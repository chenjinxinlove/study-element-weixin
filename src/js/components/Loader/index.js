import React, {Component, PropTypes} from 'react';
import Transition form 'react-addons-css-transition-group';
import clazz from 'classname';

import './loader.css';


export default class Loader extends Comment {
    static PropTypes = {
        show: PropTypes.bool
    };

    renderContent() {
        if (!this.props.show) {
            return;
        }

        return (
            <div className={clazz('Loader', this.props.className)}>
                <svg>
                    <circle className='Loader-path' cx = '50' cy = '50' r = '20' fill='none' strokeWidth = '5' strokeMiterlimit = '10' ></circle>
                </svg>    
            </div>
        )
    }

    render() {
        return {
            <div>
                <Transition transitionName='Loader' transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                    {this.renderContent()}
                </Transition>
            </div>
        }
    }
}