import React, { useContext, Fragment, useEffect, useState } from 'react'
import {
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
	Modal,
	TouchableWithoutFeedback
} from '../../../components/NativeComponents'
import { LinearGradient } from 'expo-linear-gradient'
import ScoringBar from '../QuizComponent/ScoringBar'
import { ScrollView } from 'react-native-gesture-handler'
import { GameContext } from '../../../context/GameContext'
import { tokenIncrement } from '../util'
import api, {
	storeLocalData,
	getLocalData,
	wsUserValidation,
	closeWebSocketConnection
} from '../../../services/api'
import Alert from '../../../components/Alert'

const star = require('../../../assets/star.png')
const token = require('../../../assets/token.png')
const { width } = Dimensions.get('window')
let tempOpponentsGamePoints = {}
let hasAchievement = false
const players = {}
let battleAndPlayers

export default function ResultPage({
	navigation,
	questions,
	scoringStyles,
	score,
	onPress,
	tokenWon = 0,
	starsWon = 0,
	starsEarned = 0,
	maxTime = 0,
	opponentsGamePoints = {},
	mode,
	gameId
}) {
	// let oppScoringStyles
	let finalScore = 0
	if (score > 4) {
		finalScore = score > 5 ? 2 : 1
	}
	const { opponents, setOpponents, selectedOpponents } = useContext(GameContext)
	scoringStyles = {
		...scoringStyles,
		container: {
			...scoringStyles.container,
			display: 'flex',
			height: '100%',
			height: 53,
			width: 53,
			margin: 1,
			justifyContent: 'center',
			textAlign: 'center',
			alignSelf: 'center',
			alignItems: 'center'
		}
	}
	const [avatarUri, setAvatarUri] = useState()
	const [accountName, setAccountName] = useState()
	const [finalTokens, setFinalToken] = useState(0)
	const [finalStars, setFinalStars] = useState(0)
	const [timeLeft, setTimeLeft] = useState(maxTime)
	const [opponentStat, setOpponentsStat] = useState()
	const [opponentsResultScoringStyles, setOpponentsResultScoringStyles] = useState()
	const [battleOpponentsResultScoringStyles, setBattleOpponentsResultScoringStyles] = useState({})
	const [opponentsScores, setOpponentsScores] = useState()
	const [resultMessage, setResultMessage] = useState()
	// const [gameTimer, setGameTimer] = useState()
	const [oss, setOSS] = useState({})
	const [alertVisibility, setAlertVisibility] = useState(false)
	const closeBtn = require('../../../assets/xlight.png')
	const [earnedToken, setEarnedToken] = useState (0)
	const needsOpponent = mode == 'duel' || mode == 'battle of five'

	const handleWebSocket = async () => {
		try {
			const userme = await getLocalData("username")
			const st = await wsUserValidation(userme)
			if(st == null) {
				return
			}
			st.onmessage = (event) => {
				const data = JSON.parse(event.data)
				switch(data.type) {
					case "game_points":
						if(data.game_type_id == 2) {
							setOpponentsResultScoringStyles(data.scoringStyles)
							const os = {}
							os[data.from] = data.points
							setOpponentsScores(os)
						}
						else if(data.game_type_id == 3) {
							const boss = {}
							boss[data.from] = data.scoringStyles
							const togp = Object.keys(tempOpponentsGamePoints)
							togp.map((k) => boss[k] = tempOpponentsGamePoints[k].scoringStyles)
							tempOpponentsGamePoints[data.from] = data
							setBattleOpponentsResultScoringStyles(boss)
						}
						break
					case 'get_battle_and_players':
						battleAndPlayers = data.msg
						break
					default:
						if(data.validated) {
							const tid = (selectedOpponents.length < 2)? 2: 3
							selectedOpponents.map(({username}, index) => {
								const msg = {
									"type": "game_points",
									"to": username,
									"from": userme,
									"points": score,
									"scoringStyles": scoringStyles,
									game_type_id: tid
								}
								st.send(JSON.stringify(msg))
							})
							st.send(JSON.stringify({
								type: 'get_battle_and_players',
								battle_id: gameId
							}))
						}
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	const setMessageLayout = (opScores) => {
		let msg = `You've earned ${ earnedToken } token${ earnedToken > 1 ? 's' : '' } for this round.`
		switch(mode) {
			case "standard":
				// msg = (score >= 4)? msg : "Sorry, You've lost."
				updateStats()
				break;
			case "duel":
				if(opScores == null) {
					return
				}
				const os = Object.values(opScores)
				if(score != os) {
					// msg = (score > os)? `You won against ka-duel. ${ msg }` : `You lost against ka-duel`
					msg = `You won against ka-duel. ${ msg }`
				}
				else {
					msg = "It's a draw!"
				}
				updateStats(opScores)
				break;
			case "battle of five":
				const tobp = Object.keys(tempOpponentsGamePoints)
				console.log ('tobp', tobp)
				if(tobp.length < 4) {
					break
				}
				let place = 0
				let scoreRank = 0
				tobp.map((key) => {
					if(tempOpponentsGamePoints[key].points < score && place === 0) {
						place = 1
					}
					else if(tempOpponentsGamePoints[key].points > score) {
						place = 2
						scoreRank++
					}
				})
				updateStats(null, scoreRank)
				if(place === 1) {
					// msg = "Congratulations! You've Won!"
					break
				}
				if(place === 2) {
					// msg = "Sorry, You've lost."
					break
				}
				// msg = "It's a draw!"
				msg = `Congratulations! You've Won! ${ msg }`
				break;
			case "special tourney":
				msg = (score >= 4)? `Place ${ place }
				
				${ msg }` : "Sorry, You've lost."
				updateStats()
		}
		setResultMessage(`${ mode.toUpperCase () }
		${ msg }`)
	}

	const updateStats = async (opScores, battleRank) => {
		let tokensAdded = 0
		let starsAdded = 0
		let isWinner = 0
		if(score == 6) {
			tokensAdded = 2
		}
		else if(score >= 1 && score <= 5) {
			tokensAdded = 1
		}
		if(mode === 'duel') {
			const os = Object.values(opScores)
			starsAdded = (score > os)? 20 : 10 // DUEL
			isWinner = (score > os)? 1 : 0
			const data = await api('stars-and-tokens/username/' + selectedOpponents[0].username)
			setOpponentsStat(data.results)
		}
		else if(mode === 'battle of five') {
			const starsByRank = [40, 30, 20, 14, 10]
			starsAdded = starsByRank[battleRank]
			isWinner = (battleRank === 0)? 1 : 0
		}
		const stat = {}
		if(tokensAdded) {
			stat["add_token"] = tokensAdded
		}
		if(starsAdded) {
			stat["add_star"] = starsAdded
		}
		const resp = await tokenIncrement(stat)
		setFinalToken(resp.total_token)
		setFinalStars(resp.total_star)
		addPlayerGamePointsByGameId(tokensAdded, starsAdded, isWinner)
	}

	const addPlayerGamePointsByGameId = async (tokens, stars, isWinner = 0) => {
		console.log('addPlayerGamePointsByGameId 1')
		const membershipId = await getLocalData('accountMembershipId')
		battleAndPlayers?.players.map(async (item, index) => {
			if(item.account_membership_id == membershipId) {
				const body = {
					game_id: gameId,
					players: [{
							"id": item.id,
							"game_id": gameId,
							"account_membership_id": membershipId,
							"is_winner": isWinner
					}]
				}
				if(tokens) {
					body.players[0]['tokens'] = tokens
				}
				if(stars) {
					body.players[0]['stars'] = stars
				}
				console.log('body --> *', body)
				const resp = await api('battles-and-players', {body: body}, 'PATCH')
				console.log("resp battles-and-players -->", resp)
			}
		})
	}

	const [alertMessage, setAlertMessage] = useState ('')

	const checkGameAchievement = async () => {
		const resp = await api(`battles-and-players/${gameId}/achievements`)
		if(resp.results.achievements.length > 0) {
			hasAchievement = true
			storeLocalData('gameid', `${gameId}`)
		}
	}

	// useEffect(() => {
	// 	setMessageLayout(opponentsScores)
	// }, [opponentsScores, battleOpponentsResultScoringStyles])

	useEffect(() => {
		checkGameAchievement()
		getLocalData("avatar-uri").then((uri) => {
			setAvatarUri(uri)
		})
		getLocalData("account-name").then((name) => {
			setAccountName(name)
		})
		handleWebSocket()
		switch(mode) {
			case 'duel':
				for(const ogp in opponentsGamePoints) {
					setMessageLayout({ogp: opponentsGamePoints[ogp].points})
					updateStats({ogp: opponentsGamePoints[ogp].points})
					setOpponentsResultScoringStyles(opponentsGamePoints[ogp].scoringStyles)
				}
				break
			case 'battle of five':
				const boss = {}
				for(const ogp in opponentsGamePoints) {
					boss[ogp] = opponentsGamePoints[ogp].scoringStyles
					tempOpponentsGamePoints[ogp] = opponentsGamePoints[ogp]
				}
				setBattleOpponentsResultScoringStyles(boss)
				break
			case 'special tourney':
				setMessageLayout()
				break
			default:
				setMessageLayout()
		}
		return () => {
			closeWebSocketConnection()
		}
	}, [])

	return (
		<>
			<View
				style={{
					justifyContent: 'space-between',
					alignItems: 'center',
					height: '100%',
					width: width,
					backgroundColor: '#327ebb',
				}}
			>
				<View
					style={{
						display: 'flex',
						padding: 30,
						paddingBottom: 60,
						borderBottomWidth: 3,
						borderColor: '#fff',
						flex: 2.1
					}}
				>
					<View
						style={{
							position: 'relative',
							display: 'flex',
							color: '#0066c5',
							width: 'auto',
							justifyContent: 'flex-start',
							borderRadius: 50,
							alignSelf: 'flex-start',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View
							style={{ marginRight: 10, width: 70, height: 70 }}
						>
						{/* source={avatar} */}
							<Image
								source={{uri: avatarUri}}
								style={{
									height: '100%',
									width: '100%',
									borderRadius: 300
								}}
							/>
						</View>
						<View
							style={{
								marginRight: 50,
								with: 'auto',
								diplay: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								justifyContent: 'space-around'
							}}
						>
							<Text style={{ color: '#fff', fontSize: 18 }}>
								{accountName}
							</Text>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							width: '100%'
						}}
					>
						<View
							style={{
								position: 'relative',
								display: 'flex',
								color: '#0066c5',
								backgroundColor: '#024b67',
								justifyContent: 'flex-start',
								width: 117,
								borderRadius: 50,
								alignSelf: 'center',
								alignItems: 'center',
								flexDirection: 'row',
								margin: 15
							}}
						>
							<View
								style={{
									marginLeft: 0,
									width: 35,
									height: 35
								}}
							>
								<Image
									source={star}
									style={{
										height: '100%',
										width: '100%',
										borderRadius: 300
									}}
								/>
							</View>
							<View style={{ width: 'auto', marginLeft: 5, marginRight: 5, flexGrow: 1 }}>
								<Text style={{ color: '#4ccaf9', textAlign: 'center' }}>
									{finalStars}
								</Text>
							</View>
						</View>
						<View
							style={{
								position: 'relative',
								display: 'flex',
								color: '#0066c5',
								backgroundColor: '#024b67',
								justifyContent: 'flex-start',
								width: 117,
								borderRadius: 50,
								alignSelf: 'center',
								alignItems: 'center',
								flexDirection: 'row'
							}}
						>
							<View
								style={{
									marginLeft: 0,
									width: 35,
									height: 35
								}}
							>
								<Image
									source={token}
									style={{
										height: '100%',
										width: '100%',
										borderRadius: 300
									}}
								/>
							</View>
							<View style={{ width: 'auto', marginLeft: 5, marginRight: 5, flexGrow: 1 }}>
								<Text style={{ color: '#4ccaf9', textAlign: 'center' }}>
									{finalTokens}
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							width: '100%',
							heigth: 120,
							color: '#0066c5',
							backgroundColor: '#ffffff',
							justifyContent: 'space-evenly',
							borderRadius: 50,
							alignSelf: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							padding: 2
						}}
					>
						<ScoringBar {...{ questions, scoringStyles: {...scoringStyles,
							imageStyles: {
								borderRadius: 50,
								width: '100%',
								height: '100%'
							}} }} isResultsPage={true} extra={"player me"} />
					</View>
					{resultMessage != null && <View
						style={{
							marginTop: 15,
							padding: 10,
							backgroundColor: '#f6ef25'
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 20,
								color: '#0066c5',
								fontFamily: 'Righteous_400Regular'
							}}
						>
							{resultMessage}
							{/* {(score >= 4)? "Congratulations! You've Won!" : "Sorry, You've lost."} */}
						</Text>
					</View>}
				</View>
				<View
					style={{
						backgroundColor: '#195097',
						display: 'flex',
						flex: 2.5,
						height: '100%',
						paddingTop: 60,
						padding: 20,
						width: width,
					}}
				>
					{
						opponents.length > 0 && (
							<>
								<View
						style={{
							top: -41,
							position: 'absolute',
							padding: 5,
							width: 80,
							height: 80,
							borderColor: '#fff',
							borderWidth: 3,
							backgroundColor: '#23af4c',
							borderRadius: 60,
							justifyContent: 'center',
							alignItems: 'center',
							left: '45%'
						}}
					>
						<Text style={{ fontSize: 25, color: '#fff' }}>VS</Text>
					</View>
					<ScrollView>
					{
						selectedOpponents.length > 1 && selectedOpponents.map((item, index) => (
							<View style={{
								flex:1,
								flexDirection: 'row',
								width: width * .7,
								justifyContent: 'center',
								alignSelf: 'center',
								marginBottom: 15
							}}>
								<View style={{ marginRight: 10, width: 40, height: 40 }}>
									<Image
										source={{uri: item.opponentUri}}
										style={{
											height: '100%',
											width: '100%',
										}}
									/>
								</View>
							{battleOpponentsResultScoringStyles[item.username] && <ScoringBar {...{ questions, scoringStyles: {...battleOpponentsResultScoringStyles[item.username],
								container: {
									...battleOpponentsResultScoringStyles[item.username].container,
									display: 'flex',
									height: '100%',
									height: 40,
									width: 40,
									margin: 3,
									justifyContent: 'center',
									textAlign: 'center',
									alignSelf: 'center',
									alignItems: 'center'
								},
								imageStyles: {
									borderRadius: 50,
									width: '100%',
									height: '100%'
								}} }} isResultsPage={true}  extra={"player battle"} />}

							</View>
						))
					}
					{
						selectedOpponents.length == 1 && (
							<View style={{marginBottom: 30}}>
								<View
									style={{
										position: 'relative',
										display: 'flex',
										color: '#0066c5',
										width: 'auto',
										justifyContent: 'space-around',
										borderRadius: 50,
										alignSelf: 'flex-start',
										alignItems: 'center',
										flexDirection: 'row'
									}}
								>
									<View
										style={{ marginRight: 10, width: 70, height: 70 }}
									>
										<Image
											source={{uri: selectedOpponents [0].opponentUri}}
											style={{
												height: '100%',
												width: '100%',
												borderRadius: 300
											}}
										/>
									</View>
									<View
										style={{
											marginRight: 50,
											with: 'auto',
											diplay: 'flex',
											flexDirection: 'column',
											alignSelf: 'center',
											justifyContent: 'space-around'
										}}
									>
										{/* <Text style={{ color: '#fff', fontSize: 18 }}>
											{(opponents[0].account_name == null)? opponents[0].username: opponents[0].account_name}
										</Text> */}
										<Text style={{ color: '#fff', fontSize: 18 }}>
											{(selectedOpponents[0].account_name == null)? selectedOpponents[0].username: selectedOpponents[0].account_name}
										</Text>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-around',
										width: '100%'
									}}
								>
									<View
										style={{
											position: 'relative',
											display: 'flex',
											color: '#0066c5',
											backgroundColor: '#024b67',
											justifyContent: 'flex-start',
											width: 117,
											borderRadius: 50,
											alignSelf: 'center',
											alignItems: 'center',
											flexDirection: 'row',
											margin: 15
										}}
									>
										<View
											style={{
												marginLeft: 0,
												width: 35,
												height: 35
											}}
										>
											<Image
												source={star}
												style={{
													height: '100%',
													width: '100%',
													borderRadius: 300
												}}
											/>
										</View>
										<View style={{ width: 'auto', marginLeft: 30 }}>
											<Text style={{ color: '#4ccaf9' }}>
												{(opponentsResultScoringStyles)? opponentStat?.total_star: null}
											</Text>
										</View>
									</View>
									<View
										style={{
											position: 'relative',
											display: 'flex',
											color: '#0066c5',
											backgroundColor: '#024b67',
											justifyContent: 'flex-start',
											width: 117,
											borderRadius: 50,
											alignSelf: 'center',
											alignItems: 'center',
											flexDirection: 'row'
										}}
									>
										<View
											style={{
												marginLeft: 0,
												width: 35,
												height: 35
											}}
										>
											<Image
												source={token}
												style={{
													height: '100%',
													width: '100%',
													borderRadius: 300
												}}
											/>
										</View>
										<View style={{ width: 'auto', marginLeft: 30 }}>
											<Text style={{ color: '#4ccaf9' }}>
												{(opponentsResultScoringStyles)? opponentStat?.total_token: null}
											</Text>
										</View>
									</View>
								</View>
								<View
									style={{
										width: '100%',
										heigth: 120,
										color: '#0066c5',
										backgroundColor: '#ffffff',
										justifyContent: 'space-evenly',
										borderRadius: 50,
										alignSelf: 'center',
										alignItems: 'center',
										flexDirection: 'row',
										padding: 5
									}}
								>
									{opponentsResultScoringStyles && <ScoringBar {...{ questions, scoringStyles: {
										...opponentsResultScoringStyles,
										imageStyles: {
											borderRadius: 50,
											width: '100%',
											height: '100%'
										}} }} isResultsPage={true}  extra={"player duel"} />}
								</View>
							</View>
						)
					}
					</ScrollView>
							</>
						)
					}
					<View style={{ marginTop: 5 }}>
						<TouchableOpacity
							style={{ width: '100%' }}
							onPress={() => {
								if(needsOpponent) {
									navigation.push('OponentsPage')
								}
								else {
									navigation.push('Quiz')
								}
							}}
						>
							<LinearGradient
								colors={['#fb681a', '#f74d12']}
								style={{
									borderRadius: 30,
									width: '100%',
									justifyContent: 'center',
									height: 60,
									alignItems: 'center',
									backgroundImage:
										'linear-gradient(40deg, rgb(255 0 0) 60%, orange)'
								}}
							>
								<Text
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										color: '#fff',
										fontSize: 20
									}}
								>
									PLAY AGAIN
								</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ width: '100%', marginTop: 20 }}
							// onPress={() => {
							// 	setAlertVisibility(false)
							// 	tempOpponentsGamePoints = {}
							// 	setOpponents([])
							// 	onPress()
							// 	navigation.navigate('Home')
							// }}
							onPress={() => {
								if(hasAchievement) {
									navigation.navigate("Achievements")
									hasAchievement = false
									return
								}
								setAlertVisibility(false)
								tempOpponentsGamePoints = {}
								setOpponents([])
								onPress()
								navigation.navigate('Onboarding')
							}}
						>
							<LinearGradient
								colors={['#00b7f3', '#018ce9']}
								style={{
									borderRadius: 30,
									width: '100%',
									justifyContent: 'center',
									height: 60,
									alignItems: 'center',
									// backgroundImage:
									// 	'linear-gradient(40deg, rgb(255 0 0) 60%, orange)'
								}}
							>
								<Text
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										color: '#fff',
										fontSize: 20
									}}
								>
									START A NEW GAME
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</View>
				<Modal
					visible={alertVisibility}
					transparent={true}
					animationType={"fade"}
					onRequestClose={ () => {
						{/* clearInterval(gameTimer) */}
						setAlertVisibility(false)
					} }
				>
					<View style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(0,0,0,0.5)'
					}}>
						<View style={styles.modalHeader}>
						<TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
								setAlertVisibility(false)
							}}>
								<Image
									source={closeBtn}
									style={{
										height: 15,
										width: 15,
										margin: 15
									}}
								/>
							</TouchableWithoutFeedback>
							<View style={styles.modalButtons}>
								<TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
									setAlertVisibility(false)
									tempOpponentsGamePoints = {}
									setOpponents([])
									onPress()
									navigation.navigate('Onboarding')
									{/* navigation.navigate('OponentsPage') */}
								}}>
									<Text style={{
										...styles.buttonLabel,
										borderBottomWidth: 3,
										borderColor: '#fff',
										paddingBottom: 25
									}}>CONTINUE PLAYING THE SAME GAME</Text>
								</TouchableWithoutFeedback>
								<TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
									setAlertVisibility(false)
									tempOpponentsGamePoints = {}
									setOpponents([])
									onPress()
									navigation.navigate('Home')
								}}>
									<Text style={{
										...styles.buttonLabel,
										marginTop: 20
									}}>START A NEW GAME</Text>
								</TouchableWithoutFeedback>

							</View>
						</View>
					</View> 
				</Modal>
			</View>
		</>
	)
}

{/* borderBottomWidth: 3,
		borderColor: '#fff' */}


const styles = StyleSheet.create({
	modalHeader: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		backgroundColor : "#327ebb", 
		height:  'auto',
		width: '75%',
	},
	buttonLabel: {
		fontFamily: 'Lato_700Bold',
		fontSize: 20,
		color: "#fff",
		textAlign: 'center',
		padding: 15,
		width: '100%'
	},
	modalButtons: {
		width: '100%',
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20
	}
})
