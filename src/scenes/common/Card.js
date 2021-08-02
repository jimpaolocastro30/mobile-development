import React from 'react'
import { View } from '../../components/NativeComponents'

export default function Card({ children, styleSupplements }) {
	return (
		<View style={{
			position: 'relative',
			display: 'flex',
			color: '#0066c5',
			backgroundColor: '#0066c5',
			height: 70,
			flexDirection: 'row',
			justifyContent: 'flex-start',
			borderRadius: 200,
			marginTop: 20,
			marginRight: 'auto',
			alignSelf: 'baseline',
			alignItems: 'center'
		}}>
			{children}
		</View>
	)
}
