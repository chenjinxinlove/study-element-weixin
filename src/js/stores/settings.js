import { observable, action } from 'mobx';

import storage from 'utils/storage';

class Settings {
    @observable showOnDock = true;
    @observable showOnTray = true;
    @observable showNotification = true;
    @observable startup = false;
    @observable plugins = [{
        name: '备份信息',
        link: 'https//github.com/chenjinxinlove',
        description: '',
        version: '1',
        icon: 'https://lh6.ggpht.com/k7Z4J1IIXXJnC2NRnFfJNlkn7kZge4Zx-Yv5uqYf4222tx74wXDzW24OvOxlcpw0KcQ=w300',
        enabled: true,
    }]

    @action setShowOnDock(showOnDock) {
        self.showOnDock = showOnDock;
        self.save();
    }

    @action setShowOnTray(showOnTray) {
        self.showOnTray = showOnTray;
        self.save();
    }

    @action setShowNotification(showNotification) {
        self.showNotification = showNotification;
        self.save();
    }

    @action setStartup(startup) {
        self.startup = startup;
        self.save();
    }

    @action async init() {
        let settings = await storage.get('settings');
        let { showOnDock, showOnTray, showNotification, startup } = self;

        if (settings && Object.keys(settings).length) {
            self.showOnDock = settings.showOnDock;
            self.showOnTray = settings.showOnTray;
            self.showNotification = settings.showNotification;
            self.startup = settings.startup;
        } else {
            await storage.set('setting', {
                showOnDock,
                showOnTray,
                showNotification,
                startup
            });
        }
    }

    save() {
        let { showOnDock, showOnTray, showNotification, startup } = self;

        storage.set('settings', {
            showOnDock,
            showOnTray,
            showNotification,
            startup
        });
    }
}

const self = new Settings();
export default self;