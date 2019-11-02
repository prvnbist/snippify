import mime from 'mime-types'
import {
	CREATE_LABEL,
	DELETE_LABEL,
	SET_LABELS,
	OPEN_LABEL,
	CREATE_SNIPPET,
	OPEN_SNIPPET,
	CLOSE_SNIPPET,
	RENAME_SNIPPET,
	DELETE_SNIPPET
} from './types'

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
			.then(() => {
				dispatch({
					type: CREATE_LABEL,
					payload: label
				})
			})
			.catch(console.log)
	}
}

// Open Label
const openLabel = label => dispatch => {
	return fetch(`/labels/${label}`)
		.then(response => response.json())
		.then(
			({ files }) =>
				console.log(files) ||
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
// Delete Label
const deleteLabel = label => {
	return dispatch => {
		fetch(`/labels/delete/${label}`, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(() => {
				dispatch({
					type: DELETE_LABEL,
					payload: label
				})
				dispatch({
					type: CLOSE_SNIPPET
				})
			})
			.catch(err => console.log(err))
	}
}

// Set Labels
const getLabels = () => dispatch => {
	return fetch('/labels')
		.then(res => res.json())
		.then(({ labels }) => {
			dispatch({
				type: 'SET_LABELS',
				payload: labels
			})
		})
		.catch(err => console.log(err))
}

// Save File
const saveSnippet = content => {
	return (_, getState) => {
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
			.then(result => result)
			.catch(error => console.log(error))
	}
}
// Create File
const createSnippet = name => {
	return (dispatch, getState) => {
		const body = new FormData()
		body.append('folder', getState().label)
		body.append('file', name)
		return fetch('/snippets/create', {
			method: 'POST',
			body
		})
			.then(response => response.json())
			.then(() =>
				dispatch({
					type: CREATE_SNIPPET,
					payload: name
				})
			)
			.catch(error => console.log(error))
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
		body.append('folder', getState().label)
		body.append('oldName', getState().snippet)
		body.append('newName', name)
		return fetch('/snippets/rename', {
			method: 'POST',
			body
		})
			.then(res => res.json())
			.then(() => {
				dispatch({
					type: RENAME_SNIPPET,
					payload: name
				})
			})
			.catch(err => console.log(err))
	}
}
// Delete File
const deleteSnippet = () => {
	return (dispatch, getState) => {
		fetch(`/snippets/delete/${getState().label}/${getState().snippet}`, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(() =>
				dispatch({
					type: DELETE_SNIPPET
				})
			)
			.catch(err => console.log(err))
	}
}
// Get Files

export default {
	openLabel,
	getLabels,
	createLabel,
	deleteLabel,
	createSnippet,
	openSnippet,
	deleteSnippet,
	renameSnippet,
	saveSnippet
}
