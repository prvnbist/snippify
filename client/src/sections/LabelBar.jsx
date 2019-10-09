import React from 'react'
import styled from 'styled-components'

import { Context } from '../state/Context'
import Modal from '../components/Modal'

import { AddIcon, CloseIcon, TrashIcon } from '../assets/Icons'

const LabelBar = () => {
	const { state, dispatch } = React.useContext(Context)
	const [labelName, setLableName] = React.useState('')
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
			.then(() =>
				dispatch({
					type: 'DELETE_LABEL',
					payload: label
				})
			)
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
				Object.keys(state.labels).map(label => (
					<Panel key={label}>
						<PanelHeader onClick={() => openLabel(label)}>
							<span>{label}</span>
							<button onClick={e => deleteLabel(e, label)}>
								<TrashIcon size={16} color={'#909090'} />
							</button>
						</PanelHeader>
					</Panel>
				))
			) : (
				<EmptyState color={'#fff'}>
					<span>Create a Label</span>
				</EmptyState>
			)}
		</LabelBarWrapper>
	)
}

export default LabelBar

const LabelBarWrapper = styled.aside`
	background: #142e44;
	grid-area: label;
`

const SectionHeader = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	color: #fff;
	font-size: 12px;
	opacity: 0.7;
	text-transform: uppercase;
	font-weight: 400;
	letter-spacing: 1px;
	border-bottom: 1px solid #1f4565;
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
	color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
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
	:hover {
		background: rgba(0, 0, 0, 0.2);
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
