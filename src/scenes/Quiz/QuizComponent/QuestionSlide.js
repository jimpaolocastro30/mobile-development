import React from "react"
import { Dimensions } from "react-native"
import { Box, Text } from "../../common/theme"
const { width } = Dimensions.get("window")

function QuestionSlide({ questions }) {
	return (
		<Box {...{ width }} alignItems="center" padding="m">
			<Text variant="title" fontSize={24} marginTop="m">
				Question Number {}
			</Text>

			<Text variant="body" color="white" marginTop="xl" textAlign="center">
				{questions} 
			</Text>
		</Box>
	)
}

export default QuestionSlide
