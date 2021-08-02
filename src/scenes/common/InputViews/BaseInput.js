import React from 'react'
import { View, Text, StyleSheet } from '../../../components/NativeComponents'

const BaseInput = ({ style, children, label }) => (
	<View style={[styles.baseInput, style]}>
		<Text>{label}</Text>
		{children}
	</View>
)

const styles = StyleSheet.create({
	baseInput: {
		paddingVertical: 6,
		backgroundColor: '#327ebb',
		borderRadius: 30,
		borderColor: '#01aef0',
		borderWidth: 3,
		width: '100%',
		height: 60,
		marginBottom: 20,
		alignItems: 'flex-start',
		flexDirection: 'row',
		color: '#fff'
	}
})

export default BaseInput
