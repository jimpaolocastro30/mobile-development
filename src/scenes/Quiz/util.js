import api from '../../services/api'

const entities = require('entities')

export const _ = (array) => (
	[...array].sort(() => Math.random() - 0.7)
)

export const tokenIncrement = async (data) => {
	try {
		const body = {}
		if(data.add_token) {
			body["add_token"] = data.add_token
			
		}
		if(data.add_star) {
			body["add_star"] = data.add_star
		}
		const currentTokens = await api('tokens', {'body': body})
		return currentTokens?.results || null
	}
	catch(err) {
		console.log({err})
	}
}

export const getCategoryYearLevel = async () => {
	try {
		const data = await api('preferred-level-and-category')
		let results = data.results
		return results
	}
	catch(err) {
		console.log({err})
	}
}

export const getQuiz = async (level=4, category=2, requestCount=1) => {
	try { 
		const data = await api(`quizzes/standard?year_level=${level}&quiz_category=${category}`)
		let grouped = groupArray(data.results.records, 6)
		let randomGroup
		do {
			let randomId = Math.floor(Math.random() * grouped.length)
			randomGroup = grouped[randomId]
		} while (randomGroup.length < 6)
		let result = _(randomGroup).map(({answers, question, href, quiz_detail_id}, index) => {
			let choices = answers.map((item) => (item.href)? item.href: item.answer)
			let correctAnswerId = answers.findIndex((answer) => answer.is_correct != 0)
			const q = href? href: question
			return {
				id: quiz_detail_id,
				choices: _(choices),
				question: entities.decodeHTML(q),
				correct_answer: (answers[correctAnswerId].href)? answers[correctAnswerId].href: answers[correctAnswerId].answer
			}
		})
		return {result, scoring: data.results.scoring}
	}
	catch(err) {
		console.log({err})
	}
}

export const getQuizByGameId = async (gameId) => {
	try {
		console.log('gameId -->', gameId)
		const data = await api(`quizzes/game/${gameId}`)
		// let grouped = groupArray(data.results.records, 6)
		// let randomGroup
		// do {
		// 	let randomId = Math.floor(Math.random() * grouped.length)
		// 	randomGroup = grouped[randomId]
		// } while (randomGroup.length < 6)
		// console.log('data.results.quiz -->', data.results.quiz)
		// const randomGroup = data.results.quiz

		let result = _(data.results.quiz).map(({answers, question, href, quiz_detail_id}, index) => {
			let choices = answers.map((item) => (item.href)? item.href: item.answer)
			let correctAnswerId = answers.findIndex((answer) => answer.is_correct != 0)
			const q = href? href: question
			return {
				id: quiz_detail_id,
				choices: _(choices),
				question: entities.decodeHTML(q),
				correct_answer: (answers[correctAnswerId].href)? answers[correctAnswerId].href: answers[correctAnswerId].answer
			}
		})
		return {result, scoring: data.results.scoring}
	}
	catch(err) {
		console.log({err})
	}
}

function groupArray(arr, size) {
	let newArray = [];
	let i = 0;
	while (i < arr.length) {
		let array = arr.slice(i, i + size)
		newArray = [...newArray, array]
		i += size;
	}
	return newArray;
}

export const theme = {
	standard: {
		primary: "#23af4c"
	},
	duel: {
		primary: "#dd5426"
	},
	'battle of five': {
		primary: '#653e97'
	},
	'special tourney': {
		primary: '#ff2839'
	}
}
