let borderColor = '#DEDEDE';
let inputHeight = '2rem';
export const customStyles = {
	// container: (provided) => ({
	// 	...provided,
	// 	display: 'inline-block',
	// 	width: '250px',
	// 	minHeight: '1px',
	// 	textAlign: 'left',
	// 	border: 'none',
	// }),
	control: (provided) => ({
		...provided,
		border: '1px solid ' + borderColor,
		borderRadius: '2px',
		minHeight: '1px',
		height: inputHeight,
	}),
	input: (provided) => ({
		...provided,
		minHeight: '1px',
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		// border: '1px solid #757575',
		// borderRadius: '2px',
		// minHeight: '1px',
		// height: inputHeight,
		// alignSelf: 'stretch',
		// backgroundColor: '#757575',
		// width: 1,
		height: '24px',
	}),

	dropdownIndicator: (provided) => ({
		...provided,
		minHeight: '1px',
		paddingTop: '4px',
		paddingBottom: '0',
		color: borderColor,
		height: inputHeight,
	}),
	indicatorSeparator: (provided) => ({
		...provided,
		// backgroundColor: '#757575',
		alignSelf: 'stretch',
		backgroundColor: borderColor,
		marginBottom: '4px',
		marginTop: '4px',
		width: '1px',
	}),
	clearIndicator: (provided) => ({
		...provided,
		minHeight: '1px',
	}),
	valueContainer: (provided) => ({
		...provided,
		minHeight: '1px',
		height: inputHeight,
		paddingTop: '0',
		paddingBottom: '0',
	}),
	singleValue: (provided) => ({
		...provided,
		minHeight: '1px',
		paddingBottom: '2px',
	}),
};
