import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'
import state from './state'

const composeEnhancers =
	(typeof window !== 'undefined' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose

const store = createStore(
	reducers,
	state,
	composeEnhancers(applyMiddleware(thunk))
)

export default store
