import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import classes from './style';
import default from '../../../../config/webpack.config.dev';

@inject(stores => ({
    avatar: stores.session.avatar,
    code: stores.session.code,
    getCode: stores.session.getCode
}))

@observer
export default class Login extends Component {
    componentWillMount () {
        this.props.getCode();
    }

    renderUser () {
        return (
            <div>
                {
                    <img src={this.props.avatar}/>
                }
                <p>扫码成功</p>
                <p>请在手机上确认扫码</p>
            </div>
        )
    }

    renderCode () {
        let {code} = this.props;

        return (
            <div>
                {
                    code && (<img src={`https://login.weixin.qq.com/qrcode/${code}`}/>)
                }
                <p>扫码登录在微信</p>
                <p></p>
            </div>
        )
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
        )
    }
}