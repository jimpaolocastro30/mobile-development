import React from 'react'
import Box from 'components/Box'
import { TextInput, StyleSheet } from 'components/NativeComponents'

export default function FormInput({ placeholder, value, onChange }) {
	return (<Box
			backgroundColor="bgSecondary"
			borderRadius={30}
			width="70%"
			height={45}
			marginBottom="m"
			borderColor="borderLight"
			borderWidth={2}
			display="flex"
			alignItems="flex-start"
			flexDirection="row"
			color="light"
		>
			<TextInput
				style={styles.TextInput}
				placeholder={placeholder}
				placeholderTextColor="#003f5c"
				secureTextEntry={true}
				value={value}
				onChangeText={onChange}
			/>
		</Box>)
}

const styles = StyleSheet.create({
	TextInput: {
		height: 50,
		flex: 1,
		padding: 10,
		marginLeft: 20,
		color: '#fff'
	}
})
