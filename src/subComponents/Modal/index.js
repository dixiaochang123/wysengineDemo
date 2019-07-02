import React from 'react';
import ReactModal from 'react-modal';

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 关闭弹框
        this.close = this.close.bind(this);
    }
    close() {
        this.props.onClose && this.props.onClose();
    }
    render() {
        return (
            <div className='full none'>
                <ReactModal
                    isOpen={this.props.isOpen}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={true}
                    closeTimeoutMS={0}
                    contentLabel='Modal'>
                    {this.props.children}
                </ReactModal>
            </div>
        );
    }
}

module.exports = Modal;
