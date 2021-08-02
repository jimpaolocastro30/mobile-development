import React from 'react'
import { TouchableOpacity, ActivityIndicator } from '../NativeComponents'
import Text from '../Text'
import Box from '../Box'

type Props = {
	label: string
	isLoading?: boolean
	onPress: () => void
	width: '70%'
	bgColor: 'btnPrimary'
	color: 'textLight'
	disabled: false
}

const Button = ({
	onPress,
	label,
	width,
	bgColor,
	isLoading,
	color,
	disabled,
	...props
}: Props) => {
	return (
		<Box width={width} flexDirection="row" {...props} justifyContent="center" alignItems="center">
			<TouchableOpacity onPress={onPress} disabled={disabled}>
				<Text
					variant="buttonLabel"
					marginRight={isLoading ? 's' : undefined}
				>
					{label}
				</Text>
				{isLoading ? <ActivityIndicator color={color} /> : null}
			</TouchableOpacity>
		</Box>
	)
}

export default Button
