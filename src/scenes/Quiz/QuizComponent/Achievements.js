import React, { useEffect, useState, useRef, useReducer } from 'react'
import {
	Text,
	View,
	Dimensions,
	Image,
	Animated,
	ScrollView
} from '../../../components/NativeComponents'
import { ModalScreen } from '../../../scenes'
import api, { getLocalData, storeLocalData } from '../../../services/api'

const screen = Dimensions.get("screen");
const ITEM_HEIGHT = 170
const { width, height } = Dimensions.get('screen')
const star = require('../../../assets/star.png')

const dummyData = [
	{
		"achievement_type_id": 1,
		"achievement_type": "Star",
		"value": 100
	},
	{
		"achievement_type_id": 2,
		"achievement_type": "Power-Up",
		"value": "Time Warp",
		"href": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png"
	},
	{
		"achievement_type_id": 3,
		"achievement_type": "Main Battle Badge",
		"value": "Bronze Star (Beginner)",
		"href": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png"
	},
	{
		"achievement_type_id": 4,
		"achievement_type": "Secondary Battle Badge",
		"value": "Math Smart (Beginner)",
		"href": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png"
	}
]

export default function Achievements({navigation}) {
	const refCollection = [
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current
	]
	const [achievements, setAchievements] = useState([])
	const [cardsData, setCardsData] = useState([])
	const initialState = {
		data: []
	}
	
	const rewardsReducer = (prevState, action) => {
		console.log("rewards", action.data)
		setCardsData(dummyData)
		return {
			...prevState,
			data: action.data
		}
	}
	
	const [rewardState, dispatch] = useReducer(rewardsReducer, initialState)
	
	useEffect(() => {
		setTimeout(async() => {
			try {
				const gameId = await getLocalData('gameid')
				const resp = await api(`battles-and-players/${gameId}/achievements`)
				dispatch({data: resp.results.achievements})
			} catch(e) {
				console.log(e)
			}
		}, 1)
		return () => {
			storeLocalData('gameid', null)
		}
	}, [])

	useEffect(() => {
		if(cardsData) {
			// do something
		}
	}, [cardsData])

	const ImageWithDescription = ({description, uri, typeId}) => (
		<View style={{display: 'flex', alignItems: 'center'}}>
			<Image
				source={(typeId == 1)? star: {uri: uri}}
				style={{
					height: (screen.width - 190) / 3.5,
					width: (screen.width - 190) / 3.5,
					borderRadius:300,
					margin: 10,
					resizeMode: 'contain'
				}}
			/>
			<Text style={{color: '#000'}}>{description}</Text>
		</View>
	)

	const handleAnimations = () => {
		const animatedTiming = []
		refCollection.map((item, index) => {
			animatedTiming.push(Animated.timing(item, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true
			}))
		})
		Animated.stagger(300, [...animatedTiming]).start()
	}

	return (
		<ModalScreen
			onPress={() => navigation.goBack()}
			navigation={navigation}
			greeting="Congratulations"
		>
			<View
				style={{
					flexGrow: 1,
					width: '100%',
					backgroundColor: '#195097',
					borderRadius: 15,
					alignItems: 'center',
					overflow: 'scroll',
					marginBottom: 50
				}}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{backgroundColor: '#195097'}}
				>
					<View  style={{height: ITEM_HEIGHT * ((rewardState.data.length < 4)? 4: rewardState.data.length)}}>
						{
							refCollection.length > 0 && rewardState?.data.map((item, index) => (
								<Animated.View onLayout={() => {handleAnimations()}}
									style={{
										marginBottom: 10,
										transform: [{
											translateY: refCollection[(index > 4)? 4: index].interpolate({
												inputRange: [0, 1],
												outputRange: [height, 0]
											})
										}]
									}}
									key={index}
								>
									<View style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-around',
										alignItems: 'center',
										alignContent: 'center'
									}}>
										<View style={{
											backgroundColor: '#de5426',
											padding: 10,
											paddingLeft: 20,
											width: '100%',
											borderTopLeftRadius: 15,
											borderTopRightRadius: 15
										}}>
											<Text style={{color: 'white'}}>You've earned a {(item.achievement_type.includes('Badge'))? 'Badge': item.achievement_type}</Text>
										</View>
									</View>
									<View style={{
										backgroundColor: 'white',
										height: 'auto',
										width: '100%',
										borderBottomLeftRadius: 15,
										borderBottomRightRadius: 15
									}}>
										<View style={{
											padding: 10,
											width: '100%',
											flexDirection: 'row',
											height: 'auto',
											flexWrap: 'wrap',
											justifyContent: 'space-evenly'
										}}>
											<ImageWithDescription
												description={item.value}
												uri={item?.href}
												typeId={item.achievement_type_id}
											/>
										</View>
									</View>
								</Animated.View>
							))
						}
					</View>
				</ScrollView>
			</View>
		</ModalScreen>
	)
}
