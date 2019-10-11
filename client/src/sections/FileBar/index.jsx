import React from 'react'
import mime from 'mime-types'

import { Context } from '../../state/Context'
import Modal from '../../components/Modal'

import { AddIcon, CloseIcon } from '../../assets/Icons'

import {
	FileBarWrapper,
	SectionHeader,
	ListItem,
	LabelInput,
	ButtonGroup,
	EmptyState,
	Search
} from './styles'

const FileBar = () => {
	const { state, dispatch } = React.useContext(Context)
	const [snippetName, setSnippetName] = React.useState('')
	const [searchText, setSearchText] = React.useState('')
	const [isModalVisible, setIsModalVisible] = React.useState(false)

	const openSnippet = file =>
		dispatch({
			type: 'OPEN_SNIPPET',
			payload: {
				folder: state.openLabel,
				file: file
			}
		})

	const createSnippet = () => {
		if (snippetName !== '') {
			const file = new File([' '], snippetName, {
				type: mime.lookup(snippetName)
			})
			const formData = new FormData()
			formData.append('file', file)
			formData.append('folder', state.openLabel)
			fetch('/snippet/save', {
				method: 'POST',
				body: formData
			})
				.then(response => response.json())
				.then(() => {
					setIsModalVisible(!isModalVisible)
					dispatch({
						type: 'ADD_SNIPPET',
						payload: {
							folder: state.openLabel,
							file: snippetName
						}
					})
					setSnippetName('')
				})
				.catch(error => console.log(error))
		}
	}
	if (state.openLabel === '')
		return (
			<FileBarWrapper>
				<EmptyState>
					<span>Select a Label</span>
				</EmptyState>
			</FileBarWrapper>
		)
	return (
		<FileBarWrapper>
			{isModalVisible && (
				<Modal>
					<Modal.Header>
						<span>Add Snippet</span>
						<button
							onClick={() => setIsModalVisible(!isModalVisible)}>
							<CloseIcon size={16} color={'#909090'} />
						</button>
					</Modal.Header>
					<Modal.Body>
						<LabelInput
							type="text"
							value={snippetName}
							onChange={e => setSnippetName(e.target.value)}
							placeholder="Enter the snippet name"
						/>
						<ButtonGroup>
							<button onClick={() => createSnippet()}>
								Save
							</button>
							<button
								onClick={() =>
									setIsModalVisible(!isModalVisible)
								}>
								Cancel
							</button>
						</ButtonGroup>
					</Modal.Body>
				</Modal>
			)}
			<SectionHeader>
				<span>{state.openLabel}</span>
				<button onClick={() => setIsModalVisible(!isModalVisible)}>
					<AddIcon size={16} color={'#909090'} />
				</button>
			</SectionHeader>
			{state.files !== [] &&
				state.files
					.filter(label => label.toLowerCase().includes(searchText))
					.map(file => (
						<ListItem onClick={() => openSnippet(file)} key={file}>
							<span>{file}</span>
						</ListItem>
					))}
			{state.files !== [] && (
				<Search
					type="text"
					value={searchText}
					placeholder="Search snippets"
					onChange={e => setSearchText(e.target.value.toLowerCase())}
				/>
			)}
		</FileBarWrapper>
	)
}

export default FileBar
