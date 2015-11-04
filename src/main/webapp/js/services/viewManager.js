/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.service('viewManager', function () {
    var isShowingList = false;
    return {
        isShowingList: function () {
            return isShowingList;
        },
        setIsShowingList: function (isShowingListNow) {
            isShowingList = isShowingListNow;
        }
    }
});