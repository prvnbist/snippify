import React from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'

import { Context } from '../state/Context'

import { EditIcon } from '../assets/Icons'

const Main = () => {
	const editorRef = React.useRef()
	const { state } = React.useContext(Context)
	const [content, setContent] = React.useState(null)

	React.useEffect(() => {
		if (state.openSnippet.folder !== '') {
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

	const options = {
		readOnly: true,
		minimap: {
			enabled: false
		}
	}
	if (state.openSnippet.folder === '')
		return <MainWrapper>Select a file</MainWrapper>
	return (
		<MainWrapper>
			<SectionHeader>
				<span>{state.openSnippet.file}</span>
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
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	color: #634a4a;
	font-size: 16px;
	font-weight: 400;
	border-bottom: 1px solid #e1e1e1;
`
