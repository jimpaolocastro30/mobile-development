import React from 'react'
import { View, TouchableWithoutFeedback, Text, Alert } from '../../../../components/NativeComponents'
import MCIcons from 'react-native-vector-icons/FontAwesome'
// import { LoginManager } from 'react-native-fbsdk-next'
// import { LoginManager } from 'react-native-fbsdk'
import * as Facebook from 'expo-facebook'

function FBSign({ userName, responseHandler, logoutHandler, label, appId, appName }) {
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
				const login = await fetch ('http://34.123.170.125:3006/api/api/mobile-users/with-facebook', {
					method: 'POST',
					body: {
						facebook: {
							username: fbAccount.id,
							email: fbAccount.email,
							token
						}
					}
				})
				console.log (await login.json ())
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
 