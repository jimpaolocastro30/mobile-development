import { StyleSheet, Dimensions } from '../../../../components/NativeComponents'
const { height, width } = Dimensions.get('window')
const pageContentWidth = width * .80

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F1aef0',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: width,
		height: height,
	},
	wrapper: {
		flexShrink: 1,
		marginTop: 30,
		width: pageContentWidth,
		justifyContent: 'center'
	},
	proceed: {
		width: '100%',
		borderRadius: 25,
		alignSelf: 'flex-start',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		backgroundColor: '#01aef0',
	},
	textStyle: {
		flexShrink: 1,
		fontSize: 20,
		lineHeight: 30,
		width: '90%',
		color: '#fff',
		marginBottom: 25
	}

})

export default styles
