let EventUtils = {
    bindEvent: function(eventType, callback) {
        $(document).on(eventType, callback);
    },
    unbindEvent: function(eventType, callback) {
        $(document).off(eventType, callback);
    }
};

module.exports = EventUtils;
