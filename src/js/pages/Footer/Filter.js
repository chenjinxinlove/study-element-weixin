import React ,{ Component } from 'react';
import { inject } from 'mobx-react';

import classes from './style.css';
import Switch from '../../components/Switch';

@inject(stores => ({
    filter: stores.contacts.filter,
    showGroup: stores.contacts.showGroup,
    toggleGroup: stores.contacts.toggleGroup
}))

export default class Filter extends Component {
    timer;

    doFilter(text = '') {
        text = text.trim();

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.props.filter(text);
        }, 300)
    }

    handleShowGroup(e) {
        this.props.toggleGroup(e.target.checked);
        this.doFilter(this.refs.filter.value);
    }

    render() {
        return (
            <div className={classes.filter}>
                <input type='text' ref='filter' placeholder='搜索' onInput={e => this.doFilter(e.target.value)}/>

                <div className={classes.action}>
                    <label htmlFor='showGroup'>
                        <span className={classes.options}>显示组</span>
                        <Switch id='showGroup' defaultChecked={this.props.showGroup} onClick={e=>this.handleShowGroup(e)}></Switch>
                    </label>
                </div>
            </div>
        )
    }
}