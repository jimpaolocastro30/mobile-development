import { StyleSheet, Dimensions } from '../../../../components/NativeComponents'
import { verticalScale } from 'react-native-size-matters'
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F1aef0',
		alignItems: 'center',
		justifyContent: 'center',
		width: width,
		height: verticalScale(height)
	},
	image: {
		marginBottom: 40,
		//width: '50%',
		//height: '50%'
		height: '100%', width: '100%',resizeMode: 'stretch'
	},
	buttonStyle: {
		color: '#fff',
		fontSize: 20
	},
	forgot_button: {
		margin: 20,
		height: 30,
		color: '#fff',
		alignContent: 'flex-end',
		textAlign: 'right',
		width: width * .80,
		fontSize: 18
	},
	loginBtn: {
		width: '47%',
		borderRadius: 25,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		backgroundColor: '#01aef0'
	},
	signUpBtn: {
		width: '47%',
		borderRadius: 25,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		backgroundColor: '#f74c13'
	},
	hr: { width: '100%', borderColor: '#01aef0', borderWidth: 1, marginBottom: 50},
	FB: {width: '70%', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'}
})

export default styles
