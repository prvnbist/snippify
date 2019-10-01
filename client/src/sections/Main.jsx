import React from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'

import { Context } from '../state/Context'

const Main = () => {
	const editorRef = React.useRef()
	const { state } = React.useContext(Context)
	const [editMode, setEditMode] = React.useState(true)
	const [fileName] = React.useState(state.selectedSnippet.split('/')[1])
	const [file, setFile] = React.useState(null)
	React.useEffect(() => {
		if (state.selectedSnippet !== '') {
			fetch(
				`/file?type=${state.selectedSnippet.split('/')[0]}&name=${
					state.selectedSnippet.split('/')[1]
				}`
			)
				.then(res => res.json())
				.then(({ file }) => setFile(file))
				.catch(err => console.log(err))
		}
	}, [state.selectedSnippet])

	function handleEditorDidMount(_, editor) {
		editorRef.current = editor
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
