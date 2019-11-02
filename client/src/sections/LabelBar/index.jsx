import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../state/actions/creators'

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
	const dispatch = useDispatch()
	const state = useSelector(state => state)
	const [labelName, setLableName] = React.useState('')
	const [searchText, setSearchText] = React.useState('')
	const [isModalVisible, setIsModalVisible] = React.useState(false)

	React.useEffect(() => {
		dispatch(actions.getLabels())
	}, [])

	const createLabel = () => {
		if (labelName !== '') {
			dispatch(actions.createLabel(labelName)).then(() => {
				setIsModalVisible(!isModalVisible)
				setLableName('')
			})
		}
	}

	const deleteLabel = (e, label) => {
		e.stopPropagation()
		dispatch(actions.deleteLabel(label))
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
			{state.labels.length !== 0 ? (
				state.labels
					.filter(label => label.toLowerCase().includes(searchText))
					.map(label => (
						<ListItem
							onClick={() => dispatch(actions.openLabel(label))}
							key={label}>
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
