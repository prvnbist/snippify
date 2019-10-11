import React from 'react'
import Editor from '@monaco-editor/react'

import mime from 'mime-types'

import { Context } from '../../state/Context'

import { EditIcon, TrashIcon, SaveIcon } from '../../assets/Icons'

import {
	MainWrapper,
	SectionHeader,
	FileName,
	EditorModeSelector,
	TextBtn,
	IconBtn,
	EmptyState
} from './styles'

const Main = () => {
	const editorRef = React.useRef()
	const { state, dispatch } = React.useContext(Context)
	const [content, setContent] = React.useState(null)
	const [fileName, setFileName] = React.useState('')
	const [isContentEditable, setIsContentEditable] = React.useState(false)
	const [isFileNameEditable, setIsFileNameEditable] = React.useState(false)

	React.useEffect(() => {
		if (state.openSnippet.folder !== '') {
			setFileName(state.openSnippet.file)
			fetch(
				`/snippet/file?folder=${state.openSnippet.folder}&file=${state.openSnippet.file}`
			)
				.then(res => res.json())
				.then(({ file }) => setContent(file))
				.catch(err => console.log(err))
		} else {
			setFileName('')
		}
	}, [state.openSnippet])

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
	}

	const saveSnippet = () => {
		setIsContentEditable(isContentEditable => !isContentEditable)
		const file = new File([editorRef.current.getValue()], fileName, {
			type: mime.lookup(fileName)
		})
		const formData = new FormData()
		formData.append('file', file)
		formData.append('folder', state.openLabel)
		if (content !== editorRef.current.getValue()) {
			fetch('/snippet/save', {
				method: 'POST',
				body: formData
			})
				.then(response => response.json())
				.then(success => console.log(success))
				.catch(error => console.log(error))
		}
	}

	const editName = () => {
		setIsFileNameEditable(isFileNameEditable => !isFileNameEditable)
	}

	const deleteSnippet = () => {
		setFileName('')
		const URL = `/snippet/delete?folder=${state.openSnippet.folder}&file=${state.openSnippet.file}`
		fetch(URL, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(() =>
				dispatch({
					type: 'DELETE_SNIPPET',
					payload: {
						folder: state.openSnippet.folder,
						file: state.openSnippet.file
					}
				})
			)
			.catch(err => console.log(err))
	}

	const saveName = () => {
		setIsFileNameEditable(isFileNameEditable => !isFileNameEditable)
		if (state.openSnippet.file !== fileName) {
			const formData = new FormData()
			formData.append('folder', state.openSnippet.folder)
			formData.append('file', state.openSnippet.file)
			formData.append('newName', fileName)
			fetch('/snippet/rename', {
				method: 'POST',
				body: formData
			})
				.then(res => res.json())
				.then(() => {
					dispatch({
						type: 'RENAME_SNIPPET',
						payload: {
							folder: state.openSnippet.folder,
							file: state.openSnippet.file,
							newName: fileName
						}
					})
				})
				.catch(err => console.log(err))
		}
	}

	const options = {
		readOnly: !isContentEditable,
		minimap: {
			enabled: false
		}
	}
	if (fileName === '')
		return (
			<MainWrapper>
				<EmptyState>
					<span>Select a File</span>
				</EmptyState>
			</MainWrapper>
		)
	return (
		<MainWrapper>
			<SectionHeader>
				<FileName isFileNameEditable={isFileNameEditable}>
					{isFileNameEditable ? (
						<IconBtn onClick={() => saveName()}>
							<SaveIcon size={16} color={'#26ACB4'} />
						</IconBtn>
					) : (
						<IconBtn onClick={() => editName()}>
							<EditIcon size={16} color={'#26ACB4'} />
						</IconBtn>
					)}

					<input
						type="text"
						value={fileName}
						disabled={!isFileNameEditable}
						onChange={e => setFileName(e.target.value)}
					/>
				</FileName>
				<EditorModeSelector editable={isContentEditable}>
					{isContentEditable ? (
						<TextBtn onClick={() => saveSnippet()}>Save</TextBtn>
					) : (
						<TextBtn
							onClick={() =>
								setIsContentEditable(
									isContentEditable => !isContentEditable
								)
							}>
							Edit
						</TextBtn>
					)}
				</EditorModeSelector>
				<IconBtn onClick={() => deleteSnippet()}>
					<TrashIcon size={16} color={'#26ACB4'} />
				</IconBtn>
			</SectionHeader>
			<Editor
				height="100%"
				language={
					state.languages[`${state.openSnippet.file.split('.')[1]}`]
				}
				value={content}
				options={options}
				editorDidMount={handleEditorDidMount}
			/>
		</MainWrapper>
	)
}

export default Main
