import React from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'

import { Context } from '../state/Context'

import { EditIcon, TrashIcon, SaveIcon, ViewIcon } from '../assets/Icons'

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
		const file = new File([editorRef.current.getValue()], 'index.js', {
			type: 'application/javascript'
		})
		const formData = new FormData()
		formData.append('file', file)
		fetch('/file', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(success => console.log(success))
			.catch(error => console.log(error))
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

	const viewMode = () => {
		setIsContentEditable(false)
	}
	const editMode = () => {
		setIsContentEditable(true)
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
				<EditorModeSelector isContentEditable={isContentEditable}>
					<IconBtn onClick={() => viewMode()}>
						<ViewIcon
							size={16}
							color={isContentEditable ? '#26ACB4' : '#fff'}
						/>
					</IconBtn>
					<IconBtn onClick={() => editMode()}>
						<EditIcon
							size={16}
							color={isContentEditable ? '#fff' : '#26ACB4'}
						/>
					</IconBtn>
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
	grid-template-columns: 1fr 80px 40px;
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
		:first-child {
			background: ${({ isContentEditable }) =>
				isContentEditable ? '#ecfeff' : '#08AC98'};
			border-top-left-radius: 6px;
			border-bottom-left-radius: 6px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			border-right: none;
		}
		:last-child {
			background: ${({ isContentEditable }) =>
				isContentEditable ? '#08AC98' : '#ecfeff'};
			border-top-right-radius: 6px;
			border-bottom-right-radius: 6px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`

const IconBtn = styled.button`
	height: 40px;
	width: 40px;
	background: #ecfeff;
	border: 1px solid #c6f4f6;
	border-radius: 6px;
	cursor: pointer;
`
