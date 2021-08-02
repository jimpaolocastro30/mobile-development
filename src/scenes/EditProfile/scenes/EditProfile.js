import React, { useState, useEffect, useReducer } from 'react'
import { StatusBar } from 'expo-status-bar'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Image, View, ScrollView, TouchableWithoutFeedback } from '../../../components/NativeComponents'
import Box from '../../../components/Box'
import ScreenContainer from '../../../scenes/common/ScreenContainer'
import SubmitButton from '../../../components/Button'
import Text from '../../../components/Text'
import { InputField, DropdownPicker } from '../../common'
import { storeLocalData, getLocalData } from '../../../services/api'
import { getSingleImageUri } from './AvatarHandler'
import {
	getAllRegions,
	getAllProvincesByRegionId,
	getAllCitiesByProvinceId,
	getAllAgeGroups,
	getAllUserTypes,
	getAllUserGroups,
	editProfile
} from '../util'
import { getPlayerProfile } from '../../HomePage/helper'
import Alert from '../../../components/Alert'

const avatarDefault = require('../../../assets/avatar-default.jpeg')

const genderOptions = [
	{
		label: 'Male',
		value: 'M',
		id: 1
	},
	{
		label: 'Female',
		value: 'F',
		id: 2
	}
]

// const ageGroups = [
// 	{
// 		label: '13 to 18 y/o',
// 		value: '13-18',
// 		id: 0
// 	},
// 	{
// 		label: '19 to 25 y/o',
// 		value: '19-25',
// 		id: 1
// 	},
// 	{
// 		label: '26 to 35 y/o',
// 		value: '26-35',
// 		id: 2
// 	},
// 	{
// 		label: '36-50 y/o',
// 		value: '36-50',
// 		id: 3
// 	},
// 	{
// 		label: '51 and above',
// 		value: '51-above',
// 		id: 4
// 	}
// ]

// const studentOptions = [
// 	{
// 		label: 'Student - Public',
// 		value: 'student-public',
// 		id: 0
// 	},
// 	{
// 		label: 'Student - Private',
// 		value: 'student-private',
// 		id: 1
// 	},
// 	{
// 		label: 'Out of School Youth',
// 		value: 'out-of-school-youth',
// 		id: 2
// 	},
// 	{
// 		label: 'Other',
// 		value: 'other',
// 		id: 3
// 	}
// ]

// const groups = [
// 	{
// 		label: '',
// 		value: null
// 	},
// 	{
// 		label: 'Group 2',
// 		value: '2'
// 	}
// ]

export default function EditProfile({navigation, route}) {
	const [accountId, setAccountId] = useState()
	const [accountName, setAccountName] = useState('')
	const [emailAddress, setEmailAddress] = useState('')
	const [password, setPassword] = useState('')
	const [region, setRegion] = useState()
	const [regionId, setRegionId] = useState()
	const [province, setProvince] = useState()
	const [provinceId, setProvinceId] = useState()
	const [city, setCity] = useState()
	const [cityId, setCityId] = useState()
	const [gender, setGender] = useState('male')
	const [ageGroup, setAgeGroup] = useState()
	const [ageGroupId, setAgeGroupId] = useState()
	const [userType, setUserType] = useState()
	const [userTypeId, setUserTypeId] = useState()
	const [userGroup, setUserGroup] = useState()
	const [groupId, setGroupId] = useState()
	const [inputsDisabled, setInputsDisabled] = useState(true)
	const {params} = route
	const imgSrc = (params)? ((params.avatar)? {uri: params.avatar.imageUri}: null) : null
	const [avatarUri, setAvatarUri] = useState()
	const avatarId = params?.avatar?.id

	const [showAlert, setShowAlert] = useState (false)
	const [editMode, setEditMode] = useState (false)

	const initialState = {
		regions: [{label: '', value: null}],
		provinces: [{label: '', value: null}],
		cities: [{label: '', value: null}],
		userTypes: [{label: '', value: null}],
		ageGroups:  [{label: '', value: null}],
		userGroups: [{label: '', value: null}],
		accountMembershipId: null,
		accountName: null,
		email: null,
		gender: null,
		ageGroup: null,
		region: null,
		province: null,
		city: null,
		userType: null,
		userGroup: null,
		account_membership_id: null
	}

	const editProfileReducer = (prevState, action) => {
		console.log(action)
		switch( action.type ) {
			case 'PROVINCE':
			  return {
				  ...prevState,
				  provinces:  action.provinces
			  }
			case 'CITY':
			return {
				...prevState,
				cities:  action.cities
			}
			default:
				setAccountName((action.record.account_name)? `${action.record.account_name}`: null)
				setEmailAddress((action.record.email)? `${action.record.email}`: null)
				setAgeGroup((action.record.age_group_id)? `${action.record.age_group_id}`: null)
				setRegion((action.record.region_id)? `${action.record.region_id}`: null)
				setProvince((action.record.province_id)? `${action.record.province_id}`: null)
				setCity((action.record.city_id)? `${action.record.city_id}`: null)
				setAccountId((action.record.id)? action.record.id: null)
				setUserGroup((action.record.group_id)? `${action.record.group_id}`: null)
				setUserType((action.record.user_category_id)? `${action.record.user_category_id}`: null)
				const currState = {
					...prevState,
					accountMembershipId: action.record.id,
					regions: action.regions,
					userTypes: action.userTypes,
					ageGroups: action.ageGroups,
					userGroups: action.userGroups,
					accountMembershipId: action.record.id,
					accountName: action.record.account_name,
					email: action.record.email,
					gender: action.record.sex_code,
					ageGroup: `${action.record.age_group_id}`,
					region: `${action.record.region_id}`,
					province: `${action.record.province_id}`,
					city: `${action.record.city_id}`,
					userType: `${action.record.user_category_id}`,
					userGroup: `${action.record.group_id}`
				}
				if(action.provinces) {
					currState['provinces'] = action.provinces
				}
				if(action.cities) {
					currState['cities'] = action.cities
				}
				setAccountName(action.record.account_name)
				return currState
		}
	}

	const [editProfileState, dispatch] = useReducer(editProfileReducer, initialState)

	useEffect(() => {
		setTimeout(async() => {
			try {
				const userRec = await getLocalData("user-profile").then((record) => {
					return JSON.parse(record)
				})
				const regs = await getAllRegions()
				const userTypes = await getAllUserTypes()
				const ags = await getAllAgeGroups()
				const ugs = await getAllUserGroups()
				if(userRec.region_id) {
					var provs = await getAllProvincesByRegionId(userRec.region_id)
				}
				if(userRec.province_id) {
					var cts = await getAllCitiesByProvinceId(userRec.province_id)
				}
				const imgUrl = userRec.avatar?.split('/')
				if(imgUrl) { 
					const imgUri = await getSingleImageUri(imgUrl[imgUrl.length-1])
					const avUri = (imgSrc)? imgSrc: (imgUri)? {uri: imgUri}: avatarDefault
					setAvatarUri(avUri)
				}
				dispatch({
					regions: regs,
					provinces: provs,
					cities: cts,
					userTypes: userTypes,
					ageGroups: ags,
					userGroups: ugs,
					record: userRec
				})
			} catch(e) {
				console.log(e)
			}
		}, 1)
	}, [])

	const handleSubmit = async () => {
		console.log("accountId", accountId)
		console.log("avatarId", avatarId)
		console.log("accountName", accountName)
		console.log("gender", gender)
		console.log("ageGroupId", ageGroupId)
		console.log("userTypeId", userTypeId)
		console.log("groupId", groupId)
		console.log("regionId", regionId)
		console.log("provinceId", provinceId)
		console.log("cityId", cityId)
		const body = {
			account_membership_id: accountId,
			"avatar_id": avatarId,
			"account_name": accountName,
			"sex_code": (gender === 'male')? 'M': 'F',
			"age_group_id": ageGroupId,
			"user_category_id": userTypeId,
			"group_id": groupId,
			"region_id": regionId,
			"province_id": provinceId,
			"city_id": cityId
		}
		const response = await editProfile(body)
		// alert(response)
		const success = response === "SUCCESS"
		setShowAlert (success)
		if(success) {
			const user = await getPlayerProfile()
			storeLocalData('user-profile', JSON.stringify(user.record))
			storeLocalData('avatar-uri', displayAvatar.uri)
			storeLocalData('account-name', accountName)
		}
	}

	var displayAvatar = (imgSrc)? imgSrc: avatarUri
	return(
		<ScreenContainer>
			{
				showAlert && <Alert
					message = 'Profile successfully updated.'
					btns = {[
						{
							text: 'OK',
							onPress: (e) => {}
						}
					]}
					on
				/>
			}
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
					<Icon.Button
						name="edit"
						justifySelf="flex-end"
						backgroundColor="transparent"
						onPress={() => {
							setInputsDisabled(old => !old)
							setEditMode (!editMode)
						}}
					></Icon.Button>
				</Box>
			</Box>
			<ScrollView style={styles.container}>
				<Box
					backgroundColor="bgSecondary"
					display="flex"
					flexDirection="row"
					alignItems="center"
					padding="m"
				>
					<Image
						source={(displayAvatar == null)? avatarDefault: displayAvatar}
						style={{
							borderRadius: 100,
							width: 70,
							height: 70,
							marginRight: 20
						}}
					/>
					<TouchableWithoutFeedback onPress={() => navigation.navigate('ChooseAvatar')}>
						<Text color="textLight" fontSize={20}>
							Select Your Avatar{' '}
							<MCIcon name="chevron-right" color="white" size={20} />
						</Text>
					</TouchableWithoutFeedback>
				</Box>
				<Box
					backgroundColor="bgSecondaryDark"
					width="100%"
					flex={1}
					alignItems="center"
					padding="m"
					marginTop="m"
					marginBottom="l"
				>
					<StatusBar style="auto" />
					<InputField
						asLabel = { !editMode }
						placeholder="Account name"
						value={accountName}
						onChangeText={value => {
							setAccountName(value)
						}}
						disabled={inputsDisabled}
					/>
					<InputField
						asLabel = { !editMode }
						placeholder="Password"
						value={password}
						onChangeText={value => setPassword(value)}
						type="password"
						disabled={inputsDisabled}
					/>
					<InputField
						asLabel = { !editMode }
						placeholder="Email Address"
						value={emailAddress}
						onChangeText={value => setEmailAddress(value)}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={genderOptions}
						value={editProfileState.gender}
						onChange={item => {
							setGender(item.value)
						}}
						placeholder="Select your gender"
						zIndex={5000}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.ageGroups}
						value={ageGroup}
						onChange={item => setAgeGroupId(item.id)}
						placeholder="Select your age group"
						zIndex={4000}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.regions}
						value={region}
						onChange={async (item) => {
							setRegionId(item.id)
							setProvinceId(null)
							setCityId(null)
							const provs = await getAllProvincesByRegionId(item.id)
							dispatch({type: "PROVINCE", provinces: provs})
						}}
						placeholder="Region"
						zIndex={3000}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.provinces}
							value={province}
							onChange={async (item) => {
							setProvinceId(item.id)
							setCityId(null)
							const cits = await getAllCitiesByProvinceId(item.id)
							dispatch({type: "CITY", cities: cits})
						}}
						placeholder="Province"
						zIndex={3000}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.cities}
						value={city}
						onChange={item => setCityId(item.id)}
						placeholder="City"
						zIndex={3000}
						disabled={inputsDisabled}
					/>
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.userTypes}
						value={userType}
						onChange={item => setUserTypeId(item.id)}
						placeholder="Select user type"
						zIndex={3000}
						disabled={inputsDisabled}
					/>
					{/* value={editProfileState.userGroup} */}
					<DropdownPicker
						asLabel = { !editMode }
						options={editProfileState.userGroups}
						value={userGroup}
						onChange={item => setGroupId(item.id)}
						placeholder="Select group"
						zIndex={2000} 
						disabled={inputsDisabled}
					/>
					<View
						style={{
							width: '100%',
							borderColor: '#01aef0',
							borderWidth: editMode ? 1 : 0,
							marginTop: 20,
							marginBottom: 20
						}}
					/>
					<SubmitButton
						label="Save"
						onPress={() => {
							setInputsDisabled(old => !old)
							handleSubmit()
						}}
						width="100%"
						borderRadius={40}
						alignSelf="flex-start"
						height={60}
						marginTop="s"
						backgroundColor="btnPrimary"
						alignSelf="center"
						disabled={inputsDisabled}
					/>
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
