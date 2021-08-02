import { createTheme } from '@shopify/restyle'

const palette = {
	//primary colors
	blueDark: '#024B67',
	blueDarkest: '#1a5098',
	bluePrimary: '#0066C5',
	blueSecondary: '#327EBB',
	blueLight: '#01AEF0',
	blueSecondaryLight: '#4CCAF9',
	//secondary colors
	redLight: '#DD5426',
	redPrimary: '#FF2839',
	redSecondary: '#F74C13',
	redSecondaryLight: '#0A906E',
	//tertiary colors
	gray: '#7D7D7D',
	grayLight: 'D6D6D6',
	purple: '#653E97',
	purpleLight: '#B29FCB',
	yellow: '#F6EF25',
	yellowDark: '#FACA0E',
	brown: '#DD5426',
	green: '23AF4C',
	//generics
	black: '#111111',
	white: '#FFFFFF'
}


const theme = createTheme({
	colors: {
		bgPrimary: palette.bluePrimary,
		bgPrimaryDark: palette.blueDark,
		bgPrimaryLight: palette.blueLight,
		bgSecondary: palette.blueSecondary,
		bgSecondaryDark: palette.blueDarkest,
		bgWhite: palette.white,
		bgBlack: palette.black,
		btnPrimary: palette.blueLight,
		btnDanger: palette.redSecondary,
		btnSuccess: palette.green,
		btnWarning: palette.yellowDark,
		btnDark: palette.black,
		btnLight: palette.white,
		textLight: palette.white,
		textDark: palette.black,
		borderLight: palette.blueLight
	},
	textVariants: {
		header: {
			fontFamily: 'Lato_900Black',
			fontWeight: "900",
			fontSize: 34,
			lineHeight: 42.5
		},
		subheader: {
			fontFamily: 'Lato_700Bold',
			fontWeight: "700",
			fontSize: 28,
			lineHeight: 36
		},
		body: {
			fontFamily: 'Lato_400Regular',
			fontWeight: "400",
			fontSize: 16,
			lineHeight: 24
		},
		buttonLabel: {
			fontFamily: 'Lato_400Regular',
			fontWeight: "400",
			fontSize: 24,
			lineHeight: 24,
			color: "textLight"
		}
	},
	spacing: {
		xxs: 2,
		xs: 5,
		s: 10,
		m: 20,
		l: 30,
		xl: 40
	},
	breakpoints: {
		phone: 0,
		longPhone: {
			width: 0,
			height: 812
		},
		tablet: 768,
		largeTablet: 1024
	}
})

export type Theme = typeof theme
export default theme
