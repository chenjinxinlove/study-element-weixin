import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import pinyin from 'han';
import clazz from 'classname';

import classes from './style.css';
import Avatar from 'components/Avatar';
import { Modal, ModalBody } from 'components/Modal';

@inject (stores => ({
    pallet: stores.userinfo.pallet,
    show: stores.userinfo.show,
    user: stores.userinfo.user,
    toggle: stores.userinfo.toggle,
    setRemarkName: stores.userinfo.setRemarkName,
    refershContacts: async(user) => {
        let { updateUser, filter, filtered } = stores.contacts;

        stores.userinfo.updateUser(user);
        updateUser(user);
        filter(filtered.query);
    }
}))

@observer
export default class UserInfo extends Component {
    state = {
        showEdit: fasle,
    };

    toggleEdit(showEdit = !this.state.showEdit) {
        this.setState({showEdit});
    }

    handleClose() {
        this.toggleEdit(false);
        this.props.toggle(false);
    }

    handleError(e) {
        e.target.src = 'http://i.pravatar.cc/200';
    }

    render() {
        let { HeadImgUrl, NickName, RemarkName, Signature, City, Province } = this.props.user;
        let pallet = this.props.pallet;
        let background = pallet[0];
        let gradient = 'none';
        let fontColor = '#777';
        let buttonColor = '#777';
        if (background) {
            gradient = `
                -webkit-linear-gradient(top, rgb(${background[0]}, ${background[1]}, ${background[2]}) 5%, rgba(${background[0]}, ${background[1]}, ${background[2]}, 0) 15%),
                -webkit-linear-gradient(bottom, rgb(${background[0]}, ${background[1]}, ${background[2]}) 5%, rgba(${background[0]}, ${background[1]}, ${background[2]}, 0) 15%),
                -webkit-linear-gradient(left, rgb(${background[0]}, ${background[1]}, ${background[2]}) 5%, rgba(${background[0]}, ${background[1]}, ${background[2]}, 0) 15%),
                -webkit-linear-gradient(right, rgb(${background[0]}, ${background[1]}, ${background[2]}) 5%, rgba(${background[0]}, ${background[1]}, ${background[2]}, 0) 15%)
            `;
            background = `rgba(${background[0]}, ${background[1]}, ${background[2]}, 1)`;
            fontColor = `rgb(
                ${pallet[1][0]},
                ${pallet[1][1]},
                ${pallet[1][2]}
            )`;
            buttonColor = `rgb(
                ${pallet[2][0]},
                ${pallet[2][1]},
                ${pallet[2][2]}
            )`;
        } else {
            background = '#fff';
        }

        return (
            <Modal show={this.props.show} onCancel = {() => this.handleClose()}>
                <ModalBody className={classes.container}>
                    <div className={clazz(classes.hero, this.state.showEdit && classes.showEdit)}
                        onClick={
                            () => {
                                let showEdit = this.state.showEdit;

                                if(showEdit) {
                                    this.toggleEdit();
                                }
                            }
                        }
                        style={{
                            background,
                            color: fontColor
                        }}
                    >
                        <div className={classes.edit} onClick={() => this.toggleEdit()}>
                            <i className='icon-ion-edit'/>
                        </div>   
                        <div className={classes.inner}>
                            <div className={classes.mask} style={{ background: gradient }}/>
                            <Avatar src={HeadImgUrl}/>
                        </div>

                        <h3 dangerouslySetInnerHTML={{__html: NickName}}/>
                        <p dangerouslySetInnerHTML={{__html: Signature || '没有签名'}}/>
                        <div className={classes.address}>
                            <i className='icon-ion-android-map' style={{ color: fontColor }}/>
                            {City || '暂无'}, {Province || '暂无'}
                        </div>
                        <div className={classes.sendMessage} style={{ color: buttonColor, opacity: .6 }}>
                            发送信息
                        </div>    
                    </div>
                    {
                        this.state.showEdit && (
                            <input 
                                type='text'
                                ref='input'
                                autoFocus={true}
                                placeholder='输入备注名'
                                onKeyPress={e => this.handleEnter(e)}
                            />
                        )
                    }
                </ModalBody>
            </Modal>
        )
    }
}