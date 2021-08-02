import React from 'react'
import { SafeAreaView, StyleSheet, Dimensions } from '../../components/NativeComponents'
import { StatusBar } from 'expo-status-bar'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		height: height,
		width: width,
		flex: 1
	}
})

export default function ScreenContainer({style, children }) {
	return (
		<SafeAreaView style={{...styles['container'], ...style}}>
			{children}
			<StatusBar style='auto' />
		</SafeAreaView>
	)
}
