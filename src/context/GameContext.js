import React, { createContext, useState } from "react"

export const GameContext = createContext()

export const GameContextProvider = (props) => {
	const [opponents, setOpponents] = useState([])
	const [selectedOpponents, setSelectedOpponents] = useState([])
	const [mode, setMode] = useState('standard')
	const [category, setCategory] = useState('')
	const [level, setLevel] = useState('')
	const [gameId, setGameId] = useState(0)
	const providerValue = {
		mode,
		setMode,
		level,
		setLevel,
		category,
		setCategory,
		opponents,
		setOpponents,
		selectedOpponents,
		setSelectedOpponents,
		gameId,
		setGameId
	}
	return (
		<GameContext.Provider value={providerValue}>
			{props.children}
		</GameContext.Provider>
	)
}
