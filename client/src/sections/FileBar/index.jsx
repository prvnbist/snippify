import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import actions from '../../state/actions/creators'

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
	const dispatch = useDispatch()
	const state = useSelector(state => state)
	const [snippetName, setSnippetName] = React.useState('')
	const [searchText, setSearchText] = React.useState('')
	const [isModalVisible, setIsModalVisible] = React.useState(false)

	const createSnippet = () => {
		if (snippetName !== '') {
			dispatch(actions.createSnippet(snippetName)).then(() => {
				setIsModalVisible(!isModalVisible)
				setSnippetName('')
			})
		}
	}
	if (state.label === '')
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
				<span>{state.label}</span>
				<button onClick={() => setIsModalVisible(!isModalVisible)}>
					<AddIcon size={16} color={'#909090'} />
				</button>
			</SectionHeader>
			{state.files !== [] &&
				state.files
					.filter(file => file.toLowerCase().includes(searchText))
					.map(file => (
						<ListItem
							onClick={() =>
								dispatch({
									type: 'OPEN_SNIPPET',
									payload: file
								})
							}
							key={file}>
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
