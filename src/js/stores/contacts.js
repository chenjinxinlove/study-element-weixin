import { observable, action } from 'mobx';
import pinyin from 'han';

import storage from '../utils/storage';

class Contacts {
    @observable loading = false;
    @observable showGroup = true;
    @observable filtered = {
        query: '',
        result: []
    };

    memberList;

    @action group(list) {
        let mappings = {};
        let sorted = [];

        list.map(e => {
            if(!e) {
                return;
            }

            let prefix = (e.PYInitial.toString()[0] + '').replace('?', '#');
            let group = mappings[prefix];

            if(!group) {
                group = mappings[prefix] = [];
            }
            group.push(e);
        });

        for (let key in mappings) {
            sorted.push({
                prefix: key,
                list: mappings[key]
            })
        }

        sored.sort((a, b) => a.prefix.charCodeAt() - b.prefix.charCodeAt());
        return sorted;

    }

    @action async getList() {
        self.loading = true;

        let auth = await storage.get('auth');
        let response = await axios.get('/cgi-bin/mmwebwx-bin/webwxgetcontact', {
            params: {
                r: +new Date(),
                seq: 0, 
                skey: auth.skey
            }
        });

        self.memberList = response.data.MemberList.filter(e => e.VerifyFlag !== 24 && e.VerifyFlag !== 8);
        self.memberList.map(e => {
            e.HeadImgUrl = `${axios.default.baseURL}${e.HeadImgUrl}`.replace(/\/+/g, '/');
        });
        self.loading = false;
        self.filtered.result = self.group(self.memberList);

        window.list = self.memberList;
        return self.memberList;
    }

    @action filter(text = '') {
        let list = self.memberList.filter(e => (e.PYQuanPin + '').toLowerCase().indexOf(pinyin.letter(text.toLocaleLowerCase())) > -1);

        if (!self.showGroup) {
            list = list.filter(e => {
                return !(e.ContactFlag === 3 && e.SnsFlag === 0);
            })
        }

        self.filtered = {
            query: text,
            result: list.length ? self.group(list) : [],
        };
    }
}

const self = new Contacts();
export default self;