import React from 'react'
import Editor from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../state/actions/creators'

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
	const dispatch = useDispatch()
	const state = useSelector(state => state)
	const [content, setContent] = React.useState(null)
	const [fileName, setFileName] = React.useState('')
	const [isContentEditable, setIsContentEditable] = React.useState(false)
	const [isFileNameEditable, setIsFileNameEditable] = React.useState(false)

	React.useEffect(() => {
		if (state.snippet) {
			dispatch(actions.openSnippet(state.snippet)).then(file => {
				setFileName(state.snippet)
				setContent(file)
			})
		} else {
			setFileName('')
		}
	}, [state.snippet, dispatch])

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
	}

	const saveSnippet = () => {
		setIsContentEditable(isContentEditable => !isContentEditable)
		dispatch(actions.saveSnippet(editorRef.current.getValue())).then(
			result => console.log(result)
		)
	}

	const editName = () => {
		setIsFileNameEditable(isFileNameEditable => !isFileNameEditable)
	}

	const deleteSnippet = () => {
		setFileName('')
		dispatch(actions.deleteSnippet())
	}

	const renameSnippet = () => {
		setIsFileNameEditable(isFileNameEditable => !isFileNameEditable)
		if (state.snippet !== fileName) {
			dispatch(actions.renameSnippet(fileName))
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
						<IconBtn onClick={() => renameSnippet()}>
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
				language={state.languages[`${state.snippet.split('.')[1]}`]}
				value={content}
				options={options}
				editorDidMount={handleEditorDidMount}
			/>
		</MainWrapper>
	)
}

export default Main
