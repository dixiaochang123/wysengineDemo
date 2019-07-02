import Utils from 'utils/utils';

let User = {
    get: function(key) {
        let data = localStorage.getItem('wysengineUser');
        let user = data ? JSON.parse(data) : {};
        return key ? user[key] : user;
    },
    set: function(key, val) {
        let user = this.get();
        if (typeof key === 'object') {
            for (let i in key) {
                user[i] = key[i];
            }
        } else {
            user[key] = val;
        }
        localStorage.setItem('wysengineUser', JSON.stringify(user));
    },
    clear: function() {
        localStorage.removeItem('wysengineUser');
    },
    hasAuth: function(operation) {
        let authGroup = User.get('authGroup');
        let operationPage = operation.split('__')[0];
        let operationName = operation.split('__')[1];
        let hasAuth = authGroup[operationPage] && authGroup[operationPage].indexOf(operationName) != -1;
        if (!hasAuth) {
            Utils.tooltip('没有操作权限');
        }
        return hasAuth;
    }
};

module.exports = User;