import React, { Fragment } from "react"
import { StyleSheet } from "react-native"
import AnswersButton from './AnswersButton'
import Animated from 'react-native-reanimated'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 44,
		paddingLeft: 22,
		paddingRight: 22,
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
})

export default function Choices({primary, choices, answerSelected, onPress }) {
	return (
		<Animated.View style={styles.container}>
			{choices.map((_, i) => (
				<Fragment key={i}>
					<AnswersButton
						primary={primary}
						index={i}
						answer={choices[i]}
						onPress={() => {
							answerSelected(choices[i], i)
							onPress()
						}}
					/>
				</Fragment>
			))}
		</Animated.View>
	)
}
