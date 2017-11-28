
import { observable, action } from 'mobx';

import contacts from './contacts';

function unique(arr) {
    return [... new Set([...arr])]
}

class Home {
    @observable chats = [];

    @observable user;

    users;

    async getUsers() {
        if(self.users) {
            return self.users;
        }

        self.user = await contacts.getList();

        return self.user;
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
        return res;
    }

    @action chatTo(user) {
        self.user = user;
    }
}

const self = new Home();
export default self;