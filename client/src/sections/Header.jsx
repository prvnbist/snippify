import React from 'react'
import styled from 'styled-components'

import Logo from '../assets/Logo'

const Header = () => (
	<HeaderWrapper>
		<Logo />
	</HeaderWrapper>
)

export default Header

const HeaderWrapper = styled.header`
	height: 48px;
	display: flex;
	align-items: center;
	padding: 0 16px;
	grid-area: head;
	border-bottom: 1px solid #bcbcbc;
`
