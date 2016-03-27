/**
 * modelコンストラクタ
 */
function AppModel(attrs) {
    this.val = "";
    this.attrs = {
        required: "",
        maxlength: 8,
        minlength: 4
    };
    this.listenners = {
        valid: [],
        invalid: []
    };
}

// オブザーバー機能 - イベントの登録メソッド
AppModel.prototype.on = function (event, func) {
    this.listenners[event].push(func);
};

// オブザーバー機能 - イベントの発火メソッド
AppModel.prototype.trigger = function (event) {
    $.each(this.listenners[event], function () {
       this(); 
    });
};

// validation pattern - 引数valとthis.valに差分があればvalidateメソッドを実行
// 各種validation patternは正しい場合trueを返す
AppModel.prototype.set = function (val) {
    if (this.val === val) return;
    this.val = val;
    this.validate();
};

// validation pattern - 値が空か判定
AppModel.prototype.required = function () {
    return this.val !== "";
};

// validation pattern - 値が引数num以上か判定
AppModel.prototype.maxlength = function (num) {
    return num >= this.val.length;
};

// 値が引数num以下か判定
AppModel.prototype.minlength = function (num) {
    return num <= this.val.length;
};

AppModel.prototype.validate = function () {
    var val;
    this.errors = [];

    // this.attrを走査して、AppModelのメソッドにval引数を渡して実行
    // 各種validation patternは正しくない場合falseを返す
    for (var key in this.attrs) {
        val = this.attrs[key];
        if (!this[key](val)) this.errors.push(key);
    }

    // this.errorsが空であればvalid、無ければinvalidイベントを通知する
    this.trigger(!this.errors.length ? "valid" : "invalid");
};


/**
 * viewコンストラクタ
 */
function AppView(el) {
    this.initialize(el);
    this.handleEvents();
}

// インスタンスから初期化メソッドを実行(引数としてinput要素を渡す)
AppView.prototype.initialize = function (el) {
    this.$el   = $(el);
    this.$list = this.$el.next().children();

    // 要素のdata属性を取得
    var obj = this.$el.data();

    // required属性が存在する場合は先ほどのobjにマージ
    if (this.$el.prop("required")) {
        obj["required"] = "";
    }

    // AppViewからAppModelのメソッドを呼び出せるようにする
    this.model = new AppModel(obj);
};

// DOMに対してイベントを登録するメソッド
AppView.prototype.handleEvents = function () {
    var that = this;

    // keyuoイベントのハンドラとしてonKeyupを登録
    // イベント発火時にイベントオブジェクトeを受け取る
    this.$el.on("keyup", function (e) {
       that.onKeyup(e);
    });

    // model用のイベント登録
    this.model.on("valid", function() {
        that.onValid();
    });

    this.model.on("invalid", function() {
        that.onInvalid();
    });
};

AppView.prototype.onKeyup = function (e) {
    var $target = $(e.currentTarget);
    // inputの値をmodelにセットする
    this.model.set($target.val());
};

AppView.prototype.onValid = function () {
    this.$el.removeClass("error");
    this.$list.hide();
};

AppView.prototype.onInvalid = function () {
    var that = this;
    this.$el.addClass("error");
    this.$list.hide();

    $.each(this.model.errors, function (index, val) {
        that.$list.filter("[data-error=\"" + val + "\"]").show();
    });
};

// 引数inputを渡してインスタンス化
$("input").each(function () {
    new AppView(this);
});
