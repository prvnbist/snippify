import React from 'react'

import { Context } from '../../state/Context'
import Modal from '../../components/Modal'

import { AddIcon, CloseIcon, TrashIcon } from '../../assets/Icons'

import {
	LabelBarWrapper,
	SectionHeader,
	ListItem,
	LabelInput,
	ButtonGroup,
	EmptyState,
	Search
} from './styles'

const LabelBar = () => {
	const { state, dispatch } = React.useContext(Context)
	const [labelName, setLableName] = React.useState('')
	const [searchText, setSearchText] = React.useState('')
	const [isModalVisible, setIsModalVisible] = React.useState(false)

	const openLabel = label =>
		dispatch({
			type: 'OPEN_LABEL',
			payload: label
		})

	const createLabel = () => {
		if (labelName !== '') {
			fetch(`/label/create?folder=${labelName}`, {
				method: 'POST'
			})
				.then(response => response.json())
				.then(result => {
					setIsModalVisible(!isModalVisible)
					dispatch({
						type: 'ADD_LABEL',
						payload: labelName
					})
					setLableName('')
				})
				.catch(console.log)
		}
	}

	const deleteLabel = (e, label) => {
		e.stopPropagation()
		fetch(`/label/delete?folder=${label}`, {
			method: 'DELETE'
		})
			.then(res => res.json())
			.then(() => {
				dispatch({
					type: 'DELETE_LABEL',
					payload: label
				})
				dispatch({
					type: 'CLOSE_SNIPPET'
				})
			})
			.catch(err => console.log(err))
	}
	return (
		<LabelBarWrapper>
			{isModalVisible && (
				<Modal>
					<Modal.Header>
						<span>Add Label</span>
						<button
							onClick={() => setIsModalVisible(!isModalVisible)}>
							<CloseIcon size={16} color={'#909090'} />
						</button>
					</Modal.Header>
					<Modal.Body>
						<LabelInput
							type="text"
							value={labelName}
							onChange={e => setLableName(e.target.value)}
							placeholder="Enter the label name"
						/>
						<ButtonGroup>
							<button onClick={() => createLabel()}>Save</button>
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
				<span>labels</span>
				<button onClick={() => setIsModalVisible(!isModalVisible)}>
					<AddIcon size={16} color={'#909090'} />
				</button>
			</SectionHeader>
			{Object.keys(state.labels).length !== 0 ? (
				Object.keys(state.labels)
					.filter(label => label.toLowerCase().includes(searchText))
					.map(label => (
						<ListItem onClick={() => openLabel(label)} key={label}>
							<span>{label}</span>
							<button onClick={e => deleteLabel(e, label)}>
								<TrashIcon size={16} color={'#909090'} />
							</button>
						</ListItem>
					))
			) : (
				<EmptyState color={'#fff'}>
					<span>Create a Label</span>
				</EmptyState>
			)}
			{Object.keys(state.labels).length !== 0 && (
				<Search
					type="text"
					value={searchText}
					placeholder="Search labels"
					onChange={e => setSearchText(e.target.value.toLowerCase())}
				/>
			)}
		</LabelBarWrapper>
	)
}

export default LabelBar
