'use strict';

/**
 * 1. URLと表示するコンテンツを紐付けるオブジェクトを作成 - pageFactory
 * 2. popstateイベントが発火するとurlChangeHandlerが呼び出される
 * 3. aタグがclickされた際、navigate関数でhistoryにhref属性値を追加
 * 4. scanLastで[前回のurl, 次回のurl]という配列を作成
 * 5. urlChangeHandlerで前回のurlに対応するコンテンツを非表示（存在する場合）
 * 6. urlChangeHandlerで現在のurlに対応するコンテンツ表示
 **/

$(document).on("click", ".page a", function(e){
    e.preventDefault();

    var href = $(this).attr("href");
    myRouter.navigate(href);
});

// enter関数のラッパー関数（引数pathを渡せるようにラップ）
function createEnterFunc(path) {
    // pageEnterのラッパー（pageEnterの実行前に実行される）
    return function enter($el, action, prev, next) {
        return $.ajax({
            url: path,
            dataType: 'html'
        }).then(function (d) {
            var content = $( d ).filter("article").find(".inner");
            $el.html(content);

            return action();
        });
    }
}

// pageLeaveのラッパー（pageleaveの実行前に実行される）
function leave($el, action) {
    return $el.find('.inner')
        .fadeOut()
        .promise()
        .then(function () {
            return action();
        });
}

myRouter.add( "/index.html", $("<section class='page page1'/>"), createEnterFunc("./index.html"), leave);
myRouter.add( "/page2.html", $("<section class='page page2'/>"), createEnterFunc("./page2.html"), leave);
myRouter.add( "/page3.html", $("<section class='page page3'/>"), createEnterFunc("./page3.html"), leave);
myRouter.add( "/page4.html", $("<section class='page page4'/>"), createEnterFunc("./page4.html"), leave);

$(".page").detach();

myRouter.start();
