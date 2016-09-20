/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterModel = (function () {
    var that = {},
        apiIp,
        init = function () {

            $.ajax({
                async: false,
                type: 'GET',
                url: 'http://localhost/Konsolidierung_Lokalreporter/Config',
                success: function(data) {
                    apiIp=data;
                    console.log(apiIp);
                    //callback
                }
            });

        },
        currentNews,
        currentTopNews,
        currentQuery,
        currentFavorite,

        getCurrentFavorite= function () {
          return currentFavorite;
        },

        getTopNews = function () {

            console.log(apiIp+"/news?limit=20&istopstory=true");
            var settings = {
                "async": true,
                "url": apiIp+"/news?limit=20&istopstory=true",
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
                "url": apiIp+"/news?radius=" + radius + "&centerpoint=lat49.008852:lng12.085179",
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

            var geoId;
            //var query = $(this).html();
            console.log("in getRegion Id");
            console.log(query);

            var regionSettings = {
                "async": false,
                "url": apiIp+"/districts",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.when($.ajax(regionSettings)).then(function (response) {

                console.log(response);
                for (i = 0; i < response.length; i++) {
                    var name = response[i]['name'].toLowerCase();
                    console.log(name);
                    console.log(query);
                    if(name == query) {
                        //console.log(response[i]['id']);
                        geoId=response[i]['id'];
                        console.log(geoId);


                     //  getRegion(response[i]['id'], query);
                    }

                }
            })
            return geoId;
        },

        getRegion = function(id, query) {
            console.log("in get Region");
            var settings = {
                "async": true,
                "url": apiIp+"/news?geodataid=" + id,
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

            console.log(query);

            var settings = {
                "async": true,
                "url": apiIp+"/news/meta/" + query,
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

        getCurrentQuery= function () {
            return currentQuery;
        },

        getSearchQuery = function (query) {
            //var query = $('#search-input').val().toLowerCase();
            currentQuery=query;
            var settings = {
                "async": true,
                "url": apiIp+"/news?query=" + query,
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
                console.log("in getCurrNews");
                console.log(currentNews);
                return currentNews;
            }
        },

        getFavoriteItems = function (token) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/user/bookmarks",
                "method": "GET",
                "headers": {
                    "authorization": token,
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                }
            };

            $.ajax(settings).done(function (response) {

                currentFavorite=response.items;
                NewsMap.lokalreporterView.setFavoriteItems(response);


            });

        },


        getFilteredSearchResults= function (radius,video) {
            //console.log(apiIp+"/news"+video+"query="+currentQuery+radius+"&limit=20");

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/news"+video+"query="+currentQuery+radius+"&limit=20",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                    //"accept": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {

                currentQuery=response.items;
                NewsMap.lokalreporterView.setSearchResults(response,currentQuery);
                //NewsMap.lokalreporterView.setFilteredSearchResults(response);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
            });
        },

        getFilteredNews = function (categoryTyp,category,radius,typ) {


           // localhost:9000/news?metadataid=sport&attachmentTypes=video&radius=20&centerpoint=lat49.008852:lng12.085179&limit=100
            var CatTyp;
            if(categoryTyp=="Region"){
                var regId =category;

                ///funktioninhalt aus getRegId
                CatTyp = "&geodataid=" + regId;

                }
            else{
                if(category=="alle"){
                    CatTyp="";
                }
                else{
                    CatTyp= "&metadataid="+category;

                }

            }


           // console.log("url string: "+apiIp+"/news"+typ+"limit=20"+radius+CatTyp);

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/news"+typ+"limit=20"+radius+CatTyp,
                "method": "GET",
                "headers": {
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                    //"accept": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {

                currentNews=response.items;
                NewsMap.lokalreporterView.setFilteredNews(response);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
            });

        };


    that.init = init;
    that.getFilteredSearchResults=getFilteredSearchResults;
    that.getFilteredNews=getFilteredNews;
    that.getCurrentNews=getCurrentNews;
    that.getNews = getNews;
    that.getTopNews= getTopNews;
    that.getRegion = getRegion;
    that.getRegionId= getRegionId;
    that.getCategory = getCategory;
    that.getSearchQuery = getSearchQuery;
    that.getCurrentQuery=getCurrentQuery;
    that.getCurrentFavorite=getCurrentFavorite;
    that.getFavoriteItems=getFavoriteItems;



    return that;

}());


