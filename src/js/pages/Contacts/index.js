
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import clazz from 'classname';
import randomColor from 'randomcolor';

import classes from './style.css';
import Loader from 'components/Loader';
import Avatar from 'components/Avatar';

@inject(stores => ({
    loading: stores.contacts.loading,
    filtered: stores.contacts.filtered,
    getList: stores.contacts.getList,
    showUserinfo: stores.userinfo.toggle
}))
@observer
export default class Contacts extends Component {
    componentWillMount() {
        this.props.getList();
    }

    renderColumns(data, index) {
        var list = data.filter((e, i) => i % 3 === index);

        return list.map((e, index) => {
            return (
                <div className={classes.group} key={index}>
                    <div className={classes.header}>
                        <label>{e.prefix}</label>

                        <span>{e.list.length} 好友</span>
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            height: 4,
                            width: '100%',
                            background: randomColor(),
                        }} />
                    </div>

                    <div className={classes.list}>
                        {
                            e.list.map((e, index) => {
                                return (
                                    <div className={classes.item} key={index} onClick={() => this.props.showUserinfo(true, e)}>
                                        <div className={classes.avatar}>
                                            <Avatar style={{ width: 32, height: 32 }} src={e.HeadImgUrl} />
                                        </div>
                                        <div className={classes.info}>
                                            <p className={classes.username} dangerouslySetInnerHTML={{__html: e.NickName || e.NickName}} />
                                            <p className={classes.signature} dangerouslySetInnerHTML={{__html: e.Signature || '没有签名'}} />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            );
        });
    }

    render() {
        var { query, result } = this.props.filtered;

        if (query && result.length === 0) {
            return (
                <div className={clazz(classes.container, classes.notfound)}>
                    <div className={classes.inner}>
                        <img src="assets/images/crash.png" />
                        <h1> '{query}'找不到任何匹配的人</h1>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.container}>
               
                <Loader show={ this.props.loading} fullscreen={true} />
                <div className={classes.columns}>
                    <div className={classes.column}>
                        {
                            this.renderColumns(result, 0)
                        }
                    </div>
                    <div className={classes.column}>
                        {
                            this.renderColumns(result, 1)
                        }
                    </div>
                    <div className={classes.column}>
                        {
                            this.renderColumns(result, 2)
                        }
                    </div>
                </div>
               
            </div>
        );
    }
}
