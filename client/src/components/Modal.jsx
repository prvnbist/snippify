import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const modalContainer = document.getElementById('modal__wrapper')

const Header = ({ children }) => {
	return <header>{children}</header>
}

const Body = ({ children }) => {
	return <main>{children}</main>
}

class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.el = document.createElement('div')
	}
	static Header = Header
	static Body = Body
	componentDidMount() {
		modalContainer.appendChild(this.el)
	}
	componentWillUnmount() {
		modalContainer.removeChild(this.el)
	}
	render() {
		return ReactDOM.createPortal(
			<ModalWrapper>
				<ModalCard id="modal__card">{this.props.children}</ModalCard>
			</ModalWrapper>,
			this.el
		)
	}
}

export default Modal

const ModalWrapper = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	z-index: 100;
	background: rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
`

const ModalCard = styled.div`
	height: 200px;
	width: 480px;
	background: #fff;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	header {
		height: 32px;
		display: flex;
		padding: 0 12px;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e1e1e1;
		button {
			width: 24px;
			height: 24px;
			border: none;
			display: flex;
			color: #5e4f4f;
			cursor: pointer;
			align-items: center;
			justify-content: center;
			background: transparent;
		}
	}
	main {
		padding: 12px;
	}
`
