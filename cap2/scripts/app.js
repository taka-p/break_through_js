/**
 * Modal処理 clickイベント編
 */

// modalコンストラクタ
function Modal(el) {
  this.initialize(el);
}

// 初期化を行うinitializeメソッド
Modal.prototype.initialize = function (el) {
  this.const = {
    MODAL_WIDTH_ORIGIN : 750,
    MODAL_HEIGHT_ORIGIN: 500,
    MODAL_WIDTH_SMALL  : 320,
    MODAL_HEIGHT_SMALL : 213
  };

  this.$el = el;
  this.$container = $("#modal");
  this.$contents = $("#modal-contents");
  this.$close = $("#modal-close");
  this.$next = $("#modal-next");
  this.$prev = $("#modal-prev");
  this.$overlay = $("#modal-overlay");
  this.$window = $(window);

  this.handleEvents();
};

// イベントの登録処理、calbackの紐付け
Modal.prototype.handleEvents = function () {
  var that = this;

  // イベント基点の要素がクリックされた際、showメソッドを呼び出し
  this.$el.on("click", function (e) {
    that.show(e);
    return false;
  });

  // 閉じるボタンクリック時に、hideメソッドを呼び出し
  this.$close.on("click", function (e) {
    that.hide(e);
    return false;
  });

  // オーバレイ同上
  this.$overlay.on("click", function (e) {
    that.hide(e);
    return false;
  });

  // 次へボタンクリック時にnextメソッドを呼び出し
  this.$next.on("click", function (e) {
    that.next(e);
    return false;
  });

  // 戻るボタン同上
  this.$prev.on("click", function (e) {
    that.prev(e);
    return false;
  });

  // 画面ロード時、ブラウザリサイズ時にresizeメソッドを呼び出し
  this.$window.on("load resize", function (e) {
    that.resize(e);
    return false;
  });
};

// クリックされた要素からhrefとindexを抽出、modalのsrcに設定した上でmodal部品を展開
Modal.prototype.show = function (e) {
  var $target = $(e.currentTarget),
      src = $target.attr("href");

  this.$contents.html("<img src=\"" + src + "\" />");
  this.$container.fadeIn();
  this.$overlay.fadeIn();

  // indexにはアクセスできないようローカル変数として宣言
  var index = $target.data("index");
  // indexと要素数をcreateConterに渡して値を隠蔽する
  this.countChange = this.createCounter(index, this.$el.length);
  return false;
};

// 閉じるボタン、オーバーレイクリック時にモーダル部品を消す
Modal.prototype.hide = function (e) {
  this.$container.fadeOut();
  this.$overlay.fadeOut();
};

// 現在表示している画像を消して、代わりに指定されたindex要素配下のimgを表示
Modal.prototype.slide = function (index) {
  this.$contents.find("img").fadeOut({
    complete: function () {
      var src = $("[data-index=\"" + index + "\"]").find("img").attr("src");

      $(this).attr("src", src).fadeIn();
    }
  });
};

// 次回表示する画像のindexを計算する関数値を返す（クロージャ）
Modal.prototype.createCounter = function (index, len) {
  return function (num) {
    return index = (num + index + len) % len;
  };
};

// showで定義されたcountChangeに引数numを渡して、計算結果でslideメソッドを実行
Modal.prototype.next = function () {
  this.slide(this.countChange(1));
};

// 同上
Modal.prototype.prev = function () {
  this.slide(this.countChange(-1));
};

// 同上
Modal.prototype.resize = function () {
  var w = this.$window.width(),
      that = this;

  if (w < 640) {
    this.$container.css({
      "width": that.const.MODAL_WIDTH_SMALL,
      "height": that.const.MODAL_HEIGHT_SMALL
    });
  }
  else {
    this.$container.css({
      "width": that.const.MODAL_WIDTH_ORIGIN,
      "height": that.const.MODAL_HEIGHT_ORIGIN
    });
  }
};

// 引数に処理の基点となる要素を渡してインスタンス化
var modal = new Modal($("#modal-thumb a"));

