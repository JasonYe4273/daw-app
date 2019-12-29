import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { push } from 'connected-react-router';

import EditAccount from './EditAccount.jsx';
import AccountSettings from './AccountSettings.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import CreateAccount from './CreateAccount.jsx';

const style = {
	content: {
		height: '100%',
		paddingTop: 64,
		textAlight: 'center'
	}
};

@connect(state => ({
	inSession: state.inSession
}), {
	push
})
class LoggedInRoute extends React.Component {
	componentDidMount() {
		if (this.props.inSession === 0) {
			this.props.push('/');
		}
	}

	render() {
		return (
			<Route path={this.props.path} component={this.props.component} />
		);
	}
}

@connect(state => ({
	inSession: state.inSession
}), {
	push
})
class LoggedOutRoute extends React.Component {
	componentDidMount() {
		if (this.props.inSession === 1) {
			this.props.push('/home');
		}
	}

	render() {
		return (
			<Route path={this.props.path} component={this.props.component} />
		);
	}
}

class AccountRouter extends React.Component {
	render() {
		return (
			<Switch>
				<Route path="/account/edit" component={EditAccount}/>
				<Route path="/account/settings" component={AccountSettings}/>
			</Switch>
		);
	}
}

class LoggedInRouter extends React.Component {
	render() {
	 	return (
	 		<div>
				<Switch>
					<Route path="/home" component={Home}/>
					<Route path="/account" component={AccountRouter}/>
				</Switch>
			</div>
		);
	}
}

export default class AppRouter extends React.Component {
	render() {
		return (
			<div style={style.content}>
				<Switch>
					<LoggedOutRoute exact path="/" component={Login}/>
					<LoggedOutRoute path="/createAccount" component={CreateAccount}/>
					<LoggedInRoute path="/" component={LoggedInRouter}/>
				</Switch>
			</div>
		)
	}
}