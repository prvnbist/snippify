import React from 'react'
import styled from 'styled-components'

import { Context } from '../state/Context'

import { AddIcon } from '../assets/Icons'

const FileBar = () => {
	const { state, dispatch } = React.useContext(Context)

	const createSnippet = () => {}
	const openSnippet = file =>
		dispatch({
			type: 'OPEN_SNIPPET',
			payload: {
				folder: state.openLabel,
				file: file
			}
		})

	return (
		<FileBarWrapper>
			<SectionHeader>
				<span>{state.openLabel}</span>
				<button onClick={() => createSnippet()}>
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
