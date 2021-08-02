import React, { useState, useEffect, useContext } from 'react'
import { 
	Text,
	View,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Dimensions
} from 'react-native'
import { getLocalData } from '../../services/api'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '../../context/context'

const logo = require('../../assets/logo.png')
const screen = Dimensions.get("screen");

export default function Settings({navigation}) {
	const { signOut } = useContext(AuthContext)
	const [activeTab, setActiveTab] = useState('badges')
	const text = 'Terms & Conditions'
	const [avatarUri, setAvatarUri] = useState()
	const [accountName, setAccountName] = useState()

	useEffect(() => {
		getLocalData("avatar-uri").then((uri) => {
			setAvatarUri(uri)
		})
		getLocalData("account-name").then((name) => {
			setAccountName(name)
		})
	}, [])

	return (
		<View style={styles.wrapper}>
			<TouchableWithoutFeedback onPress={() => {navigation.push('ViewProfile')} }>
			<View>
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
			</View>
			</TouchableWithoutFeedback>
			<View style={{
				padding: 30,
				display: 'flex',
				backgroundColor: '#1a5098',
				flexGrow: 1,
				alignItems: 'center',
				width: '100%'
			}}>
				<View style={{width: '100%'}}>
					<Text style={{fontSize: 30, marginBottom: 20, color: '#fff'}}>{text}</Text>
					<View
						style={{ width: '100%', borderColor: '#01aef0', borderWidth: 1, marginBottom: 20}}
					/>
					<Text style={{fontSize: 10, color: '#fff'}}>Version 1.2.2e1b1c4d</Text>
					<Text style={{fontSize: 10, color: '#fff'}}>Last Updated on June 7, 2021</Text>
				</View>

				<TouchableWithoutFeedback style={{width: '100%', flexFrow: 1, justifySelf: 'flex-end' }} onPress={() => {
					signOut()
				}}>
					<LinearGradient
						colors={['#fb681a', '#f74d12']}
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
								color: '#fff',
								fontSize: 20
							}}
						>
							LOGOUT
						</Text>
					</LinearGradient>
				</TouchableWithoutFeedback>
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
