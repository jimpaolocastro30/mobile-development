import React, { Fragment, useContext, useState, useEffect } from 'react'
import {
	Dimensions,
	StyleSheet,
	ImageBackground,
	Text,
	View,
	Image,
	TouchableOpacity
} from '../../../components/NativeComponents'
import { verticalScale } from 'react-native-size-matters'
import { useScrollHandler } from 'react-native-redash'
import Animated, { multiply } from 'react-native-reanimated'
import ScreenContainer from '../../../scenes/common/ScreenContainer'
import Choices from './Choices'
import ScoringBar from './ScoringBar'
import Timer from './Timer'
import { getQuiz, theme, _, tokenIncrement, getQuizByGameId } from '../util'
import ResultPage from '../ResultsPage'
import ReadyGo from './ReadyGo'
import { GameContext } from '../../../context/GameContext'
import api, { getLocalData, wsUserValidation, getWebSocketConnection, closeWebSocketConnection } from '../../../services/api'

const whizBg = require('../../../assets/bg.png')
const star = require('../../../assets/star.png')
const token = require('../../../assets/token.png')
const timeWarpIcon = require('../../../assets/time-warp.png')
const eurekaIcon = require('../../../assets/eureka.png')
const takeTwoIcon = require('../../../assets/take2.jpg')
const { height, width } = Dimensions.get('window')

const initialScoringStyles = {
	'0style1': {
		backgroundColor: '#d6d6d6',
	},
	'0style2': {
		color:'#7d7d7d'
	},
	'1style1': {
		backgroundColor: '#d6d6d6',
	},
	'1style2': {
		color:'#7d7d7d'
	},
	'2style1': {
		backgroundColor: '#d6d6d6',
	},
	'2style2': {
		color:'#7d7d7d'
	},
	'3style1': {
		backgroundColor: '#d6d6d6',
	},
	'3style2': {
		color:'#7d7d7d'
	},
	'4style1': {
		backgroundColor: '#d6d6d6',
	},
	'4style2': {
		color:'#7d7d7d'
	},
	'5style1': {
		backgroundColor: '#d6d6d6',
	},
	'5style2': {
		color:'#7d7d7d'
	}
}

export default function Quiz({navigation}) {
	const { mode, opponents, level, category, selectedOpponents, gameId} = useContext(GameContext)
	const { ScrollView } = Animated
	const { x, scrollHandler } = useScrollHandler()
	const scroll = React.createRef(ScrollView)
	const [isLoading, setIsLoading] = useState(true)
	const [isReady, setIsReady] = useState(false)
	const [questions, setQuestions] = useState([])
	const [scoring, setScoring] = useState([])
	const [selectedAnswers, setUserSelectedAnswers] = useState([])
	const [text, setText] = useState('Ready')
	const [readyCounter, setReadyCounter] = useState(3)
	const [score, setScore] = useState(0)
	const [curNum, setCurNum] = useState(0)
	const [gameOver, setGameOver] = useState(false)
	const [counter, setCounter] = useState(20)
	const primary = theme[mode].primary
	const [timeWarps, setTimeWarps] = useState(0)
	const [takeTwos, setTakeTwos] = useState(0)
	const [eurekas, setEurekas] = useState(0)
	const [players, setPlayers] = useState([])
	const [tokenWon, setTokenWon] = useState(0)
	const [starsWon, setStarsWon] = useState(0)
	const [statsWon, setStatsWon] = useState(0)
	const [currTokens, setCurrTokens] = useState(0)
	const [currStars, setCurrStars] = useState(0)
	const [statDisplay, setStatDisplay] = useState(0)
	const [starsEarned, setStarsEarned] = useState(0)
	const [maxTime, setMaxTime] = useState(125) // 125
	const [opponentsScoringStyles, setOpponentsScoringStyles] = useState()
	const [opponentsGamePoints, setOpponentsGamePoints] = useState()
	const [powerUps, setPowerUps] = useState()
	let gameTimer
	let oss = {}
	let ogp = {}

	useEffect(() => {
		if(counter === 0) {
			nextQuestion()
		}
		const timer = counter > 0 && setInterval(() => {
			setMaxTime(maxTime - 1)
			setCounter(counter - 1)
		}, 1000)
		gameTimer = timer
		return () => {
			clearInterval(timer)
			navigation = null
		}
	}, [counter, isReady])

	const answerSelected = (answer) => {
		if(!gameOver) {
			const isAnswerCorrect = questions[curNum].correct_answer == answer
			let style1, style2
			if(isAnswerCorrect) {
				setScore((score) => score + 1)
				if(mode === "special tourney") {
					addStarsEarned()
				}
				style1 = {...scoringStyles[`${curNum}style1`], backgroundColor: '#0066c5'}
				style2 = {...scoringStyles[`${curNum}style2`], color: '#4ccaf9'}
			}
			else {
				style1 = {...scoringStyles[`${curNum}style1`], backgroundColor: '#de5b31'}
				style2 = {...scoringStyles[`${curNum}style2`], color: '#ffffff'}
			}

			scoringStyles[`${curNum}style1`] = style1
			scoringStyles[`${curNum}style2`] = style2

			const updatedAnswerData = {
				question: questions[curNum].question,
				answer,
				isAnswerCorrect,
				correctAnswer: questions[curNum].correct_answer
			}

			setUserSelectedAnswers((currAnswers) => [
				...currAnswers,
				updatedAnswerData
			])
		}
	}

	const addStarsEarned = () => {
		switch(counter) {
			case 20:
			case 19:
			case 18:
				setStarsEarned(starsEarned + 10)
				setStatDisplay(statDisplay + 10)
				break
			case 17:
			case 16:
				setStarsEarned(starsEarned + 9)
				setStatDisplay(statDisplay + 9)
				break
			case 15:
			case 14:
				setStarsEarned(starsEarned + 8)
				setStatDisplay(statDisplay + 8)
				break
			case 13:
			case 12:
				setStarsEarned(starsEarned + 7)
				setStatDisplay(statDisplay + 7)
				break
			case 11:
			case 10:
				setStarsEarned(starsEarned + 6)
				setStatDisplay(statDisplay + 6)
				break
			case 9:
			case 8:
				setStarsEarned(starsEarned + 5)
				setStatDisplay(statDisplay + 5)
				break
			case 7:
			case 6:
				setStarsEarned(starsEarned + 4)
				setStatDisplay(statDisplay + 4)
				break
			case 5:
			case 4:
				setStarsEarned(starsEarned + 3)
				setStatDisplay(statDisplay + 3)
				break
			case 3:
			case 2:
				setStarsEarned(starsEarned + 2)
				setStatDisplay(statDisplay + 2)
				break
			case 1:
				setStarsEarned(starsEarned + 1)
				setStatDisplay(statDisplay + 1)
		}
	}

	const nextQuestion = async () => {
		let isNotLast = curNum < questions.length - 1
		if(!gameOver && isNotLast ) {
			setCounter(20)
			setCurNum((curr) => curr + 1)
		}
		else {
			setGameOver(true)
			clearInterval(gameTimer)
		}
	}

	const updateStats = async (finalScore) => {
		if(curNum == 5) {
			let tokensAdded = 0
			let starsAdded = 0
			if(score == 6) {
				tokensAdded = 2
			}
			else if(score >= 1 && score <= 5) {
				tokensAdded = 1
			}
			if(tokensAdded) {
				const body = {
					add_token: tokensAdded,
					add_star: 5
				}
			}
		}
	}

	useEffect(() => {
		if(!gameOver) {
			if(scroll.current) {
				scroll.current.getNode().scrollTo({
					x: width * curNum,
					animated: true
				})
			}
		}
	}, [curNum])

	const startGame = async () => {
		setGameOver(false)
		// const newQuestions = await getQuiz(level, category)
		const newQuestions = await getQuizByGameId(gameId)
		if(newQuestions == null) {
			setGameOver(true)
		}
		console.log('newQuestions -->', newQuestions)
		setIsLoading(false)
		setQuestions(newQuestions.result)
		setScoring(newQuestions.scoring)
		setUserSelectedAnswers([])
		await api('preferred-level-and-category', {body: {
			"year_level_id": null,
			"quiz_category_id": null,
			"game_type_id": null
		}})
		const resp = await api('power-ups')
		const pups = {}
		resp.results?.records?.map((item, index) => {
			if(pups[item.power_up_id] == null) {
				pups[item.power_up_id] = []
				pups[item.power_up_id].push(item.user_power_up_id)
			}
			else {
				pups[item.power_up_id].push(item.user_power_up_id)
			}
		})
		setPowerUps(pups)
		setTimeWarps(pups[1].length)
		setTakeTwos(pups[2].length)
		setEurekas(pups[3].length)
	}

	useEffect(() => {
		if(!isLoading) {
			const timer = readyCounter > -1 && setInterval(() => {
				setReadyCounter(readyCounter - 1)
			}, 1000)
			setText(readyCounter > 0 && readyCounter || 'Go!')
			if(readyCounter < 0) {
				setIsReady(true)
				setCounter(20)
			}
			return () => clearInterval(timer)
		}
	}, [isLoading, readyCounter, text])

	useEffect(() => {
		startGame()
		scoringStyles = {...scoringStyles, ...initialScoringStyles}
		if(mode === 'duel' || mode === 'battle of five') {
			handleWebSocket()
			setTimeout(async() => {
				const newPlayers = [...opponents]
				const p = {
					account_name: await getLocalData("account-name"),
					username: await getLocalData("username"),
					opponentUri: await getLocalData("avatar-uri")
				}
				newPlayers.splice(2, 0, p)
				setPlayers(newPlayers)
			}, 1)
		}
		getLocalData("tokens").then((v) => {
			setCurrTokens(v)
			if(mode === 'standard') {
				setStatDisplay(parseInt(v))
			}
		})
		getLocalData("stars").then((v) => {
			setCurrStars(v)
			if(mode !== 'standard') {
				setStatDisplay(parseInt(v))
			}
		})
	}, [])

	const handleWebSocket = async () => {
		try {
			const userme = await getLocalData("username")
			const st = await wsUserValidation(userme)
			if(st == null) {
				return
			}
			st.onmessage = (event) => {
				const data = JSON.parse(event.data)
				if(mode === 'duel' || mode === 'battle of five') {
					if(data.type === 'game_points') {
						ogp[data.from] = data
						setOpponentsGamePoints(ogp)
						setMaxTime(0)
					}
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	const timeWarp = async () => {
		setCounter(counter + 10)
		setTimeWarps(timeWarps - 1)
		const userme = await getLocalData("username")
		const body = {
			"game_type_id": "4",
			"quiz_category_id": category,
			"players": [userme]
		}
		const resp = await api(`power-ups/${powerUps[1].pop()}`, {body: body}, 'DELETE')
		console.log('resp power-ups -->', resp)
	}

	const eliminateTwoWrong = async () => {
		let current = questions[curNum]
		let correctAnswer = questions[curNum].correct_answer
		let correctIndex = current['choices'].indexOf(correctAnswer)
		let arr = [0,1,2,3]
		arr = arr.filter((_, i) => i != correctIndex)
		let randomNum = Math.floor(Math.random() * arr.length)
		current['choices'] = _([current['choices'][correctIndex], current['choices'][randomNum]])
		setTakeTwos(takeTwos - 1)
		const userme = await getLocalData("username")
		const body = {
			"game_type_id": "4",
			"quiz_category_id": category,
			"players": [userme]
		}
		const resp = await api(`power-ups/${powerUps[2].pop()}`, {body: body}, 'DELETE')
		console.log('resp power-ups -->', resp)
	}

	const eureka = async () => {
		let current = questions[curNum]
		let correctAnswer = questions[curNum].correct_answer
		current['choices']= current['choices'].filter((item) => item == correctAnswer)
		setEurekas(eurekas - 1)
		const userme = await getLocalData("username")
		const body = {
			"game_type_id": "4",
			"quiz_category_id": category,
			"players": [userme]
		}
		const resp = await api(`power-ups/${powerUps[3].pop()}`, {body: body}, 'DELETE')
		console.log('resp power-ups -->', resp)
	}

	return (
		<ScreenContainer style={{flex: 1}}>
			{gameOver ? (
				<ResultPage {...{
					navigation,
					questions,
					scoringStyles,
					score,
					tokenWon,
					starsWon,
					starsEarned,
					maxTime,
					opponentsGamePoints,
					mode,
					gameId
				}} 
				onPress={()=> setGameOver('false')} />
			):(
				!isReady ? (
					<ReadyGo {...{isLoading, setIsReady, text}} />
				):(
					<ImageBackground
						source = {whizBg}
						style = {{height: '100%', width: '100%'}}
					>
					<View style={styles.container}>
						<View style={styles.wrapper}>
							<View style={{width: 35, height: 35}}>
								<Image
									source={(mode==="standard")? token: star}
									style={{
										height: '100%', width: '100%',
										borderRadius: 50
									}}
								/>
							</View>
							
							<View style={{width: 'auto', marginLeft: 15, marginRight: 15}}>
								<Text style={{color:'#4ccaf9'}}>{statDisplay}</Text>
							</View>
						</View>
						<ScoringBar {...{questions, scoringStyles}}/>
					</View>
					{
						mode == 'special tourney' && (
							<View
								style={styles.powerUpsContainer}
							>
								<TouchableOpacity disabled={!timeWarps > 0} onPress={() => timeWarp()}
									style={timeWarps > 0 ? {...styles.powerUps, backgroundColor: '#70c5e4'} :
										{...styles.powerUps}}
								>
									<View style={timeWarps > 0 ? {...styles.powerUpWrapper, backgroundColor: 'white'} :
										{...styles.powerUpWrapper}}
									>
										<Image
											source={timeWarpIcon}
											style={{
												height: '100%', width: '100%',
												borderRadius: 50
											}}
										/>
									</View>
									<Text style={timeWarps > 0 ? {...styles.powerUpText, color: '#024b67'} :
										{...styles.powerUpText}}>TIME WARP</Text>
								</TouchableOpacity >
								<TouchableOpacity disabled={!takeTwos > 0} onPress={() => eliminateTwoWrong()}
									style={takeTwos > 0 ? {...styles.powerUps, backgroundColor: '#70c5e4'} :
										{...styles.powerUps}}
								>
									<View style={takeTwos > 0 ? {...styles.powerUpWrapper, backgroundColor: 'green'} :
										{...styles.powerUpWrapper}}
									>
										<Image
											source={takeTwoIcon}
											style={{
												height: '100%', width: '100%',
												borderRadius: 50
											}}
										/>
									</View>
									<Text style={takeTwos > 0 ? {...styles.powerUpText, color: '#024b67'} :
										{...styles.powerUpText}}>TAKE TWO</Text>
								</TouchableOpacity >
								<TouchableOpacity disabled={!eurekas > 0} onPress={() => eureka()}
									style={eurekas > 0 ? {...styles.powerUps, backgroundColor: '#70c5e4'} :
										{...styles.powerUps}}
								>
									<View style={eurekas > 0 ? {...styles.powerUpWrapper, backgroundColor: 'white'} :
										{...styles.powerUpWrapper}}
									>
										<Image
											source={eurekaIcon}
											style={{
												height: '100%', width: '100%',
												borderRadius: 50
											}}
										/>
									</View>
									<Text style={eurekas > 0 ? {...styles.powerUpText, color: '#024b67'} :
										{...styles.powerUpText}}>EUREKA</Text>
								</TouchableOpacity >
							</View>
						)
					}
					<View justifyContent='flex-start' flex={1} flexDirection='column'>
					<View
						height={verticalScale(height * 0.19)}
						backgroundColor= '#fff'
						borderWidth={1}
						alignItems={'center'}
						justifyContent={'center'}
						borderColor={primary}
						alignSelf='center'
						width={width * .90}
						marginTop={40}
						borderRadius={20}
						paddingTop={30}
					>
						<View style={{position: 'absolute', top: -45}}><Timer {...{counter, nextQuestion}}/></View>
						<ScrollView
							elevation={2}
							height='100%'
							alignSelf={'center'}
							alignContent={'center'}
							alignItems={'center'}
							ref={scroll}
							horizontal
							decelerationRate='fast'
							showsHorizontalScrollIndicator={false}
							bounces={false}
							{...scrollHandler}
						>
							{questions?.map(({question}, i) => (
								<ScrollView key={i}>
									<Animated.View
										style={{
											flexDirection: 'row',
											width: width,
											justifyContent:'center',
											alignItems:'center',
											height: height * 0.2
										}}>
										{question.includes('http') && <Image
											source={{uri: question}}
											style={{
												width: width,
												height: height * 0.17,
												marginLeft: -40,
												resizeMode: 'contain'
											}}
										/>}
										{!question.includes('http') && <Text style={{
											width: '80%',
											textAlign: 'center',
											marginLeft: -40,
											justifyContent:'center',
											alignItems:'center',
											color: primary, fontSize: 16}}>
											{question}
										</Text>}
									</Animated.View>
								</ScrollView>
							))}
						</ScrollView>
						</View>
						<View style={{
							flex: 1,
							height: 0.4 * height
						}}>
							<Animated.View
								style={{
									flexDirection: 'row',
									width: width * questions.length ,
									transform: [{translateX: multiply(x, -1)}]
								}}>
								{questions?.map(({choices}, i) => (
									<Fragment key={i}>
										<Choices {...{choices, answerSelected, primary}}
											onPress={nextQuestion}
										/>
									</Fragment>)
								)}
							</Animated.View>
						</View>
					</View>
					<View style={{
						...styles.footer, 
						backgroundColor: mode != 'battle of five' ? '#ffffff' : 'transparent',  
						opacity: mode == 'battle of five' ? 1 : 0.6,}}>
						{
							mode == 'battle of five' ? 
							players.map(({account_name, username, opponentUri}, i) => {
								const displayName = (account_name)? account_name: username
								return (
									<Fragment key={i}>
										<View style={{flex: 1, justifyContent:'flex-start', alignItems: 'center', marginBottom: 35}}>
											<View style={{
												display: 'flex',
												top: 5,
												right: -15,
												margin: 'auto',
												zIndex: 2}}>
											{/* <Text style={{
												height: 23,
												width: 23,
												textAlign: 'center',
												borderRadius: 25,
												backgroundColor: '#dd5426',
												color: 'white'}}>{i}</Text> */}
												</View>
											<Image
												source={{uri: opponentUri}}
												style={{
													height: i == 2 ? 53 : 40, width: i == 2 ? 53 : 40,
													borderRadius: 50, marginTop: -10
												}}
											/>
											<View style={{width: 50, bottom: 10, height: 20, borderRadius: 25, backgroundColor: '#653e97'}}>
												<Text style={{color: 'white', textAlign: 'center'}}>{displayName.substring(0,1)}</Text>
											</View>
										</View>
									</Fragment>
								)
							}):
							<Text style={{color: primary }}>YOU'RE PLAYING
								<Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}> {mode} </Text>
								CHALLENGE
							</Text>
						}
						
					</View>
				</ImageBackground>
				)
			)}
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		display: 'flex',
		color: '#0066c5',
		backgroundColor: '#024b67',
		justifyContent: 'flex-start',
		borderRadius: 50,
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row'
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 20,
		padding: 20,
		justifyContent: 'space-between'
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		height: 40,
		flexDirection: 'row'
	},
	powerUpsContainer: {
		backgroundColor: '#fff',
		padding: 4,
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: width * .90,
		alignSelf: 'center',
		alignContent: 'center',
		borderRadius: 3,
		alignItems: 'center',
		padding: 3,
		marginBottom: 20
	},
	powerUps: {
		backgroundColor:'#d6d6d6',
		borderRadius: 5,
		padding: 3,
		flexDirection:'row',
		height: 35,
		width: '32%',
		justifyContent: 'space-around',
		alignContent:'center',
		alignItems:'center'
	},
	powerUpWrapper: {
		borderRadius: 102,
		height: 20,
		width: 20,
		backgroundColor:'red'
	},
	powerUpText: {
		color: '#7d7d7d',
		fontWeight: 'bold',
		fontSize: 16
	},
	questionBox: {
		color: '#7d7d7d'
	}
})

let scoringStyles = StyleSheet.create({
	container: {
		borderRadius: 50,
		display: 'flex',
		flexDirection: 'row',
		margin: 2
	},
	textStyles: {
		borderRadius: 50,
		display: 'flex',
		flexDirection: 'row',
		width: 23,
		height: 23,
		justifyContent: 'center',
		textAlign: 'center'
	},
	imageStyles: {
		borderRadius: 50,
		flexDirection: 'row',
		width: 23,
		height: 23,
		justifyContent: 'space-around'
	},
	...initialScoringStyles
})
