import React, { Fragment, useState, useEffect, Component } from "react"
import { View, Text, StyleSheet, Image } from "react-native"

const redx = require('../../../assets/redx.png')
const greencheck = require('../../../assets/greencheck.png')

export default function ScoringBar({ questions, scoringStyles, isResultsPage, extra }) {
	const containerStyles = (isResultsPage)? defaultStyles: styles
	const displayStyles = (scoringStyles)? scoringStyles: defaultScoringStyles
	return (
		<View style={containerStyles.container}>
			{questions.map((_, i) => (
				<Fragment key={i}>
					<View style={{
						...displayStyles.container,
						...displayStyles[`${i}style1`]
					}}>
					{(displayStyles[`${i}style1`].backgroundColor === "#0066c5") &&
							<Image
								source={greencheck}
								style={{
									...displayStyles.imageStyles
								}}
							/>
						}
						{(displayStyles[`${i}style1`].backgroundColor === "#de5b31") &&
							<Image
								source={redx}
								style={{
									...displayStyles.imageStyles
								}}
							/>
						}
						{(displayStyles[`${i}style1`].backgroundColor === "#d6d6d6") &&
							<Text style={{
								...displayStyles.textStyles,
								...displayStyles[`${i}style2`]
							}}></Text>
						}
					</View>
				</Fragment>
			))}
		</View>
	)
}

const initialScoringStyles = {
	'0style1': {
		backgroundColor: '#d6d6d6',
	},
	'0style2': {
		color:'#7d7d7d'
	},
	'1style1': {
		backgroundColor: '#d6d6d6',
	},
	'1style2': {
		color:'#7d7d7d'
	},
	'2style1': {
		backgroundColor: '#d6d6d6',
	},
	'2style2': {
		color:'#7d7d7d'
	},
	'3style1': {
		backgroundColor: '#d6d6d6',
	},
	'3style2': {
		color:'#7d7d7d'
	},
	'4style1': {
		backgroundColor: '#d6d6d6',
	},
	'4style2': {
		color:'#7d7d7d'
	},
	'5style1': {
		backgroundColor: '#d6d6d6',
	},
	'5style2': {
		color:'#7d7d7d'
	}
}
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		color: '#0066c5',
		backgroundColor: '#ffffff',
		justifyContent: 'center',
		borderRadius: 100,
		alignItems: 'center',
		flexDirection: 'row'
	}
})
const defaultStyles = StyleSheet.create({
	container: {
		display: 'flex',
		color: '#0066c5',
		width: '100%',
		backgroundColor: '#ffffff',
		justifyContent: 'space-between',
		borderRadius: 100,
		alignItems: 'center',
		flexDirection: 'row'
	}
})
let defaultScoringStyles = StyleSheet.create({
	container: {
		borderRadius: 50,
		display: 'flex',
		flexDirection: 'row',
		margin: 2,
		display: 'flex',
		height: '100%',
		height: 53,
		width: 53,
		margin: 1,
		justifyContent: 'center',
		textAlign: 'center',
		alignSelf: 'center',
		alignItems: 'center'

	},
	textStyles: {
		borderRadius: 50,
		display: 'flex',
		flexDirection: 'row',
		width: 23,
		height: 23,
		justifyContent: 'center'
	},
	...initialScoringStyles
})
