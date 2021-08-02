import React from 'react'
import {
	Text,
	View,
	Button,
	TouchableWithoutFeedback,
	Image
} from 'components/NativeComponents'

function ModalScreen({ dismissable=true, greeting, children, onPress, hasClose=true }) {
	const closeBtn = require('../../assets/x.png')
	return (
	 	 <View style={{
			justifyContent: 'space-between',
			alignItems: 'center',
			height: '100%',
			width: '100%',
			backgroundColor: '#327ebb'
		}}>
			<View style={{
				borderColor: 'white',
				display: 'flex',
				padding: 30,
				paddingBottom: 30,
				borderBottomWidth: 1.5,
				width: '100%',
				borderColor: '#fff',
			}}>
				<View
					style={{
						marginTop: 15,
						padding: 10,
						backgroundColor: '#f6ef25'
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 21,
							color: '#0066c5',
							paddingLeft: 5,
							paddingRight: 5,
							fontFamily: 'Righteous_400Regular'
						}}
					>
							{greeting}
						</Text>
					</View>
			</View>
			<View style={{flex: 4, backgroundColor: '#195097', padding: 30, width: '100%', height: '100%'}}>
					{children}
					{dismissable && hasClose ? 
						<TouchableWithoutFeedback onPress={() => onPress()}>
							<View style={{marginTop: -50, alignItems: 'center'}}>
								<Image
									source={closeBtn}
									style={{
										height: 20,
										width: 20,
										marginTop: 20
									}}
								/>

							</View>
						</TouchableWithoutFeedback> : null}
				</View>
		</View>
	)
}

export default ModalScreen
