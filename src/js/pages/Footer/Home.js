
import React, { Component } from 'react';

import classes from './style.css';

export default class Input extends Component {
    render() {
        return (
            <div className={classes.home}>
                <input type="text" placeholder="发送消息" />

                <div className={classes.action}>
                    <i className="icon-ion-ios-mic" />
                    <i className="icon-ion-android-attach" />
                    <i className="icon-ion-ios-heart" />
                </div>
            </div>
        );
    }
}
