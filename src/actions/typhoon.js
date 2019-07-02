import Request from 'utils/request';

function setTyphoonListObj(data) {
    return {
        type: 'SET_TYPHOON_LIST_OBJ',
        data
    };
}

function setTyphoon(data) {
    return {
        type: 'SET_TYPHOON',
        data
    };
}

let Typhoon = {
    getTop10NearestProject: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function(dispatch) {
            let url = '/weather/typhoon/getTop10NearestProject';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTyphoonListObj(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getTyphoonByTfId: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TFID: '201709'
        // }
        return function(dispatch) {
            let url = '/weather/typhoon/getTyphoonByTfId';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTyphoon(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    }
};

module.exports = Typhoon;
