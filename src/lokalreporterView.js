/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterView = (function () {
    var token;
    var that = {},
        angezeigteNews,
        isLoggedIn = false,
        toShare,
        toggleCount = 0,
        selectedCat,
        selectedCatTyp,
        selectedRadius,
        selectedTyp,
        apiIp="http://132.199.141.129:9000",
        latestPagingInfo,
        latestPagingInfoTop,
        latestPagingInfoSearch,
        latestPagingInfoPerso,
        loadNewsEnabled,
        currentWindow,
        lastQuery="",
        init = function () {
        /*
            $.ajax({
                async: false,
                type: 'GET',
                url: 'http://localhost/Konsolidierung_Lokalreporter/Config',
                success: function(data) {
                    apiIp=data;

                    //callback
                }
            }); */


            NewsMap.lokalreporterModel.init();
            selectedCat="alle";

                selectedCatTyp="Kategorie";
                //selectedRadius="&radius=50&centerpoint=lat49.008852:lng12.085179";
                selectedRadius="&radius=50";

                  selectedTyp="?";

            $('#scroll-wrapper').on('scroll', function () {

                var scrollTop = $('#scroll-wrapper').scrollTop();
                //damit nur 1 Nachricht pro zeile ordentlich angezeigt wird bei small screens
                if (!$('#map-content').hasClass('map-content-after-scroll')) {
                    $('#map-content').addClass('map-content-after-scroll');
                }

                else if (scrollTop == 0 && $('#map-content').hasClass('map-content-after-scroll')) {
                    $('#map-content').removeClass('map-content-after-scroll');
                }

                /// Code um beim Scrollen nach unten neue Nachrichten zu laden, für News/TopNews/Persönliche News/Suche
                var pos = $(this).scrollTop();
                if(pos + $(this).innerHeight() >= $(this)[0].scrollHeight-150) {

                    switch (currentWindow){
                        case "news":
                            if(loadNewsEnabled){
                                loadNewsEnabled=false;
                                NewsMap.lokalreporterModel.getNewsWithPagingLink(latestPagingInfo);
                            }
                            break;
                        case "top-news":
                            if(loadNewsEnabled){
                                loadNewsEnabled=false;
                                NewsMap.lokalreporterModel.getNewsWithPagingLink(latestPagingInfo);
                            }
                            break;
                        case "suche":
                            if(loadNewsEnabled){
                                loadNewsEnabled=false;
                                NewsMap.lokalreporterModel.getNewsWithPagingLink(latestPagingInfo);
                            }
                            break;
                        case "personal":
                            if(loadNewsEnabled){
                                loadNewsEnabled=false;
                                NewsMap.lokalreporterModel.getNewsWithPagingLink(latestPagingInfo);
                            }
                            break;
                    }
                }
            });

            var headerHeight = $('#lokalreporter-header').height();
            $('#main').css('margin-top', headerHeight);

            NewsMap.lokalreporterModel.getTopNews(); //getTopNews();
            NewsMap.lokalreporterModel.getNews(selectedCatTyp,selectedCat,selectedRadius,selectedTyp);
            // muss getNews aufgerufen werden mit aktuellen bzw standart filter.

            $('#lokalreporter-image').on('click', function () {

                document.location.hash = "top-news";
            });

            $('#search-button-top').on('click', function () {
                var query = $('#search-input').val().toLowerCase();

                document.location.hash = "suche/" + query;
            });

            $('#search-button-top-small').on('click', function () {

                if($('#collapse-searchbar').is(':visible')) {
                    var query = $('#search-input-small').val().toLowerCase();

                    if(query != "") {
                        document.location.hash = "suche/" + query;
                    }
                    $('#collapse-searchbar').hide();

                }
                else {
                    $('#collapse-searchbar').show();
                    $('#search-input-small').focus();

                }


            });

            $('#search-input-small').keypress(function (e) {
                if (e.which == 13) {
                    var query = $('#search-input-small').val().toLowerCase();

                    document.location.hash = "suche/" + query;

                    $('#collapse-searchbar').hide();

                    return false;
                }
            });

            $('#search-input').keypress(function (e) {
                if (e.which == 13) {
                    var query = $('#search-input').val().toLowerCase();

                    document.location.hash = "suche/" + query;
                    return false;
                }
            });

            $(document).on("click", '.tag-item', function (e) {
                var query = $(e.target).closest('.tagit-label').html();
                document.location.hash = "suche/" + query;
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

            $("#comment-open").on('click', function () {

                    $('#single-news-comments').slideToggle("fast");
                    if($('#comment-img').attr('src')=="img/order.png"){
                        $('#comment-img').attr('src','img/close-dropdown.png');
                    }
                    else{
                        $('#comment-img').attr('src','img/order.png');
                    }
            });

            $(document).on("click", '#fav-button', function () {
                $('.main-menu-item').removeClass('menu-item-activated');
                $(this).addClass('menu-item-activated');
                document.location.hash = "favoriten";
            });

            $(document).on("click", '#collapse-favoriten', function () {
               // $('.main-menu-item').removeClass('menu-item-activated');
              //  $(this).addClass('menu-item-activated');
                $("#collapse-menu").hide();
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

            loadNewsEnabled=true;

            moveMap= function () {

                if (toggleCount == 1) {
                    if($(document).width() < 600) {
                        $("#map-content").css("width", "25%");
                        $(".left-content").show();
                        $(".right-content").removeClass("small-12").addClass("small-2");
                    }

                    else {
                        $("#map-content").css("width", "25%");
                        $(".left-content").removeClass("large-4 columns").addClass("large-8 columns");
                        $(".right-content").removeClass("large-8 columns").addClass("large-4 columns");
                    }

                    $("#news-list div").find("li").addClass("article-list-for-map");
                    $("#top-list div").find("li").addClass("article-list-for-map");
                    $("#search-list div").find("li").addClass("article-list-for-map");
                    $("#category-list div").find("li").addClass("article-list-for-map");
                    $("#favorite-list div").find("li").addClass("article-list-for-map");
                    $("#media-list div").find("li").addClass("article-list-for-map");

                    $("#moveMapButton img").attr("src", "img/left-arrow.png");

                    toggleCount = 0;

                }
                else {
                    if($(document).width() < 600) {
                        $("#map-content").css("width", "100%");
                        $(".left-content").show();
                        $(".right-content").removeClass("small-2").addClass("small-12");
                    }

                    else {
                        $("#map-content").css("width", "50%");
                        $(".left-content").removeClass("large-4 columns").addClass("large-8 columns");
                        $(".right-content").removeClass("large-8 columns").addClass("large-4 columns");
                    }

                    $("#news-list div").find("li").removeClass("article-list-for-map");
                    $("#top-list div").find("li").removeClass("article-list-for-map");
                    $("#search-list div").find("li").removeClass("article-list-for-map");
                    $("#category-list div").find("li").removeClass("article-list-for-map");
                    $("#favorite-list div").find("li").removeClass("article-list-for-map");
                    $("#media-list div").find("li").removeClass("article-list-for-map");


                    $(".left-content").removeClass("large-8 columns").addClass("large-4 columns");
                    $(".right-content").removeClass("large-4 columns").addClass("large-8 columns");
                    $("#news-list div").find("li").css("width", "100%");
                    $("#top-list div").find("li").css("width", "100%");
                    $("#search-list div").find("li").css("width", "100%");
                    $("#category-list div").find("li").css("width", "100%");
                    $("#favorite-list div").find("li").css("width", "100%");
                    $("#media-list div").find("li").css("width", "100%");

                    $("#moveMapButton img").attr("src", "img/right-arrow.png");

                    toggleCount = 1;
                }

                NewsMap.DrawMap.changeMapSize();

            };

            $('#moveMapButton').on('click', moveMap);

            $("#menu-button-top").on("click", function () {
               $("#collapse-menu").toggle();
            });

            $("#collapse-news").on("click", function () {

                document.location.hash = "nachrichten";
                $("#collapse-menu").hide();
            });

            $("#collapse-topnews").on("click", function () {

                document.location.hash = "top-news";
                $("#collapse-menu").hide();
            });

            $("#collapse-login").on("click", function () {

                NewsMap.NewsMapView.showLogin();
                $("#collapse-menu").hide();
            });

            $("#collapse-register").on("click", function () {

                NewsMap.NewsMapView.showRegister();
                $("#collapse-menu").hide();
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
                if($("#collapse-div").is(':visible')) {

                    $("#map-content").show();

                    var id = $(this).parent().parent().attr('id');

                    $("#moveMapButton").off('click');
                    $("#moveMapButton img").attr("src","img/x-button.png");
                    $("#moveMapButton").on('click', function () {
                        $("#map-content").hide();
                    });

                    //if (data != null && data != undefined) {

                       /* NewsMap.DrawMap.setArticlesFromApi(data); */
                        NewsMap.DrawMap.changeMarkerColor(id);

                   // }
                  /*  $("#moveMapButton img").attr("src","img/x-button.png");
                    $("#map-content").removeClass("map-content-after-scroll");
                    $("#map-content").css("width","100%");
                    $("#map-content").css("height","100%");
                    $("#map-content").css("margin","3% 3% 3% 3%"); */
                    NewsMap.DrawMap.changeMapSize();
                }
                else{
                    var id = $(this).parent().parent().attr('id');

                    $("#moveMapButton").off('click');
                    $("#moveMapButton").on('click', moveMap);

                        NewsMap.DrawMap.changeMarkerColor(id);
                        $("#moveMapButton img").attr("src","img/left-arrow.png");
                        NewsMap.DrawMap.changeMapSize();
                }
            });

            $("#select-radius").on("change", function () {
                var selected = $(':selected', this);
                    selectedRadius= "&radius="+this.value;
                //Empty News-list
                if(currentWindow=='news'){
                    $("#news-list").empty();
                }

                    if(this.value==""){
                        selectedRadius="";
                    }
                if($("#search-input").val() != "" && $("#search-input").val() != undefined){
                    NewsMap.lokalreporterModel.getFilteredSearchResults(selectedRadius,selectedTyp);
                }
                else{
                    NewsMap.lokalreporterModel.getNews(selectedCatTyp,selectedCat,selectedRadius,selectedTyp);
                }

            });

            $("#select-typ").on("change", function () {
                var selected = $(':selected', this);
                var label= selected.closest('optgroup').attr('label');
                console.log("in onchange Typ");
                //Empty News-list
                if(currentWindow=='news'){
                    $("#news-list").empty();
                    $('#loading-content').show();

                }

                if(this.value==""){
                    //selectedTyp="?attachmentTypes=video,picture&";
                    selectedTyp="?";
                }
                else{
                    selectedTyp="?attachmentTypes=video&";
                }
                console.log(selectedTyp);
                console.log($("#search-input").val());
                if($("#search-input").val() != "" && $("#search-input").val() != undefined){
                    NewsMap.lokalreporterModel.getFilteredSearchResults(selectedRadius,selectedTyp);
                }
                else{
                    NewsMap.lokalreporterModel.getNews(selectedCatTyp,selectedCat,selectedRadius,selectedTyp);
                }
            });


            $("#select-category").on("change", function () {
                var selected = $(':selected', this);
                var label= selected.closest('optgroup').attr('label');
                //Empty News-list
                if(currentWindow=='news'){
                    $("#news-list").empty();
                    $('#loading-content').show();
                }

                selectedCat=this.value;
                if(label=="Kategorie"){
                    $("#select-radius").prop('disabled', false);
                    selectedCatTyp="Kategorie";
                }
                else{
                    selectedRadius="";
                    $("#select-radius").prop('disabled', 'disabled');
                    selectedCatTyp="Region";
                    selectedCat=NewsMap.lokalreporterModel.getRegionId(this.value);
                }
                NewsMap.lokalreporterModel.getNews(selectedCatTyp,selectedCat,selectedRadius,selectedTyp);
            });
        }

        fbshareCurrentPage = function () {
            //window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(window.location.origin+'/konsolidierung_lokalreporter/#artikel/' + toShare), 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'));
            var uri=window.location.origin+'/konsolidierung_lokalreporter/#artikel/' + toShare;
            //console.log(uri);
            //console.log(encodeURI(uri));
            //console.log("https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href="+encodeURIComponent(uri));
            window.open("https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href="+encodeURIComponent(uri));
            return false;

            //https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=http://localhost/konsolidierung_lokalreporter/#artikel/46254_3634B56B&redirect_uri=http://localhost/konsolidierung_lokalreporter/#artikel/46254_3634B56B
            //https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer
            //https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=http://localhost/konsolidierung_lokalreporter/%23artikel/46254_3634B56B&redirect_uri=http://localhost/konsolidierung_lokalreporter/%23artikel/46254_3634B56B
        },

        setUpEmailLink = function () {

            var link = "mailto: ?body=" + encodeURI(window.location.origin+'/konsolidierung_lokalreporter/#artikel/' + toShare);
            return link;
        },

        twitterCurrentArticle = function () {
            console.log(toShare);
             /*TODO: test ob # vor artikel das Problem ist & mit www. versuchen sowie von webserver www.nickolai-family.de aus */
            //var uri=encodeURI(window.location.origin+'/konsolidierung_lokalreporter/%23artikel/' + toShare);
            var uri=window.location.origin+'/konsolidierung_lokalreporter/%23artikel/' + toShare;
            console.log(uri);
            window.open("http://twitter.com/intent/tweet?text=Imsharing&url="+uri);
            return false;
            //http://twitter.com/share?text=Im Sharing on Twitter&url=http://stackoverflow.com/users/2943186/youssef-subehi&hashtags=stackoverflow,example,youssefusf
        },

        getRelatedItems= function () {
            var settings = {
                "async": true,
                "url": apiIp+"/news/recommended?limit=20",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": token
                }
            };

            $.ajax(settings).done(function (response) {

                if(response.items.length==0){
                    if($("#personal-content").find("#favorite-alert").length == 0){
                        var missingFavourites = '<div id="favorite-alert"><h1>Fügen sie zuerst Favoriten hinzu.</h1><p>Hier wird ihnen eine Reihe von Artikeln vorgeschlagen, auf Basis ihrer Favoriten.</p></div>';
                        $("#personal-content").append(missingFavourites);
                    }
                    $("#map-content").hide();
                }
                else{
                    if($("#personal-content").find("#favorite-alert").length > 0){
                        console.log("vor remove favoritenalert");
                       $("#favorite-alert").remove();
                    }
                    var pagingInfo = response['pagingInfo']['properties']['links']['paging'];
                    NewsMap.lokalreporterView.setPersonalContent(response, "Personalisierter-Content",pagingInfo);
                    NewsMap.DrawMap.setArticlesFromApi(response.items);
                }


            }).error(function (response) {
                console.log("error");
            });

        },

        bookmarkArticle = function (id) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/user/bookmark/" + id,
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
                NewsMap.lokalreporterModel.getFavoriteItems(token);
            });
        },

        login = function () {
            var username = $('#login-username').val();
            var password = $('#login-password').val();


            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://132.199.141.129:9560/token",
                "method": "PUT",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "c771fb95-6418-c27a-6fb9-446d7bec172e",
                    "content-type": "application/x-www-form-urlencoded",

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

        logout = function () {
            isLoggedIn=false;
            $('#login-open').html('Login');
            $('#collapse-login').html('Login');
            $('#register-open').html('Register');
            $('#register-open').off("click");
            $('#collapse-register').html('Register');
            $('#collapse-register').off("click");
            $('#login-open').on('click', NewsMap.NewsMapView.showLogin);
            $('#register-open').on('click', NewsMap.NewsMapView.showRegister);
            $("#live-button").html("Top-News");

            $('.favorite-icon').show();
            $('.favorite-icon').css('display', 'block');
            $("#fav-button").remove();
            $("#collapse-favoriten").remove();
            $("#favorite-content").hide();
            $("#personal-content").css('display', 'none');
            $("#container-Personalisierter-Content").remove();
            $("#favorite-list div").remove();

            NewsMap.lokalreporterModel.getTopNews();
            $("#live-content").css('display', 'block');
            $('.main-menu-item').removeClass('menu-item-activated');
            $('#live-button').addClass('menu-item-activated');
        },

        changeMenuAfterLogin = function () {
            $('#login-open').html('Profil');
            $('#collapse-login').html('Profil');
            $('#register-open').html('Logout');
            $('#register-open').off("click");
            $('#register-open').on("click",logout);
            $('#collapse-register').html('Logout');
            $('#collapse-register').on("click",logout);

            $('#live-button').html('Ihre News');
            $('#collapse-topnews').html('Ihre News');

            $('.main-menu-item').removeClass('menu-item-activated');
            $('#live-button').addClass('menu-item-activated');
            //document.location.hash = "top-news";

            var favMenuItem = $('<li id="fav-button" class="main-menu-item">Favoriten</li>');
            $('#main-menu').append(favMenuItem);

            var favCollapseMenuItem = $('<li id="collapse-favoriten" class="collapse-menu-item">Favoriten</li>');
            favCollapseMenuItem.insertBefore('#collapse-menu li:last-child');

            $('.favorite-icon').show();
            $('.favorite-icon').css('display', 'block');

            NewsMap.lokalreporterModel.getFavoriteItems(token);
            getRelatedItems();
            showPersonal();

        },

        getMediaItems = function () {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/news?attachmentTypes=video&limit=20",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "abeec082-341a-ccd1-2cc8-169828f412de"
                }
            };

            $.ajax(settings).done(function (response) {

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
                if (videoSrc != 'false') {
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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }
        },


        setFavoriteItems = function (data) {
            loadNewsEnabled=true;
            if(data.items.length==0 || data==undefined || data.items==undefined){
                $('#favorite-list').append($('<li><h3>Leider haben sie noch keine Favoriten hinzugefügt.</h3><p>Dazu Wählen sie einfach das Herz Symbol bei einem Artikel aus</p></li>'));
                $("#map-content").css("display","none");
            }
            else {
                $('#favorite-list').empty();

                var widthForArticleClass = " article-list-for-map";
                var width = $(window).width(), height = $(window).height();

                if (width <= 512) {
                    widthForArticleClass = "";
                }


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

                    if (data['items'][i]['news']['thumbnail'] != null) {
                        imageSrc = data['items'][i]['news']['thumbnail']['source'];
                    }
                    //commentCount = data['items'][i]['news']['properties']['comments.count'];
                    commentCount = '0';


                    if (imageSrc == '' || imageSrc == undefined) {
                        imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                    }

                    pubDate = pubDate.split("T");
                    pubDate[1] = pubDate[1].substring(0, 8);

                    if (data['items'][i]['news']['attachments']['items'].length && data['items'][i]['news']['attachments']['items'][0]['url'] != 'false' && data['items'][i]['news']['attachments']['items'][0]['type'] == 'video') {
                        thumbnailSrc = data['items'][i]['news']['attachments']['items'][0]['thumbnailUrl'];
                        videoSrc = data['items'][i]['news']['attachments']['items'][0]['url'];

                        var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list' + widthForArticleClass + '"><article class="news-article" id="' + EIDI + '">'
                                + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                                + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                            )
                            ;
                    }
                    else {
                        var articleListElement = $('<li class="large-6 small-12 medium-6 columns article-list' + widthForArticleClass + '"><article class="news-article" id="' + EIDI + '">'
                                + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                                + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                            )
                            ;
                    }

                    $("#favorite-list").append(articleListElement);

                }
                if ($(document).width() > 1100) {
                    $('#favorite-list > li').each(function (i) {
                        if (i % 2 == 0) {
                            $(this).nextAll().andSelf().slice(0, 2).wrapAll('<div class="row large-12 columns news-row"></div>');
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

            }

                if (isLoggedIn) {
                    $('.favorite-icon').show();
                }

        },

        registerUser = function () {
            var username = $('#register-username').val();
            var password = $('#register-password').val();
            var passwordRepeat = $('#register-password-again').val();

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://132.199.141.129:9560/token",
                "method": "PUT",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "48b1091f-ae77-25db-36fe-3075408e6156",
                    "content-type": "application/x-www-form-urlencoded",

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
            var articleHash = location.hash;
            var id = articleHash.split("/");
            var articleId = id[1];
            var name = $('#comment-user-name').val();
            var commentContent = {articleId: articleId, name: name, content: comment};


            var c = JSON.stringify(commentContent);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": apiIp+"/news/" + articleId + "/comments",
                "method": "PUT",
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAFWMsQ6CMBiEi4LiQ5B0cJSGtkCBTRcTEyd4gSJ_tQmiaWni4wsymcu3fLm7NUJocwJpwARkkE8IiHn1sJq0h_ZZqtoiyUTcgmJxKjMey1KVsWAs4SnlOZSFh-YsM99ZMItAvweE_ImQGFAG7MNvjIPdrdcwjJXuQmk7NbMl2loHXVS74YAZxUd3xyyhOaa8YrzKGD5fm5DA562nn6iW4wFTgS9umGvir_YFrLE0sdMAAAA",
                    "cache-control": "no-cache",
                    "postman-token": "0342084a-2bf0-0594-84ec-ef5c18a07a8e"
                },
                "processData": false,
                "data": c
            };

            $.ajax(settings).done(function (response) {

                setComments(articleId);
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

                if (data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
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
            if (isLoggedIn) {
                $('.favorite-icon').show();
            }
        },

        setSearchResults = function (data, query,pagingInfo) {

            loadNewsEnabled=true;
            latestPagingInfoSearch=pagingInfo;
            console.log(pagingInfo);
            $('.main-content').hide();
            $('#search-content').show();
            $("#select-category").prop('disabled','disabled');
            $('#search-headline').html('Suchergebnisse für "' + query + '":');

                if(query != lastQuery){
                    lastQuery=query;
                    $('#search-list').empty();
                }

            //$('#search-list').empty();

            $('.main-menu-item').removeClass('menu-item-activated');

            var widthForArticleClass = " article-list-for-map";
            var width = $(window).width(), height = $(window).height();

            if (width <= 512){
                widthForArticleClass="";
            }

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
                if (data['items'][i]['thumbnail'] != null) {
                    imageSrc = data['items'][i]['thumbnail']['source'];

                }
                else{
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }


                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);
                if (data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type']['id'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"' + '<article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"' + '<article class="news-article" id="' + EIDI + '">'
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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }
        },



        commentCount = function () {
            $('.news-article').each(function (i) {
                var id = $(this).attr('id');
                var commentCount = "#comment-count-" + id;

                var commentSettings = {
                    "async": true,
                    "url": apiIp+"/news/" + id + "/comments",
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

        setTopNews = function (data,pagingInfo) {
            loadNewsEnabled=true;
            latestPagingInfoTop=pagingInfo;
            //$("#top-list").empty();
            var widthForArticleClass = " article-list-for-map";
            var width = $(window).width(), height = $(window).height();

            if (width <= 512){
                widthForArticleClass="";
            }

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
                if (data['items'][i]['thumbnail'] != null) {
                    imageSrc = data['items'][i]['thumbnail']['source'];

                }
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '' || imageSrc == undefined) {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if (data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type']['id'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }

            //commentCount();
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

            $('.article-video').each(function () {
                $(this).get(0).pause();
            });
            var toShow = location.hash;
            var res = toShow.split("/");

            if (res[0] == "#artikel") {

                getSingleArticle(res[1]);
                currentWindow="single";
            }

            if (res[0] == "#suche") {
                currentWindow="suche";
                NewsMap.lokalreporterModel.getSearchQuery(res[1].toLowerCase());
            }

            if (res[0] == "#kategorie") {
                NewsMap.lokalreporterModel.getCategory(res[1]);
            }

            if (res[0] == "#region") {
                NewsMap.lokalreporterModel.getRegionId(res[1]);
            }
            console.log("To Show :"+toShow );
            switch (toShow) {

                case "":
                    document.location.hash = "top-news";
                    currentWindow="top-news";
                    if (!isLoggedIn) {
                        showTop();
                    }
                    else {
                        currentWindow="personal";
                        getRelatedItems();
                        showPersonal();
                    }

                    break;
                case "#nachrichten":
                    currentWindow="news";
                    showNews();
                    break;
                case "#top-news":
                    currentWindow="top-news";
                    if (!isLoggedIn) {
                        showTop();
                    }
                    else {
                        currentWindow="personal";
                        getRelatedItems();
                        showPersonal();
                    }
                    break;
                case "#mediathek":
                    showMediathek();
                    break;
                case "#karte":
                    showMap();
                    break;
                case "#favoriten":
                    currentWindow="favorites";
                    showFavorites();

                    break;
            }
        },


        getSingleArticle = function (id) {
            var settings = {
                "async": true,
                "url": apiIp+"/news?ids=" + id,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var contentSettings = {
                "async": true,
                "url": apiIp+"/news/" + id + "/content",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var commentSettings = {
                "async": true,
                "url": apiIp+"/news/" + id + "/comments",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            var relatedSettings = {
                "async": true,
                "url": apiIp+"/news/" + id + "/related",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };
            $.ajax(settings).done(function (article) {
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

        setComments = function(id) {
            $("#comment-list").empty();


            var commentSettings = {
                "async": true,
                "url": apiIp+"/news/" + id + "/comments",
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };
            $.ajax(commentSettings).done(function (comments) {
                for (i = 0; i < comments['items'].length; i++) {
                    var commentDate = comments['items'][i]['createDate'];
                    commentDate = commentDate.split("T");
                    commentDate[1] = commentDate[1].substring(0, 8);

                    var commentListItem = $('<li class="single-comment" id="' + comments['items'][i]['id'] + '">' + '<h3 class="commentator">' + comments['items'][i]['name'] + ':' + '</h3>' + '<hr class="comment-divider">' +  '<p class="comment-paragraph">' + comments['items'][i]['content'] + '</p>' + '<div class="pub-date">' + commentDate[0] + ' ' + commentDate [1] + '</div>' + '</li>');

                    $("#comment-list").append(commentListItem);
                }
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
            $("#select-radius,#select-category,#select-typ").hide();
            var widthForArticleClass = " related-list-item";
            var width = $(window).width(), height = $(window).height();

            if (width <= 512) {
                widthForArticleClass = "";
                $("#single-news-comments").hide();
                $("#comment-open").show();
            }
            if(width <= 1024){
                $("#single-news-comments").hide();
                $("#comment-open").show();
            }

            console.log(article);
            var imageSrc;
            var title = article['items'][0]['title'];
            var date = article['items'][0]['date'];
            if(article['items'][0]['thumbnail']==undefined){
                imageSrc= "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
            }
            else {
                imageSrc = article['items'][0]['thumbnail']['source'];
            }
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

                var commentListItem = $('<li class="single-comment" id="' + comments['items'][i]['id'] + '">' + '<h3 class="commentator">' + comments['items'][i]['name'] + ':' + '</h3>' + '<hr class="comment-divider">' +  '<p class="comment-paragraph">' + comments['items'][i]['content'] + '</p>' + '<div class="pub-date">' + commentDate[0] + ' ' + commentDate [1] + '</div>' + '</li>');

                $("#comment-list").append(commentListItem);

            }

            /* $('#single-news-comments').height($('#single-news-content').height()); */


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
                if(related['items'][i]['thumbnail']==undefined){
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }
                else {
                    imageSrc = related['items'][i]['thumbnail']['source'];
                }

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                //var relatedListItem = $('<li class="related-list-item" id="'+ related['items'][i]['id'] +'">' + '<h3 class="related-title">'+  related['items'][i]['title'] +'</h3>' + '</li>');


                var relatedListItem = $('<li class="large-4 columns article-list'+widthForArticleClass+'>' + '<article id="' + EIDI + '">'
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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }
        },


        showFavorites = function () {
            $('.main-content').hide();

            $('#favorite-content').toggle();
            var data = NewsMap.lokalreporterModel.getCurrentFavorite();
             if (data != null && data != undefined) {

             NewsMap.DrawMap.setArticlesFromApi(data);
             }
        },

        showNews = function () {
            console.log("in showNews");
            $("#select-category").prop('disabled',false);
            $('.main-content').hide();
            $('#news-content').toggle();
            $("#search-input").val("");
            $("#select-radius,#select-category,#select-typ").show();
            var data = NewsMap.lokalreporterModel.getCurrentNews('news');
            console.log(data);
            if (data != null && data != undefined) {
                console.log("setArticlesFrom Api Current News");
                NewsMap.DrawMap.setArticlesFromApi(data);
            }

            setTimeout(function () {
                $('#map-content').show();
                NewsMap.DrawMap.changeMapSize();

            }, 1500);
        },

        showTop = function (e) {
            $("#select-category").prop('disabled',false);
            $('.main-content').hide();
            $('#live-content').toggle();
            $("#search-input").val("");
            $("#select-radius,#select-category,#select-typ").hide();
            var data = NewsMap.lokalreporterModel.getCurrentNews('topnews');
            if (data != null && data != undefined) {
                NewsMap.DrawMap.setArticlesFromApi(data);
            }

           setTimeout(function () {
                $('#map-content').show();
                NewsMap.DrawMap.changeMapSize();
            }, 1500);

        },


        showPersonal = function (e) {
            currentWindow="personal";
            $('#select-category').hide();
            $('#select-typ').hide();
            $('#select-radius').hide();
            $('.main-content').hide();


            $('#personal-content').toggle();

            if($.find("#favorite-alert").length==0){
                $("#map-conent").hide();
            }
            else{
                $("#map-content").css("display","block");

            }

            /*
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
                    $('#map-content').show();
                },

                afterTagRemoved: function (event, ui) {
                    // do something special
                    var tag = ui.tag[0].firstChild.innerText;
                    removePersonalContent(tag);
                }
            });
            */

        },

       /*  getPersonalContent = function (tag) {
            var settings = {
                "async": true,
                "url": apiIp+"/news?metadataid=" + tag + '&limit=6',
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
        }, */

        setPersonalContent = function (data, tag, pagingInfo) {
            latestPagingInfoPerso=pagingInfo;
            loadNewsEnabled=true;
            var widthForArticleClass = " article-list-for-map";
            var width = $(window).width(), height = $(window).height();

            if (width <= 512){
                widthForArticleClass="";
            }


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

            /* var personalContentContainer = $('<div class="personal-container" id="container-' + tag + '"><h1 class="personal-title">' + tag.charAt(0).toUpperCase() + tag.slice(1) + ':</h1><ul class="results-list personal-list-" id="personal-' + tag + '"></ul><hr></div>'); */
            var personalContentContainer = $('<div class="personal-container" id="container-' + tag + '"><ul class="results-list personal-list-" id="personal-' + tag + '"></ul><hr></div>');

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
                if(data['items'][i]['thumbnail']==undefined){
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }
                else {
                    imageSrc = data['items'][i]['thumbnail']['source'];
                }
               /* imageSrc = data['items'][i]['thumbnail']['source']; */
                commentCount = data['items'][i]['properties']['comments.count'];


                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                if (data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }
        },

        showMediathek = function () {
            getMediaItems();
            $('.main-content').hide();
            $('#mediathek-content').toggle();
            /*  setTimeout(function () {
                $('#map-content').show();
                NewsMap.DrawMap.changeMapSize();

            }, 1500); */
        },

        getCurrentWindow = function () {
          return currentWindow;
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

        },

        setNews= function (data,pagingInfo) {
            //console.log(pagingInfo);
            loadNewsEnabled=true;
            latestPagingInfo=pagingInfo;
            var widthForArticleClass = " article-list-for-map";
            var width = $(window).width(), height = $(window).height();

            if (width <= 512){
                widthForArticleClass="";
            }

            // auskommentiert damit bei Scroll Bottom neue Nachrichten appendet werden und die alten nicht gelöscht werden
            //$("#news-list").empty();
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


                if(data['items'][i]['thumbnail']==undefined){
                        imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }
                else {
                    imageSrc = data['items'][i]['thumbnail']['source'];
                }
                commentCount = data['items'][i]['properties']['comments.count'];

                if(pubDate == undefined){
                    pubDate= "unbekannter Ort";
                }

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
                if (data['items'][i]['attachments']['items'].length && data['items'][i]['attachments']['items'][0]['url'] != 'false' && data['items'][i]['attachments']['items'][0]['type']['id'] == 'video') {
                    thumbnailSrc = data['items'][i]['attachments']['items'][0]['thumbnailUrl'];
                    videoSrc = data['items'][i]['attachments']['items'][0]['url'];

                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns video-box text-center"><video class="article-video" controls poster="' + thumbnailSrc + '"><source src="' + videoSrc + '" type="video/mp4"></video></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div><i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }
                else {
                    var articleListElement = $('<li class="large-6 small-10 medium-6 columns article-list'+widthForArticleClass+'"><article class="news-article" id="' + EIDI + '">'
                            + '<div class="row">' + '<div class="large-12 columns image-box text-center"><img class="article-image" src="' + imageSrc + '"></div>' + '</div>' + '<div class="row">' + '<div class="large-12 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                            + '<div class="row text-center">' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="comment-preview"><img class="comment-icon" height="48" width="48" src="img/chat.png"/> <div  id="comment-count-' + EIDI + '" class="comment-count">' + commentCount + '</div></div>' + '<div class="show-map-button"><img class="map-icon" height="48" width="48" src="img/map-location.png"/></div>' + '<i class="fi-heart favorite-icon small-fav-icon" id="favorite-' + EIDI + '"></i><i class="fi-share share-icon small-share-icon" id="share-' + EIDI + '"></i>' + '</div>' + '</article>' + '</li>'
                        )
                        ;
                }

                $("#news-list").append(articleListElement);
            }
            $('#loading-content').hide();


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

            if (isLoggedIn) {
                $('.favorite-icon').show();
            }

        };


    that.init = init;
    that.getCurrentWindow=getCurrentWindow;
    that.setNews=setNews;
    that.setTopNews = setTopNews;
    that.setCategoryResults = setCategoryResults;
    that.setSearchResults = setSearchResults;
    that.showContent = showContent;
    that.setPersonalContent=setPersonalContent;
    that.setFavoriteItems=setFavoriteItems;
    return that;

}());
