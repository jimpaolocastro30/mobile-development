import api from '../../../services/api'
import * as FileSystem from 'expo-file-system'

const avatarBaseUrl = 'http://34.123.170.125:3006/bonus-and-freebies'
const imageDir = FileSystem.documentDirectory + 'freebies/'
const imageFileUri = (imageId) => imageDir + imageId
const imageUrl = (imageId) => avatarBaseUrl + imageId

export const getAchievements = async (gameId) => {
	try {
		const data = await api('battles-and-players')
		if(data.results.count === 0) {
			return(data.results)
		}
		const freebieImages = []
		for(const v of data.results.records) {
			const fn = v.href.split('/')
			v['imageFile'] = fn[fn.length-1]
			freebieImages.push(v)
		}
		await fetchImagesFromServer(freebieImages)
		const images = await readDirectoryAsync()
		const freebies = []
		for(const v of freebieImages) {
			const imageUri = await getSingleImageUri(v.imageFile)
			v['imageUri'] = imageUri
			freebies.push(v)
		}
		return freebies
	}
	catch(err) {
		console.log({err})
	}
}

async function ensureDirExists() {
	const dirInfo = await FileSystem.getInfoAsync(imageDir)
	if (!dirInfo.exists) {
	  console.log("Freebies directory doesn't exist, creating...")
	  await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true })
	}
}

const fetchImagesFromServer = async (freebieImages) => {
	try {
		await ensureDirExists()
		await Promise.all(freebieImages.map(async ({href}) => {
			const fn = href.split('/')
			await FileSystem.downloadAsync(href, imageFileUri(fn[fn.length-1]))
			.then(({ uri }) => {
				console.log('Finished downloading to ', uri)
			})
			.catch(error => {
				console.error(error)
			})
		}))
	} catch (e) {
		console.error("Couldn't download image files:", e)
	}
}

export const readDirectoryAsync = async () => {
	try {
		await ensureDirExists()
		const images = await FileSystem.readDirectoryAsync(imageDir).then((files) => {
			return(files)
		})
		return(images)
	} catch (e) {
		console.error(e)
	}
}

export const getContentUriAsync = async (uri) => {
	FileSystem.getContentUriAsync(uri).then(cUri => {
		IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
		  data: cUri,
		  flags: 1,
		})
	  })
}

export async function getSingleImageUri(imageId) {
	await ensureDirExists()
	const fileUri = imageFileUri(imageId)
	const fileInfo = await FileSystem.getInfoAsync(fileUri)
	if (!fileInfo.exists) {
		console.log("Image isn't cached locally. Downloading...")
		await FileSystem.downloadAsync(imageUrl(imageId), fileUri)
	}
	return fileUri
}


export const claimAchievements = async (body) => {
	try {
		const response = await api('bonus-and-freebies', {body: body}, 'PATCH')
		return response.status
	}
	catch(err) {
		console.log({err})
		return err.status + ": " + err.results
	}
}
