import AsyncStorage from '@react-native-async-storage/async-storage'

const tokenKey = 'whiz_token'
// const apiBaseUrl = process.env.REACT_NATIVE_API_URL
const apiBaseUrl = 'http://34.123.170.125:3006/api/mobile-users'
const webSocketUrl = 'ws://34.123.170.125:3006'
let socket

async function api(endpoint, {body, ...customConfig} = {}, method) {
	const token = await getLocalData(tokenKey)
	const headers = {'content-type': 'application/json'}
	if (token != null && token != '') {
		headers.Authorization = `Bearer ${token}`
	}
	const config = {
		method: body ? (method? method: 'POST') : 'GET',
		...customConfig,
		headers: {
		...headers,
		...customConfig.headers,
		},
	}
	if (body) {
		config.body = JSON.stringify(body)
	}
	console.log(apiBaseUrl)
	console.log(endpoint)
	console.log(config)
	return fetch(`${apiBaseUrl}/${endpoint}`, config)
		.then(async response => {
			if (response.status === 401) {
				// logout()
				return
			}
			const data = await response.json()
			if (data.status == 'SUCCESS') {
				return Promise.resolve(data)
			}
			return Promise.reject(data)
		})
}

const removeLocalData = async (asyncStorageKey) => {
	try {
		await AsyncStorage.removeItem(asyncStorageKey)
	}
	catch(e) {
		// remove error
	}
}

const storeLocalData = async (asyncStorageKey, value) => {
	try {
		console.log(value)
		AsyncStorage.setItem(asyncStorageKey, value)
	}
	catch (e) {
	  console.log({e})
	}
}

const getLocalData = (asyncStorageKey) => {
	return new Promise(async(resolve, reject) => {
		try {
			const jsonValue = await AsyncStorage.getItem(asyncStorageKey)
			if(jsonValue !== null) {
				return resolve(jsonValue)
			}
			return resolve()
		}
		catch(e) {
			return reject(e)
		}
	})
}

const wsUserValidation = async (username) => {
	const token = await getLocalData(tokenKey)
	const message = {
		"type": "user_validation",
		"username": username,
		"token": token
	}
	socket = new WebSocket(webSocketUrl)
	socket.onopen = (e) => {
		console.log("[open] WebSocket Connection established")
		socket.send(JSON.stringify(message))
		return socket
	}
	socket.onerror = (error) => {
		socket = new WebSocket(webSocketUrl)
	}
	return socket
}

const getWebSocketConnection = async (username) => {
	if(socket == null) {
		return await wsUserValidation(username)
	}
	return socket
}

const sendMessageToWebSocket = (msg) => {
	socket.send(JSON.stringify(msg))
}

const closeWebSocketConnection = () => {
	if(socket == null) {
		return
	}
	socket.close(1000, " ")
	socket.onclose = (event) => {
		console.log(event)
	}
}

export default api
export {
	getLocalData,
	storeLocalData,
	removeLocalData,
	wsUserValidation,
	closeWebSocketConnection,
	getWebSocketConnection,
	sendMessageToWebSocket
}
