
import React, { Component } from 'react';

import classes from './style.css';

export default class Placeholder extends Component {
    render() {
        return (
            <div className={classes.settings}>
                <a className={classes.button} href="mailto:chenjinxinlove@gmail.com?Subject=微信%20Feedback" target="_blank">
                    发送反馈
                    <i className="icon-ion-ios-email-outline" />
                </a>

                <a className={classes.button} href="https://github.com/chenjinxinlove" target="_blank">
                    Github
                    <i className="icon-ion-social-github" />
                </a>
            </div>
        );
    }
}
