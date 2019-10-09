import React from 'react'
import styled from 'styled-components'
import mime from 'mime-types'

import { Context } from '../state/Context'
import Modal from '../components/Modal'

import { AddIcon, CloseIcon } from '../assets/Icons'

const FileBar = () => {
	const { state, dispatch } = React.useContext(Context)
	const [snippetName, setSnippetName] = React.useState('')
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
				state.files.map(file => (
					<Panel key={file}>
						<PanelHeader onClick={() => openSnippet(file)}>
							<span>{file}</span>
						</PanelHeader>
					</Panel>
				))}
		</FileBarWrapper>
	)
}

export default FileBar

const FileBarWrapper = styled.aside`
	background: #f9ffff;
	grid-area: file;
	border-right: 1px solid #e1e1e1;
`

const SectionHeader = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	color: #a28989;
	font-size: 12px;
	text-transform: uppercase;
	font-weight: 400;
	letter-spacing: 1px;
	border-bottom: 1px solid #e1e1e1;
	button {
		background: transparent;
		cursor: pointer;
		border: none;
		height: 16px;
		width: 16px;
		visibility: hidden;
	}
	:hover button {
		visibility: visible;
	}
`

const Panel = styled.div``
const PanelHeader = styled.header`
	height: 32px;
	padding: 0 16px;
	font-size: 14px;
	color: #5e4f4f;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	:hover {
		background: #d2ffff;
	}
`

const LabelInput = styled.input`
	width: 60%;
	height: 40px;
	background: #fff;
	border: 1px solid #c6f4f6;
	border-radius: 6px;
	padding-left: 12px;
`

const ButtonGroup = styled.div`
	margin-top: auto;
	justify-self: flex-end;
	button {
		color: #fff;
		border: none;
		height: 32px;
		padding: 0 12px;
		cursor: pointer;
		font-weight: 500;
		line-height: 32px;
		margin-right: 12px;
		border-radius: 4px;
		:first-child {
			background: #08ac98;
		}
		:last-child {
			background: red;
		}
	}
`

const EmptyState = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${props => props.color};
`
