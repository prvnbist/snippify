import {
	CREATE_LABEL,
	DELETE_LABEL,
	SET_LABELS,
	OPEN_LABEL,
	RENAME_LABEL,
	CREATE_SNIPPET,
	OPEN_SNIPPET,
	CLOSE_SNIPPET,
	RENAME_SNIPPET,
	DELETE_SNIPPET
} from './actions/types'

const reducers = (state, action) => {
	switch (action.type) {
		case CREATE_LABEL: {
			return {
				...state,
				labels: [...state.labels, action.payload]
			}
		}
		case DELETE_LABEL: {
			const labels = state.labels
			delete labels[labels.indexOf(action.payload)]
			return {
				...state,
				labels: labels.filter(Boolean),
				label: '',
				files: state.openLabel === action.payload ? [] : state.files
			}
		}
		case RENAME_LABEL: {
			const labels = state.labels
			labels[labels.indexOf(action.payload.oldName)] =
				action.payload.newName
			return {
				...state,
				labels,
				label:
					state.label === action.payload.oldName
						? action.payload.newName
						: state.label
			}
		}
		case SET_LABELS:
			return {
				...state,
				labels: action.payload
			}
		case CREATE_SNIPPET:
			return {
				...state,
				files: [...state.files, action.payload]
			}
		case OPEN_SNIPPET: {
			return {
				...state,
				snippet: action.payload
			}
		}
		case CLOSE_SNIPPET:
			return {
				...state,
				snippet: ''
			}
		case RENAME_SNIPPET: {
			const files = state.files
			files[files.indexOf(state.snippet)] = action.payload
			return {
				...state,
				snippet: action.payload,
				files: files
			}
		}
		case DELETE_SNIPPET: {
			return {
				...state,
				snippet: '',
				files: state.files.filter(file => file !== state.snippet)
			}
		}
		case OPEN_LABEL:
			return {
				...state,
				label: action.payload.label,
				files: action.payload.files
			}
		default:
			return state
	}
}

export default reducers
