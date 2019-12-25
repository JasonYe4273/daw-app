import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import store, { browserHistory } from './redux/store.js';

import AppRouter from './AppRouter.js';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedRouter history={browserHistory}>
					<div>
						<Route path="/" component={AppRouter}/>
					</div>
				</ConnectedRouter>
			</Provider>
		);
	}
}

export default App;