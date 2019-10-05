import React from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'

import { Context } from '../state/Context'

import { EditIcon } from '../assets/Icons'

const Main = () => {
	const editorRef = React.useRef()
	const { state } = React.useContext(Context)
	const [editMode, setEditMode] = React.useState(true)
	const [fileName, setFileName] = React.useState('')
	const [file, setFile] = React.useState(null)
	React.useEffect(() => {
		if (state.openSnippet !== '') {
			setFileName(state.openSnippet.split('/')[1])
			fetch(
				`/file?type=${state.openSnippet.split('/')[0]}&name=${
					state.openSnippet.split('/')[1]
				}`
			)
				.then(res => res.json())
				.then(({ file }) => setFile(file))
				.catch(err => console.log(err))
		} else if (state.newSnippet !== '') {
			setFileName(state.newSnippet.split('/')[1])
			setFile('')
		}
	}, [state.openSnippet, state.newSnippet])

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
	}

	const saveSnippet = () => {
		const file = new File([editorRef.current.getValue()], fileName, {
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

	const options = {
		readOnly: editMode,
		minimap: {
			enabled: false
		}
	}
	if (file === null) return <MainWrapper>Select a file</MainWrapper>
	return (
		<MainWrapper>
			<MainHeader>
				<span>{fileName}</span>
				{!editMode && (
					<SaveBtn onClick={() => saveSnippet()}>Save</SaveBtn>
				)}
				<Options>
					<button
						className={`${editMode ? '' : 'active'}`}
						onClick={() => setEditMode(editMode => !editMode)}>
						<EditIcon size={16} color={'#909090'} />
					</button>
				</Options>
			</MainHeader>
			<Editor
				height="100%"
				language="javascript"
				value={file}
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
`

const MainHeader = styled.header`
	height: 48px;
	padding: 0 16px;
	border-bottom: 1px solid #dedede;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Options = styled.div`
	width: 64px;
	height: 32px;
	line-height: 32px;
	button {
		height: 32px;
		width: 32px;
		line-height: 36px;
		cursor: pointer;
		border: 1px solid transparent;
		background: transparent;
		border-radius: 4px;
		:hover,
		&.active {
			border: 1px solid #909090;
		}
	}
`

const SaveBtn = styled.button`
	cursor: pointer;
	width: auto;
	padding: 0 12px;
	height: 32px;
	border: none;
	color: #fff;
	background: #28c328;
	border-radius: 4px;
`
