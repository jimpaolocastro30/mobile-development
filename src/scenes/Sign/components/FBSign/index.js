import React, { useContext } from 'react'
import { View, TouchableWithoutFeedback, Text, Alert } from '../../../../components/NativeComponents'
import MCIcons from 'react-native-vector-icons/FontAwesome'
// import { LoginManager } from 'react-native-fbsdk-next'
// import { LoginManager } from 'react-native-fbsdk'
import * as Facebook from 'expo-facebook'
import Axios from 'axios'
import { AuthContext } from '../../../../context/context'
import api, { storeLocalData, getLocalData } from '../../../../services/api'


function FBSign({ userName, responseHandler, logoutHandler, label, appId, appName }) {
	const { signIn } = useContext(AuthContext)
	const handleFacebookLogin = async () => {
		console.log("working on it :)")
		try {
			await Facebook.initializeAsync({ appId, appName	});
			const {
				type,
				token,
				expirationDate,
				permissions,
				declinedPermissions,
			} = await Facebook.logInWithReadPermissionsAsync({
				permissions: ['public_profile', 'email'],
				behavior: 'web'
			});
			if (type === 'success') {
				// Get the user's name using Facebook's Graph API
				const auth = await fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`);
				const fbAccount = await auth.json()
				console.log ('facebookLoginInfo', fbAccount)
				// const login = await fetch ('http://34.123.170.125:3006/api/mobile-users/with-facebook', {
				// 	method: 'POST',
				// 	body: {
				// 		facebook: {
				// 			username: fbAccount.id,
				// 			email: fbAccount.email,
				// 			token
				// 		}
				// 	}
				// })
				const login = await Axios.post ('http://34.123.170.125:3006/api/mobile-users/with-facebook', {
					facebook: {
						username: fbAccount.id,
						email: fbAccount.email,
						token
					}
				})
				// console.log ('token', token)
				const backendResponse = await login.data
				console.log ('backendResponse', backendResponse)
				const backendResponseDescription = backendResponse.description
				const backendResponseMessage = backendResponse.message
				const backendResponseResultsEmail = backendResponse.results.email
				const backendResponseResultsToken = backendResponse.results.token
				const backendResponseResultsUsername = backendResponse.results.username
				const backendResponseResultsVia = backendResponse.results.via
				const backendResponseStatus = backendResponse.status

				// const response = await api('login', {
				// 	body: {
				// 		username: backendResponseResultsUsername,
				// 		email: backendResponseResultsEmail,
				// 		token: backendResponseResultsToken
				// 	}
				// })
				// console.log ('loginResponse', response)

				signIn ({
					username: backendResponseResultsUsername,
					// email: backendResponseResultsEmail,
					whiz_token: backendResponseResultsToken
				})

			} else {
				// type === 'cancel'
			}
		} catch ({ message }) {
			console.error (`Facebook Login Error: ${message}`);
		}
	}

	return (
		<View style={{
			borderRadius: 4,
			alignSelf: 'center',
			padding: 5,
			backgroundColor: '#1a5098',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center'
		}}>
			<MCIcons name='facebook-square' color='white' size={25} />
			<TouchableWithoutFeedback
				onPress={handleFacebookLogin}
				style={{alignSelf: 'center', justifyContent: 'center', width: '100%'}}
			>
				<Text style={{ color: '#fff', fontSize: 18, margin: 7}}>{label}</Text>
			</TouchableWithoutFeedback>
		</View>
	)
}

export default FBSign
 