import { StyleSheet } from 'components/NativeComponents'
 
const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	textStyle: {
		fontSize: 20,
		color: '#000',
		textAlign: 'center',
		padding: 10,
	},
	imageStyle: {
		width: 200,
		height: 300,
		resizeMode: 'contain',
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		padding: 20,
	},
	footerHeading: {
		fontSize: 18,
		textAlign: 'center',
		color: 'grey',
	},
	footerText: {
		fontSize: 16,
		textAlign: 'center',
		color: 'grey',
	},
	button: {
		width: '100%',
		height: 35,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default styles
