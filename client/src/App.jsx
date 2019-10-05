import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import NavBar from './sections/NavBar'
import Main from './sections/Main'

import { Context, initialState, reducers } from './state/Context'

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: "SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
	}
	body {
		overflow: hidden;
	}
`

const App = () => {
	const [state, dispatch] = React.useReducer(reducers, initialState)
	return (
		<Context.Provider value={{ state, dispatch }}>
			<GlobalStyle />
			<Wrapper>
				<NavBar />
				<Main />
			</Wrapper>
		</Context.Provider>
	)
}

export default App

const Wrapper = styled.div`
	display: grid;
	height: 100vh;
	grid-template-columns: 240px 1fr;
`
