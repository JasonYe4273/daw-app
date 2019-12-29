import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Button, Dialog, DialogTitle, DialogContent, TextField } from '@material-ui/core';

import { login } from '../redux/actions/session.js';

@connect(null, dispatch => ({
	login: (username, password) => {
		dispatch(login(username, password));
	},
	pushToCreateAccount: () => {
		dispatch(push('/createAccount'));
	}
}))
export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		}
	}

	_onUsernameChanged = event => {
		this.setState({
			username: event.target.value
		});
	}

	_onPasswordChanged = event => {
		this.setState({
			password: event.target.value
		});
	}

	_login = event => {
		this.props.login(this.state.username, this.state.password);
		event.preventDefault();
	};
	
	render() {
		return (
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
				<h1>Dead Action Worm Login</h1>
				<form
					noValidate
					onSubmit={this._login}
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						width: '200px'
					}}
				>
					<TextField
						autoFocus
						required
						fullWidth
						id="username"
						name="username"
						label="Username"
						value={this.state.username}
						onChange={this._onUsernameChanged}
						style={{margin:'10px'}}
					/>
					<TextField
						required
						fullWidth
						id="password"
						name="password"
						label="Password"
						type="password"
            			autoComplete="current-password"
						value={this.state.password}
						onChange={this._onPasswordChanged}
						style={{margin:'10px'}}
					/>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						type="submit"
						style={{margin:'10px'}}
					>
						Login
					</Button>
					<p>Don't have an account?</p>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						type="button"
						onClick={this.props.pushToCreateAccount}
						style={{margin:'10px'}}
					>
						Create one!
					</Button>
				</form>
			</div>
		);
	}
}

