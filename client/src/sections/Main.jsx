import React from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'

import mime from 'mime-types'

import { Context } from '../state/Context'

import { EditIcon, TrashIcon, SaveIcon } from '../assets/Icons'

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
				`/file?folder=${state.openSnippet.folder}&file=${state.openSnippet.file}`
			)
				.then(res => res.json())
				.then(({ file }) => setContent(file))
				.catch(err => console.log(err))
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
		if (content !== editorRef.current.getValue()) {
			fetch('/file', {
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
		const URL = `/file?folder=${state.openSnippet.folder}&file=${state.openSnippet.file}`
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
			fetch('/renameSnippet', {
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
	if (fileName === '') return <MainWrapper>Select a file</MainWrapper>
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

const MainWrapper = styled.main`
	display: flex;
	flex-direction: column;
	grid-area: main;
`

const SectionHeader = styled.div`
	height: 64px;
	padding: 0 16px;
	color: #634a4a;
	font-size: 16px;
	font-weight: 400;
	border-bottom: 1px solid #e1e1e1;
	display: grid;
	grid-template-columns: 1fr 60px 40px;
	grid-column-gap: 12px;
	align-items: center;
`

const FileName = styled.div`
	display: grid;
	grid-template-columns: 40px 1fr;
	input {
		height: 40px;
		background: ${props => (props.isFileNameEditable ? '#fff' : '#ecfeff')};
		border: 1px solid #c6f4f6;
		border-left: none;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		padding-left: 12px;
	}
	button {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`

const EditorModeSelector = styled.div`
	button {
		width: 60px;
		height: 40px;
		cursor: pointer;
		border-radius: 6px;
		color: ${props => (props.editable ? '#fff' : '#5e4f4f')};
		background: ${props => (props.editable ? '#08AC98' : '#ecfeff')};
		border: ${props => (props.editable ? 'none' : '1px solid #c6f4f6')};
	}
`

const TextBtn = styled.button``

const IconBtn = styled.button`
	height: 40px;
	width: 40px;
	background: #ecfeff;
	border: 1px solid #c6f4f6;
	border-radius: 6px;
	cursor: pointer;
`
