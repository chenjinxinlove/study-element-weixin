import React, { Component } from 'react';

import classes from './style.css';
import { action } from 'mobx';


export default class Input extends Component {
    render () {
        return (
            <div className={classes.input}>
                <input type='text' placeholder='键入要发送的...' />

                <div className={classes.action}>
                    <i className='icon-ion-ios-mic'/>
                    <i className='icon-ion-android-attach'/>
                    <i className='icon-ion-ios-heart'/>
                </div>
            </div>
        )
    }
}
