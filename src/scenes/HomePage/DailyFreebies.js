import React, { useEffect, useState, useRef, useReducer } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
	Text,
	View,
	Dimensions,
	Image,
	Animated,
	ScrollView
} from '../../components/NativeComponents'
import { ModalScreen } from '../../scenes'
import { getFreebies, claimFreebies } from './util'

const screen = Dimensions.get("screen");
const ITEM_HEIGHT = 162
const { width, height } = Dimensions.get('screen')

export default function DailyFreebies({navigation}) {
	const [cardsData, setCardsData] = useState([])
	const refCollection = [
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current,
		useRef(new Animated.Value(0)).current
	]
	const initialState = {
		freebies: []
	}
	
	const frebieReducer = (prevState, action) => {
		console.log("frebieReduce", action.freebies)
		const fb = []
		action.freebies.map((item, index) => {
			item['key'] = parseInt(index)
			fb.push(item)
		})
		setCardsData(fb)
		return {
			...prevState,
			freebies: action.freebies
		}
	}

	const [freebieState, dispatch] = useReducer(frebieReducer, initialState)

	useEffect(() => {
		setTimeout(async() => {
			try {
				const freebies = await getFreebies()
				dispatch({freebies: freebies})
				freebies?.map((item, index) => {
					claimFreebies({'trn_id': item.trn_id})
				})
			} catch(e) {
				console.log(e)
			}
		}, 1)
	}, [])

	useEffect(() => {
		if(cardsData) {
			// do something
		}
	}, [cardsData])

	const ImageWithDescription = ({description, uri}) => (
		<View style={{display: 'flex', alignItems: 'center'}}>
			<Image
				source={{uri: uri}}
				style={{
					height: (screen.width - 190) / 4, width: (screen.width - 190) / 3.5,
					borderRadius:300,
					margin: 10
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
			greeting="Thank your for playing. Here's your daily reward."
		>
			<View
				style={{
					flexGrow: 1,
					width: '100%',
					backgroundColor: 'transparent',
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
					<View  style={{height: ITEM_HEIGHT * ((cardsData.length < 4)? 4: cardsData.length)}}>
						{
							refCollection.length > 0 && cardsData.map((item, index) => (
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
											<Text style={{color: 'white'}}>You've earned a {item.freebie_type}</Text>
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
											<ImageWithDescription description={item.value} uri={item.imageUri} />
										</View>
									</View>
									<TouchableOpacity style = {{
										height: 60,
										width: 320,
										borderRadius: 40,
										marginTop: 20,
										justifyContent: 'center',
										overflow: 'hidden',
										backgroundColor: '#de5426',
										borderColor: '#fa691a',
										borderWidth: 3,
										alignSelf: 'center'
									}} onPress={() => navigation.goBack()}>
										<View
											style = {{
												position: 'absolute',
												top: 0,
												height: 28,
												backgroundColor: '#fa691a',
												borderRadius: 40,
												width: 315
											}}
										/>
										<Text style = {{
											textAlign: 'center',
											fontSize: 20,
											textTransform: 'uppercase',
											fontWeight: '700',
											color: 'white'
										}}>Claim Rewards</Text>
									</TouchableOpacity>
								</Animated.View>
							))
						}
					</View>
				</ScrollView>
			</View>
		</ModalScreen>
	)
}
