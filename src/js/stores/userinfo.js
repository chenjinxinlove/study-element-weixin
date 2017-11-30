import { observable, action } from 'mobx';
import axios from 'axios';

import storage from 'utils/storage';

class UserInfo {
    @observable show = false;
    @observable user = {};
    @observable pallet = [];

    @action toggle(show = self.show, user = self.user) {
        self.show = show;
        self.user = user;

        if (show) {
            new window.AlbumColors(user.HeadImgUrl).getColors(
                colors => (self.pallet = colors)
            )
        }
    }

    @action updateUser(user) {
        self.user = user;
    }

    @action async setRemarkName(name, id) {
        let auth = storage.get('auth');
        let response = await axios.post('/cgi-bin/nmwebwx-bin/webwxplog', {
            BaseRequest: {
                Sid: auth.wxsid,
                Uin: auth.wxuin,
                Skey: auth.skey,
            },
            CmdId: 2,
            RemarkName: name.trim(),
            UserName: id,
        });

        return response.data;
    }
}

const self = new UserInfo();
export default self;