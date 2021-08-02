import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext } from 'react';
import {
	Text,
	View,
	Dimensions,
	TouchableOpacity,
} from '../../../../components/NativeComponents';

import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '../../../../context/context'
import styles from './style'
import { InputField, ScreenContainer } from '../../../common/'
import axios from 'axios'
import Alert from '../../../../components/Alert';

export default function ForgotPassword({ route, navigation }) {

	console.log (route)

	const [trn_id, setTRNId] = useState(route.params.state.trn_id);
	const [code, setCode] = useState(route.params.state.code);
	const [success, setSuccess] = useState(false);
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState ('')
	const [showAlert, setShowAlert] = useState (false)
	const { signUp } = useContext(AuthContext)
	const { height, width } = Dimensions.get('window')
	const pageContentWidth = width * .80

	const handleSubmitEmailAddress = async () => {
		const sendResetPassword = await axios.post ('http://34.123.170.125:3006/api/mobile-users/forgot-password/new-password', { code, trn_id, password })
		if (sendResetPassword.data) {
      setSuccess (true)
    }
    console.log (sendResetPassword.data)
		setMessage (`${ sendResetPassword.data.status || 'FAILED' }\n\n${ sendResetPassword.data.description || 'Cannot change your password.' }.`)
		setShowAlert (true)
	}

	return (
		<ScreenContainer>
			{
				showAlert && <Alert
					message = { message }
					btns = {[
						{
							text: 'OK',
							onPress: () => {
								setShowAlert (false)
								setMessage ('')
								if (success) {
									navigation.navigate ('Login')
								}
								setSuccess (false)
							}
						}
					]}
				/>
			}
			<LinearGradient
				colors={['#1bcfb7', '#1bcfb7', '#327ebb', '#327ebb', '#327ebb']}
				style={styles.container}
			>
				<View style={styles.wrapper}>
					<Text style={styles.textStyle}>Enter your new password.</Text>
					<InputField
						placeholder='Password'
						onChangeText={(pwd) => setPassword(pwd)}
						type = 'password'
						value = { password }
					/>
					<View style={{width: '100%'}}>
						{/* <TouchableOpacity onPress={() => signIn()} style={styles.proceed}> */}
						<TouchableOpacity onPress={handleSubmitEmailAddress} style={styles.proceed}>
							<Text style={{color: '#fff', fontSize: 20,}}>Proceed</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		</ScreenContainer>
	)
}
