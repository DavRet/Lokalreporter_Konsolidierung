NewsMap.MainController = (function () {
    var that = {},
        newsMapView = null,
        drawMap = null,
        lokalreporterView = null,
        currentClickedArticle = null,



        // REST API IPs

        // IPs des Live-Servers (wahrscheinlich nicht mehr online)
       /* apiIp = "http://132.199.141.129:9000",
        oAuthIp = "http://132.199.141.129:9560",*/

        // Lokale IPs

        apiIp = "http://localhost:9000",
        oAuthIp = "http://localhost:9100",



        init = function () {
            newsMapView = NewsMap.NewsMapView.init();
            drawMap = NewsMap.DrawMap.init();
            lokalreporterView = NewsMap.lokalreporterView.init();
            checkForUrlChange();


            $(newsMapView).on("locationFound", setLocation);
            $(newsMapView).on("markerPopupClick", getClickedArticlePopup);
            $(newsMapView).on("searchButtonClick", getTagsFromArticles);
            $(newsMapView).on("searchSelectChanged", changeSearchSelect);
            $(newsMapView).on("addedToFavorites", addToFavorites);
            $(newsMapView).on("showFavorites", showFavorites);
            $(drawMap).on("locationClicked", closeMenu);
            $(drawMap).on("showMenuLeftForFavorite", showMenuLeftforFavorite);
            $(drawMap).on("setAutocompletePosition", setAutocompletePosition);
            $(newsMapView).on("showFavArticle", showFavArticle);
            $(newsMapView).on("radiusSelectChanged", changeRadiusSelect);
            $(newsMapView).on("queryRemoved", removeQuery);
            $(drawMap).on("identifyLocation", identifyLocation);
            $(lokalreporterView).on("mapSizeChanged", changeMapSize);

            return this;
        },

        changeMapSize = function () {
            console.log("test");
        },

        checkForUrlChange = function () {
            $(window).hashchange(function () {
                NewsMap.lokalreporterView.showContent();
            });

            $(window).hashchange();
        },

        removeQuery = function (e, query) {
            drawMap.removeQuery(query);
        },

        showFavArticle = function (e, index) {
            drawMap.showFavArticle(index);
        },


        showFavorites = function () {
            drawMap.showFavorites();
        },

        addToFavorites = function () {
            drawMap.addToFavorites(currentClickedArticle);
        },

        showMenuLeftforFavorite = function (e, article) {
            currentClickedArticle = article;
            newsMapView._setArticleContent(article);
        },

        changeSearchSelect = function () {
            drawMap.selectChanged();
        },

        changeRadiusSelect = function () {
            drawMap.radiusSelectChanged();
        },

        setLocation = function (e, lat, long) {
            drawMap._setLocation(lat, long);
        },
        setAutocompletePosition = function () {
            newsMapView.setAutocompletePosition();
            newsMapView.setRadiusBoxPosition();
        },

        closeMenu = function () {
            newsMapView._closeMenu();
        },

        getTagsFromArticles = function (e) {
            drawMap.tagSearchClicked();
        },

        getClickedArticlePopup = function (e, articleID) {
            var clickedArticle = drawMap._getArticle(articleID);
            currentClickedArticle = clickedArticle;
            newsMapView._setArticleContent(clickedArticle);
        },

        identifyLocation = function () {
            newsMapView.identifyLocation();
        };

    that.init = init;
    that.apiIp = apiIp;
    that.oAuthIp = oAuthIp;

    return that;
}());