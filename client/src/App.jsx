import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import LabelBar from './sections/LabelBar/index'
import FileBar from './sections/FileBar/index'
import Main from './sections/Main/index'
import Header from './sections/Header/index'

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
	React.useEffect(() => {
		fetch('/snippet/files')
			.then(res => res.json())
			.then(({ files: labels }) => {
				dispatch({
					type: 'SET_LABELS',
					payload: labels
				})
			})
			.catch(err => console.log(err))
	}, [])
	return (
		<Context.Provider value={{ state, dispatch }}>
			<GlobalStyle />
			<Wrapper>
				<Header />
				<LabelBar />
				<FileBar />
				<Main />
			</Wrapper>
		</Context.Provider>
	)
}

export default App

const Wrapper = styled.div`
	display: grid;
	height: 100vh;
	grid-template-columns: 200px 300px 1fr;
	grid-template-rows: 48px 1fr;
	grid-template-areas:
		'head head head'
		'label file main';
`
