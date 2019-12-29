import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { verifySession } from '../redux/actions/session.js';

import AppRouter from './AppRouter.jsx';
//import AppBar from './AppBar.jsx';

import Loading from './Loading.jsx';
import Success from './Success.jsx';

@connect(state => ({
	inSession: state.inSession
}), {
	verifySession
})
export default class App extends React.Component {
	componentDidMount() {
		if (this.props.inSession === -1) {
			this.props.verifySession(true);
		}
	}
	
	render() {
		return (this.props.inSession === -1 ? (
			<div>
				<Loading />
				<Success />
			</div>
		) : (
			<div>
				<Loading />
				<Success />
				
				{/*<AppBar />*/}
				<AppRouter/>
			</div>
		));
	}
}