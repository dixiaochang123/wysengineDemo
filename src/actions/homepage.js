import Request from 'utils/request';

function setNewestForecastList(data) {
    return {
        type: 'SET_NEWEST_FORECAST_LIST',
        data
    };
}

function setNewestForecastListObj(data) {
    return {
        type: 'SET_NEWEST_FORECAST_LIST_OBJ',
        data
    };
}

let Homepage = {
    getNewestForecastList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        return function(dispatch) {
            let url = '/weather/forecast/getNewestForecastList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setNewestForecastList(body.body.pageData || []));
                    dispatch(setNewestForecastListObj(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    }
};

module.exports = Homepage;
