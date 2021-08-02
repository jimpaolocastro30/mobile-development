import React from 'react'
import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
	Login,
	Register,
	ForgotPassword,
	HomePage,
	UserProfile,
	Rankings,
	EditProfile,
	Settings,
	DailyFreebies,
	ChooseAvatar,
	GameChallenge,
	CategoryYearLevelForm,
	FAQs,
	ForgotPasswordStep2
	// Badges {/* NOTE: commented out temporarily to aligned with the provided mockup*/}
} from '../scenes/'

import Quiz, { OponentsPage, Onboarding, Achievements } from '../scenes/Quiz/'
import { GameContextProvider } from '../context/GameContext'
import { ForgotPasswordStep3 } from '../scenes/Sign'

const QuizStack = createStackNavigator()
const QuizStackScreen = () => (
	<QuizStack.Navigator>
		<QuizStack.Screen
			name="Quiz"
			component={Quiz}
			options={{ title: 'Sign in', headerShown: false }}
		/>
		<QuizStack.Screen
			name="OponentsPage"
			component={OponentsPage}
			options={{ title: 'Sign in' }}
		/>
		<QuizStack.Screen
			name="Achievements"
			component={Achievements}
			options={{
				headerShown: false
			}}
		/>
	</QuizStack.Navigator>
)

const AppStack = createStackNavigator()
const AppStackScreen = () => (
	<GameContextProvider>
		<AppStack.Navigator initialRouteName="Tab">
			<AppStack.Screen
				name="Quiz"
				component={QuizStackScreen}
				options={{ headerShown: false }}
			/>
			<QuizStack.Screen
				name="OponentsPage"
				component={OponentsPage}
				options={{
					headerBackTitleVisible: true,
					headerBackTitle: 'Back',
					headerTitleAlign: 'center',
					headerTitle: '',
					headerStyle: {
						backgroundColor: '#01aef0'
					}
				}}
			/>
			<QuizStack.Screen
				name="Onboarding"
				component={Onboarding}
				options={{
					headerBackTitleVisible: true,
					headerBackTitle: 'Back',
					headerTitleAlign: 'center',
					headerTitle: '',
					headerStyle: {
						backgroundColor: '#01aef0'
					}
				}}
			/>
			<AppStack.Screen
				name="Tab"
				component={TabsScreen}
				options={{ headerShown: false }}
			/>
			<AppStack.Screen
				name="Settings"
				component={SettingsStackScreen}
				options={{ headerShown: false }}
			/>
			
		</AppStack.Navigator>
	</GameContextProvider>
)

const AuthStack = createStackNavigator()
const AuthStackScreen = () => (
	<AuthStack.Navigator>
		<AuthStack.Screen
			name="Login"
			component={Login}
			options={{ title: 'Sign in', headerShown: false }}
		/>
		<AuthStack.Screen
			name="Register"
			component={Register}
			options={{
				title: 'Register',
				headerTitleAlign: 'center',
				headerBackTitleVisible: true,
				headerBackTitle: 'Back',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
		<AuthStack.Screen
			name="ForgotPassword"
			component={ForgotPassword}
			options={{
				headerTitleAlign: 'center',
				title: 'Forgot Password',
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
		<AuthStack.Screen
			name="ForgotPassword2"
			component={ForgotPasswordStep2}
			options={{
				headerTitleAlign: 'center',
				title: 'Forgot Password Code',
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
		<AuthStack.Screen
			name="ForgotPassword3"
			component={ForgotPasswordStep3}
			options={{
				headerTitleAlign: 'center',
				title: 'New Password',
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
	</AuthStack.Navigator>
)

const SettingsStack = createStackNavigator()
const SettingsStackScreen = () => (
	<SettingsStack.Navigator>
		<SettingsStack.Screen
			name="Settings"
			component={Settings}
			options={{
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
	</SettingsStack.Navigator>
)

const FAQsStackScreen = () => (
	<SettingsStack.Navigator>
		<SettingsStack.Screen
			name="FAQs"
			component={FAQs}
			options={{
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
	</SettingsStack.Navigator>
)

const RankingsStack = createStackNavigator()
const RankingsStackScreen = () => (
	<RankingsStack.Navigator>
		<RankingsStack.Screen
			name="Rankings"
			component={Rankings}
			options={{
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
	</RankingsStack.Navigator>
)

{
	/* NOTE: commented out temporarily to align with the provided mockup*/
}
// const BadgesStack = createStackNavigator()
// const BadgesStackScreen = () => (
// 	<BadgesStack.Navigator>
// 		<BadgesStack.Screen
// 			name="Badges"
// 			component={Badges}
// 			options={{
// 				headerTitleAlign: 'center',
// 				headerStyle: {
// 					backgroundColor: '#01aef0'
// 				}
// 			}}
// 		/>
// 	</BadgesStack.Navigator>
// )

const HomepageStack = createStackNavigator()
const HomePageStackScreen = () => (
	<HomepageStack.Navigator initialRouteName="Home" mode="modal">
		<HomepageStack.Screen
			name="CategoryYearLevelForm"
			component={CategoryYearLevelForm}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen 
			name="DailyFreebies"
			component={DailyFreebies}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen 
			name="GameChallenge"
			component={GameChallenge}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen
			name="Home"
			component={HomePage}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen
			name="EditProfile"
			component={EditProfile}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen
			name="ChooseAvatar"
			component={ChooseAvatar}
			options={{
				headerShown: false
			}}
		/>
		<HomepageStack.Screen
			name="ViewProfile"
			component={UserProfile}
			options={{
				title: 'My Profile',
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#01aef0'
				}
			}}
		/>
	</HomepageStack.Navigator>
)

const Tabs = createMaterialBottomTabNavigator()
const TabsScreen = () => {
	return (
		<Tabs.Navigator
			barStyle={{ backgroundColor: '#01aef0', height: 50 }}
			initialRouteName="Home"
			activeColor="#034a66"
			inactiveColor="#fff"
			indicatorStyle={{
				height: '100%',
				backgroundColor: 'red'
			}}
		>
			<Tabs.Screen
				name="Home"
				component={HomePageStackScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<MCIcons name="home" color={color} size={20} />
					)
				}}
			/>
			<Tabs.Screen
				name="Rankings"
				component={RankingsStackScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<MCIcons name="seal-variant" color={color} size={20} />
					)
				}}
			/>
			{/* NOTE: commented out temporarily to align with the provided mockup*/}
			{/* <Tabs.Screen
				name="Badges"
				component={BadgesStackScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<MCIcons
							name="star-circle-outline"
							color={color}
							size={20}
						/>
					)
				}}
			/> */}
			<Tabs.Screen
				name="Settings"
				component={SettingsStackScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<MCIcons name="cog-outline" color={color} size={20} />
					)
				}}
			/>
			<Tabs.Screen
				name="FAQs"
				component={FAQsStackScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<MCIcons name="frequently-asked-questions" color={color} size={20} />
					)
				}}
			/>
		</Tabs.Navigator>
	)
}

const RootStack = createStackNavigator()
const RootStackScreen = ({ userToken }) => (
	<RootStack.Navigator headerMode="none">
		{userToken ? (
			<RootStack.Screen name="App" component={AppStackScreen} />
		) : (
			<RootStack.Screen name="Auth" component={AuthStackScreen} />
		)}
	</RootStack.Navigator>
)

export default RootStackScreen
