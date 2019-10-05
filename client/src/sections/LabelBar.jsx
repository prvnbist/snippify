import React from 'react'
import styled from 'styled-components'

import { Context } from '../state/Context'

import { AddIcon } from '../assets/Icons'

const LabelBar = () => {
	const { state, dispatch } = React.useContext(Context)

	const createLabel = () => {}
	const openLabel = label =>
		dispatch({
			type: 'OPEN_LABEL',
			payload: label
		})

	return (
		<LabelBarWrapper>
			<SectionHeader>
				<span>labels</span>
				<button onClick={() => createLabel()}>
					<AddIcon size={16} color={'#909090'} />
				</button>
			</SectionHeader>
			{Object.keys(state.labels).map(label => (
				<Panel key={label}>
					<PanelHeader onClick={() => openLabel(label)}>
						<span>{label}</span>
					</PanelHeader>
				</Panel>
			))}
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
	:hover {
		background: rgba(0, 0, 0, 0.2);
	}
`
