// import { signInAsync } from 'expo-google-sign-in'
import React, { useState, useContext } from 'react'
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Dimensions
} from '../../../../components/NativeComponents'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '../../../../context/context'
 import FBSign from '../../components/FBSign'
// import GoogleSign from '../../components/GoogleSign'
import styles from './style'
import { InputField, ScreenContainer } from '../../../common/'
import api, { storeLocalData, getLocalData } from '../../../../services/api'
import config from '../../../../../app.json'
import Alert from '../../../../components/Alert'

export default function Login({ navigation }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { signIn, signOut } = useContext(AuthContext)
	const { height, width } = Dimensions.get('window')
	const {facebookAppId} = config
	const pageContentWidth = width * .80
	const [invalid, setInvalid] = useState (false)
	return (
		<ScreenContainer>
			<LinearGradient
				colors={['#1bcfb7', '#1bcfb7', '#01aef0', '#327ebb', '#327ebb']}
				style={styles.container}
			>
				<View style={{
					flex: 1,
					width: pageContentWidth,
					alignContent:'center',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<View style={{
						alignSelf: 'center',
						height: 120,
						width: 200,
						marginTop: -20,
						marginBottom: 40
					}}>
						<Image
							style={styles.image}
							source={require('../../../../assets/logo.png')}
						/>
					</View>
					<InputField
						placeholder='Enter Username'
						onChangeText={(value) => setUsername(value)}
					/>
					<InputField
						placeholder='Enter Password'
						type='password'
						onChangeText={(password) => setPassword(password)}
					/>
					<View style={{
						display: 'flex',
						flexDirection: 'row',
						width: pageContentWidth,
						alignContent:'space-between',
						justifyContent: 'space-between'
					}}>
						<TouchableOpacity
							onPress={async() => {
								setInvalid (false)
								const body = {
									"whizapp": {
										"username": username,
										"password": password
									}
								}
								console.log(body)
								{/* // temp
								const token = await getLocalData('whiz_token')
									signIn({
										userName: username,
										whiz_token: token
									})
									return */}
								// temp

								const response = await api('login', {body})
								console.log("login response")
								console.log(response)


								if(response && response.status == 'SUCCESS') {
									let userToken = response?.results?.token || null
									await storeLocalData('whiz_token', userToken)
									signIn({
										userName: username,
										whiz_token: userToken
									})
								}
								else {
									// Alert.alert(
									// 	"Error",
									// 	"Incorrect account credentials. Please try again",
									// 	[
									// 	{
									// 		text: "Cancel",
									// 		onPress: () => console.log("Cancel Pressed"),
									// 		style: "cancel"
									// 	},
									// 	{ text: "OK", onPress: () => console.log("OK Pressed") }
									// 	],
									// 	{ cancelable: false }
									// )
									setInvalid (true)
								}

								{/* signIn({username: username, password: password}, (view) => {
									navigation.push(view)
								}) */}
							}}
							style={styles.loginBtn}
						>
							<Text style={styles.buttonStyle}>Log In</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => navigation.push('Register')}
							style={styles.signUpBtn}
						>
							<Text style={styles.buttonStyle}>Register</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
						<Text style={styles.forgot_button}>Forgot Password?</Text>
					</TouchableOpacity>
					<View
						style={styles.hr}
					/>
					<TouchableOpacity style={styles.FB}>
						<FBSign
							label='Login with Facebook'
							userName={'test'}
							responseHandler={'test'}
							logoutHandler={'test'}
							appId={facebookAppId}
							appName='Whiz App'
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>
			{
				invalid && <Alert
					btns = {[
						{
							onPress: () => setInvalid (false),
							text: 'OK'
						}
					]}
					message = {
						`Incorrect account credentials.\n\nPlease try again`
					}
				/>
			}
		</ScreenContainer>
	)
}
