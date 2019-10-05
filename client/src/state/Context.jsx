import React from 'react'
import { stat } from 'fs'

const Context = React.createContext()

const initialState = {
	labels: {},
	files: [],
	openSnippet: {
		folder: '',
		file: ''
	},
	openLabel: ''
}

const reducers = (state, action) => {
	switch (action.type) {
		case 'SET_LABELS':
			return {
				...state,
				labels: action.payload
			}
		case 'OPEN_SNIPPET':
			return {
				...state,
				openSnippet: {
					folder: action.payload.folder,
					file: action.payload.file
				}
			}
		case 'OPEN_LABEL':
			return {
				...state,
				openLabel: action.payload,
				files: state.labels[action.payload]
			}
		default:
			return state
	}
}

export { Context, initialState, reducers }
