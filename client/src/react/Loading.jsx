import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { zIndex } from './zIndex.js';

const style = {
	dialog: {
		zIndex: zIndex.loading,
		textAlign: 'center'
	}
};

/**
 * @classdesc The loading dialog that pops up when fetching to the server
 */
@connect(state => ({
	fetching: state.fetching
}))
export default class Loading extends React.Component {
	constructor(props) {
		super(props);
	}
	
	static propTypes = {
		fetching: PropTypes.bool.isRequired		// Whether the client is currently fetching to the server
	};

	render = () => {
		return (
			<Dialog open={this.props.fetching} style={{zIndex: zIndex.loading, textAlign: 'center'}}>
				<DialogTitle style={{width: '300px'}}>Loading</DialogTitle>
				<DialogContent>
					<CircularProgress />
				</DialogContent>
			</Dialog>
		);
	}
};