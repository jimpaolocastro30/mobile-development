import React from 'react'
import {
	Text,
	View,
	Dimensions,
	Image,
	FlatList,
	TouchableWithoutFeedback,
	StyleSheet
} from '../../components/NativeComponents'
import {
	ModalScreen
} from '../../scenes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

const screen = Dimensions.get("screen");
const logo = require('../../assets/logo.png')

export default function GameChallenge({navigation}) {
	const closeBtn = require('../../assets/x.png')
	const check = require('../../assets/check.png')

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
	const challenges = [
		{
			username: 'username_1',
			mode: 'Duel',
			avatar: logo
		},
		{
			username: 'random_user',
			mode: 'Duel',
			avatar: logo
		},
		{
			username: 'random_user_1',
			mode: 'Duel',
			avatar: logo
		}
	]
	const renderItem = ({ item }) => {
		const { account_name, opponentUri, username, selected_id } = item
		let opacity = 0.0
		// if(selectedInviteIds.includes(item.id)) {
		// 	opacity = 1.0
		// }
		const displayName = (account_name)? account_name: username
		return (
			<TouchableWithoutFeedback onPress={() => {
				{/* acceptedChallenge[username] = item
				_handleSelectedInvite(item.id, username)
				sendInviteResponse(username, true) */}
			}}>
				<View style={{...styles.invitesContainer}}>
					<View style={{width: 70, height: 70, justifyContent: 'center'}}>
						<Image
							source={{uri: opponentUri}}
							style={{
								height: '70%', width: '70%',
								alignSelf: 'flex-start'
							}}
						/>
					</View>
					<View style={{flex: 1}}>
						<Text style={{color: '#fff', fontSize: 20}}>{displayName}</Text>
						<Text style={{color: '#fff'}}>Duel</Text>
					</View>
					<View style={{width: 25, height: 25, justifyContent: 'center'}}>
						<Image
							source={check}
							style={{
								height: '100%', width: '100%',
								alignSelf: 'flex-start',
								opacity: opacity
							}}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
	return (
		<ModalScreen
			onPress={() => navigation.pop()}
			navigation={navigation}
			greeting="You have new game challenges to play."
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
				<View style={{backgroundColor: 'transparent', height: 'auto', width: '100%'}}>
					<View style={{
						padding: 10,
						width: '100%',
						flexDirection: 'row',
						height: 'auto',
						flexWrap: 'wrap',
						justifyContent: 'space-evenly'
					}}>
						<FlatList
							data={challenges}
							renderItem={renderItem}
							keyExtractor={(item) => item.id}
						/>
					</View>
				</View>
			</View>
		</ModalScreen>
	)
}

const styles = StyleSheet.create({
	bannerContainer2: {
		display: 'flex',
		width: '100%',
		height: 'auto' ,
		justifyContent: 'space-between',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		alignContent: 'center',
		borderBottomWidth: .8,
		borderColor: 'white'
	}
})