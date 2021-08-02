import React, { useContext, useState, useEffect, useReducer } from 'react'
import { 
	View,
	Text,
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { bots } from '../bots'
import { GameContext } from '../../../context/GameContext'
import Box from '../../../components/Box'
import { DropdownPicker } from '../../common'
import ScreenContainer from '../../../scenes/common/ScreenContainer'
import api, { getLocalData } from '../../../services/api'
import { getSingleImageUri } from '../../../scenes/EditProfile/scenes/AvatarHandler'

let categoriesPlaceholder = [{
	value: -1,
	label: ""
}]
let gradeLevelsPlaceholder = [{
	value: -1,
	label: ""
}]

export default function Onboarding({navigation}) {
	const { width } = Dimensions.get("screen")
	const {
		setLevel,
		setCategory,
		level,
		category,
		setOpponents,
		opponents,
		mode,
		setGameId
	} = useContext(GameContext) 
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [selectedGradeLevel, setSelectedGradeLevel] = useState(null)
	const [categories, setCategories] = useState([{
		value: -1,
		label: ""
	}])
	const [gradeLevels, setGradeLevels] = useState([{
		value: -1,
		label: ""
	}])
	const handleSelectCategory = (newCategory) => {
		setSelectedCategory(newCategory)
		setCategory(newCategory)
	}
	const handleSelectLevel = (newLevel) => {
		setSelectedGradeLevel(newLevel)
		setLevel(newLevel)
	}
	const needsOpponent = mode == 'duel' || mode == 'battle of five'

	const initialState = {
		categories: [{label: '', value: -1}],
		yearLevels: [{label: '', value: -1}]
	}

	const onboardingReducer = (prevState, action) => {
		setCategories(action.categoryOptions)
		setGradeLevels(action.yearLevelOptions)
		if (action.categoryOptions[0].value && action.yearLevelOptions[0].value) {
			setSelectedCategory (action.categoryOptions[0].value)
			setSelectedGradeLevel (action.yearLevelOptions[0].value)
		}
		return {
			...prevState,
		}
	}

	const [onboardingState, dispatch] = useReducer(onboardingReducer, initialState)

	useEffect(() => {
		(async () => {
			try {
				let cat
				if(mode == 'special tourney') {
					// replace code and fetch special tourney categories
					cat = await getLocalData("category").then((values) => {
						return JSON.parse(values)
					})
				}
				else {
					cat = await getLocalData("category").then((values) => {
						return JSON.parse(values)
					})
				}
				const yl = await getLocalData("yearLevel").then((values) => {
					return JSON.parse(values)
				})
				const ami = await getLocalData("accountMembershipId").then((value) => {
					return value
				})
				dispatch({
					categoryOptions: cat,
					yearLevelOptions: yl,
					ami: ami
				})
			} catch(e) {
				console.error(e)
			}
		}) ()
	}, [])

	return (
		<ScreenContainer>
			<View style={styles.container}>
				<Box
					backgroundColor="bgSecondaryDark"
					width={width}
					flex={1}
					alignItems="center"
					padding="m"
					marginTop="m"
					marginBottom="l"
				>
					{mode !== 'special tourney' && <DropdownPicker
						options={gradeLevels}
						value={selectedGradeLevel}
						onChange={item => handleSelectLevel(item.value)}
						placeholder="Select Level"
						zIndex={4000}
					/>}
					<DropdownPicker
						options={categories}
						value={selectedCategory}
						onChange={item => handleSelectCategory(item.value)}
						placeholder="Select Category"
						zIndex={4000}
					/>
					<TouchableWithoutFeedback disabled={!selectedCategory || !selectedGradeLevel} style={{width: '100%', }} onPress={async () => {
						if(needsOpponent) {
							navigation.push('OponentsPage')
						}
						else {
							const un = await getLocalData("username")
							const gti = (mode == 'standard')? 1: 4
							const body = {
								"game_type_id": gti,
								"year_level_id": (gti === 4)? 6: level,
								"quiz_category_id": category,
								"players": [un]
							}
							const resp = await api('battles-and-players', {body: body})
							setGameId(resp.results.game_id)
							navigation.push('Quiz')
						}
					}}>
						<LinearGradient
							colors={['#fb681a', '#f74d12']}
							style={{
								borderRadius: 30,
								marginTop: 20,
								width: '100%',
								justifyContent: 'center',
								height: 60,
								alignItems: 'center'
							}}
						>
							<Text
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									color: '#fff',
									fontSize: 20
								}}
							>
								PROCEED
							</Text>
						</LinearGradient>
					</TouchableWithoutFeedback>
				</Box>
			</View>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#1a5098'
	},
	bannerContainer: {
		paddingBottom: 40,
		display: 'flex',
		backgroundColor: '#327ebc',
		width: '100%',
		padding: 15,
		borderBottomColor: '#fff',
		borderBottomWidth: 3,
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row'
	},
	bannerContainer2: {
		display: 'flex',
		width: '100%',
		height: 'auto' ,
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row'
	}
})
