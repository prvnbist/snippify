import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { useSelector } from 'react-redux'

import LabelBar from './sections/LabelBar/index'
import FileBar from './sections/FileBar/index'
import Main from './sections/Main/index'
import Header from './sections/Header/index'

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

const Error = ({ children }) => {
	return (
		<ErrorBar>
			<span>{children}</span>
		</ErrorBar>
	)
}

const Success = ({ children }) => {
	return (
		<SuccessBar>
			<span>{children}</span>
		</SuccessBar>
	)
}
const App = () => {
	const state = useSelector(state => state)
	return (
		<Wrapper error={state.error} success={state.success}>
			<GlobalStyle />
			{state.error && <Error>{state.error}</Error>}
			{state.success && <Success>{state.success}</Success>}
			<Header />
			<LabelBar />
			<FileBar />
			<Main />
		</Wrapper>
	)
}

export default App

const Wrapper = styled.div`
	display: grid;
	height: 100vh;
	grid-template-columns: 200px 300px 1fr;
	grid-template-rows: ${({ error, success }) =>
		error || success ? '32px 48px 1fr' : '48px 1fr'};
	grid-template-areas: ${({ error, success }) =>
		error || success
			? `'message message message' 'head head head'
	'label file main'`
			: `'head head head'
	'label file main'`};
`

const ErrorBar = styled.div`
	background: #ed4337;
	grid-area: message;
	display: flex;
	align-items: center;
	justify-content: center;
	span {
		color: #fff;
		font-size: 14px;
		margin-top: -2px;
		font-weight: 500;
	}
`

const SuccessBar = styled.div`
	background: #a4c639;
	grid-area: message;
	display: flex;
	align-items: center;
	justify-content: center;
	span {
		color: #fff;
		font-size: 14px;
		margin-top: -2px;
		font-weight: 500;
	}
`
