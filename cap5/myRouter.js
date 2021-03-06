'use strict';

;(function () {

    var $pages;
    var pageObjects = [];
    var urlHistory = [];

    function pageFactory(url, $el, enter, leave) {
        return {
            url: url,
            $el: $el,
            enter: enter || pageEnter,
            leave: leave || pageLeave
        }
    }

    // pageObjectsに格納されるオブジェクトのうちpageurlに対応するものを返す
    function getPage(pages, key) {
        return pages.filter(function (e) {
                return e.url == key;
            })[0] || null;
    }

    function pageEnter($el) {
        var $page = $el.addClass('page-enter').appendTo('article');
        return animEnd($page).then(function () {
            $el.removeClass('page-enter');
        });
    }

    function pageLeave($el) {
        var $page = $el.addClass('page-leave');
        return animEnd($page).then(function () {
            $el.detach();
            $el.removeClass('page-leave');
        });
    }

    function scanLast(arr, f) {
        var temp = arr.slice(-2);
        if (temp.length === 1) temp.unshift(null);
        return f.apply(this, temp);
    }

    // 解決済みのデファードオブジェクト
    var firstPromise = new $.Deferred().resolve();

    function urlChangeHandler() {
        var pageurl = parseUrl(location.pathname);

        urlHistory.push(pageurl);

        // urlHistoryの最後から2つのURL要素を取り出し、prev,nextに分配する
        // temp = [prev, next]
        scanLast(urlHistory, function (prev, next) {
            // pageObjectsの中から該当URLのオブジェクトを抽出
            var prevPage = getPage(pageObjects, prev),
                nextPage = getPage(pageObjects, next);

            if (! nextPage) throw new Error(pageurl + 'に対応するページが見つからない');

            firstPromise.then(function () {
                var page = prevPage;
                if(page) return page.leave(
                    page.$el,
                    pageLeave.bind(this, page.$el),
                    prev, next);
            }).then(function () {
                var page = nextPage;
                return page.enter(
                    page.$el,
                    pageEnter.bind(this, page.$el),
                    prev, next);
            });
        });
    }

    function animEnd($el) {
        var dfd = new $.Deferred,
            callback = function () {
                dfd.resolve($el);
            };

        if ($el.length === 0 || $el.css('-webkit-animation') === undefined) {
            dfd.resolve();
            return dfd;
        }

        $el.on("webkitAnimationEnd", callback);
        dfd.done(function () {
            $el.off("webkitAnimationEnd", callback);
        });

        return dfd;
    }

    function parseUrl(url) {
        if (url == '/') url = 'index.html';
        return url;
    }

    function start() {
        $(window)
            .on("popstate", urlChangeHandler)
            .trigger("popstate");
    }

    function add(url, $el, enter, leave) {
        pageObjects.push(pageFactory(url, $el, enter, leave));
    }

    function navigate(url) {
        history.pushState(null, null, url);
        urlChangeHandler();
    }

    // 外部から実行できるように公開したい機能をwindowオブジェクトに追加
    window.myRouter = {
        add: add,
        navigate: navigate,
        start: start
    };
})();
