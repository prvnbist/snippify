import styled from 'styled-components'

const FileBarWrapper = styled.aside`
	background: #f9ffff;
	grid-area: file;
	border-right: 1px solid #e1e1e1;
	position: relative;
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

const ListItem = styled.div`
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

const Search = styled.input`
	left: 12px;
	color: #000;
	bottom: 12px;
	height: 32px;
	border: none;
	position: absolute;
	padding-left: 12px;
	border-radius: 4px;
	width: calc(100% - 24px);
	background: #f1f1f1;
`

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	input,
	select {
		flex: 1;
		height: 40px;
		background: #fff;
		border: 1px solid #c6f4f6;
		border-radius: 6px;
		padding-left: 12px;
	}
	select {
		margin-left: 16px;
	}
`

export {
	FileBarWrapper,
	SectionHeader,
	ListItem,
	ButtonGroup,
	EmptyState,
	Search,
	InputWrapper
}
