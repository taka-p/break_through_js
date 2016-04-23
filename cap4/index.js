/**
 * フィルタ・ソート機能付き表コンテンツ
 * データ操作
 **/

function App(url) {
    this.bindEvents();
    var that = this;
    this.fetch(url).then(function (data) {
        that.data = data;
    }, function (e) {
        console.error('データの取得に失敗しました');
    });
}

// data.jsonを取得して、$.Deferredオブジェクトを返す($.ajaxは$.Deferredを返す)
App.prototype.fetch = function (url) {
    return $.ajax({
        url: url,
        dataType: 'json'
    });
};

// select要素にイベント登録 - onChangeのthisを束縛
App.prototype.bindEvents = function () {
    _.bindAll(this, "onChange");
    $('select').on("change", this.onChange);
};

App.prototype.onChange = function (e) {
    var that = this;

    // $('select')から、function配列を作成
    // where = [
    //  function (list) { select[filter](list, select[filter].value); },
    //  function (list) { select[sort](list, select[sort].value); }
    // ];
    var where = $('select').map(function (i, e) {
        var $el = $(e);
        return function (list) {
            return that[$el.attr('name')](list, $el.val());
        };
    });

    // whereに格納されるfunctionを順次実行（初期値はthis.data.list）
    // 1. tmp  = (function (this.data.list) {
    //               select[filter](list, select[filter].value);
    //           }(this.data.list));
    //
    // 2. list = (function (tmp) {
    //               select[sort](list, select[sort].value);
    //           }(tmp));
    var list = _.reduce(where, function (prev, current) {
        return current(prev);
    }, this.data.list);
};

App.prototype.sort = function (list, key) {
    // 空の場合はlistをそのまま返す
    if (this.isEmpty(key)) {
        return list;
    }
    // keyの値でソート
    return _.sortBy(list, function (e) {
        return e[key];
    });
};

App.prototype.filter = function (list, value) {
    if (this.isEmpty(value)) {
        return list;
    }
    // list.[N].group === valueでフィルター
    return _.filter(list, function (e) {
        return e['group'] === value;
    });
};

App.prototype.isEmpty = function (value) {
    return value === "";
};

new App('data.json');

