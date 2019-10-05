import React from 'react'

const Context = React.createContext()

const initialState = {
	openSnippet: '',
	newSnippet: ''
}

const reducers = (state, action) => {
	switch (action.type) {
		case 'OPEN_SNIPPET':
			return {
				openSnippet: action.payload,
				newSnippet: ''
			}
		case 'NEW_SNIPPET':
			return {
				newSnippet: action.payload,
				openSnippet: ''
			}
		default:
			return state
	}
}

export { Context, initialState, reducers }
