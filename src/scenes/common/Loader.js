import React from 'react'
import { View, ActivityIndicator, StyleSheet } from '../../components/NativeComponents'

export default function Loader() {
	return (
		<View style={{
			...StyleSheet.absoluteFillObject,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'white'
		}}>
			<ActivityIndicator size="large" color="blue" />
		</View>
	)
}
