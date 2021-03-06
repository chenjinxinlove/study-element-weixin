import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import classes from './style.css';
import Switch from 'components/Switch';

@inject(stores => ({
    showOnDock: stores.settings.showOnDock,
    setShowOnDock: stores.settings.setShowOnDock,
    showOnTray: stores.settings.showOnTray,
    setShowOnTray: stores.settings.setShowOnTray,
    showNotification: stores.settings.showNotification,
    setShowNotification: stores.settings.setShowNotification,
    startup: stores.settings.startup,
    setStartup: stores.settings.setStartup,

    plugins: stores.settings.plugins
}))

@observer
export default class Settings extends Component {
    renderPlugins(plugins) {
        return plugins.map((e, index) => {
            return (
                <div key={index} className={classes.plugins}>
                    <img src={e.icon}/>

                    <div className={classes.details}>
                        <p>
                            <span>{e.name}</span>
                            <span className={classes.version}>{e.version}</span>
                        </p>
                        <p>
                            <a href={e.link} target='_bank'>浏览Github</a>
                        </p>
                        <div className={classes.description}>{e.description}</div>
                    </div>
                    <Switch defaultChecked={e.enabled}/>
                </div>
            )
        })
    }
    render () {
        let {
            showOnDock,
            setShowOnDock,
            showOnTray,
            setShowOnTray,
            showNotification,
            setShowNotification,
            startup,
            setStartup,
            plugins
        } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.column}>
                    <h2>设置</h2>

                    <ul>
                        <li>
                            <label htmlFor="showOnDock">
                                <span>显示dock</span>
                                <Switch id="showOnDock" checked={showOnDock} onChange={e => setShowOnDock(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="showOnTray">
                                <span>显示在托盘</span>
                                <Switch id="showOnTray" checked={showOnTray} onChange={e => setShowOnTray(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="showNotification">
                                <span>发送桌面通知</span>
                                <Switch id="showNotification" checked={showNotification} onChange={e => setShowNotification(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="startup">
                                <span>在启动时启动</span>
                                <Switch id="startup" checked={startup} onChange={e => setStartup(e.target.checked)} />
                            </label>
                        </li>
                    </ul>
                </div>
                <div className={classes.column}>
                    <h2>插件</h2>
                    {
                        this.renderPlugins(plugins)
                    }
                </div>
            </div>
        )
    }
}