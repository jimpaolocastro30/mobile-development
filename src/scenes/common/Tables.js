import React, { Fragment, useState } from 'react'
import { View, Image } from '../../components/NativeComponents'
import Text from '../../components/Text'
import Box from '../../components/Box'
import { FlatList } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

const win = Dimensions.get('window')

const Table = ({ data = [], columns = [] }) => {

	return (
		<Box>
			<Box
				flexDirection="row"
				flexWrap="wrap"
				backgroundColor="btnDanger"
				textAlign="right"
				justifyContent="flex-start"
				borderTopRightRadius={10}
				borderTopLeftRadius={10}
			>
				{columns?.map((col, index) => (
					<Fragment key={index}>
						<Box width="25%" key={index}>
							<Text
								color="textLight"
								fontSize={16}
								display="block"
								padding="m"
								textAlign="left"
							>
								{col.name}
							</Text>
						</Box>
					</Fragment>
				))}
				{columns.length === 0 && <View style={{padding: 20}}></View>}
			</Box>
			<FlatList
				borderBottomRightRadius={10}
				borderBottomLeftRadius={10}
				showsVerticalScrollIndicator={false}
				marginBottom={50}
				data={data}
				renderItem={({ item }) => {
					let imgWidth = 60
					return (
						<Box
							flexDirection="row"
							flexWrap="wrap"
							borderBottomWidth={1}
							borderColor="borderLight"
							backgroundColor="bgWhite"
							width="100%"
							justifyContent="flex-start"
						>
							<View style={{
								width: 100,
								marginRight: 20,
								alignItems: 'flex-start'
							}}>
								{item.isActive? <Image source={{uri: item.img}}
									style={{
										height: 60,
										width: 75,
										resizeMode: 'contain',
										marginLeft: 20,
										marginTop: 10,
										marginBottom: 10
									}}
								/>:
								<Image source={{uri: item.img}}
									style={{
										height: 60,
										width: 75,
										resizeMode: 'contain',
										marginLeft: 20,
										marginTop: 10,
										marginBottom: 10,
										tintColor: item.isActive? null: '#00000090'
									}}
								/>
								}
							</View>
							<View style={{justifyContent: 'center'}}>
								<Text style={{
									fontSize: 15,
									fontFamily: 'Lato_700Bold',
									marginBottom: 1,
									opacity: item.isActive? 1.0: 0.2
								}}>{item.name}</Text>
								<View>
									<Text style={{
										fontSize: 15,
										opacity: item.isActive? 1.0: 0.2
									}}>Level {item.level} | {item.stars} Stars</Text>
								</View>
							</View>
						</Box>
					)
				}}
			/>
		</Box>
	)
}

export default Table
