import $ from 'jquery';
import React from 'react';
import Device from 'current-device';

import Utils from 'utils/utils';

require('jquery-mousewheel/jquery.mousewheel.js');

class App extends React.Component {
    componentDidMount() {
        let theme = Utils.getTheme();
        $(document.body).attr('theme', theme);

        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });

        $(window).on('load resize', function() {
            Utils.handleScreenZoom(function() {
                Utils.handleBigScreenDomHeight();
            });
        });

        // stop zoom page by ctrl & +/-
        $(document).on('keydown', function(event) {
            if (event.ctrlKey) {
                let keyCode = event.keyCode || event.which;
                if (keyCode === 187 || keyCode === 189) {
                    !!event.preventDefault && event.preventDefault();
                }
            }
        });

        // stop zoom page by ctrl & mousewheel
        $(document).on('mousewheel', function(event) {
            if (event.ctrlKey) {
                !!event.preventDefault && event.preventDefault();
            }
        });
    }
    componentDidUpdate() {
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    render() {
        return this.props.children;
    }
}

module.exports = App;
