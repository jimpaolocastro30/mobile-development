import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen')
const styles = StyleSheet.create({
	container: {
		position: 'relative',
		display: 'flex',
		backgroundColor: '#0066c5',
		width: 'auto',
		height: height * .085,
		justifyContent: 'flex-start',
		borderRadius: 50,
		alignSelf: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 30
	},
	imageWrapper: {
		marginRight: 15,
		width: 70,
		height: 70
	},
	imageStyles: {
		height: '125%',
		width: '125%',
		borderRadius: 100,
		position: 'relative',
		top: -9,
		left: -5
	}
})

export default styles
