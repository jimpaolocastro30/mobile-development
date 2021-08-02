import React, { useState, useEffect, useReducer } from 'react'
import { 
	Text,
	View,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Dimensions,
	ScrollView
} from '../../components/NativeComponents'
import { getLocalData } from '../../services/api'
import { getSingleImageUri, fetchImagesFromServer } from './PowerupsHandler'

const avatarDefault = require('../../assets/avatar-default.jpeg')
const eureka = require('../../assets/eureka.png')
const takeTwo = require('../../assets/take2.jpg')
const timeWarp = require('../../assets/time-warp.png')
const bronze = require('../../assets/badges/bronze.png')
const silver = require('../../assets/badges/silver.png')
const gold = require('../../assets/badges/gold.png')
const mathSmart = require('../../assets/badges/math-smart.png')
const mathStar = require('../../assets/badges/math-star.png')
const mathWhiz = require('../../assets/badges/math-whiz.png')
const scienceSmart = require('../../assets/badges/science-smart.png')
const scienceStar = require('../../assets/badges/science-star.png')
const scienceWhiz = require('../../assets/badges/science-whiz.png')
const screen = Dimensions.get("screen")
const BADGE_HEIGHT = 100
const badges = [
	{name: 'Bronze Star (Math)', src: bronze, isActive: false},
	{name: 'Bronze Star (Science)', src: bronze, isActive: false},
	{name: 'Silver Star (Math)', src: silver, isActive: false},
	{name: 'Silver Star (Science)', src: silver},
	{name: 'Gold Star (Math)', src: gold},
	{name: 'Gold Star (Science)', src: gold},
	{name: 'Math Smart', src: mathSmart},
	{name: 'Science Smart', src: scienceSmart},
	{name: 'Math Star', src: mathStar},
	{name: 'Science Star', src: scienceStar},
	{name: 'Math Whiz', src: mathWhiz},
	{name: 'Science Whiz', src: scienceWhiz},
]
const dummyPowerUps = [
	{
		"user_power_up_id": 2,
		"power_up_id": 1,
		"is_active": 1,
		"image_path": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png",
		"type_name": "Time Warp",
		"description": "Increase 10s in Time"
	},
	{
		"user_power_up_id": 3,
		"power_up_id": 2,
		"is_active": 1,
		"image_path": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png",
		"type_name": "Take Two",
		"description": "Eliminate Two Wrong Answers"
	}
]
const dummyBadges = [
	{
		"is_battle": 1,
		"badge_id": 1,
		"badge_name": "Math Smart (Beginner)",
		"dt_inserted": "2021-04-30 17:24:07",
		"game_type": "Battle",
		"image_path": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png"
	},
	{
		"is_battle": 1,
		"badge_id": 2,
		"badge_name": "Math Star (Beginner)",
		"dt_inserted": "2021-04-30 17:24:07",
		"game_type": "Battle",
		"image_path": "http://34.123.170.125:3006/images/quizzes/close-1623246222565.png"
	}
]
let powerUps = []


export default function UserProfile({navigation}) {
	const [activeTab, setActiveTab] = useState('badges')
	const [avatarURI, setAvatarURI] = useState()
	const [accountName, setAccountName] = useState()
	const [rank, setRank] = useState()
	const [stars, setStars] = useState(0)
	const [tokens, setTokens] = useState(0)

	const initialize = async () => {
		const userRec = JSON.parse(await getLocalData("user-profile"))
		const uri = await getLocalData("avatar-uri")
		const pups = {}
		userRec.powerUps.map((item, index) => {
			if(item.type_name in pups) {
				pups[item.type_name].count++
			}
			else {
				item['count'] = 1
				pups[item.type_name] = item
			}
		})
		powerUps = Object.values(pups)

		let rankDesc
		rankDesc = userRec.rank?.description.split('(')[0]
		setAccountName(userRec.account_name)
		setAvatarURI(uri)
		setRank(rankDesc)
		setStars(userRec.star)
		setTokens(userRec.token)
	}

	useEffect(() => {
		initialize()
	})

	const ImageWithDescription = ({description, src, isActive=false}) => (
		<View style={{display: 'flex', alignItems: 'center'}}>
			{isActive && <Image
				source={src}
				style={{
					height: (screen.width - 190) / 2,
					width: (screen.width - (description.includes('Time')? 160: 190)) / 2,
					margin: 10,
					borderRadius: 100,
					tintColor: 'gray'
				}}
			/>}
			<Image
				source={src}
				style={{
					height: (screen.width - 190) / 2,
					width: (screen.width - (description.includes('Time')? 160: 190)) / 2,
					margin: 10,
					borderRadius: 100,
					position: isActive? 'absolute': 'relative',
					opacity: isActive? 1.0: 0.2
				}}
			/>
			<Text style={{color: '#000', opacity: isActive? 1.0: 0.2}}>{description}</Text>
		</View>
	)

	console.log('UserProfile')
	return (
		<View style={styles.wrapper}>
			<View style={styles.bannerContainer}>
				<View style={{marginRight: 10, width: 70, height: 70}}>
					<Image
						source={(avatarURI == null)? avatarDefault: {uri: avatarURI}}
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
					<TouchableWithoutFeedback onPress={() => navigation.push('EditProfile')}>
						<Text style={{color:'white'}}>View Profile {">"}</Text>
					</TouchableWithoutFeedback>
				</View>
			</View>
			<View style={{
				padding: 20,
				display: 'flex',
				backgroundColor: '#024b67',
				flexGrow: 1,
				alignItems: 'center'
			}}>
				<View
					style={{
						marginBottom: 20,
						padding: 5,
						width: '100%',
						backgroundColor: '#23af4c',
						borderRadius: 60,
						alignItems: 'center'
					}}
				>
					<Text style={{fontSize: 25,color: '#fff' }}>{rank}</Text>
					<View style={{display: 'flex', flexDirection: 'row'}}>
						<Text style={{color: '#fff' }}>{stars} Stars  | </Text>
						<Text style={{color: '#fff' }}> {tokens} Tokens</Text>
					</View>
				</View>
				<View
					style={{
						flexGrow: 1,
						width: '100%',
						backgroundColor: 'white',
						borderRadius: 15,
						alignItems: 'center'
					}}
				>
					<View style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'center',
						alignContent: 'center'
					}}>
						<View style={{
							backgroundColor: activeTab == 'badges' ? '#de5426' : '#e68362',
							padding: 10,
							width: '50%',
							borderTopLeftRadius: 15
						}}>
						<TouchableOpacity onPress={() => setActiveTab('badges')}>
							<Text>My Badges</Text>
						</TouchableOpacity>
						</View>
						<View style={{
							backgroundColor: activeTab == 'badges' ? '#e68362' : '#dd5426',
							padding: 10,
							width: '50%',
							borderTopRightRadius: 15
						}}>
						<TouchableOpacity onPress={() => setActiveTab('powerups')}>
							<Text>Power-Ups</Text>
						</TouchableOpacity>
						</View>
					</View>
					<View style={{backgroundColor: 'white', height: screen.height - 455, width: '100%'}}>
					{
						activeTab == 'badges' && 
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
							<View style={{
								padding: 10,
								width: '100%',
								height: BADGE_HEIGHT * 9,
								flexDirection: 'row',
								flexWrap: 'wrap',
								justifyContent: 'space-evenly'
							}}>
								{
									badges.map(({name, src, isActive}, i) => (
										<ImageWithDescription description={name} src={src} isActive={isActive} />
									))
								}
							</View>
						</ScrollView>
					}
					{	activeTab == 'powerups' && <View style={{
							padding: 10,
							width: '100%',
							flexDirection: 'row',
							height: 'auto',
							 flexWrap: 'wrap',
							justifyContent: 'space-evenly'
						}}>
							{powerUps.map((item, index) => (
								<ImageWithDescription description={`${item.type_name} (x${item.count})`}
									src={((item.power_up_id==1)? timeWarp: (item.power_up_id==2)? takeTwo: eureka)} isActive={item.is_active} />
							))}
						</View>
					}
					</View>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		height: '100%',
		justifyContent: 'space-evenly'
	},
	bannerContainer: {
		display: 'flex',
		backgroundColor: '#327ebc',
		width: '100%',
		padding: 15,
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row'
	},
	badges: {
		backgroundColor: '#dd5426'
	},
	powerUps: {
		backgroundColor: '#e68362'
	}
})
