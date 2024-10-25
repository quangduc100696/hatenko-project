import React, { useCallback, useEffect, useState } from 'react';
import jwtService from 'utils/jwtService';
import { useStore } from "DataContext";
import { ACTIONS } from 'configs';

const log = (value) => console.log('[auth.Auth] ', value);
const Auth = (props) => {

	const [ state, setState ] = useState({ waitAuthCheck: true })
	const { dispatch } = useStore();

	const logout = useCallback(() => {
		log('====== Logout ACTIONS.REMOVE_USER =====')
		dispatch({ type: ACTIONS.REMOVE_USER });
	}, [dispatch]);

	useEffect(() => {
		const jwtCheck = () => new Promise(resolve => {
			jwtService.on('onAutoLogin', async () => {
				resolve(jwtService.signInWithToken())
			});
	
			jwtService.on('onAutoLogout', (message) => {
				logout();
				resolve();
			});
	
			jwtService.on('onNoAccessToken', () => {
				resolve();
			});
	
			jwtService.init();
			return Promise.resolve();
		});
		jwtCheck().then(() => setState({waitAuthCheck: false}));
	}, [logout]);
	
	return state.waitAuthCheck ? null : <React.Fragment children={props.children}/>;
}

export default Auth;
