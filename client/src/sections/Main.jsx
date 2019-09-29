import React from 'react'
import styled from 'styled-components'

import { Context } from '../state/Context'

const Main = () => {
	const { state } = React.useContext(Context)
	const [file, setFile] = React.useState(null)
	React.useEffect(() => {
		if (state.selectedSnippet !== '') {
			fetch(
				`/file?type=${state.selectedSnippet.split('/')[0]}&name=${
					state.selectedSnippet.split('/')[1]
				}`
			)
				.then(res => res.json())
				.then(({ file }) => console.log(file) || setFile(file))
				.catch(err => console.log(err))
		}
	}, [state.selectedSnippet])
	if (file === null) return <div>Select a file</div>
	return (
		<MainWrapper>
			<pre>
				<code>{file}</code>
			</pre>
		</MainWrapper>
	)
}

export default Main

const MainWrapper = styled.main``
