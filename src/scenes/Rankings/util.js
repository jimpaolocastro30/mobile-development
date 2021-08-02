import api from '../../services/api'
import * as FileSystem from 'expo-file-system'

const avatarBaseUrl = 'http://34.123.170.125:3006/libs/rankings'
const imageDir = FileSystem.documentDirectory + 'rankings/'
const imageFileUri = (imageId) => imageDir + imageId
const imageUrl = (imageId) => avatarBaseUrl + imageId

export const getRankings = async () => {
	try {
		const data = await api('libs/rankings')
		const rankImages = []
		for(const v of data.results.records) {
			if(v.is_active === 1) {
				const fn = v.image_path.split('/')
				v['imageFile'] = fn[fn.length-1]
				rankImages.push(v)
			}
		}
		await fetchImagesFromServer(rankImages)
		const images = await readDirectoryAsync()
		const rankings = []
		for(const v of rankImages) {
			const imageUri = await getSingleImageUri(v.imageFile)
			v['imageUri'] = imageUri
			rankings.push(v)
		}
		return rankings
	}
	catch(err) {
		console.log({err})
	}
}

async function ensureDirExists() {
	const dirInfo = await FileSystem.getInfoAsync(imageDir)
	if (!dirInfo.exists) {
	  console.log("Rankings directory doesn't exist, creating...")
	  await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true })
	}
}

const fetchImagesFromServer = async (rankImages) => {
	try {
		await ensureDirExists()
		await Promise.all(rankImages.map(async ({image_path}) => {
			const fn = image_path.split('/')
			await FileSystem.downloadAsync(image_path, imageFileUri(fn[fn.length-1]))
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
