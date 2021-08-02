import React, { useState } from 'react'
import { TextInput, Picker, StyleSheet } from '../../../components/NativeComponents'
import DropDownPicker from 'react-native-dropdown-picker'

import BaseInput from './BaseInput'

const InputField = ({ asLabel, children, value, onChangeText, type="text", disabled=false, ...props }) => {

	const [focused, setFocused] = useState (false)

	const handleValidation = (value) => {
		const { pattern } = props;
		if (!pattern) return true;
	
		// string pattern, one validation rule
		if (typeof pattern === 'string') {
		  const condition = new RegExp(pattern, 'g');
		  return condition.test(value);
		}
	
		// array patterns, multiple validation rules
		if (typeof pattern === 'object') {
		  const conditions = pattern.map(rule => new RegExp(rule, 'g'));
		  return conditions.map(condition => condition.test(value));
		}
	}
	
	  const handleOnChangeText = (value) => {
		const { onValidation } = props;
		const isValid = handleValidation(value);
		onValidation && onValidation(isValid);
		onChangeText && onChangeText(value);
	  }
	  return(
		<BaseInput 
			{...props}
			style = {{
				borderColor: !asLabel ? focused ? '#fff': '#01aef0' : 'transparent',
				backgroundColor: !asLabel ? '#327ebb' : 'transparent',
				borderRadius: !asLabel ? 30 : 0,
				borderColor: '#01aef0',
				borderLeftWidth: !asLabel ? 3: 0,
				borderTopWidth: !asLabel ? 3: 0,
				borderRightWidth: !asLabel ? 3: 0,
			}}
		>
			<TextInput
				{...props}
				placeholderTextColor="#fff"
				style={{
					opacity: !disabled ? 1 : 0.8,
					...styles.inputStyles,
				}}
				value={value}
				onChangeText={handleOnChangeText}
				secureTextEntry={type === 'password'}
				editable={!disabled}
				onFocus = { () => setFocused (true) }
				onBlur = { () => setFocused (false) }
			/>
		</BaseInput>
	)
}

const SelectField = ({ children, value, onChange, items, ...props }) => (
	<BaseInput {...props}>
		<Picker
			style={styles.inputStyles}
			selectedValue={value}
			onValueChange={onChange}
			mode="dropdown"
		>
			{items.map(item => (
				<Picker.Item
					key={item.value}
					label={item.label}
					value={item.value}
				/>
			))}
		</Picker>
	</BaseInput>
)

const DropdownPicker = ({
	options,
	value,
	placeholder,
	onChange,
	disabled = false,
	zIndex,
	asLabel
}) => {
	return(
	<DropDownPicker
		zIndex={zIndex}
		items={options}
		defaultValue={value}
		containerStyle={{
			...styles.dropdownContainerStyles,
		}}
		style={{
			...styles.pickerStyles,
			backgroundColor: !asLabel ? '#327ebb' : 'transparent',
			borderColor: '#01aef0',
			borderLeftWidth: !asLabel ? 3: 0,
			borderTopWidth: !asLabel ? 3: 0,
			borderRightWidth: !asLabel ? 3: 0,
			borderTopLeftRadius: !asLabel ? 30 : 0,
			borderTopRightRadius: !asLabel ? 30 : 0,
			borderBottomLeftRadius: !asLabel ? 30 : 0,
			borderBottomRightRadius: !asLabel ? 30 : 0,
		}}
		itemStyle={styles.itemStyles}
		dropDownStyle={styles.dropdownStyles}
		selectedLabelStyle={styles.selectedLabelStyles}
		placeholderStyle={styles.placeholderStyles}
		onChangeItem={onChange}
		disabled={disabled}
		placeholder={placeholder}
		globalTextStyle={styles.globalTextStyle}
		arrowStyle={styles.arrowStyle}
		arrowColor="#01AEF0"
		arrowSize={36}
	/>
)}

const styles = StyleSheet.create({
	globalTextStyle: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'left',
	},
	inputStyles: {
		color: '#fff',
		height: 50,
		width: '100%',
		padding: 10,
		fontSize: 20,
		marginLeft: 20,
		alignSelf: 'center'
	},
	dropdownContainerStyles: {
		height: 60,
		width: '100%',
		marginBottom: 20
	},
	pickerStyles: {
		backgroundColor: '#327EBB',
		borderColor: '#01AEF0',
		borderWidth: 3,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		color: '#fff',
	},
	dropdownStyles: {
		backgroundColor: '#327EBB',
		borderColor: '#01AEF0',
		borderLeftWidth: 3,
		borderBottomWidth: 3,
		borderRightWidth: 3,
		marginTop: 2,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10
	},
	selectedLabelStyles: {
		color: "#fff",
		fontSize: 20,
		marginLeft: 20,
	},
	placeholderStyles: {
		color: "#fff",
		fontSize: 20,
	},
	arrowStyle: {
		bottom: 5
	}
})

export { InputField, SelectField, DropdownPicker }
