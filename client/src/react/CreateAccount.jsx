import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Button, Dialog, DialogTitle, DialogContent, TextField } from '@material-ui/core';

import { createAccount } from '../redux/actions/session.js';

@connect(null, dispatch => ({
	createAccount: (username, email, password) => {
		dispatch(createAccount(username, email, password));
	},
	pushToLogin: () => {
		dispatch(push('/'));
	}
}))
export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			password: '',
			passwordConfirm: ''
		}
	}

	_onUsernameChanged = event => {
		this.setState({
			username: event.target.value
		});
	}

	_onEmailChanged = event => {
		this.setState({
			email: event.target.value
		});
	}

	_onPasswordChanged = event => {
		this.setState({
			password: event.target.value
		});
	}

	_onPasswordConfirmChanged = event => {
		this.setState({
			passwordConfirm: event.target.value
		});
	}

	_createAccount = event => {
		this.props.createAccount(this.state.username, this.state.email, this.state.password);
		event.preventDefault();
	};
	
	render() {
		return (
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
				<h1>Create An Account</h1>
				<form
					noValidate
					onSubmit={this._createAccount}
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
						id="email"
						name="email"
						label="email"
						value={this.state.email}
						onChange={this._onEmailChanged}
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
					<TextField
						required
						fullWidth
						id="passwordConfirm"
						name="passwordConfirm"
						label="Confirm Password"
						type="password"
						value={this.state.passwordConfirm}
						onChange={this._onPasswordConfirmChanged}
						style={{margin:'10px'}}
					/>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						type="submit"
						style={{margin:'10px'}}
					>
						Create Account
					</Button>
					<p>Already have an account?</p>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						type="button"
						onClick={this.props.pushToLogin}
						style={{margin:'10px'}}
					>
						Go to Login
					</Button>
				</form>
			</div>
		);
	}
}

