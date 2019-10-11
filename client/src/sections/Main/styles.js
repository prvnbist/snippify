import styled from 'styled-components'

const MainWrapper = styled.main`
	display: flex;
	flex-direction: column;
	grid-area: main;
`

const SectionHeader = styled.div`
	height: 64px;
	padding: 0 16px;
	color: #634a4a;
	font-size: 16px;
	font-weight: 400;
	border-bottom: 1px solid #e1e1e1;
	display: grid;
	grid-template-columns: 1fr 60px 40px;
	grid-column-gap: 12px;
	align-items: center;
`

const FileName = styled.div`
	display: grid;
	grid-template-columns: 40px 1fr;
	input {
		height: 40px;
		background: ${props => (props.isFileNameEditable ? '#fff' : '#ecfeff')};
		border: 1px solid #c6f4f6;
		border-left: none;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		padding-left: 12px;
	}
	button {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`

const EditorModeSelector = styled.div`
	button {
		width: 60px;
		height: 40px;
		cursor: pointer;
		border-radius: 6px;
		color: ${props => (props.editable ? '#fff' : '#5e4f4f')};
		background: ${props => (props.editable ? '#08AC98' : '#ecfeff')};
		border: ${props => (props.editable ? 'none' : '1px solid #c6f4f6')};
	}
`

const TextBtn = styled.button``

const IconBtn = styled.button`
	height: 40px;
	width: 40px;
	background: #ecfeff;
	border: 1px solid #c6f4f6;
	border-radius: 6px;
	cursor: pointer;
`

const EmptyState = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${props => props.color};
`

export {
	MainWrapper,
	SectionHeader,
	FileName,
	EditorModeSelector,
	TextBtn,
	IconBtn,
	EmptyState
}
