import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';

import classes from './style.css';

@inject(stores => ({
    user: stores.home.user,
    loading: stores.session.loading
}))

@observer
export default class ChatContent extends Component {
    render () {
        let { loading, user } = this.props;

        if( loading ) return false;

        if(!user) {
            return (
                <div className={clazz(classes.container, classes.notfound)}>
                    <div className={classes.inner}>
                        <img src='assets/images/noselected.png'/>
                        <h1>没有聊天窗口被选择</h1>
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.container}>
                <header>
                    <div className={classes.info}>
                        <p dangerouslySetInnerHTML={{__html: user.RemarkName || user.NickName}}/>

                        <span dangerouslySetInnerHTML={{__html: user.Signature || '没有签名'}}/>

                        <i className='icon-ion-android-more-vertical' />
                    </div>
                </header>
            </div>
        )
    }
}