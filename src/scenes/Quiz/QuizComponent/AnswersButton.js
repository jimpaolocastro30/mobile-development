import React from 'react'
import { Dimensions, StyleSheet, Text, Image, View } from '../../../components/NativeComponents'
import { RectButton } from 'react-native-gesture-handler'

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		borderRadius: 10,
		height: 60,
		width: width * 0.9,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		alignItems: 'center',
		marginBottom: 15,
		borderColor: '#000',
		borderWidth: 1,
		padding: 20
	},
	imageContainer: {
		borderRadius: 10,
		height: width * 0.44,
		width: width * 0.44,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignItems: 'center',
		marginBottom: 2,
		borderColor: '#000',
		borderWidth: 1,
		marginBottom: 5
	}
})

const AnswersBtn = ({
	answer,
	onPress,
	index,
	primary
}) => {
	const backgroundColor = primary
	const letter = ['A', 'B', 'C', 'D']
	const containerStyle = (answer.includes('http'))? styles.imageContainer: styles.container
	return (
		<RectButton
			onPress={onPress}
			style={{
				...containerStyle,
				backgroundColor
			}}
		>
			{answer.includes('http') && <View style={{flexDirection: 'row'}}>
				<Image
					source={{uri: answer}}
					style={{
						borderRadius: 5,
						width: width * 0.42,
						height: width * 0.42,
						resizeMode: 'contain'
					}}
				/>
			</View>}
			{!answer.includes('http') && <Text style={{ color: '#ffffff' }} variant='button' alignItems='flex-start'>
				{letter[index]}. {answer}
			</Text>}
		</RectButton>
	)
}

export default AnswersBtn
