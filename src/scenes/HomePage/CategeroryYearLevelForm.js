import React from 'react'
import {
	Text,
	View,
	Dimensions,
	Image
} from '../../components/NativeComponents'
import {
	ModalScreen
} from '..'

const screen = Dimensions.get("screen");
const logo = require('../../assets/logo.png')

export default function CategoryYearLevelForm({navigation}) {
	const ImageWithDescription = ({description}) => (
		<View style={{display: 'flex', alignItems: 'center'}}>
			<Image
				source={logo}
				style={{
					height: (screen.width - 190) / 2, width: (screen.width - 190) / 2,
					borderRadius:300,
					margin: 10
				}}
			/>
			<Text style={{color: '#000'}}>{description}</Text>
		</View>
	)
	return (
		<ModalScreen
			onPress={() => navigation.goBack()}
			navigation={navigation}
			greeting="Thank your for playing. Here's your daily freebie."
		>
			<View
				style={{
					flexGrow: 1,
					width: '100%',
					height: 50,
					backgroundColor: '#195097',
					borderRadius: 15,
					alignItems: 'center',
				}}
			>
				<View style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					alignItems: 'center',
					alignContent: 'center'
				}}>
					<View style={{
						backgroundColor: '#de5426',
						padding: 10,
						width: '100%',
						borderTopLeftRadius: 15,
						borderTopRightRadius: 15
					}}>
						<Text style={{color: 'white'}}>You've earned a power-up</Text>
					</View>
				</View>
				<View style={{backgroundColor: 'white', height: 'auto', width: '100%'}}>
					<View style={{
						padding: 10,
						width: '100%',
						flexDirection: 'row',
						height: 'auto',
						flexWrap: 'wrap',
						justifyContent: 'space-evenly'
					}}>
						<ImageWithDescription description='Time Warp (x1)'/>
					</View>
				</View>
			</View>
		</ModalScreen>
	)
}
