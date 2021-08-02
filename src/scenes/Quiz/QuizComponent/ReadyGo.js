import React, { Fragment, useContext, useEffect, useState } from 'react'
import {
	Text,
	ImageBackground,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Animated
} from '../../../components/NativeComponents'
import ScreenContainer from '../../../scenes/common/ScreenContainer'
import { Alert } from 'react-native'

const whizBg = require('../../../assets/bg.png')
const { width, height } = Dimensions.get('screen')

export default function ReadyGo({ isLoading, setIsReady, text }) {
	return (
		<ScreenContainer>
			<ImageBackground
				source={whizBg}
				style={{
					height: height,
					width: width,
					padding: 20,
					borderWidth: 2,
					display: 'flex',
					alignContent: 'center',
					justifyContent: 'center',
					margin: 'auto'
				}}
			>
				<Text style={{
					color: '#024b67',
					fontSize: 40,
					textAlign: 'center',
					fontWeight: 'bold',
				}}>
					{text}
				</Text>
			</ImageBackground>
		</ScreenContainer>
	)
}