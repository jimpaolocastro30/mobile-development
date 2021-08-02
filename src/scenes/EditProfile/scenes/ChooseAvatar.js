import React, { useEffect, useState, useReducer } from 'react'
import { StatusBar } from 'expo-status-bar'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Image, View, ScrollView, Dimensions, TouchableOpacity } from '../../../components/NativeComponents'
import Box from '../../../components/Box'
import ScreenContainer from '../../../scenes/common/ScreenContainer'
import Text from '../../../components/Text'
import { getAvatars, getContentUriAsync, readDirectoryAsync } from './AvatarHandler'

export default function ChooseAvatar({navigation}) {
	const screen = Dimensions.get("screen")
	const [avatars, setAvatars] = useState([])
	const [selectedAvatar, setSelectedAvatar] = useState(1)
	const [selectedAvatarRecord, setSelectedAvatarRecord] = useState()

	const handleSelectAvatar = (id) => {
		setSelectedAvatar(id)
	}

	const initialCAState = {
		avatars: []
	}

	const caReducer = (prevState, action) => {
		return {
			...prevState,
			avatars: action.avatars
		}
	}

	const [caState, dispatch] = useReducer(caReducer, initialCAState)

	useEffect(() => {
		setTimeout(async() => {
			let allAvatars = null
			try {
				allAvatars = await getAvatars()
			} catch(e) {
				console.log(e)
			}
			dispatch({avatars: allAvatars})
		}, 1)
	}, [])

	useEffect(() => {
		if(caState.avatars == null || caState.avatars == '') {
			return
		}
		caState.avatars = caState.avatars = caState.avatars.map((item, index)=> {
			item = {...item, isSelected: 0}
			if(selectedAvatar == item.id) {
				item = {...item, isSelected: 1}
				const fn = item.imageUri.split('/')
				setSelectedAvatarRecord(item)
			}
			return item
		})
	}, [selectedAvatar])

	const Avatar = ({imageUri, isSelected}) => (
		<View style={{display: 'flex', alignItems: 'center'}}>
			<Image
				source={{uri: imageUri}}
				style={{
					backgroundColor: !isSelected ? 'grey' : 'white',
					height: (screen.width - 190) / 2, width: (screen.width - 190) / 2,
					borderRadius:200,
					margin: 10
				}}
			/>
		</View>
	)

	return (
		<ScreenContainer>
			<Box
				backgroundColor="bgPrimaryLight"
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="flex-end"
				padding="m"
			>
				<Box width="50%" textAlign="right" paddingTop="l">
					<Text fontSize={24} fontWeight="bold" color="textLight">
						My Profile
					</Text>
				</Box>
				<Box marginTop="l">
					<FontAwesomeIcon.Button
						name="check"
						size={35}
						justifySelf="flex-end"
						backgroundColor="transparent"
						onPress={() => navigation.navigate('EditProfile', {avatar: selectedAvatarRecord})}
					></FontAwesomeIcon.Button>
				</Box>
			</Box>
			<ScrollView style={styles.container}>
				<Box
					backgroundColor="bgSecondary"
					alignItems="center"
					padding="l"
				>
					<Text color="textLight" fontSize={20} style={{alignItems:"center"}}>
						Select Your Avatar
					</Text>
				</Box>
				<Box
					backgroundColor="bgSecondaryDark"
					width="100%"
					flex={1}
					alignItems="center"
					padding="m"
					marginTop="m"
					marginBottom="l"
					flexDirection='row'
					flexWrap= 'wrap'
					justifyContent='space-evenly'
				>
					{
						caState.avatars.map(({imageUri, isSelected, id}, i) => (
							<TouchableOpacity key={i} onPress={() => handleSelectAvatar(id)}>
								<Avatar {...{imageUri, isSelected}}/>
							</TouchableOpacity>
						))
					}
				</Box>
			</ScrollView>
		</ScreenContainer>
	)
}

const styles = {
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#1a5098'
	}
}
