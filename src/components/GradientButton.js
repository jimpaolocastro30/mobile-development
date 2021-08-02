import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, Text, StyleSheet, Dimensions } from './NativeComponents'

const { width, height } = Dimensions.get('screen')

export default function GradientButton({colors, label, onPress}) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
			<LinearGradient
				colors={colors}
				style={styles.btnStyle}
			>
				<Text style={styles.textStyle}>
					{label}
				</Text>
			</LinearGradient>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
		borderColor: '#fff',
		borderWidth: 1,
		width: '100%',
		height: height * .09,
		flex: 1,
		justifyContent: 'center',
		borderRadius: 6
	},
	btnStyle: {
		height: '100%',
		alignItems: 'center',
		borderRadius: 5,
		width: '100%',
		justifyContent: 'center'
	},
	textStyle: {
		fontSize: 18,
		color: '#fff',
		textTransform: 'capitalize'
	}
})
