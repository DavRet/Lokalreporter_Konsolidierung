/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterView = (function () {
    var that = {},
        init = function () {
            getTopNews();
            getNews(20);
            $('#search-button-top').on('click', getSearchQuery);
            $('#search-input').keypress(function (e) {
                if (e.which == 13) {
                    getSearchQuery();
                    return false;
                }
            });
            $('#news-radius-box').keypress(function (e) {
                if (e.which == 13) {
                    getNews($('#news-radius-box').val());
                    return false;
                }
            });
            $('.dropdown-item-category').on('click', getCategory);
            $('.dropdown-item-region').on('click', getRegionId);
        },

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
                setTopNews(response);
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
                setNews(response);
            }).error(function (response) {
                console.log("error");
            });
            return false;

        },

        getRegionId = function () {
            var query = $(this).html();

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

                for (i = 0; i < response.length; i++) {
                    if(response[i]['name'] == query) {
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
                setCategoryResults(response, query, type);
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getCategory = function () {
            var query = $(this).html().toLowerCase();

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
                setCategoryResults(response, query, type);
            }).error(function (response) {
                console.log("error");
            });
            return false;
        },

        getSearchQuery = function () {
            var query = $('#search-input').val().toLowerCase();

            var settings = {
                "async": true,
                "url": "http://localhost:9000/news?metadataid=" + query,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                setSearchResults(response, query);
            }).error(function (response) {
                console.log("error");
            });
            return false;
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
                imageSrc;
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

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                        + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="' + imageSrc + '"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                        + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                    )
                    ;

                $("#category-list").append(articleListElement);

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
                imageSrc;
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

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                        + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="' + imageSrc + '"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                        + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                    )
                    ;

                $("#search-list").append(articleListElement);

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
                imageSrc;
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

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                        + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="' + imageSrc + '"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                        + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                    )
                    ;

                $("#news-list").append(articleListElement);

            }

        },

        setTopNews = function (data) {
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

                if (imageSrc == '') {
                    imageSrc = "http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg";
                }

                pubDate = pubDate.split("T");
                pubDate[1] = pubDate[1].substring(0, 8);

                var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                        + '<div class="row">' + '<div class="large-6 columns"><img class="article-image" src="' + imageSrc + '"></div>' + '<div class="large-6 columns">' + '<h3 class="article-title">' + artikelTitel + '</h3>' + '<div class="pub-date">' + pubDate[0] + ' ' + pubDate[1] + ', ' + artikelOrt + '</div>' + '<br>' + '<div class="article-entry-summary" id="entry-' + i + '">' + content + '</div>'
                        + '<div class="row text-center">' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</div>' + '</div>' + '</div>' + '</article>' + '</li>'
                    )
                    ;

                $("#top-list").append(articleListElement);

            }

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

        truncateOnWord = function (str, limit) {
            var trimmable = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
            var reg = new RegExp('(?=[' + trimmable + '])');
            var words = str.split(reg);
            var count = 0;
            return words.filter(function (word) {
                count += word.length;
                return count <= limit;
            }).join('');
        };

    that.init = init;
    that.setNachrichten = setNachrichten;
    return that;

}());
