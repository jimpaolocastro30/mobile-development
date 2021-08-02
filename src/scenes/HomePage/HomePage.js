import React, { Fragment, useContext, useEffect, useRef, useReducer, useState } from 'react'
import {
	Text,
	ImageBackground,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Animated
} from '../../components/NativeComponents'
import ScreenContainer from '../../scenes/common/ScreenContainer'
import GradientButton from '../../components/GradientButton'
import Box from '../../components/Box'
import styles from './style'
import { GameContext } from '../../context/GameContext'
import { getCategoryYearLevel } from '../Quiz/util'
import { storeLocalData } from '../../services/api'
import { AuthContext } from '../../context/context'
import { getPlayerProfile } from './helper'
import { getSingleImageUri } from '../EditProfile/scenes/AvatarHandler'
import { useFocusEffect } from '@react-navigation/native'
import { getFreebies } from './util'

const whizBg = require('../../assets/bg.png')
const star = require('../../assets/star.png')
const token = require('../../assets/token.png')
const owl = require('../../assets/owl_reading.png')
const tree = require('../../assets/tree.png')
const lightning = require('../../assets/lightning.png')
const edit = require('../../assets/edit.png')
const ribbon = require('../../assets/ribbon.png')
const avatarDefault = require('../../assets/avatar-default.jpeg')
const { width, height } = Dimensions.get('screen')
const moveStandardButton = new Animated.ValueXY({ x: 10, y: height * 2})
const moveDuelButton = new Animated.ValueXY({ x: width * .45, y: height * 2})
const moveBattleButton = new Animated.ValueXY({ x: 10, y: height * 2})
const moveSpecialButton = new Animated.ValueXY({ x: width * .45, y: height * 2})
// const moveAnimation = new Animated.ValueXY({ x: width * .34, y: height * -.60})

export default function HomePage({ navigation }) {
	const moveAnimation = useRef (new Animated.Value(0)).current
	const { signOut } = useContext(AuthContext)
	const fadeAnim = useRef(new Animated.Value(0)).current
	const animations = [
		{
			animation: fadeAnim,
			toValue: 1,
			duration: 1000
		},
		// {
		// 	animation: moveAnimation,
		// 	toValue: {x: width * .30, y: height * 0},
		// 	duration: 1000
		// },
		{
			animation: moveAnimation,
			toValue: 1,
			duration: 1000
		},
		{
			animation: moveStandardButton,
			toValue: {x: 13, y: 0},
			duration: 1000
		},
		{
			animation: moveDuelButton,
			toValue: {x: width * .51, y: 0},
			duration: 2000
		},
		{
			animation: moveBattleButton,
			toValue: {x: 13, y: height * .11},
			duration: 3000
		},
		{
			animation: moveSpecialButton,
			toValue: {x: width * .51, y: height * .11},
			duration: 4000
		}
	]
	const [accountName, setAccountName ] = useState('')
	const [rank, setRank ] = useState('')
	const [stars, setStars ] = useState('')
	const [tokens, setTokens ] = useState('')
	const [powerUps, setPowerUps ] = useState('')
	const initialHomeState = {
		accountName: null,
		rank: null,
		stars: 0,
		tokens: 0,
		powerUps: 0,
		avatarUri: null
	}

	const homeReducer = (prevState, action) => {
		const avatar = action.record?avatar: null
		switch(action.type) {
			case 'RETRIEVE_INFO':
			  return {
				  ...prevState,
				  accountName: (action.record.account_name)? action.record.account_name: action.record.username,
				  rank: action.record.rank?.description.split('(')[0],
				  stars: action.record.star? action.record.star: 0,
				  tokens: action.record.token? action.record.token: 0,
				  powerUps: action.record.power_up_count,
				  avatarUri: action.record.avatarUri
			  }
		  }
	}

	const [homeState, dispatch] = useReducer(homeReducer, initialHomeState)

	const handleGetCategoryYearLevel = async() => {
		const result = await getCategoryYearLevel()
		await storeLocalData('category', JSON.stringify(result.quiz_category.map(({quiz_category_id, name}) => ({label: name, value: quiz_category_id}))))
		await storeLocalData('yearLevel', JSON.stringify(result.year_level.map(({year_level_id, name}) => ({label: name, value: year_level_id}))))
	}

	const handleAnimations = () => {
		animations.map(({animation, toValue, duration}) => {
			setTimeout(() => {
				Animated.timing(animation, {
					toValue,
					duration: 3000,
					useNativeDriver: false
				}).start()
			}, duration)
		})
	}

	const setInitialValues = () => {
		setTimeout(async() => {
			let user = null
			try {
				user = await getPlayerProfile()
				if(user == null) {
					return
				}
				console.log(user)
				storeLocalData('user-profile', JSON.stringify(user.record))
				const imgUrl = user.record.avatar?.split('/')
				if(imgUrl) { 
					const avatarUri = await getSingleImageUri(imgUrl[imgUrl.length-1])
					user.record["avatarUri"] = avatarUri
					storeLocalData('avatar-uri', avatarUri)
				}
				else {
					storeLocalData('avatar-uri', "")
				}
				storeLocalData('accountMembershipId', `${user.record.id}`)
				storeLocalData('account-name', (user.record.account_name)? user.record.account_name: user.record.username)
				storeLocalData('username', user.record.username)
				storeLocalData('gender', user.record.gender)
				storeLocalData('rank', user.record.rank)
				storeLocalData('stars', (user.record.star)? `${user.record.star}`: '0')
				storeLocalData('tokens', (user.record.token)? `${user.record.token}`: '0')
			} catch(e) {
				console.log(e)
			}
			dispatch({ type: 'RETRIEVE_INFO', record: user.record })
		}, 1000)
	}

	const handleDailyFreebies = () => {
		const resp = getFreebies()
		resp.then((res) => {
			if(Array.isArray(res)) {
				navigation.navigate('DailyFreebies')
			}
			else {
				if(res.count === 0) {
					console.log('Daily freebies has been claimed')
				}
			}
			console.log(res)
		})
	}

	useEffect(() => {
		// navigation.navigate('GameChallenge')
		// navigation.navigate('CategoryYearLevelForm')
		handleDailyFreebies()
		handleGetCategoryYearLevel()
		handleAnimations()
		setInitialValues()
	}, [])

	useFocusEffect(
		React.useCallback(() => {
			setInitialValues()
		}, [])
	)

	const buttons = [
		{
			mode: 'standard',
			colors: [
				'#23af4c',
				'#23af4c',
				'#23af4c',
				'#1e9541',
				'#1e9541',
				'#1e9541'
			],
			animation: () => moveStandardButton.getLayout()
		},
		{
			mode: 'duel',
			colors: [
				'#dd5426',
				'#dd5426',
				'#dd5426',
				'#bc4720',
				'#bc4720',
				'#bc4720'
			],
			animation: () => moveDuelButton.getLayout()
		},
		{
			mode: 'battle of five',
			colors: [
				'#653e97',
				'#653e97',
				'#653e97',
				'#563580',
				'#563580',
				'#563580'
			],
			animation: () => moveBattleButton.getLayout()
		},
		{
			mode: 'special tourney',
			colors: [
				'#ff2839',
				'#ff2839',
				'#ff2839',
				'#d92231',
				'#d92231',
				'#d92231'
			],
			animation: () => moveSpecialButton.getLayout()
		}
	]

	const { setMode } = useContext(GameContext)
	const imgSrc = {uri: homeState.avatarUri}
	return (
		// <ScreenContainer>
		<ImageBackground
			source={whizBg}
			style={{ height: height, width: width}}
		>
			<ScreenContainer style={{ padding: 20 }}>
				<View style={styles.container}>
					<View style={styles.imageWrapper}>
						<Image source={imgSrc} style={styles.imageStyles} />
					</View>
					<View
						style={{
							marginRight: 60,
							with: 'auto',
							diplay: 'flex',
							flexDirection: 'column',
							alignSelf: 'center',
							justifyContent: 'space-around'
						}}
					>
						<Text style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>
							{homeState.accountName}
						</Text>
						<View
							style={{
								position: 'relative',
								display: 'flex',
								color: '#0066c5',
								backgroundColor: '#024b67',
								width: 'auto',
								height: 'auto',
								justifyContent: 'flex-start',
								borderRadius: 50,
								alignSelf: 'flex-start',
								alignItems: 'center',
								flexDirection: 'row'
							}}
						>
							<Box backgroundColor="btnWarning" borderRadius={50}>
								<Image
									source={ribbon}
									style={{
										height: 25,
										width: 25
									}}
								/>
							</Box>
							<View style={{ paddingRight: 50, with: 'auto' }}>
								<Text
									style={{ color: '#4ccaf9', marginLeft: 20 }}
								>
									{homeState.rank}
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							position: 'absolute',
							right: -10,
							top: 10,
							width: 30,
							height: 30,
							borderRadius: '20px',
						}}
					>
					{/* onPress={() => navigation.push('ViewProfile')} */}
						<TouchableOpacity
							onPress={() => navigation.push('ViewProfile')}
						>
							<Image
								source={edit}
								style={{
									height: '100%',
									width: '100%',
									borderRadius: 300,
									borderColor: '#fff'
								}}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						marginTop: 20,
						display: 'flex',
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
				>
					<View
						style={{
							position: 'relative',
							display: 'flex',
							color: '#0066c5',
							backgroundColor: '#024b67',
							justifyContent: 'flex-start',
							borderRadius: 50,
							alignSelf: 'flex-start',
							alignItems: 'center',
							flexDirection: 'row',
							height: height * .040
						}}
					>
						<View style={{ width: width * 0.070, height:  height * .035 }}>
							<Image
								source={star}
								style={{
									height: '110%',
									width: '110%',
									borderRadius: 300,
									position: 'relative',
									top: -1,
									left: -1
								}}
							/>
						</View>
						<View
							style={{
								with: 'auto',
								marginLeft: 15,
								marginRight: 15
							}}
						>
							<Text style={{ color: '#4ccaf9' }}>{homeState.stars}</Text>
						</View>
					</View>
					<View
						style={{
							position: 'relative',
							display: 'flex',
							color: '#0066c5',
							backgroundColor: '#024b67',
							justifyContent: 'flex-start',
							borderRadius: 50,
							alignSelf: 'flex-start',
							alignItems: 'center',
							flexDirection: 'row',
							height: height * .040
						}}
					>
						<View style={{ width: width * 0.070, height:  height * .035 }}>
							<Image
								source={token}
								style={{
									height: '110%',
									width: '110%',
									borderRadius: 300,
									position: 'relative',
									top: -1,
									left: -1
								}}
							/>
						</View>
						<View
							style={{
								with: 'auto',
								marginLeft: 15,
								marginRight: 15
							}}
						>
							<Text style={{ color: '#4ccaf9' }}>{homeState.tokens}</Text>
						</View>
					</View>
					<View
						style={{
							position: 'relative',
							display: 'flex',
							color: '#0066c5',
							backgroundColor: '#faca0e',
							height: 'auto',
							justifyContent: 'flex-start',
							borderRadius: 50,
							alignSelf: 'flex-start',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<View style={{ width: width * 0.070, height:  height * .035 }}>
							<Image
								source={lightning}
								style={{
									height: '105%',
									width: '105%',
									borderRadius: 300,
									backgroundColor: '#1a5098',
									position: 'relative',
									top: -1,
									left: -1
								}}
							/>
						</View>
						<View
							style={{
								with: 'auto',
								marginLeft: 15,
								marginRight: 15
							}}
						>
							<Text style={{ color: '#024b67' }}>{homeState.powerUps}</Text>
						</View>
					</View>
				</View>
				<View style={{ marginTop: 30, width: '100%' }}>
					<Text
						style={{
							color: '#024b67',
							fontWeight: 'bold',
							fontSize: 35,
							textAlign: 'center'
						}}
					>
						Choose What To Play!
					</Text>
					<Text
						style={{
							alignContent: 'center',
							alignSelf: 'center',
							color: '#024b67',
							fontSize: 20,
							textAlign: 'center',
							fontWeight: '200',
							width: '80%',
							justifyContent: 'center'
						}}
					>
						Have fun playing individually or challenging your
						friends.
					</Text>
				</View>
				<View
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-start'
					}}
				>
					<Animated.View
						style={[{
							alignSelf: 'center',
							height: height * .15,
							width: width,
							position: 'absolute',
							top: 90,
							left: 0
						},
						{
							opacity: fadeAnim
						}]}
					>
						<Image
							source={tree}
							style={{
								height: '100%',
								width: '100%',
								resizeMode: 'stretch'
							}}
						/>
					</Animated.View>
					<Animated.View
						style={[{height: height * .20, width: width * .34},
							{
								transform: [{
									translateX: moveAnimation.interpolate ({
										inputRange: [0, 1],
										outputRange: [width * 2, width * .25]
									})
								}]
							}
							// moveAnimation.getLayout()
						]}
					>
						<Image
							source={owl}
							style={{
								width: null,
								resizeMode: 'contain',
								height: '100%'
							}}
						/>
					</Animated.View>
				</View>

			</ScreenContainer>
			<View style={{ height: height * .25, justifyContent: 'flex-end', marginBottom: 100}}>
				{buttons.map(({mode, colors, animation}, i) => (
					<Animated.View  key={i} style={[{width: width * .45, position: 'absolute'}, animation()]}>
						<GradientButton
							onPress={() => {
								setMode(mode)
								navigation.push('Onboarding')
							}}
							colors={colors}
							label={mode}
						/>
					</Animated.View>
				))}
				</View>
		</ImageBackground>
	)
}
