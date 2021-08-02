import { Alert } from 'react-native'
import api from '../../services/api'

export const getPlayerProfile = async () => {
	try {
		const data = await api('my-profile')
		let results = data.results
		return results
	}
	catch(err) {
		console.log({err})
	}
}
