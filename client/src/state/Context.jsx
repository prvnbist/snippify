import React from 'react'

const Context = React.createContext()

const initialState = {
	labels: {},
	files: [],
	openSnippet: {
		folder: '',
		file: ''
	},
	openLabel: '',
	languages: {
		coffee: 'coffeescript',
		h: 'objective-c',
		bat: 'bat',
		clj: 'clojure',
		cpp: 'cpp',
		cs: 'csharp',
		csp: 'csp',
		dockerfile: 'dockerfile',
		fs: 'fsharp',
		go: 'go',
		graphql: 'graphql',
		handlebars: 'handlebars',
		html: 'html',
		java: 'java',
		js: 'javascript',
		jsx: 'javascript',
		lua: 'lua',
		md: 'markdown',
		php: 'php',
		ps1: 'powershell',
		pug: 'pug',
		py: 'python',
		r: 'r',
		rb: 'ruby',
		rs: 'rust',
		swift: 'swift',
		ts: 'typescript',
		xml: 'xml',
		yaml: 'yaml',
		css: 'css',
		less: 'less',
		scss: 'scss',
		txt: 'text'
	}
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
		case 'CLOSE_SNIPPET':
			return {
				...state,
				openSnippet: {
					folder: '',
					file: ''
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
