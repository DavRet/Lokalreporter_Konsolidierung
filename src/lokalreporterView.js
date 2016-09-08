/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterView = (function () {
    var token;
    var that = {},
        angezeigteNews,
        isLoggedIn = false,
        toShare,
        init = function () {

            NewsMap.lokalreporterModel.getTopNews(); //getTopNews();
            NewsMap.lokalreporterModel.getNews(20); //getNews(20);
            $('#lokalreporter-image').on('click', function () {

                document.location.hash = "top-news";
            });

            $('#search-button-top').on('click', function () {
                var query = $('#search-input').val().toLowerCase();

                document.location.hash = "suche/" + query;
            });
            $('#search-input').keypress(function (e) {
                if (e.which == 13) {
                    //NewsMap.lokalreporterModel.getSearchQuery(); //getSearchQuery();
                    var query = $('#search-input').val().toLowerCase();

                    document.location.hash = "suche/" + query;
                    return false;
                }
            });

            $(document).on("click", '.tag-item', function (e) {
                var query = $(e.target).closest('.tagit-label').html();
                document.location.hash = "suche/" + query;
            });

            $('#news-radius-box').keypress(function (e) {
                if (e.which == 13) {
                    NewsMap.lokalreporterModel.getNews($('#news-radius-box').val());//getNews($('#news-radius-box').val());
                    return false;
                }
            });
            $('.dropdown-item-category').on('click', function (e) {
                //NewsMap.lokalreporterModel.getCategory;
                var query = $(this).html().toLowerCase();

                document.location.hash = "kategorie/" + query;
            });

            $('.dropdown-item-region').on('click', function (e) {
                //NewsMap.lokalreporterModel.getRegionId
                var query = $(this).html().toLowerCase();

                document.location.hash = "region/" + query;
            });

            $('#live-button').on('click', function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "top-news";
            });
            $('#news-button').on('click', function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "nachrichten";
            });
            $('#mediathek-button').on('click', function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "mediathek";
            });

            $("#show-map-button").on("click", function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "karte";
            });

            $(document).on("click", '#fav-button', function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "favoriten";
            });

            $(document).on("click", '.article-title', function () {
                var id = $(this).closest('article').attr('id');
                document.location.hash = "artikel/" + id;
            });
            $(document).on("click", '.article-image', function () {
                var id = $(this).closest('article').attr('id');
                document.location.hash = "artikel/" + id;
            });

            $(document).on("click", '.comment-preview', function () {
                var id = $(this).closest('article').attr('id');
                document.location.hash = "artikel/" + id;
            });

            $('#comment-submit').on('click', function () {
                sendComment();
            });

            $('#register-button').on('click', function () {
                registerUser();
            });

            $('#login-button').on('click', function () {
                login();
            });

            $('#close-share-modal').on('click', function () {
                $('.modal').hide();
            });

            $('#fb-image').on('click', function () {
                fbshareCurrentPage();
            });

            $('#twitter-image').on('click', function () {
                twitterCurrentArticle();
            });

            $('#moveMapButton').on('click', function () {
               $('#map-content').css("width","20rem");
            });

            $(document).on("click", '.favorite-icon', function () {
                $(this).addClass('favorite-icon-activated');
                var id = $(this).attr('id');
                var idSplitted = id.split("-");
                bookmarkArticle(idSplitted[1]);
            });

            $(document).on("click", '.share-icon', function () {
                $('#share-modal').show();
                var id = $(this).attr('id');
                var idSplitted = id.split("-");

                toShare = idSplitted[1];

                $("#share-mail-button").attr("href", setUpEmailLink());
            });


            $(document).on('click', '.show-map-button', function () {
                var id = $(this).parent().parent().attr('id');

                var data = NewsMap.lokalreporterModel.getCurrentNews('news');
                if (data != null && data != undefined) {

                    NewsMap.DrawMap.setArticlesFromApi(data);
                    /* $('.main-content').hide();
                     $('#map-content').show();
                     $("#newsmap-content").show();*/

                    document.location.hash = "karte";

                    //var marker = L.marker([50,-20], {icon: myIcon}).addTo(map);
                    //marker.valueOf()._icon.style.backgroundColor = 'green';
                    //console.log($("#"+id));
                    NewsMap.DrawMap.changeMarkerColor(id);

                    //// MARKER DER AUSGEWÄHLTEN NACHRICHT HERVORHEBEN!!! SELBES ZUDEM FÜR TOPNEWS MACHEN ->  on click muss verändert werden dass zwischen topnews und news unterschieden wird
                }
            });

        },

        fbshareCurrentPage = function () {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURI('http://localhost/lokalreporter_konsolidierung/#artikel/' + toShare, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'));
            return false;
        },

        setUpEmailLink = function () {
            console.log(toShare);
            var link = "mailto: ?body=" + encodeURI('http://localhost/lokalreporter_konsolidierung/#artikel/' + toShare);
            return link;

        },

        twitterCurrentArticle = function () {
            window.open("https://twitter.com/intent/tweet?text=" + encodeURI('http://localhost/lokalreporter_konsolidierung/#artikel/' + toShare, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'));
            return false;

        },

        bookmarkArticle = function (id) {

            console.log(id);

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9000/user/bookmark/" + id,
                "method": "PUT",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "c771fb95-6418-c27a-6fb9-446d7bec172e",
                    "content-type": "application/x-www-form-urlencoded",
                    "authorization": token
                },
                "data": {
                    "client_id": "asdfasdf"
                }
            };

            $.ajax(settings).done(function (response) {
                getFavoriteItems();
            });
        },

        login = function () {
            var username = $('#login-username').val();
            var password = $('#login-password').val();


            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9100/token",
                "method": "PUT",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "c771fb95-6418-c27a-6fb9-446d7bec172e",
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "grant_type": "password",
                    "client_id": "asdfasdf",
                    "username": username,
                    "password": password
                }
            };

            $.ajax(settings).done(function (response) {
                token = "Bearer " + response['access_token'];
                $('#login-modal').hide();
                changeMenuAfterLogin();
                isLoggedIn = true;

            });
        },

        changeMenuAfterLogin = function () {
            $('#login-open').html('PROFIL');
            $('#register-open').html('LOGOUT');

            $('#live-button').html('IHRE NEWS');

            var favMenuItem = $('<li id="fav-button" class="main-menu-item">FAVORITEN</li>');
            $('#main-menu').append(favMenuItem);

            $('.favorite-icon').show();
            $('.favorite-icon').css('display', 'block');

            getFavoriteItems();

            //showPersonal();
        },

        getMediaItems = function () {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9000/news?attachmentTypes=video&limit=20",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                }
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                setMediaItems(response);
            });
        },

        setMediaItems = function (data) {
            $('#media-list').empty();

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                thumbnailSrc,
                videoSrc,
                commentCount;
            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id'];
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                //commentCount = data['items'][i]['news']['properties']['comments.count'];
                commentCount = '0';


                if (thumbnailSrc == '') {
                    thumbnailSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);
                if(videoSrc != 'false') {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;


                    $("#media-list").append(articleListElement);
                }

            }
            if ($(document).width() > 1100) {
                $('#media-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#media-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
        },


        getFavoriteItems = function () {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9000/user/bookmarks",
                "method": "GET",
                "headers": {
                    "authorization": token,
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                }
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                setFavoriteItems(response);
            });
        },

        setFavoriteItems = function (data) {
            $('#favorite-list').empty();

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                commentCount;
            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['news']['geoData'].length) {
                    artikelOrt = data['items'][i]['news']['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['news']['id'];
                artikelTitel = data['items'][i]['news']['title'];
                artikelLink = data['items'][i]['news']['originalLink'];
                pubDate = data['items'][i]['news']['date'];
                content = data['items'][i]['news']['abstract'];

                if ( data['items'][i]['thumbnail'] != null) {
                    imageSrc = data['items'][i]['news']['thumbnail']['source'];
                }
                //commentCount = data['items'][i]['news']['properties']['comments.count'];
                commentCount = '0';


                if (imageSrc == '' || imageSrc == undefined) {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if(data['items'][i]['news']['attachments']['items'].length && data['items'][i]['news']['attachments']['items'][0]['url'] != 'false' && data['items'][i]['news']['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['news']['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['news']['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-4 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-4 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $("#favorite-list").append(articleListElement);

            }
            if ($(document).width() > 1100) {
                $('#favorite-list > li').each(function (i) {
                    if (i % 3 == 0) {
                        $(this).nextAll().andSelf().slice(0, 3).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#favorite-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
        },

        registerUser = function () {
            var username = $('#register-username').val();
            var password = $('#register-password').val();
            var passwordRepeat = $('#register-password-again').val();

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9100/token",
                "method": "PUT",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "48b1091f-ae77-25db-36fe-3075408e6156",
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "grant_type": "register_user",
                    "client_id": "asdfasdf",
                    "email": username,
                    "password": password,
                    "password_repeat": passwordRepeat
                }
            };

            $.ajax(settings).done(function (response) {
                $('#register-modal').hide();
                token = "Bearer " + response['access_token'];
                changeMenuAfterLogin();
                isLoggedIn = true;
            });
        },

        sendComment = function () {
            var comment = $('#comment-text').val();
            var name = $('#comment-user-name').val();
            var articleHash = location.hash;
            var id = articleHash.split("/");
            var articleId = id[1];


            /*var commentSetting = {
             "crossDomain": true,

             "async": true,
             "url": "http://localhost:9000/news/" + articleId + "/comments",
             "method": "PUT",
             "headers": {
             "cache-control": "no-cache",
             "postman-token": "c771fb95-6418-c27a-6fb9-446d7bec172e",
             "content-type": "application/json",
             "Accept": "application/json",
             "authorization": token
             },
             "processData": false,
             "data": {
             "title": "…",
             "content": comment,
             "articleId": articleId
             }
             };

             $.ajax(commentSetting).done(function (response) {
             console.log(response);
             }).error(function (response) {
             console.log("error");
             });*/

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:9000/news/205733_c5967e452/comments",
                "method": "PUT",
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAFWMsQ6CMBiEi4LiQ5B0cJSGtkCBTRcTEyd4gSJ_tQmiaWni4wsymcu3fLm7NUJocwJpwARkkE8IiHn1sJq0h_ZZqtoiyUTcgmJxKjMey1KVsWAs4SnlOZSFh-YsM99ZMItAvweE_ImQGFAG7MNvjIPdrdcwjJXuQmk7NbMl2loHXVS74YAZxUd3xyyhOaa8YrzKGD5fm5DA562nn6iW4wFTgS9umGvir_YFrLE0sdMAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "0342084a-2bf0-0594-84ec-ef5c18a07a8e"
                },
                "processData": false,
                "data": "{\n    \"title\": \"I just found a fantastic\",\n    \"content\": \"I love Israeli fruit in the Winter but does it not taste bitter knowing what's going on in Palestine? The whole concept of maternity leave is an affront to gender equality - let's put an end to this patriarchal system of repression and stigmatisation! It's time to recognise that animal rights now are as important as women's rights last century.\",\n    \"articleId\": \"65556\"\n}"
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        },

        setCategoryResults = function (data, query, type) {
            query = query.charAt(0).toUpperCase() + query.slice(1);

            $('#category-headline').html(type + ' "' + query + '":');

            $('.main-content').hide();
            $('#category-content').show();
            $('.main-menu-item').removeClass('menu-item-activated');
            $('#category-button').addClass('menu-item-activated');

            $('#category-list').empty();

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                thumbnailSrc,
                videSrc,
                commentCount;
            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id']
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                imageSrc = data['items'][i]['thumbnail']['source'];
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if(data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $("#category-list").append(articleListElement);

            }
            if ($(document).width() > 1100) {
                $('#category-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#category-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
        },

        setSearchResults = function (data, query) {
            $('.main-content').hide();
            $('#search-content').show();

            $('#search-headline').html('Suchergebnisse für "' + query + '":');

            $('#search-list').empty();

            $('.main-menu-item').removeClass('menu-item-activated');

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                thumbnailSrc,
                videoSrc,
                commentCount;
            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id'];
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                imageSrc = data['items'][i]['thumbnail']['source'];
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);
                if(data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $("#search-list").append(articleListElement);


            }

            if ($(document).width() > 1100) {
                $('#search-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#search-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }

        },


        setNews = function (data) {
            $("#news-list").empty();
            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                thumbnailSrc,
                videoSrc,
                commentCount;
            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id'];
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                imageSrc = data['items'][i]['thumbnail']['source'];
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                /*  var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                 + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="' + imageSrc + '"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                 + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                 )
                 ;*/
                if(data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $("#news-list").append(articleListElement);


            }

            if ($(document).width() > 1100) {
                $('#news-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#news-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
        },

        commentCount = function () {
            $('.news-article').each(function (i) {
                var id = $(this).attr('id');
                var commentCount = "#comment-count-" + id;

                var commentSettings = {
                    "async": true,
                    "url": "http://localhost:9000/news/" + id + "/comments",
                    "method": "GET",
                    "limit": "200",
                    "headers": {
                        "Accept": "application/json",
                        "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                    }
                };

                $.ajax(commentSettings).done(function (comments) {
                    //console.log(commentCount);
                    $(commentCount).html(comments['items'].length);
                }).error(function (response) {
                    console.log("error");
                });
            });
        },

        setTopNews = function (data) {
            $("#top-list").empty();
            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                videoSrc,
                thumbnailSrc,
                commentCount;

            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id'];
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                if ( data['items'][i]['thumbnail'] != null) {
                    imageSrc = data['items'][i]['thumbnail']['source'];

                }
                commentCount = data['items'][i]['properties']['comments.count'];



                if (imageSrc == '' || imageSrc == undefined) {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if(data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }


                $("#top-list").append(articleListElement);

            }

            if ($(document).width() > 1100) {
                $('#top-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $('#top-list > li').each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }

            //commentCount();
        },

        setNachrichten = function (data) {

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region;
            /*for (i = 0; i < data.length; i++) {

             //  if (i != 0 && data[i - 1].title != data[i].title) {  //|| data.length == 2 mit in schleife ?
             EIDI = "a" + i;
             artikelTitel = data[i].title;
             artikelLink = data[i].link;
             artikelOrt = data[i].city;
             pubDate = data[i].pub_date;
             region = data[i].region;
             content = data[i].content;

             content = truncateOnWord(content, 300) + '...';


             var articleListElementFirst = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
             + '<div class="row">' + '<div class="large-12 columns"><img class="article-image top-image" src="http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate + ', ' + artikelOrt + ', ' + region + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>' + '</div>' + '</div>'
             + '</div>' + '<div class="row">' + '<button class="read-more-button top-read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</article>' + '</li>'
             )
             ;

             var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
             + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate + ', ' + artikelOrt + ', ' + region + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
             + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
             )
             ;

             /!* var artikelListElements = $('<li>' +
             '<a href="#' + EIDI + '">' + '<div>' + pubDate + '</div>' + artikelTitel + '</a>' +
             '<div' + ' id="' + EIDI + '">' + artikelOrt + ',' + region + '<br/><p>' + content + '</p><br/><a href="' + artikelLink + '" id="' + EIDI + '" class="content" target="_blank">' +

             '<i class="fi-arrow-right"> </i>zum Artikel</a>' +
             '</div> </li> <hr>');*!/


             $("#news-list").append(articleListElement);


             }*/
            $(document).foundation();


        },

        putRowInList = function (type) {


            /* for (var i = 0; i < listItems.length; i += 3) {
             //listItems.css('margin-right', '1rem');
             listItems.slice(i, i + 3).wrapAll("<div class='row large-12 columns news-row'></div>");
             }*/


            var highest = null;
            var hi = 0;
            $(".article-list").each(function () {
                var h = $(this).height();
                if (h > hi) {
                    hi = h;
                    highest = $(this);
                }
            });

            $(".article-list").css('min-height', hi);
        },

        truncateOnWord = function (str, limit) {
            var trimmable = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
            var reg = new RegExp('(?=[' + trimmable + '])');
            var words = str.split(reg);
            var count = 0;
            return words.filter(function (word) {
                count += word.length;
                return count <= limit;
            }).join('');
        },

        showContent = function () {
            $(document).scrollTop();

            $('.article-video').each(function() {
                $(this).get(0).pause();
            });
            var toShow = location.hash;
            var res = toShow.split("/");

            if (res[0] == "#artikel") {
                getSingleArticle(res[1]);
            }

            if (res[0] == "#suche") {
                NewsMap.lokalreporterModel.getSearchQuery(res[1].toLowerCase());
                $('#map-content').show();
            }

            if (res[0] == "#kategorie") {
                NewsMap.lokalreporterModel.getCategory(res[1]);
            }

            if (res[0] == "#region") {
                NewsMap.lokalreporterModel.getRegionId(res[1]);
            }
            switch (toShow) {
                case "":
                    document.location.hash = "top-news";
                    if (!isLoggedIn) {
                        showTop();
                    }
                    else
                        showPersonal();
                    break;
                case "#nachrichten":
                    showNews();
                    break;
                case "#top-news":
                    if (!isLoggedIn) {
                        showTop();
                    }
                    else
                        showPersonal();
                    break;
                case "#mediathek":
                    showMediathek();
                    break;
                case "#karte":
                    showMap();
                    break;
                case "#favoriten":
                    showFavorites();
                    break;
            }


        },


        getSingleArticle = function (id) {
            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?ids=" + id,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var contentSettings = {
                "async": true,
                "url": "http://localhost:9000/news/" + id + "/content",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var commentSettings = {
                "async": true,
                "url": "http://localhost:9000/news/" + id + "/comments",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var relatedSettings = {
                "async": true,
                "url": "http://localhost:9000/news/" + id + "/related",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };
            $.ajax(settings).done(function (article) {
                console.log(article);
                $.ajax(contentSettings).done(function (content) {
                    $.ajax(commentSettings).done(function (comments) {
                        $.ajax(relatedSettings).done(function (related) {
                            setSingleNews(article, content, comments, related);
                        }).error(function (related) {
                            console.log("error");
                            setSingleNews(article, content, comments, related);
                        });
                    }).error(function (response) {
                        console.log("error");
                    });
                }).error(function (response) {
                    console.log("error");
                });
            }).error(function (response) {
                console.log("error");
            });

        },

        setSingleNews = function (article, content, comments, related) {
            $('.main-menu-item').removeClass('menu-item-activated');
            $('.main-content').hide();
            $('#map-content').hide();

            $('#single-news-article').empty();
            $('#comment-list').empty();
            $('#related-news-list').empty();

            $('#single-news-page').show();


            console.log(article);
            var title = article['items'][0]['title'];
            var date = article['items'][0]['date'];
            var imageSrc = article['items'][0]['thumbnail']['source'];
            //var topContent = content[0]['contents'][0]['text'];
            var location;


            for (i = 0; i < article['items'][0]['geoData'].length; i++) {
                if (i == 0) {
                    location = article['items'][0]['geoData'][i]['name'];
                }
                else
                    location = location + ', ' + article['items'][0]['geoData'][i]['name'];
            }

            if (imageSrc == '') {
                imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
            }


            date = date.split("T");
            date[1] = date[1].substring(0, 8);

            var id = article['items'][0]['id'];
            var headLine = $('<h2 class="single-article-title">' + title + '</h2><i class="fi-heart favorite-icon" id="favorite-' + id + '"></i>');
            var dateLine = $('<div class="pub-date">' + date[0] + ' ' + date[1] + ', ' + location + '</div>');
            //var content1 = $('<p class="top-paragraph">' + topContent + '</p>');
            var image = $('<img class="single-article-image" src="' + imageSrc + '">');

            $("#single-news-article").append(headLine, dateLine, image, content['content']);


            var previousParagraph;

            /*for (i = 2; i < content.length - 1; i++) {

             var type = typeof content[i]['contents'];
             if (type != "undefined") {
             var paragraph = content[i]['contents'][0]['text'];

             var articleElement = $('<p>' + paragraph + '</p>');

             if (previousParagraph != paragraph)
             $("#single-news-article").append(articleElement);

             previousParagraph = paragraph;
             }

             }*/

            $('#news-tags').remove();

            $('#single-news-content').append('<ul id="news-tags"></ul>');

            for (i = 0; i < article['items'][0]['metaData'].length; i++) {
                var tag = article['items'][0]['metaData'][i]['id'];
                var tagItem = $('<li id="' + tag + '" class="tag-item">' + tag + '</li>');
                $('#news-tags').append(tagItem);
            }

            $("#news-tags").tagit({
                readOnly: true
            });

            for (i = 0; i < comments['items'].length; i++) {
                var commentDate = comments['items'][i]['createDate'];
                commentDate = commentDate.split("T");
                commentDate[1] = commentDate[1].substring(0, 8);

                var commentListItem = $('<li class="single-comment" id="' + comments['items'][i]['id'] + '">' + '<h3 class="commentator">' + comments['items'][i]['creator']['name'] + ':' + '</h3>' + '<hr class="comment-divider">' + '<h3 class="comment-title">' + comments['items'][i]['title'] + '</h3>' + '<p class="comment-paragraph">' + comments['items'][i]['content'][0]['text'] + '</p>' + '<div class="pub-date">' + commentDate[0] + ' ' + commentDate [1] + '</div>' + '</li>');

                $("#comment-list").append(commentListItem);

            }

            $('#single-news-comments').height($('#single-news-content').height());


            for (i = 0; i < related['items'].length; i++) {

                var EIDI,
                    artikelTitel,
                    artikelLink,
                    accord,
                    artikelOrt,
                    artikelRegion,
                    pubDate,
                    content,
                    region,
                    imageSrc;

                if (related['items'][i]['geoData'].length) {
                    artikelOrt = related['items'][i]['geoData'][0]['name'];
                }
                EIDI = related['items'][i]['id'];
                artikelTitel = related['items'][i]['title'];
                artikelLink = related['items'][i]['originalLink'];
                pubDate = related['items'][i]['date'];
                content = related['items'][i]['abstract'];
                imageSrc = related['items'][i]['thumbnail']['source'];

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                //var relatedListItem = $('<li class="related-list-item" id="'+ related['items'][i]['id'] +'">' + '<h3 class="related-title">'+  related['items'][i]['title'] +'</h3>' + '</li>');


                var relatedListItem = $('<li class="large-4 columns article-list related-list-item">' + '<article id="' + EIDI + '">'
                        + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                        + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                    )
                    ;


                $("#related-news-list").append(relatedListItem);

            }

            $('#related-news-list > li').each(function (i) {
                if (i % 3 == 0) {
                    $(this).nextAll().andSelf().slice(0, 3).wrapAll('<div class="row large-12 columns news-row"></div>');
                }
            });


        },

        showFavorites = function () {
            $('.main-content').hide();
            $('#map-content').show();

            $('#favorite-content').toggle();
            /*var data = NewsMap.lokalreporterModel.getCurrentNews('news');
             if (data != null && data != undefined) {
             NewsMap.DrawMap.setArticlesFromApi(data);
             }*/
        },

        showNews = function () {
            $('.main-content').hide();
            $('#map-content').show();

            $('#news-content').toggle();
            var data = NewsMap.lokalreporterModel.getCurrentNews('news');
            if (data != null && data != undefined) {
                NewsMap.DrawMap.setArticlesFromApi(data);
            }

        },

        showTop = function (e) {

            $('.main-content').hide();
            $('#map-content').show();

            $('#live-content').toggle();
            var data = NewsMap.lokalreporterModel.getCurrentNews('topnews');
            if (data != null && data != undefined) {
                NewsMap.DrawMap.setArticlesFromApi(data);
            }

        },

        showPersonal = function (e) {

            $('.main-content').hide();
            $('#map-content').show();

            $('#personal-content').toggle();
            /*var data = NewsMap.lokalreporterModel.getCurrentNews('topnews');
             if (data != null && data != undefined) {
             NewsMap.DrawMap.setArticlesFromApi(data);
             }*/

            $("#personal-tags").tagit({
                availableTags: ["wetter", "sport", "verkehr", "polizei", "ratgeber", "kultur", "religion", "oberfranken", "mittelfranken", "niederbayern", "oberpfalz", "oberbayern", "unterfranken"],
                placeholderText: "Themen hinzufügen",
                onTagClicked: function (event, ui) {
                    // do something special
                },

                afterTagAdded: function (event, ui) {
                    // do something special
                    var tag = ui.tag[0].innerText;
                    getPersonalContent(tag);
                },

                afterTagRemoved: function (event, ui) {
                    // do something special
                    var tag = ui.tag[0].firstChild.innerText;
                    removePersonalContent(tag);
                }
            });

        },

        getPersonalContent = function (tag) {
            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?metadataid=" + tag + '&limit=6',
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                setPersonalContent(response, tag);
            }).error(function (response, tag) {
                console.log("error");
            });
        },

        removePersonalContent = function (tag) {
            var toRemove = '#container-' + tag;
            $(toRemove).remove();
        },

        setPersonalContent = function (data, tag) {
            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                content,
                region,
                imageSrc,
                thumbnailSrc,
                videoSrc,
                commentCount;

            var personalContentContainer = $('<div class="personal-container" id="container-' + tag + '"><h1 class="personal-title">' + tag.charAt(0).toUpperCase() + tag.slice(1) + ':</h1><ul class="results-list personal-list-" id="personal-' + tag + '"></ul><hr></div>');

            var personalContentId = "#personal-" + tag;

            $('#personal-content').append(personalContentContainer);

            for (i = 0; i < data['items'].length; i++) {

                if (data['items'][i]['geoData'].length) {
                    artikelOrt = data['items'][i]['geoData'][0]['name'];
                }
                EIDI = data['items'][i]['id'];
                artikelTitel = data['items'][i]['title'];
                artikelLink = data['items'][i]['originalLink'];
                pubDate = data['items'][i]['date'];
                content = data['items'][i]['abstract'];
                imageSrc = data['items'][i]['thumbnail']['source'];
                commentCount = data['items'][i]['properties']['comments.count'];



                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if(data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list article-list-for-map">' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $(personalContentId).append(articleListElement);


            }

            var idForRow = personalContentId + ' > li';

            if ($(document).width() > 1100) {
                $(idForRow).each(function (i) {

                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
            else if ($(document).width() > 600) {
                $(idForRow).each(function (i) {
                    if (i % 2 == 0) {
                        $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
                    }
                });
            }
        },

        showMediathek = function () {
            getMediaItems();
            $('.main-content').hide();
            $('#map-content').show();

            $('#mediathek-content').toggle();
        },

        showMap = function () {
            $('.main-content').hide();

            if ($('#newsmap-content').hasClass('not-visible-for-init')) {
                $('#newsmap-content').removeClass('not-visible-for-init');
                $('#newsmap-content').show();
                $('#map-content').show();

            }
            else {
                $('#newsmap-content').toggle();
                $('#map-content').toggle();

            }

        };


    that.init = init;
    that.setNachrichten = setNachrichten;
    that.setNews = setNews;
    that.setTopNews = setTopNews;
    that.setCategoryResults = setCategoryResults;
    that.setSearchResults = setSearchResults;
    that.showContent = showContent;

    return that;

}());
