import React from 'react';

import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import store, { browserHistory } from '../redux/store.js';

import App from './App.jsx';

class AppContainer extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedRouter history={browserHistory}>
					<div>
						<Route path="/" component={App}/>
					</div>
				</ConnectedRouter>
			</Provider>
		);
	}
}

export default AppContainer;