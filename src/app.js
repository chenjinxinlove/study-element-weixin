
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, hashHistory } from 'react-router';
import ElectronCookies from '@exponent/electron-cookies';

import './global.css';
import './assets/fonts/icomoon/style.css';
import 'utils/albumcolors';
import getRoutes from './js/routes';
import stores from './js/stores';

ElectronCookies.enable({
    origin: 'https://wx.qq.com',
});

stores.session.hasLogin(); 
stores.settings.init();

render(
    <Provider {...stores}>
        <Router history={hashHistory}>
            {getRoutes()}
        </Router>
    </Provider>,

    document.getElementById('root')
);
