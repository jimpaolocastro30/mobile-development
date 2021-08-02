import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ImageBackground } from 'react-native'
import { GameContext } from '../../../context/GameContext'
import { theme } from '../util'

export default function Timer({ counter }) {
	const clock = require('../../../assets/clock.png')
	const { mode } = useContext(GameContext)
	return (
		<View style={{display: 'flex'}}>
			<ImageBackground
				source = {clock}
				style = {{height: 80, width: 80, color: 'green'}}
			>
				<View style = {{
					marginTop: 15,
					alignContent: 'center',
					justifyContent: 'center',
					alignSelf: 'center',
					height: 60,
					width: 60,
					backgroundColor: '#fff',
					borderRadius: 40
				}}>
					<Text style={{textAlign: 'center', color: theme[mode]['primary'], fontSize: 30}} >{counter}</Text>
				</View>
			
			</ImageBackground>
		</View>
	)
}
