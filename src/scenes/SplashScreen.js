import React from 'react'
import { ImageBackground, View, Image, Dimensions } from '../components/NativeComponents'
import { StyleSheet } from 'react-native'

const whizBg = require('../assets/bg.png')
const logo = require('../assets/logo.png')
const owl = require('../assets/owl.png')
const tree = require('../assets/tree.png')
const { width } = Dimensions.get("window")

export default function Splash() {
	return (
		<ImageBackground
			source={whizBg}
			style={styles.container}
		>
			<View style={styles.logoWrapper}>
				<Image
					source={logo}
					style={styles.images}
				/>
			</View>
			<View style={styles.owlWrapper}>
				<View style={styles.tree}>
					<Image
						source={tree}
						style={styles.images}
					/>
				</View>
				<View style={styles.owl}>
					<Image
						source={owl}
						style={styles.images}
					/>
				</View>
			</View>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	container: {height: '100%', width: '100%', justifyContent: 'flex-start'},
	logoWrapper: {alignSelf: 'center',height: 120, width: 200, marginTop: 100},
	images: { height: '100%', width: '100%',resizeMode: 'stretch' },
	owlWrapper: {width: '100%',display: 'flex', justifyContent: 'flex-start', marginTop: 50},
	tree: {alignSelf: 'center',height: 145, width: width * .95, position: 'absolute', top: 100, right: 0},
	owl: {alignSelf: 'center',height: 180, width: 180, position: 'absolute', top: -20, right: '25%'}
})
