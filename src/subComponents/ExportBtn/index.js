import React from 'react';

import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

class ExportBtn extends React.Component {
    constructor(props) {
        super(props);

        // 导出
        this.exportFile = this.exportFile.bind(this);
    }
    exportFile() {
        let hasAuth = User.hasAuth('report__export');
        if (!hasAuth) {
            return false;
        }
        let formData = this.props.data;
        if (formData.reportIds == '') {
            Utils.tooltip('请选择要导出的报告');
            return false;
        }

        let form = $('#' + formData.formId);
        $('#ID').val(formData.reportIds);
        form.submit();
    }
    render() {
        let userInfo = User.get();
        let formData = this.props.data;

        return (
            <form id={formData.formId} action={Constant.API_ROOT + formData.url} method='POST' target='_blank'>
                <input type='hidden' id='token' name='token' value={userInfo.token} />
                <input type='hidden' id='ID' name='ID' value='' />
                <span className='panelExport' onClick={this.exportFile}></span>
            </form>
        );
    }
}

module.exports = ExportBtn;
