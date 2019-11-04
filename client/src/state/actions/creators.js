import mime from 'mime-types'
import {
	CREATE_LABEL,
	DELETE_LABEL,
	SET_LABELS,
	OPEN_LABEL,
	RENAME_LABEL,
	SET_ERROR,
	SET_SUCCESS,
	REMOVE_SUCCESS,
	REMOVE_ERROR,
	CREATE_SNIPPET,
	CLOSE_SNIPPET,
	RENAME_SNIPPET,
	DELETE_SNIPPET
} from './types'

const successOrError = (dispatch, { success, message }) => {
	dispatch({
		type: success ? SET_SUCCESS : SET_ERROR,
		payload: message
	})
	setTimeout(
		() =>
			dispatch({
				type: success ? REMOVE_SUCCESS : REMOVE_ERROR
			}),
		3000
	)
}

// Create Label
const createLabel = label => {
	return dispatch => {
		const body = new FormData()
		body.append('label', label)
		return fetch('/labels/create', {
			method: 'POST',
			body
		})
			.then(response => response.json())
			.then(({ success, message }) => {
				dispatch({
					type: CREATE_LABEL,
					payload: success ? label : null
				})
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}

// Open Label
const openLabel = label => dispatch => {
	return fetch(`/labels/${label}`)
		.then(response => response.json())
		.then(({ files }) =>
			dispatch({
				type: OPEN_LABEL,
				payload: {
					label,
					files
				}
			})
		)
		.catch(error => console.log(error))
}

// Rename Label
const renameLabel = (oldName, newName) => {
	return (dispatch, getState) => {
		const body = new FormData()
		body.append('oldName', oldName)
		body.append('newName', newName)
		return fetch('/labels/rename', {
			method: 'POST',
			body
		})
			.then(res => res.json())
			.then(({ success, message }) => {
				dispatch({
					type: RENAME_LABEL,
					payload: {
						oldName,
						newName
					}
				})
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}

// Delete Label
const deleteLabel = label => {
	return dispatch => {
		fetch(`/labels/delete/${label}`, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(({ success, message }) => {
				dispatch({
					type: DELETE_LABEL,
					payload: label
				})
				dispatch({
					type: CLOSE_SNIPPET
				})
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}

// Set Labels
const getLabels = () => dispatch => {
	return fetch('/labels')
		.then(res => res.json())
		.then(({ labels }) => {
			dispatch({
				type: SET_LABELS,
				payload: labels
			})
		})
		.catch(err => console.log(err))
}

// Save File
const saveSnippet = content => {
	return (dispatch, getState) => {
		const snippet = new File([content], getState().snippet, {
			type: mime.lookup(getState().snippet)
		})
		const data = new FormData()
		data.append('snippet', snippet)
		data.append('label', getState().label)
		return fetch('/snippets/save', {
			method: 'POST',
			body: data
		})
			.then(response => response.json())
			.then(({ success, message }) => {
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}
// Create File
const createSnippet = (name, ext) => {
	return (dispatch, getState) => {
		const body = new FormData()
		body.append('label', getState().label)
		body.append('snippet', `${name}.${ext}`)
		return fetch('/snippets/create', {
			method: 'POST',
			body
		})
			.then(response => response.json())
			.then(({ success, message }) => {
				dispatch({
					type: CREATE_SNIPPET,
					payload: `${name}.${ext}`
				})
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}
// Open File
const openSnippet = file => (_, getState) => {
	return fetch(`/snippets/${getState().label}/${file}`)
		.then(response => response.json())
		.then(({ file }) => file)
		.catch(error => console.log(error))
}

// Rename File
const renameSnippet = name => {
	return (dispatch, getState) => {
		const body = new FormData()
		body.append('label', getState().label)
		body.append('oldName', getState().snippet)
		body.append('newName', name)
		return fetch('/snippets/rename', {
			method: 'POST',
			body
		})
			.then(res => res.json())
			.then(({ success, message }) => {
				dispatch({
					type: RENAME_SNIPPET,
					payload: name
				})
				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}
// Delete File
const deleteSnippet = () => {
	return (dispatch, getState) => {
		fetch(`/snippets/delete/${getState().label}/${getState().snippet}`, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(({ success, message }) => {
				dispatch({
					type: DELETE_SNIPPET
				})

				if (success) {
					successOrError(dispatch, { success, message })
				} else {
					throw new Error(message)
				}
			})
			.catch(({ message }) => {
				successOrError(dispatch, { success: false, message })
			})
	}
}
// Get Files

export default {
	openLabel,
	getLabels,
	createLabel,
	deleteLabel,
	renameLabel,
	createSnippet,
	openSnippet,
	deleteSnippet,
	renameSnippet,
	saveSnippet
}
