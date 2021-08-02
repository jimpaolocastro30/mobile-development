import React, { useMemo, useState, useEffect, useReducer } from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { AuthContext } from './context/context'
import RootStackScreen from './navigation/RootStackScreen'
import SplashScreen from './scenes/SplashScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {ThemeProvider} from '@shopify/restyle'
import theme from './lib/theme'
import { Alert } from './components/NativeComponents'
import {
	useFonts,
	Lato_400Regular,
	Lato_700Bold,
	Lato_900Black
} from '@expo-google-fonts/lato'
import { Righteous_400Regular } from '@expo-google-fonts/righteous'
import api, { storeLocalData } from './services/api'
import { LogBox } from 'react-native'

export default App = () => {
	LogBox.ignoreLogs(['Remote debugger'])
	//fonts
	let [fontsLoaded] = useFonts({
		Lato_400Regular,
		Lato_700Bold,
		Lato_900Black,
	})
	let [righteousFontsLoaded] = useFonts({
		Righteous_400Regular
	})
	// const [userName, setUserName]  = useState('')
	const [userToken, setUserToken ] = useState('')
	//const [profilePic, setProfilePic ] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	//const [hasUser, setHasUser] = useState(null)

	const initialLoginState = {
		isLoading: true,
		userName: null,
		userToken: null,
	}
	
	const loginReducer = (prevState, action) => {
		switch( action.type ) {
		  case 'RETRIEVE_TOKEN':
			  console.log(prevState)
			return {
				...prevState,
				userToken:  action.token,
				isLoading: false,
			}
		  case 'LOGIN':
			return {
				...prevState,
				userName: action.id || 'test',
				userToken:  'test',
				isLoading: false,
			}
		  case 'LOGOUT':
			return {
				...prevState,
				userName: null,
				userToken: null,
				isLoading: false,
			}
		  case 'REGISTER':
			return {
				...prevState,
				userName: action.id || 'test',
				userToken:  'test',
				isLoading: false,
			}
		}
	}

	const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)

	const authContext = useMemo(() => {
		return {
			signIn: async(user) => {
				const userToken = String(user?.whiz_token)
				const userName = user?.username
				setUserToken(userToken)
				try {
					await AsyncStorage.setItem('whiz_token', userToken)
				} catch(e) {
					console.log(e)
				}
				dispatch({ type: 'LOGIN', id: userName, token: userToken })
			},
			signUp: async(data, callback) => {
				try {
					const body = {
						"whizapp": {
							"username": data.username,
							"email": data.emailAddress,
							"password": data.password
						}
					}
					const response = await api('', {body})
					return response.status
					// if(response.status == 'SUCCESS') {
					// 	let userToken = response?.results?.data?.token || null
					// 	await storeLocalData('whiz_token', userToken)
					// 	Alert.alert(
					// 		"Success!",
					// 		"We have sent you an email verification",
					// 		[
					// 		  { text: "OK", onPress: () => callback() }
					// 		],
 					// 		{ cancelable: false }
					// 	  )
					// }
					// else {
					// 	Alert.alert(
					// 		"Error",
					// 		"Something went wrong1",
					// 		[
					// 		  {
					// 			text: "Cancel",
					// 			onPress: () => console.log("Cancel Pressed"),
					// 			style: "cancel"
					// 		  },
					// 		  { text: "OK", onPress: () => console.log("OK Pressed") }
					// 		],
					// 		{ cancelable: false }
					// 	  )
					// }
				}
				catch(error) {
					console.log(error)
				}
				setIsLoading(false)
				setUserToken("token")
			},
			signOut: async() => {
				console.log("signOut")
				setIsLoading(false)
				setUserToken(null)
				try {
					await AsyncStorage.removeItem('whiz_token')
				}
				catch(e) {
					console.log(e)
				}
				dispatch({ type: 'LOGOUT' })
			}
		}
	}, [])

	useEffect(() => {
		authContext.signOut()
		// setTimeout(async() => {
		// 	let userToken
		// 	userToken = null
		// 	try {
		// 		userToken = await AsyncStorage.getItem('whiz_token')
		// 	} catch(e) {
		// 		console.log(e)
		// 	}
		// 	dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
		// }, 1000)
		return () => {
			authContext.signOut()
		}
	}, [])

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 3000)
	}, [])

	if(loginState.isLoading) { // && fontsLoaded) {
		return <SplashScreen />
	}
	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer theme={DarkTheme}>
				<ThemeProvider theme={theme}>
					<RootStackScreen userToken={loginState.userToken} />
				</ThemeProvider>
			</NavigationContainer>
		</AuthContext.Provider>	
	)
}
