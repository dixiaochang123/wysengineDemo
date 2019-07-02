import React from 'react';
const ReactRedux = require('react-redux');
const FileUpload  = require('react-fileupload');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class FileUploads  extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.fileuploadChangs = this.fileuploadChangs.bind(this);

    }

    fileuploadChangs(options) {
        this.props.onClick && this.props.onClick(options)

    }

    render() {
        /*指定参数*/
        var options={
            baseUrl:Constant.API_ROOT+'/workorder/uploadDisposeProcess',
            param:{
                fid:0,
                token: User.get('token')
            },
            dataType : 'json',
            chooseAndUpload: true,
            // requestHeaders: {'User-Agent': 'So Aanyip'},
            beforeUpload : function(files,mill){
                if(typeof files == 'string') return true
                if(files[0].size<1024*1024*20){
                    files[0].mill = mill
                    return true
                }
                return false
            },
            fileFieldName: 'file',
            doUpload : function(files,mill){
                console.log('you just uploaded',typeof files == 'string' ? files : files[0].name)
            },
            uploading : function(progress){
                // console.log('loading...',progress.loaded/progress.total+'%')
            },
            uploadSuccess : function(resp){
                console.log(resp)
                // return resp.body.ID;
                this.props.onClick && this.props.onClick(resp.body.ID)
            },
            uploadError : function(err){
                alert(err.message)
            },
            uploadFail : function(resp){
                alert(resp)
            }
        }

        return (
            <div className={style.box}>
                <FileUpload options={options} onClick={this.fileuploadChangs.bind(this,options)}>
                    <button ref="chooseAndUpload" className={style.button}></button>
                    {/*<button ref="chooseBtn">choose</button>
                    <button ref="uploadBtn">upload</button>*/}
                </FileUpload>
            </div>
        );
    }
}

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {};
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FileUploads);
