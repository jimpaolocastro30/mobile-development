import React, { useEffect, useState, useContext, Component } from 'react'
import { View,
	Text,
	Image,
	StyleSheet,
	FlatList,
	TouchableWithoutFeedback,
	Dimensions,
	ToastAndroid,
	Platform,
	TouchableOpacity,
	Modal,
	Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GameContext } from '../../../context/GameContext'
import { ScreenContainer } from '../../common'
import api, { getLocalData, wsUserValidation, closeWebSocketConnection } from '../../../services/api'
import { getSingleImageUri } from '../../EditProfile/scenes/AvatarHandler'

const height = Dimensions.get('window').height
let acceptedChallenge = {}
let tempSelectedOps = {}
let responseIds = {}
let tempInvitesFrom = {}
let tempOpponents

export default function OpponentsPage({navigation}) {
	const closeBtn = require('../../../assets/x.png')
	const check = require('../../../assets/check.png')
	const {
		setOpponents,
		opponents,
		mode,
		level,
		category,
		setSelectedOpponents,
		setGameId
	} = useContext(GameContext)
	const hasAvailablePlayers = opponents.length > 0
	const isDuel = mode == 'duel' ? true : false
	const [selectedIds, setSelectedIds]= useState([])
	const [avatarUri, setAvatarUri] = useState()
	const [accountName, setAccountName] = useState()
	const [socket, setSocket] = useState()
	const [buttonDisabled, setButtonDisabled] = useState(false)
	const [alertVisibility, setAlertVisibility] = useState(false)
	const [lockInvites, setLockInvites] = useState(false)
	const [invitesFrom, setInvitesFrom]= useState([])
	const [selectedInviteIds, setSelectedInviteIds]= useState([])
	// const [confirmedOpponents, setConfirmedOpponents]= useState([])
	const [membershipId, setMembershipId]= useState()
	let accountId
	let timer

	const getOpponents = async () => {
		const gti = (mode === 'duel')? 2: 3
		const body = {
			"year_level_id": level,
			"quiz_category_id": category,
			"game_type_id": gti
		}
		await api('preferred-level-and-category', {body: body})
		const response = await api('players/preference?level=' + level + '&category=' + category + '&game=' + gti)
		const rec = []
		for(const v of response.results.records) {
			if(v.account_membership_id == accountId) {
				continue
			}
			v["id"] = v.account_membership_id
			const imgUrl = v.avatar?.split('/')
			if(imgUrl) { 
				const imgUri = await getSingleImageUri(imgUrl[imgUrl.length-1])
				if(imgUri) {
					v["opponentUri"] = imgUri
					v["rank"] = "Explorer"
				}
			}
			rec.push(v)
		}
		tempOpponents = rec
		response.results.records && setOpponents(rec)
	}

	const handleWebSocket = async () => {

		try {
			const st = await wsUserValidation(getLocalData("username"))
			if(st == null) {
				return
			}
			st.onmessage = async (event) => {
				const data = JSON.parse(event.data)
				switch(data.type) {
					case "game_invite":
						if(lockInvites || selectedIds.length > 0) {
							break
						}
						let invitesObj = {}
						for(const op of tempOpponents) {
							if(op.username === data.from) {
								op["from"] = data.from
								op["year_level_id"] = data.year_level_id
								op["quiz_category_id"] = data.quiz_category_id
								tempInvitesFrom[data.from] = op
								for(const k in tempInvitesFrom) {
									invitesObj[tempInvitesFrom[k].from] = tempInvitesFrom[k]
								}
								break
							}
						}
						const invites = Object.values(invitesObj)
						if(invites.length > 0) {
							setInvitesFrom(invites)
						}
						break
					case "invitation_sent":
						if(Platform.OS === 'android') {
							ToastAndroid.show(
								data.msg,
								ToastAndroid.LONG
							  )
						}
						break
					case "invite_response":
						if(data.response === "accept") {
							setSocket(st)
							if(isDuel) {
								responseIds = {}
							}
							responseIds[data.membership_id] = true
							tempSelectedOps[data.membership_id] = data.from
							// let uns
							// if(isDuel) {
							// 	uns = [data.from]
							// }
							// else {
								// if(!confirmedOpponents.includes(data.from)) {
									// uns = [...confirmedOpponents, data.from]
								// }
							// }
							// confirmedOpponents = uns
							// setConfirmedOpponents(uns)
							// console.log("uns invite_response-->", confirmedOpponents)
							console.log("responseIds invite_response-->", responseIds)
							let acceptCount = 0
							for(const id in responseIds) {
								if(responseIds[id]) {
									acceptCount++
								}
							}
							if(isDuel || (!isDuel && acceptCount === 2)) {
								setButtonDisabled(false)
							}
						}
						break
					case "cancel_invite":
						console.log("cancelled invitation *", data)
						break
					case "play_now":
						setLockInvites(true)
						setAlertVisibility(false)
						if(isDuel) {
							const ac = Object.values(acceptedChallenge)
							if(ac.length > 0) {
								setOpponents(ac)
								setSelectedOpponents(ac)
								navigation.navigate('Quiz')
							}
						}
						else {
							const oppIds = Object.keys(data.opponents)
							if(oppIds.length > 0) {
								setOpponents(tempOpponents.filter(({id}) => oppIds.includes(id.toString())))
								setSelectedOpponents(tempOpponents.filter(({id}) => oppIds.includes(id.toString())))
								navigation.navigate('Quiz')
							}
						}
						const un = await getLocalData("username")
						const gti = (isDuel)? 2: 3
						st.send(JSON.stringify({
							"type": "remove_from_list",
							"username": un,
							"game_type_id": gti
						}))
		
						break
					case "remove_from_list":
						await getOpponents()
						break
					case "joined":
						if(!lockInvites) {
							await getOpponents()
						}
						break
					case "battle_and_players":
						console.log("battle_and_players -->", data.msg.game_id)
						setGameId(data.msg.game_id)
						break
					default:
						if(data.validated) {
							setSocket(st)
							setGamePreference(st)
							timer = setInterval(() => {
								st.send(JSON.stringify({type: 'ping'}))
							}, 60000)
						}
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	const playNow = async () => {
		setLockInvites(true)
		if(socket) {
			const ops = Object.values(tempSelectedOps)
			const un = await getLocalData("username")
			const players = []
			players.push(un)
			ops.map((name) => {
				const sos = {}
				sos[membershipId] = un
				for(const i in tempSelectedOps) {
					if(tempSelectedOps[i] === name) {
						continue
					}
					sos[i] = tempSelectedOps[i]
				}
				players.push(name)
				socket.send(JSON.stringify({
					"type": "play_now",
					"to": name,
					opponents: sos
				}))
			})
			const gti = (isDuel)? 2: 3
			socket.send(JSON.stringify({
				"type": "remove_from_list",
				"username": un,
				"game_type_id": gti
			}))
			const bap = {
				"type": "battle_and_players",
				 "battle": {
					 "game_type_id": gti,
					 "year_level_id": level,
					 "quiz_category_id": category,
					 "players": players
				 }
			 }
			 socket.send(JSON.stringify(bap))
		}
		console.log("responseIds playNow -->", responseIds)
		const confirmedIds = []
		Object.entries(responseIds).map((item, i) => {
			console.log(item)
			if(item[1]) {
				confirmedIds.push(parseInt(item[0]))
			}
		})
		console.log("confirmedIds playNow -->", confirmedIds)
		setOpponents(opponents.filter(({id}) => confirmedIds.includes(id)))
		setSelectedOpponents(opponents.filter(({id}) => confirmedIds.includes(id)))
		// setOpponents(opponents.filter(({id}) => selectedIds.includes(id)))
		// setSelectedOpponents(opponents.filter(({id}) => selectedIds.includes(id)))
		navigation.navigate('Quiz')
	}

	const setGamePreference = (st) => {
		const gti = (isDuel)? 2: 3
		const gf = {
			"type": "game_preference",
			"game_type_id": gti,
			"year_level_id": level,
			"quiz_category_id": category
		}
		st.send(JSON.stringify(gf))
	}

	const inviteForDuelOrBattle = async (username, id) => {
		const gti = (isDuel)? 2: 3
		const un = await getLocalData("username")
		const message = {
			"type": "game_invite",
			"to": username,
			"from": un,
			"from_account_name": accountName,
			"game_type_id": gti,
			"year_level_id": level,
			"quiz_category_id": category,
			membership_id: id
		}
		if(socket) {
			socket.send(JSON.stringify(message))
		}
	}

	const sendInviteResponse = async (username, res) => {
		const gti = (isDuel)? 2: 3
		const local = await getLocalData("user-profile")
		const up = JSON.parse(local)
		const response = {
			"type": "invite_response",
			"to": username,
			"from": up.username,
			"year_level_id": level,
			"quiz_category_id": category,
			"game_type_id": gti,
			"response": (res)? 'accept': 'decline',
			membership_id: up.id
		}
		if(socket) {
			socket.send(JSON.stringify(response))
		}
	}

	useEffect(() => {

	}, [opponents])

	useEffect(() => {
		if(invitesFrom.length > 0) {
			setAlertVisibility(true)
		}
	}, [invitesFrom]);

	useEffect(() => {
		getLocalData("avatar-uri").then((uri) => {
			setAvatarUri(uri)
		})
		getLocalData("account-name").then((name) => {
			setAccountName(name)
		})
		getLocalData("accountMembershipId").then((value) => {
			accountId = value
			setMembershipId(value)
		})
		getOpponents()
		handleWebSocket()
		return () => {
			acceptedChallenge = {}
			tempSelectedOps = {}
			responseIds = {}
			tempInvitesFrom = {}
			tempOpponents
			responseIds = {}
			clearInterval(timer)
			closeWebSocketConnection()
			api('preferred-level-and-category', {body: {
				"year_level_id": null,
				"quiz_category_id": null,
				"game_type_id": null
			}})
		}
	}, [])

	const handleSelectPlayer = (id, username, invite) => {
		let ids
		if(isDuel) {
			ids = [id]
		}
		else {
			if(selectedIds.includes(id)) {
				ids = selectedIds.filter((selectedId) => selectedId != id)
			}
			else {
				if(selectedIds.length >= 4 ) return
				ids = [...selectedIds, id]
			}
		}
		let resIds = {}
		for(const id of ids) {
			responseIds[id] = false
		}
		setSelectedIds(ids)
		if(invite) {
			inviteForDuelOrBattle(username, id)
		}
		if(isDuel || selectedIds.length < 4) {
			setButtonDisabled(true)
		}
	}

	const _handleSelectedInvite = (id) => {
		let ids
		if(isDuel) {
			ids = [id]
		}
		else {
			if(selectedInviteIds.includes(id)) {
				ids = selectedInviteIds.filter((selectedInviteId) => selectedInviteId != id)
			}
			else {
				if(selectedInviteIds.length >= 5 ) return
				ids = [...selectedInviteIds, id]
			}
		}
		setSelectedInviteIds([id])
	}

	const renderItem = ({ item }) => {
		const { account_name, rank, opponentUri, username } = item
		let [backgroundColor, color] = ["#fff", "#327ebc"]
		if(selectedIds.includes(item.id)) {
			if(responseIds[item.id]) {
				[backgroundColor, color] = ["#23af4c", "#fff"]
			}
			else {
				[backgroundColor, color] = ["#327ebc", "#fff"]
			}
		}
		else {
			delete tempSelectedOps[item.id]
		}
		const displayName = (account_name)? account_name: username
		return (
			<TouchableWithoutFeedback onPress={() => handleSelectPlayer(item.id, username, true)}>
				<View style={{...styles.bannerContainer2, backgroundColor}}>
					<View style={{width: 70, height: 70, justifyContent: 'center'}}>
						<Image
							source={{uri: opponentUri}}
							style={{
								height: '50%', width: '50%',
								borderRadius:300, alignSelf: 'center'
							}}
						/>
					</View>
					<View>
						<Text style={{color, fontSize: 20}}>{displayName}</Text>
						<Text style={{color}}>{rank}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	const _renderInviteItems = ({ item }) => {
		const { account_name, opponentUri, username, selected_id } = item
		let opacity = 0.0
		if(selectedInviteIds.includes(item.id)) {
			opacity = 1.0
		}
		const displayName = (account_name)? account_name: username
		return (
			<TouchableWithoutFeedback onPress={() => {
				acceptedChallenge[username] = item
				_handleSelectedInvite(item.id, username)
				sendInviteResponse(username, true)
			}}>
				<View style={{...styles.invitesContainer}}>
					<View style={{width: 70, height: 70, justifyContent: 'center'}}>
						<Image
							source={{uri: opponentUri}}
							style={{
								height: '70%', width: '70%',
								alignSelf: 'flex-start'
							}}
						/>
					</View>
					<View style={{flex: 1}}>
						<Text style={{color: '#fff', fontSize: 20}}>{displayName}</Text>
						<Text style={{color: '#fff'}}>Duel</Text>
					</View>
					<View style={{width: 25, height: 25, justifyContent: 'center'}}>
						<Image
							source={check}
							style={{
								height: '100%', width: '100%',
								alignSelf: 'flex-start',
								opacity: opacity
							}}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	return (
		<ScreenContainer>
			<View style={styles.wrapper}>
				<View style={styles.bannerContainer}>
					<View style={{marginRight: 10, width: 70, height: 70}}>
						<Image
							source={{uri: avatarUri}}
							style={{
								height: '100%', width: '100%',
								borderRadius:300
							}}
						/>
					</View>
					<View style={{
						marginRight: 50,
						with: 'auto',
						diplay: 'flex',
						flexDirection: 'column',
						alignSelf: 'center',
						justifyContent: 'space-around'
					}}>
						<Text style={{color:'#fff', fontSize: 20}}>{accountName}</Text>
					</View>
				</View>
				<View style={{
					padding: 30,
					display: 'flex',
					flexGrow: 1,
					alignItems: 'center',
					backgroundColor: '#1a5098'
					
				}}>
					<View
						style={{
							top: '-8%',
							position: 'absolute',
							marginBottom: 20,
							padding: 5,
							width: 80,
							height: 80,
							borderColor: '#fff',
							borderWidth: 3,
							backgroundColor: '#23af4c',
							borderRadius: 60,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Text style={{fontSize: 25,color: '#fff' }}>VS</Text>
					</View>
					
					<View
						style={{
							height: (height - 350),
							width: '100%',
							backgroundColor: 'white',
							borderRadius: 15,
							marginTop: 25,
							paddingBottom: 15
						}}
					>
						<View style={{
							display: 'flex',
							flexDirection: 'row',
							backgroundColor: '#de5426',
							padding: 10,
							width: '100%',
							height: 40,
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10,
							alignItems: 'center',
						}}>
							<Text style={{color: '#fff'}}>Choose Players:</Text>
						</View>
						<FlatList
							data={opponents}
							renderItem={renderItem}
							keyExtractor={(item) => item.id}
							extraData={selectedIds}
						/>
					</View>
					<TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
						playNow()
					}} disabled={buttonDisabled}>
						<LinearGradient
							colors={(buttonDisabled)? ['#646464', '#646464']: ['#fb681a', '#f74d12']}
							style={{
								borderRadius: 30,
								marginTop: 20,
								width: '100%',
								justifyContent: 'center',
								height: 60,
								alignItems: 'center'
							}}
						>
							<Text 
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									color: (buttonDisabled)? '#fffffff0':'#fff',
									fontSize: 20
								}}
							>
								PLAY NOW
							</Text>
						</LinearGradient>
					</TouchableWithoutFeedback>
				</View>
			</View>
			<Modal
				visible={alertVisibility}
				transparent={true}
				animationType={"fade"}
				onRequestClose={ () => {
					setSelectedInviteIds([])
					setAlertVisibility(false)
				} }
			>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>You have new game challenges to play.</Text>
					</View>
					<View style={styles.modalContent}>
						<View style={{flex: 1, width: '100%'}}>
							<FlatList
								data={invitesFrom}
								renderItem={_renderInviteItems}
								keyExtractor={(item) => item.from}
								extraData={invitesFrom}
							/>
						</View>
						<TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
							setSelectedInviteIds([])
							setAlertVisibility(false)
						}}>
							<View style={{width: '100%', marginTop: -50, alignItems: 'center'}}>
								<Image
									source={closeBtn}
									style={{
										height: 20,
										width: 20,
										marginTop: 20
									}}
								/>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</View> 
			</Modal>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		height: '100%',
		justifyContent: 'flex-start'
	},
	bannerContainer: {
		paddingBottom: 40,
		display: 'flex',
		backgroundColor: '#327ebc',
		width: '100%',
		padding: 15,
		borderBottomColor: '#fff',
		borderBottomWidth: 3,
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row'
	},
	bannerContainer2: {
		display: 'flex',
		width: '100%',
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
	},
	invitesContainer: {
		display: 'flex',
		width: '100%',
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		marginTop: 10,
		paddingBottom: 10,
	},
	modalHeader: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor : "#327ebb", 
		height:  'auto',
		width: '100%',
		padding: 25
	},
	modalTitle: {
		fontSize: 20,
		color: "#0066c5",
		textAlign: 'center',
		padding: 15,
		width: '100%',
		backgroundColor: '#f6ef25',
		fontFamily: 'Righteous_400Regular'
	},
	modalContent: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor : "#195097", 
		height:  100,
		width: '100%',
		padding: 20,
		flex: 1
	}
})
