import { Alert } from 'react-native'
import api from '../../services/api'

export const getAllRegions = async () => {
	try {
		const data = await api('regions')
		let regions = []
		for(const v of data.results.records) {
			const r = v.region_name.split('[')[0]
			regions.push({
				label: r,
				value: `${v.region_id}`,
				id: v.region_id
			})
		}
		regions.push({
			label: '',
			value: null
		})
		return regions
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllProvincesByRegionId = async (id) => {
	try {
		const data = await api('provinces/region/' + id)
		let provinces = []
		for(const v of data.results.records) {
			provinces.push({
				label: v.province_name,
				value: `${v.province_id}`,
				id: v.province_id
			})
		}
		provinces.push({
			label: '',
			value: null
		})
		return provinces
	}
	catch(err) {
		console.log({err})
	}
}

export const getProvinceById = async (id) => {
	try {
		const response = await api('provinces/' + id)
		return response.results.records
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllCitiesByProvinceId = async (id) => {
	try {
		const data = await api('cities/province/' + id)
		let cities = []
		for(const v of data.results.records) {
			cities.push({
				label: v.city_name,
				value: `${v.city_id}`,
				id: v.city_id
			})
		}
		cities.push({
			label: '',
			value: null
		})
		return cities
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllGenders = async () => {
	try {
		const data = await api('sexes')
		let gender = []
		for(const v of data.results.records) {
			gender.push({
				label: v.name,
				value: `${v.sex_id}`,
				id: v.sex_id
			})
		}
		gender.push({
			label: '',
			value: null
		})
		return gender
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllUserTypes = async () => {
	try {
		const data = await api('user-categories')
		let userTypes = []
		for(const v of data.results.records) {
			userTypes.push({
				label: v.name,
				value: `${v.user_category_id}`,
				id: `${v.user_category_id}`
			})
		}
		userTypes.push({
			label: '',
			value: null
		})
		return userTypes
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllAgeGroups = async () => {
	try {
		const data = await api('age-groups')
		let age = []
		for(const v of data.results.records) {
			age.push({
				label: v.age_group_name,
				value: `${v.age_group_id}`,
				id: v.age_group_id
			})
		}
		age.push({
			label: '',
			value: null
		})
		return age
	}
	catch(err) {
		console.log({err})
	}
}

export const getAllUserGroups = async () => {
	try {
		const response = await api('user-groups')
		let groups = []
		for(const v of response.results.records) {
			groups.push({
				label: v.name,
				value: `${v.group_id}`,
				id: v.group_id
			})
		}
		groups.push({
			label: '',
			value: null
		})
		return groups
	}
	catch(err) {
		console.log({err})
	}
}

export const editProfile = async (body) => {
	try {
		const response = await api('my-profile', {body: body})
		return response.status
	}
	catch(err) {
		console.log({err})
		return err.status + ": " + err.results
	}
}

