import React from 'react'
import {
	View,
	Dimensions, 
	StyleSheet
} from 'components/NativeComponents'

const screen = Dimensions.get('screen')

export default function PlayButtons({children}) {
	return (
		<View style={styles.container}>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginBottom: 11,
		alignItems: 'center',
		marginBottom: -200,
		height: 50,
		display: 'flex',
		width: screen.width - 20,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-end',
		alignContent: 'flex-end',
		alignSelf: 'center',
		flexGrow: 1,
		//flex: 1,
		borderWidth: 1
	}
})
