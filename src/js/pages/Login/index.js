
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import classes from './style.css';

@inject(stores => ({
    avatar: stores.session.avatar,
    code: stores.session.code,
    getCode: stores.session.getCode,
}))
@observer
export default class Login extends Component {
    componentWillMount() {
        this.props.getCode();
    }

    renderUser() {
        return (
            <div>
                {
                    <img src={this.props.avatar} />
                }

                <p>扫描成功</p>
                <p>确认登录移动微信</p>
            </div>
        );
    }

    renderCode() {
        var { code } = this.props;

        return (
            <div>
                {
                    code && (<img src={`https://login.weixin.qq.com/qrcode/${code}`} />)
                }

                <p>登录微信扫描</p>
                <p>登录手机在Web上使用微信</p>
            </div>
        );
    }

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.inner}>
                    {
                        this.props.avatar ? this.renderUser() : this.renderCode()
                    }
                </div>
            </div>
        );
    }
}
