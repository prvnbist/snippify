import React from 'react'
import styled from 'styled-components'

import { Context } from '../state/Context'

const NavBar = () => {
	const { dispatch } = React.useContext(Context)
	const [files, setFiles] = React.useState({})
	const [isLoading, setIsLoading] = React.useState(true)
	React.useEffect(() => {
		fetch('/files')
			.then(res => res.json())
			.then(({ files }) => {
				setFiles(files)
				setIsLoading(isLoading => !isLoading)
			})
			.catch(err => console.log(err))
	}, [])

	if (isLoading) return <div>Loading...</div>
	return (
		<NavWrapper>
			{Object.keys(files).map(fileType => (
				<Panel key={fileType}>
					<PanelHeader>{fileType}</PanelHeader>
					<List>
						{files[fileType].map(fileName => (
							<ListItem
								key={fileName}
								onClick={() =>
									dispatch({
										type: 'OPEN_SNIPPET',
										payload: `${fileType}/${fileName}`
									})
								}>
								{fileName}
							</ListItem>
						))}
					</List>
				</Panel>
			))}
		</NavWrapper>
	)
}

export default NavBar

const NavWrapper = styled.nav`
	border-right: 1px solid #000;
`

const Panel = styled.div``
const PanelHeader = styled.header`
	height: 32px;
	line-height: 32px;
	padding-left: 12px;
	font-weight: 500;
	font-size: 14px;
	text-transform: uppercase;
`
const List = styled.ul``
const ListItem = styled.li`
	height: 28px;
	line-height: 28px;
	padding-left: 18px;
	font-size: 14px;
	color: #777d82;
	cursor: pointer;
	:hover {
		background: #efefef;
	}
`
