
import { observable, action } from 'mobx';
import axios from 'axios';

import storage from 'utils/storage';
import contacts from './contacts';
import session from './session';

function unique(arr) {
    return [... new Set([...arr])]
}

async function resolveMessage(message) {
    var auth = await storage.get('auth');

    switch (message.MsgType) {
        case 3:
            let string = message.Content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            let matchs = string.match(/(\w+)="([^\s]+)"/g);
            let images = {};

            matchs.map(e => {
                var kv = e.replace(/"/g, '').split('=');

                images[kv[0]] = kv[1];
            });

            images.src = `${axios.defaults.baseURL}/cgi-bin/mmwebwx-bin/webwxgetmsgimg?&MsgID=${message.MsgId}&skey=${auth.skey}`.replace(/\/+/g, '/');
            message.images = images;
            return message;
    }
}

class Home {
    @observable chats = [];
    @observable messages = []
    @observable user = false;

    users;

    async getUsers() {
        if(self.users) {
            return self.users;
        }

        self.users = await contacts.getList();

        return self.users;
    }

    @action async loadChats(chatSet) {
        let list = await self.getUsers();
        let res = [];

        unique(chatSet.split(',')).map(e => {
            let user = list.find(user => user.UserName === e);

            if (user) {
                res.push(user);
            }
        });

        self.chats.replace(res);

        res.map(e => {
            self.messages[e.UserName] = [];
        })
        return res;
    }

    @action chatTo(user) {
        self.user = user;
        self.markedRead(user.UserName);
    }

    @action async addMessage(message) {
        let from = message.FromUserName;
        let messages = Object.assign({}, self.messages);
        let list = messages[from];

        if (list) {
            if(!list.find(e => e.NewMsgId === message.NewMsgId)) {
                message = await resolveMessage(message);
                list.push(message);
            } else {
                let user = self.users[from];

                if (user) {
                    self.chats.shift(user);
                    list = messages[from] = [message];
                }
            }
        }

        if (self.user.UserName === from ) {
            list.unread = list.length;
        } else {
            list.unread = 0;
        }

        self.messages = messages;
    }

    @action async sendMessage(content) {
        let id = (+new Date() * 1000) + Math.random().toString().substr(2, 4);
        let auth = await storage.get('auth');
        let from = session.user.User.UserName;
        let to = self.user.UserName;
        let response = await axios.post(`/cgi-bin/mmwebwx-bin/webwxsendmsg`, {
            BaseRequest: {
                Sid: auth.wxsid,
                Uin: auth.wxuin,
                Skey: auth.skey
            },
            Msg: {
                Content: content,
                FromUserName: from,
                ToUserName: to,
                ClientMsgId: id,
                LocalID: id,
                Type: 1
            },
            Scene: 0
        });

        if (+response.data.BaseResponse.Ret === 0) {
            let messages = Object.assign({}, self.messages);

            messages[to].push({
                isme: true,
                Content: content,
                MsgType: 1,
                CreateTime: +new Date() / 1000,
                HeadImgUrl: `${axios.defaults.baseURL}${session.user.User.HeadImgUrl}`.replace(/\/+/g, '/')
            });

            self.markedRead(to);
        } else {
            console.error('Failed to send message:', response.data);
        }

        return +response.data.BaseResponse.Ret === 0;
    }

    @action markedRead(userid) {
        var messages = Object.assign({}, self.messages);
        var list = messages[userid];

        if (list) {
            list.unread = list.length;
            self.messages = messages;
        } else {
            // Init the message queue
            self.messages[userid] = [];
        }
    }
}

const self = new Home();
export default self;