/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterModel = (function () {
    var that = {},
        init = function () {

        },
        currentNews,
        currentTopNews,

        getTopNews = function () {

            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?limit=20&istopstory=true",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                NewsMap.lokalreporterView.setTopNews(response);
                //NewsMap.DrawMap.setArticlesFromApi(response.items);
                currentTopNews=response.items;
            }).error(function (response) {
                console.log("error");
            });
            return false;

        },

        getNews = function (radius) {

            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?radius=" + radius + "&centerpoint=lat49.008852:lng12.085179",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {

                NewsMap.lokalreporterView.setNews(response);
               // NewsMap.DrawMap.setArticlesFromApi(response.items);
                currentNews=response.items;
            }).error(function (response) {
                console.log("error");
            });
            return false;

        },

        getRegionId = function (query) {
            //var query = $(this).html();
            console.log(query);

            var regionSettings = {
                "async": true,
                "url": "http://localhost:9000/districts",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(regionSettings).done(function (response) {

                console.log(response);
                for (i = 0; i < response.length; i++) {
                    var name = response[i]['name'].toLowerCase();
                    if(name == query) {
                        getRegion(response[i]['id'], query);
                    }
                }
            }).error(function (response) {
                console.log("error");
            });
        },

        getRegion = function(id, query) {

            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?geodataid=" + id,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                var type = "Region";
                NewsMap.lokalreporterView.setCategoryResults(response, query, type);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
                console.log("Map Articles von Region");
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getCategory = function (query) {
            //var query = $(this).html().toLowerCase();



            var settings = {
                "async": true,
                "url": "http://localhost:9000/news/meta/" + query,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                var type = "Kategorie";
                NewsMap.lokalreporterView.setCategoryResults(response, query, type);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
                console.log("Map Articles von Category");
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getSearchQuery = function (query) {
            //var query = $('#search-input').val().toLowerCase();

            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?query=" + query,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                NewsMap.lokalreporterView.setSearchResults(response, query);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
                console.log("Map Articles von Suche");
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getCurrentNews= function (x) {
            if(x=='topnews'){
                return currentTopNews;
            };
            if(x=='news'){
                return currentNews;
            }
        };


    that.init = init;
    that.getCurrentNews=getCurrentNews;
    that.getNews = getNews;
    that.getTopNews= getTopNews;
    that.getRegion = getRegion;
    that.getRegionId= getRegionId;
    that.getCategory = getCategory;
    that.getSearchQuery = getSearchQuery;


    return that;

}());


