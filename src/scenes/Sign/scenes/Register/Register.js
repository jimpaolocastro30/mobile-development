import React, { useState, useContext, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from '../../../../components/NativeComponents'
import Box from '../../../../components/Box'
import ScreenContainer from '../../../../scenes/common/ScreenContainer'
import SubmitButton from '../../../../components/Button'
import { InputField } from '../../../common/'
import { LinearGradient } from 'expo-linear-gradient'
import styles from './style'
import FBSign from '../../components/FBSign'
import { AuthContext } from '../../../../context/context'
import { checkForUpdateAsync } from 'expo-updates'
import Alert from '../../../../components/Alert'

export default function Register({ navigation }) {
	const [username, setUsername] = useState(null)
	const [emailAddress, setEmailAddress] = useState(null)
	const [password, setPassword] = useState(null)
	const [isValid, setIsValid] = useState(null)
	const [isUsernameValid, setIsUsernameValid] = useState(null)
	const [isEmailValid, setIsEmailValid] = useState(null)
	const [passwordsMatch, setPasswordsMatch] = useState(null)
	const [inputsDisabled, setInputsDisabled] = useState(true)
	
	const { signUp } = useContext(AuthContext)
	const [success, setSuccess] = useState (false)
	const [showAlert, setShowAlert] = useState (false)

	const validate = (value, name) => {
		console.log(value.nativeEvent.text)
		// alert(value)
	}
	const checkPasswordMatch = (value) => {
		let reTypedPassword = value.nativeEvent.text		
		setPasswordsMatch(password == reTypedPassword)
	}
	useEffect(() => {
		if(isEmailValid && isUsernameValid && isValid) {
			const consolidatedErrors = [...isValid, ...isUsernameValid, ...isEmailValid]
		}
	}, [isValid, isUsernameValid, isEmailValid])	
	return (
		<ScreenContainer>
			<LinearGradient
				colors={['#1bcfb7', '#01aef0', '#327ebb']}
				style={styles.container}
			>
			<ScrollView style={styles.container}>
				<Box
					width="100%"
					flex={1}
					alignItems="center"
					padding="l"
					marginTop="m"
					marginBottom="l"
				>
					<InputField
						textContentType='username' 
						placeholder='Enter Username'
						onChangeText={(value) => setUsername(value)}
						pattern={[
							'(?=.*?[#?!@$%^&*-])'
						]}
						onValidation={isValid => setIsUsernameValid(isValid)}
					/>
					<View style={{paddingLeft: 20, width: '100%'}}>
						{
							isUsernameValid && isUsernameValid[0] && (
								<Text style={{...styles.error, marginTop: -20, color: '#bc4720' }}>
									Invalid username
								</Text>
							)
						}
					</View>
					<InputField
						textContentType='emailAddress' 
						placeholder='Enter Email Address'
						onChangeText={(value) => setEmailAddress(value)}
						pattern={[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]}
						onValidation={isEmailValid => setIsEmailValid(isEmailValid)}
					/>
					<View style={{paddingLeft: 20, width: '100%'}}>
						{
							!isEmailValid || !isEmailValid[0] && (
								<Text style={{...styles.error, marginTop: -20, color: '#bc4720' }}>
									Invalid email address
								</Text>
							)
						}
					</View>
					<InputField
						textContentType='password' 
						placeholder='Enter Password'
						secureTextEntry={true}
						onChangeText={(password) => setPassword(password)}
						type='password'
						pattern={[
							'^.{8,}',
							'(?=.*?[0-9])',
							'(?=.*[A-Z])',
							'(?=.*[!@#$%^&*_])'
						]}
						onValidation={isValid => setIsValid(isValid)}
					/>
					<View style={{paddingLeft: 20,  width: '100%', marginTop: -20}}>
						<Text style={{ ...styles.error, color: isValid && isValid[0] ? 'green' : '#bc4720' }}>
							Minimum of 8 characters
						</Text>
						<Text style={{...styles.error, color: isValid && isValid[1] ? 'green' : '#bc4720' }}>
							Atleast 1 number required
						</Text>
						<Text style={{...styles.error, color: isValid && isValid[2] ? 'green' : '#bc4720' }}>
							Atleast 1 upper case and lower case letter
						</Text>
						<Text style={{...styles.error, color: isValid && isValid[3] ? 'green' : '#bc4720' }}>
							Atleast 1 special character
						</Text>
					</View>
					<InputField
						placeholder='Re-type Password'
						secureTextEntry={true}
						onEndEditing={(password) => checkPasswordMatch(password)}
						type='password'
					/>
					{/* {
						!passwordsMatch && (
							<View style={{paddingLeft: 20,  width: '100%', marginTop: -20}}>
								<Text style={{ ...styles.error, color: isValid && isValid[0] ? 'green' : '#bc4720' }}>
									Passwords don't match
								</Text>
							</View>
						)
					} */}
					<SubmitButton
						label="Proceed"
						onPress={async () => {
							setSuccess (false)
							// console.log({username})
							const signup = await signUp({username, emailAddress, password}, () => {})
							console.log ('signup', signup)
							if (signup === 'SUCCESS') {
								setSuccess (true)
								setShowAlert (true)
							}
							setUsername(null)
							setEmailAddress(null)
							setPassword(null)
						}}
						width="100%"
						borderRadius={40}
						height={60}
						marginTop="s"
						backgroundColor="btnPrimary"
						alignSelf="center"
					/>
					<View style={{width: '65%', alignSelf: 'center', flexBasis: 1}}>
						<Text style={styles.termsText}>
							By continuing, you are agreeing to the Terms and Conditions
						</Text>
					</View>
					<View
						style={styles.hr}
					/>
					<TouchableOpacity style={styles.FB}>
						<FBSign
							label='Continue with Facebook'
							userName={'test'}
							responseHandler={'test'}
							logoutHandler={'test'}
						/>
					</TouchableOpacity>
				</Box>
			</ScrollView>
			</LinearGradient>
			{
				showAlert && <Alert
					btns = {[
						{
							onPress: () => {
								setSuccess (false)
								navigation.push('Login')
								setShowAlert (false)
							},
							text: 'OK'
						}
					]}
					message = {
						success ? `Success!\n\nAccount successfully registered.\nWe have sent you an email verification.` : 'Registration failed.'
					}
				/>
			}
		</ScreenContainer>
	)
}
