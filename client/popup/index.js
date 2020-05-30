import React from 'react';
import ReactDOM from 'react-dom';
import * as browser from 'webextension-polyfill';
import './index.css';
import App from '../extension/app';

browser.runtime.sendMessage({ data: 'hello' });

ReactDOM.render(<App />, document.getElementById('root'));
