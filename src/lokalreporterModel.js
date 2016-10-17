/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterModel = (function () {
    var that = {},
        apiIp = NewsMap.MainController.apiIp,
        oAuthIp = NewsMap.MainController.oAuthIp,
        init = function () {
            /*
             $.ajax({
             async: false,
             type: 'GET',
             url: 'http://localhost/Konsolidierung_Lokalreporter/Config',
             success: function(data) {
             apiIp=data;
             console.log(apiIp);
             //callback
             }
             }); */

        },
        currentNews,
        currentTopNews,
        lastSearchResponse,
        currentFavorite,
        searchQuery,
        myPos,


        getCurrentFavorite = function () {
            return currentFavorite;
        },

        getTopNews = function () {

            var settings = {
                "async": true,
                "url": apiIp + "/news?limit=20&istopstory=true",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                NewsMap.lokalreporterView.setTopNews(response, pagingInfo);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
                currentTopNews = response.items;
            }).error(function (response) {
                console.log("error");
            });
            return false;

        },

        getRegionId = function (query) {

            var geoId;
            //var query = $(this).html();

            var regionSettings = {
                "async": false,
                "url": apiIp + "/districts",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.when($.ajax(regionSettings)).then(function (response) {

                for (i = 0; i < response.length; i++) {
                    var name = response[i]['name'].toLowerCase();
                    if (name == query) {
                        geoId = response[i]['id'];


                        //  getRegion(response[i]['id'], query);
                    }

                }
            });
            return geoId;
        },

        getRegion = function (id, query) {
            var settings = {
                "async": true,
                "url": apiIp + "/news?geodataid=" + id,
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
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getCategory = function (query) {
            var settings = {
                "async": true,
                "url": apiIp + "/news/meta/" + query,
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
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getlastSearchResponse = function () {
            return lastSearchResponse;
        },

        getSearchQuery = function (query) {

            searchQuery = query;
            //var query = $('#search-input').val().toLowerCase();
            lastSearchResponse = query;
            var settings = {
                "async": true,
                "url": apiIp + "/news?query=" + query,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };
            $.ajax(settings).done(function (response) {
                var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                NewsMap.lokalreporterView.setSearchResults(response, query, pagingInfo);
                NewsMap.DrawMap.setArticlesFromApi(response.items);
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getCurrentNews = function (x) {
            if (x == 'topnews') {
                return currentTopNews;
            }
            if (x == 'news') {
                return currentNews;
            }
        },

        getRelatedItems = function (token) {
            var settings = {
                "async": true,
                "url": apiIp + "/news/recommended?limit=20",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": token
                }
            };

            $.ajax(settings).done(function (response) {

                if (response.items.length == 0) {
                    if ($("#personal-content").find("#favorite-alert").length == 0) {
                        var missingFavourites = '<div id="favorite-alert"><h4>Fügen sie zuerst Favoriten hinzu.</h4>' +
                                '<p>Hier wird ihnen eine Reihe von Artikeln vorgeschlagen, auf Basis ihrer Favoriten.</p>'+
                                '<img src="img/instructFav.png">'+
                                '</div>';
                        $("#personal-content").append(missingFavourites);
                    }
                    $('#loading-content').hide();
                }
                else {
                    if ($("#personal-content").find("#favorite-alert").length > 0) {
                        $("#favorite-alert").remove();
                    }
                    var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                    NewsMap.lokalreporterView.setPersonalContent(response, "Personalisierter-Content", pagingInfo);
                    NewsMap.DrawMap.setArticlesFromApi(response.items);
                }


            }).error(function (response) {
                console.log("error");
            });

        },


        getFavoriteItems = function (token) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp + "/user/bookmarks",
                "method": "GET",
                "headers": {
                    "authorization": token,
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                }
            };

            $.ajax(settings).done(function (response) {
                currentFavorite = response.items;
                NewsMap.lokalreporterView.setFavoriteItems(response);
                NewsMap.DrawMap.setArticlesFromApi(currentFavorite);

            });
        },


        getFilteredSearchResults = function (radius, video) {
            var timeout = 0;
            var centerpoint = "";
            if (myPos == undefined) {
                identifyLocation();
                timeout = 300;
            }

            setTimeout(function () {
                if (myPos == undefined) {
                    centerpoint = radius + "&centerpoint=lat49.008852:lng12.085179";
                }
                else {
                    if (radius == "") {
                        centerpoint = "";
                    }
                    else {
                        centerpoint = radius + "&centerpoint=lat" + myPos.lat + ":lng" + myPos.long;
                    }
                }


                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": apiIp + "/news" + video + "query=" + searchQuery + centerpoint + "&limit=20",
                    "method": "GET",
                    "headers": {
                        "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                        "cache-control": "no-cache",
                        "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                        //"accept": "application/json"
                    }
                };

                $.ajax(settings).done(function (response) {
                    var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                    lastSearchResponse = response.items;
                    NewsMap.lokalreporterView.setSearchResults(response, searchQuery, pagingInfo);
                    NewsMap.DrawMap.setArticlesFromApi(response.items);
                });
            }, timeout);
        },

        getNewsWithPagingLink = function (pagingLink) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": pagingLink,
                "method": "GET",
                "headers": {
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                    //"accept": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {
                var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                var currWind = NewsMap.lokalreporterView.getCurrentWindow();
                switch (currWind) {
                    case "news":
                        NewsMap.lokalreporterView.setNews(response, pagingInfo);
                        NewsMap.DrawMap.enableExtraMarkers();
                        NewsMap.DrawMap.setArticlesFromApi(response.items);
                        break;
                    case "top-news":
                        NewsMap.lokalreporterView.setTopNews(response, pagingInfo);
                        NewsMap.DrawMap.enableExtraMarkers();
                        NewsMap.DrawMap.setArticlesFromApi(response.items);
                        break;
                    case "suche":
                        NewsMap.lokalreporterView.setSearchResults(response, searchQuery, pagingInfo);
                        NewsMap.DrawMap.enableExtraMarkers();
                        NewsMap.DrawMap.setArticlesFromApi(response.items);
                        break;
                    case "personal":
                        NewsMap.lokalreporterView.setPersonalContent(response, "Personalisierter-Content", pagingInfo);
                        NewsMap.DrawMap.enableExtraMarkers();
                        NewsMap.DrawMap.setArticlesFromApi(response.items);
                        break;
                }
            });
        },

        getNews = function (categoryTyp, category, radius, typ) {
            //Set Standort

            var timeout = 0;

            if (myPos == undefined) {
                identifyLocation();
                timeout = 300;
            }
            setTimeout(function () {
                var centerpoint;
                // localhost:9000/news?metadataid=sport&attachmentTypes=video&radius=20&centerpoint=lat49.008852:lng12.085179&limit=100
                var CatTyp;
                if (categoryTyp == "Region") {
                    var regId = category;

                    CatTyp = "&geodataid=" + regId;
                }
                else {
                    if (category == "alle") {
                        CatTyp = "";
                    }
                    else {
                        CatTyp = "&metadataid=" + category;
                    }
                }
                if (radius == "") {
                    centerpoint = "";
                }
                else if (myPos == undefined) {
                    centerpoint = radius + "&centerpoint=lat49.008852:lng12.085179";
                }
                else if(myPos!=undefined && radius != ""){
                    centerpoint = radius + "&centerpoint=lat" + myPos.lat + ":lng" + myPos.long;
                }

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": apiIp + "/news" + typ + "limit=20" + centerpoint + CatTyp,
                    "method": "GET",
                    "headers": {
                        "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                        "cache-control": "no-cache",
                        "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                        //"accept": "application/json"
                    }
                };

                $.ajax(settings).done(function (response) {
                    var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                    currentNews = response.items;
                    NewsMap.lokalreporterView.setNews(response, pagingInfo);
                    NewsMap.DrawMap.setArticlesFromApi(response.items);
                });


            }, timeout);


        },

        identifyLocation = function () {
            if (navigator && navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(success, error,
                    {enableHighAccuracy: true, timeout: 30000, maximumAge: 600000});

            } else {
                console.log("GeoLocation API ist nicht verfügbar!");
            }


            function success(position) {
                var lat = position.coords.latitude,
                    long = position.coords.longitude;

                myPos = {lat: "", long: ""};
                myPos.lat = lat;
                myPos.long = long;

                //return myPosition;
            }

            function error(msg) {
                //alert(typeof msg == 'string' ? msg : "Bitte aktivieren Sie das GPS auf Ihrem Gerät und laden Sie die Seite neu.");
                return null;
            }

        };


    that.init = init;
    that.getNewsWithPagingLink = getNewsWithPagingLink;
    that.getFilteredSearchResults = getFilteredSearchResults;
    that.getCurrentNews = getCurrentNews;
    that.getNews = getNews;
    that.getTopNews = getTopNews;
    that.getRegion = getRegion;
    that.getRegionId = getRegionId;
    that.getCategory = getCategory;
    that.getSearchQuery = getSearchQuery;
    that.getlastSearchResponse = getlastSearchResponse;
    that.getCurrentFavorite = getCurrentFavorite;
    that.getFavoriteItems = getFavoriteItems;
    that.getRelatedItems = getRelatedItems;


    return that;

}());


