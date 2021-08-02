import { StyleSheet, Dimensions } from '../../../../components/NativeComponents'

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: width,
		height: height
	},
	wrapper: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	termsText: {
		height: 50,  
		color: 'rgba(255, 255, 255, .8)',
		textAlign: 'center',
		marginTop: 30
	},
	proceed: {
		width: '100%',
		borderRadius: 25,
		alignSelf: 'flex-start',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		//flexGrow: 1,
		backgroundColor: '#01aef0',
	},
	hr: {
		width: '100%', borderColor: '#01aef0', borderWidth: 1.5},
	FB: {marginTop: 30, width: '70%', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'},
	error: {
		fontSize: 15, fontWeight: 'bold',
	}
})

export default styles
