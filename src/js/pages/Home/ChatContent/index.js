import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import moment from 'moment';

import classes from './style.css';
import Avatar from 'components/Avatar';

@inject(stores => ({
    user: stores.home.user,
    messages: stores.home.messages,
    loading: stores.session.loading,
    showUserinfo: () => {
        stores.userinfo.toggle(stores.home.user);
    }
}))

@observer
export default class ChatContent extends Component {

    getMessageContent(message) {
        switch (message.MsgType) {
            case 1:
                return message.Content;
            case 3:
                let images = message.images;
                return `<img src="${images.src}">`;
            case 34:
                let voice = message.voice;
                return `
                    <div style="width: ${40 + 7 * message.VoiceLength / 1000}px" data-voice="${voice.src}">
                        <i class="icon-ion-android-volume-up"></i>
                    </div>
                `;
            case 47:
                let emoji = message.emoji;
                
                if (emoji) {
                    return `<img src="${emoji.cdnurl}"/>`;
                }

                return `<div class="${classes.invalidEmoji}"> 
                    <span>发送的是一个表情，请在客户端查看</sapn>
                </div>`
        }
    }

    renderMessages(list, from) {
        return list.map((e, index) => {
            return (
                <div className={clazz(classes.message, {
                    [classes.isme]: e.isme,
                    [classes.isText]: e.MsgType === 1,
                    [classes.isImage]: e.MsgType === 3,
                    [classes.isEmoji]: e.MsgType === 47,
                    [classes.isVoice]: e.MsgType === 34
                })} key={index}>
                    <div>   
                        <Avatar src={e.isme ? e.HeadImgUrl : from.HeadImgUrl} className={classes.avatar} onClick={e => this.props.showUserinfo()} />
                        <div className={classes.content}>
                            <p dangerouslySetInnerHTML={{__html: this.getMessageContent(e)}} />

                            <span className={classes.times}>{ moment(e.CreateTime * 1000).fromNow() }</span>
                        </div>
                    </div>
                </div>

            );
        });
    }

    componentDidMount() {
        let viewport = this.refs.viewport;

        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }

    render () {
        let { loading, user, messages } = this.props;

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
                <div className={classes.messages} ref='viewport'>
                    {
                        this.renderMessages(messages[user.UserName], user)
                    }
                </div>
            </div>
        )
    }
}