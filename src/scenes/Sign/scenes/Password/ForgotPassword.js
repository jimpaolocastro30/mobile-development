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

export default function ForgotPassword({ navigation }) {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { signUp } = useContext(AuthContext)
	const { height, width } = Dimensions.get('window')
	const pageContentWidth = width * .80

	const handleSubmitEmailAddress = async () => {
		const sendResetPassword = await axios.post ('http://34.123.170.125:3006/api/mobile-users/forgot-password/reset-code', { username, email })
		navigation.navigate ('ForgotPassword2', {
			state: {
				email
			}
		})
	}


	return (
		<ScreenContainer>
			<LinearGradient
				colors={['#1bcfb7', '#1bcfb7', '#327ebb', '#327ebb', '#327ebb']}
				style={styles.container}
			>
				<View style={styles.wrapper}>
					<Text style={styles.textStyle}>Enter your registered email address to reset your password</Text>
					<InputField
						placeholder='Username'
						onChangeText={(username) => setUsername(username)}
					/>
					<InputField
						placeholder='Enter Email Address'
						onChangeText={(email) => setEmail(email)}
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
