import React, { useEffect, useState, useReducer } from 'react'
import Box from '../../components/Box'
import { Table } from '../../scenes/common'
import { View, Image } from '../../components/NativeComponents'
import { ScreenContainer } from '../common'
import { getRankings } from './util'
import { getLocalData } from '../../services/api'

import mad from '../../assets/ranks/10_MadMale.png'
import sm from '../../assets/ranks/9_SuperMale.png'
import vip from '../../assets/ranks/8_VIPFemalefinal.png'
import gen from '../../assets/ranks/7_GeniusMalefinal.png'
import jun from '../../assets/ranks/6_JrScientistMaleFinal.png'
import lab from '../../assets/ranks/5_LabScientistMaleFinal.png'
import expl from '../../assets/ranks/4_ExploringScientistFemale.png'
import appr from '../../assets/ranks/2_ScienceApprenticeFemalefinal.png'
import inv from '../../assets/ranks/1_ScienceInvestigatorrMalefinal.png'
import amb from '../../assets/ranks/3_ScienceAmbassadorMalefinal.png'


const data = [
	{
		img: mad,
		name: 'Mad Scientist',
		level: 10,
		stars: '90, 000'
	},
	{
		img: sm,
		name: 'Super Scientist',
		level: 9,
		stars: '80, 000'
	},
	{
		img: vip,
		name: 'VIP Scientist',
		level: 8,
		stars: '70, 000'
	},
	{
		img: gen,
		name: 'Genius Scientist',
		level: 7,
		stars: '60, 000'
	},
	{
		img: jun,
		name: 'Junior Scientist',
		level: 6,
		stars: '50, 000'
	},
	{
		img: lab,
		name: 'Lab Scientist',
		level: 5,
		stars: '40, 000'
	},
	{
		img: expl,
		name: 'Exploring Scientist',
		level: 4,
		stars: '30, 000'
	},
	{
		img: amb,
		name: 'Science Ambassador',
		level: 3,
		stars: '20, 000'
	},
	{
		img: mad,
		name: 'Science Apprentice',
		level: 2,
		stars: '10, 000'
	},
	{
		img: inv,
		name: 'Science Investigator',
		level: 1,
		stars: '5, 000'
		
	}
]

const dataColumns = [
	{
		name: 'Image'
	},
	{
		name: 'Name'
	},
	{
		name: 'Level'
	},
	{
		name: 'Stars'
	}
]

export default function Rankings() {
	const [imageWidth, setImageWidth] = useState(60)

	const initialState = {
		data: []
	}
	
	const rankingsReducer = (prevState, action) => {
		const d = []
		action.ranks.map( ({imageUri, description, star_count, rank_no, isActive}) => {
			d.push(	{
				img: imageUri,
				name: description.split('(')[0],
				rankNo: rank_no,
				stars: star_count,
				height: 60,
				isActive: isActive
			}
		)
		})
		return {
			...prevState,
			data: d
		}
	}
	
	const [rankingState, dispatch] = useReducer(rankingsReducer, initialState)
	
	useEffect(() => {
		setTimeout(async() => {
			let ranks = []
			try {
				const user =  JSON.parse(await getLocalData('user-profile'))
				const items = await getRankings()
				let isActive = false
				items.reverse().map((item, i) => {
					const desc = item.description.toLowerCase().split('(')
					const d = desc[1].substr(0, desc[1].length-1)
					const g = user.gender.toLowerCase()
					if(d === g) {
						if(isActive) {
							item['isActive'] = isActive
						}
						else {
							isActive = (item.rank_no === user.rank.rank_no)? true: false
							item['isActive'] = isActive
						}
						ranks.push(item)
					}
				})
			} catch(e) {
				console.log(e)
			}
			dispatch({ranks: ranks})
		}, 1)
	}, [])

	return (
		<ScreenContainer>
			<View style={{
				backgroundColor: '#1a5098',
				padding: 30,
				flex: 1
			}}>
				<View style={{
					backgroundColor: '#fff',
					borderRadius: 10,
					height: '100%'
				}}>
					<Table data={rankingState.data} />
				</View>
			</View>
		</ScreenContainer>
	)
}
