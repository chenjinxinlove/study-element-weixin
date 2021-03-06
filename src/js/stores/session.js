
/* eslint-disable no-eval */

import axios from 'axios';
import { observable, action } from 'mobx';

import storage from 'utils/storage';
import home from './home';

class Session {
    @observable loading = false;
    @observable auth;
    @observable code;
    @observable avatar;
    @observable user;

    syncKey;

    genSyncKey(list) {
        return (self.syncKey = list.map(e => `${e.Key}_${e.Val}`).join('|'));
    }

    @action async getCode() {
        var response = await axios.get('https://login.wx.qq.com/jslogin?appid=wx782c26e4c19acffb&redirect_uri=https%3A%2F%2Fwx.qq.com%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxnewloginpage&fun=new&lang=en_US&_=1499075647264');
        var code = response.data.match(/[A-Za-z_\-\d]{10}==/)[0];

        self.code = code;
        self.check();
        return code;
    }

    @action async check() {
        var response = await axios.get('https://login.web.wechat.com/cgi-bin/mmwebwx-bin/login', {
            params: {
                loginicon: true,
                uuid: self.code,
                tip: 0,
                r: +new Date(),
            }
        });

        eval(response.data);

        switch (window.code) {
            case 200:
                let authAddress = window.redirect_uri;

                // Set your weChat network route, otherwise you will got a code '1102'
                axios.defaults.baseURL = authAddress.match(/^https:\/\/(.*?)\//)[0];

                delete window.redirect_uri;
                delete window.code;
                delete window.userAvatar;

                // Login success, create session
                let response = await axios.get(authAddress, {
                    params: {
                        fun: 'new',
                        version: 'v2',
                    }
                });
                let auth = {
                    baseURL: axios.defaults.baseURL,
                    skey: response.data.match(/<skey>(.*?)<\/skey>/)[1],
                    passTicket: response.data.match(/<pass_ticket>(.*?)<\/pass_ticket>/)[1],
                    wxsid: response.data.match(/<wxsid>(.*?)<\/wxsid>/)[1],
                    wxuin: response.data.match(/<wxuin>(.*?)<\/wxuin>/)[1],
                };

                self.auth = auth;
                await storage.set('auth', auth);
                await self.initUser();
                self.keepalive();
                break;

            case 201:
                // Confirm to login
                self.avatar = window.userAvatar;
                self.check();
                break;

            case 400:
                // QR Code has expired
                window.location.reload();
                return;

            default:
                // Continue call server and waite
                self.check();
        }
    }

    @action async initUser() {
        self.loading = true;

        var response = await axios.post(`/cgi-bin/mmwebwx-bin/webwxinit?r=${-new Date()}&pass_ticket=${self.auth.passTicket}`, {
            BaseRequest: {
                Sid: self.auth.wxsid,
                Uin: self.auth.wxuin,
                Skey: self.auth.skey,
            }
        });

        await axios.post(`/cgi-bin/mmwebwx-bin/webwxstatusnotify?lang=en_US&pass_ticket=${self.auth.passTicket}`, {
            BaseRequest: {
                Sid: self.auth.wxsid,
                Uin: self.auth.wxuin,
                Skey: self.auth.skey,
            },
            ClientMsgId: +new Date(),
            Code: 3,
            FromUserName: response.data.User.UserName,
            ToUserName: response.data.User.UserName,
        });

        self.user = response.data;
        self.user.ContactList.map(e => {
            e.HeadImgUrl = `${axios.defaults.baseURL}${e.HeadImgUrl}`.replace(/\/+/g, '/');
        });
        await home.loadChats(self.user.ChatSet);
        self.loading = false;

        return self.user;
    }

    async getNewMessage() {
        var auth = self.auth;
        var response = await axios.post(`/cgi-bin/mmwebwx-bin/webwxsync?sid=${auth.wxsid}&skey=${auth.skey}&lang=en_US&pass_ticket=${auth.passTicket}`, {
            BaseRequest: {
                Sid: auth.wxsid,
                Uin: auth.wxuin,
                Skey: auth.skey,
            },
            SyncKey: self.user.SyncKey,
            rr: ~new Date(),
        });

        // Refresh the sync keys
        self.user.SyncKey = response.data.SyncKey;
        self.genSyncKey(response.data.SyncKey.List);

        response.data.AddMsgList.map(e => {
            if (e.FromUserName === self.user.User.UserName) {
                return home.markedRead(e.ToUserName);
            }

            if (e.FromUserName.startsWith('@')) {
                home.addMessage(e);
            }
        });

        return response.data;
    }

    async keepalive() {
        var auth = self.auth;
        var response = await axios.post(`/cgi-bin/mmwebwx-bin/webwxsync?sid=${auth.wxsid}&skey=${auth.skey}&lang=en_US&pass_ticket=${auth.passTicket}`, {
            BaseRequest: {
                Sid: auth.wxsid,
                Uin: auth.wxuin,
                Skey: auth.skey,
            },
            SyncKey: self.user.SyncKey,
            rr: ~new Date(),
        });
        var host = axios.defaults.baseURL.replace('//', '//webpush.');
        var loop = async() => {
            var response = await axios.get(`${host}cgi-bin/mmwebwx-bin/synccheck`, {
                params: {
                    r: +new Date(),
                    sid: auth.wxsid,
                    uin: auth.wxuin,
                    skey: auth.skey,
                    synckey: self.syncKey,
                }
            });

            eval(response.data);

            if (+window.synccheck.retcode === 0) {
                if ([
                    // Normal synccheck
                    0,
                    // Has new message need sync
                    2
                ].includes(+window.synccheck.selector)) {
                    var selector = +window.synccheck.selector;

                    switch (selector) {
                        case 2:
                            await self.getNewMessage();
                            break;

                        // Selector is 4 or 6 ?
                    }

                    // Do next sync keep your wechat alive
                    loop();
                }
            } else {
                console.err(window.synccheck);
            }
        };

        response.data.AddMsgList.map(async e => {
            await home.loadChats(e.StatusNotifyUserName);
        });

        self.genSyncKey(response.data.SyncKey.List);
        loop();
    }

    @action async hasLogin() {
        var auth = await storage.get('auth');

        axios.defaults.baseURL = auth.baseURL;
        return (self.auth = !auth);
    }
}

const self = new Session();
export default self;
