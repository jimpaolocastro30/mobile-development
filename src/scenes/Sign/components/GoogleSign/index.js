import React, { useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'components/NativeComponents'
import GoogleSignIn from 'expo-google-sign-in'
import { google_client_id } from '../../../../CONSTANTS'

export default function GoodleSign({ user, responseHandler, logoutHandler }) {

	useEffect(() => {
		GoogleSignIn.initAsync({
			clientId: google_client_id,
		})
		isSignedIn()
	}, [])
	
	const signIn = async () => {
		try {
			await GoogleSignIn.askForPlayServicesAsync()
			const userInfo = await GoogleSignIn.signInAsync()
			responseHandler(userInfo)
		}
		catch (error) {
			/** todo: Handle error */
			//if (error.code === statusCodes.SIGN_IN_CANCELLED) {
			//    console.log('User Cancelled the Login Flow')
			//} else if (error.code === statusCodes.IN_PROGRESS) {
			//    console.log('Signing In')
			//} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
			//    console.log('Play Services Not Available or Outdated')
			//} else {
			//    console.log('Some Other Error Happened')
			//}
		}
	}

	const isSignedIn = async () => {
		const isSignedIn = await GoogleSignIn.isSignedInAsync()
		if (!!isSignedIn) {
			getCurrentUserInfo()
		}
		else {
			console.log('Please Login')
		}
	}

	const getCurrentUserInfo = async () => {
		try {
			const userInfo = await GoogleSignIn.signInSilentlyAsync()
			responseHandler(userInfo)
		}
		catch (error) {
			if (error.code === statusCodes.SIGN_IN_REQUIRED) {
				alert('User has not signed in yet')
				console.log('User has not signed in yet')
			}
			else {
				alert("Something went wrong. Unable to get user's info")
				console.log("Something went wrong. Unable to get user's info")
			}
		}
	}

	const signOut = async () => {
		try {
			//await GoogleSignIn.revokeAccess()
			await GoogleSignIn.signOutAsync()
			logoutHandler()
		}
		catch (error) {
			console.error(error)
		}
	}

	return (
		<View style={styles.main}>
			{!user.idToken ?             
				<TouchableOpacity onPress={signIn}>
					<Text>Google Sign</Text>
				</TouchableOpacity>
				:
				<TouchableOpacity onPress={signOut}>
					<Text>Logout</Text>
				</TouchableOpacity>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})
