import React from 'react'

const Context = React.createContext()

const initialState = {
	selectedSnippet: ''
}

const reducers = (state, action) => {
	switch (action.type) {
		case 'OPEN_SNIPPET':
			return {
				...state,
				selectedSnippet: action.payload
			}
		default:
			return state
	}
}

export { Context, initialState, reducers }
