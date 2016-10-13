NewsMap.DrawMap = (function () {
    var marker = [],
        that = {},
        articles = [],
        markers = new L.MarkerClusterGroup(),
        markersSet = false,
        searchSelect = $("#search-select").val(),
        $dateSelect = $("#date-select"),
        dateSelectionVal = $dateSelect.val(),
        radiusSelect = $("#radius-select"),
        myLocation = null,
        $loading = null,
        $autoComplete = null,
        initLoading = true,
        favorites = [],
        favoritesVisible = false,
        lastData = [],
        tempData = [],
        searchQueries = [],
        myLat,
        myLng,
        tempLat,
        tempLon,
        greenIcon,
        apiIp = "http://132.199.141.129:9000",
        extraMarkers = false,

        map = null,
        newsDataObjects = [],
        foundArticles = [],
        foundArticlesBySearch = [],

        wordInString = function (s, word) {
            return new RegExp('\\b' + word.toLowerCase() + '\\b', 'i').test(s.toLowerCase());
        },

        init = function () {

            /*  $.ajax({
             async: false,
             type: 'GET',
             url: 'http://localhost/Konsolidierung_Lokalreporter/Config',
             success: function(data) {
             apiIp=data;
             console.log(apiIp);
             //callback
             }
             }); */

            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            $loading = $("#loading");
            $autoComplete = $("#autocomplete");

            $(document).ready(function () {
                dateSelection();
                autocomplete();
                enterListen();
                drawmap();
                checkFavorites();
            });


            return this;
        },

        getArticlesFromApi = function (radius, limit) {

            // weitere Kriterien einbauen/ für Sortierung(relevanz,datum) da Sortierung vom server gemacht wird/
            // Radius und Limit müssen von Select Feldern auf Nachrichten Seite übergeben werden

            var settings = {
                "async": true,
                "url": apiIp + "/news?radius=" + radius + "&centerpoint=lat49.008852:lng12.085179&limit=" + limit,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "authorization": "Bearer H4sIAAAAAAAEAGNmYGBgc0pNLEotYtXLS8xNZdUrys9JZQIKMzJwJBanpIEwIwMIQqTYknMyU_NKIEIMYHUMDCxAzKGXWlGQWZRaLBtcmqejYGSo4FiarmBkYGimYGBgZWBmZWKq4O4bwqFXlJoGVJXB6paYU5zKCTHOKjMFbhu7XmZxcWlqimxwYgnQHAOEOYZmCHMAnxWnzLoAAAA"
                }
            };

            $.ajax(settings).done(function (response) {
                //console.log(response);
                //console.log(response.items);
                setArticlesFromApi(response.items)

            }).error(function (response) {
                console.log("error");
            }).complete(function () {
                $loading.hide();
            });

            return false;
        },

        setArticlesFromApi = function (artikelArray) {
            //console.log(artikelArray);
            markersSet = false;
            addMarker(artikelArray);

        },

        getAllArticles = function () {

            // 500 radius und 40 limit testweise gewählt später über select oder so
            // getArticlesFromApi(500,40);
            // hier muss filter ausgelesen und getNews aus lokalrepModel aufgerufen werden?
        },

        changeMapSize = function () {

            map.invalidateSize();
        },


        drawmap = function () {
            window.onload = load_map;
        },

        load_map = function () {
            map = new L.Map('map', {zoomControl: false});


            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttribution = 'Map data &copy; 2016 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

            map.setView(new L.LatLng(48.9533, 11.3973), 8).addLayer(osm);

            getAllArticles();
        },

        enableExtraMarkers = function () {
            extraMarkers = true;
        },

        addMarker = function (data) {
            var pfad;

            if (!favoritesVisible) {
                lastData = data;
            }

            if (!markersSet) {

                //damit neue marker zusätzlich angezeigt werden(wenn nach unten gescrollt wird und neue nachrichten geladen werden
                if (extraMarkers == false) {
                    //Marker werden von Map gelöscht und Artikel wieder aus Artikelfenster
                    markers.clearLayers();
                    var currWind = NewsMap.lokalreporterView.getCurrentWindow();

                    switch (currWind) {
                        case "news":
                            if ($("#news-list").children().length > 10) {
                                $("#news-list").children().eq(4).nextAll('div').remove();
                            }

                            break;
                        case "top-news":
                            if ($("#top-list").children().length > 10) {
                                $("#top-list").children().eq(4).nextAll('div').remove();
                            }

                            break;
                        case "suche":
                            if ($("#search-list").children().length > 10) {
                                $("#search-list").children().eq(4).nextAll('div').remove();
                            }

                            break;
                        case "personal":
                            if ($("#personal-Personalisierter-Content").children().length > 10) {
                                $("#personal-Personalisierter-Content").children().eq(4).nextAll('div').remove();
                            }

                    }
                }
                else {
                    extraMarkers = false;
                }

                //for (i = 0; i < 10; i++) {
                for (i = 0; i < data.length; i++) {

                    pfad = data[i];
                    tempData.push(data[i]);

                    if (data[i].geoData == undefined) {

                        pfad = data[i]['news'];

                    }


                    //Nimmt Geo Information 2, falls nicht vorhanden -> 0, falls auch nicht vorhanden 1.

                    if (pfad.geoData[2] != undefined) {
                        if (pfad.geoData[2].geoPoint != undefined || pfad.geoData[2].geoPoint != null) {
                            var lat = pfad.geoData[2].geoPoint.lat;
                        }
                    }
                    else if (pfad.geoData[0] != undefined) {
                        if (pfad.geoData[0].geoPoint != undefined || pfad.geoData[0].geoPoint != null) {
                            var lat = pfad.geoData[0].geoPoint.lat;
                        }
                    }
                    else if (pfad.geoData[1] != undefined) {
                        if (pfad.geoData[1].geoPoint != undefined || pfad.geoData[1].geoPoint != null) {
                            var lat = pfad.geoData[1].geoPoint.lat;
                        }
                    }
                    else {
                        //alert("ERROR NO GEO INFORMATION AVAILIBLE -- LAT");
                        // Setzen einer Standart Location falls keine Vorhanden!
                        var lat = 50.14567;

                    }

                    if (pfad.geoData[2] != undefined) {
                        if (pfad.geoData[2].geoPoint != undefined || pfad.geoData[2].geoPoint != null) {
                            var lon = pfad.geoData[2].geoPoint.lon;
                        }
                    }
                    else if (pfad.geoData[0] != undefined) {
                        if (pfad.geoData[0].geoPoint != undefined || pfad.geoData[0].geoPoint != null) {
                            var lon = pfad.geoData[0].geoPoint.lon;
                        }
                    }
                    else if (pfad.geoData[1] != undefined) {
                        if (pfad.geoData[1].geoPoint != undefined || pfad.geoData[1].geoPoint != null) {
                            var lon = pfad.geoData[1].geoPoint.lon;
                        }
                    }
                    else {
                        //alert("ERROR NO GEO INFORMATION AVAILIBLE -- Lon");
                        // Setzen einer Standart Location falls keine Vorhanden!
                        var lon = 11.05928;
                    }


                    var id = pfad.id;


                    var title = pfad.title;


                    var marker = L.marker([lat, lon]);
                    $(marker).attr("data-id", id);
                    $(marker).attr("title", title);
                    var markerPopup = "<div class='marker-popup' data-id='" + id + "' ><h3 class='marker-title'>" + title + "</h3></div>";

                    //marker.bindPopup(markerPopup);
                    marker.on("click", function () {
                        var id = $(this)[0]['data-id'];
                        var currentWindow;
                        if ($("#personal-content").is(':visible')) {
                            currentWindow = "personal-content";
                        }
                        else if ($("#favorite-content").is(':visible')) {
                            currentWindow = "favorite-content";
                        }
                        else if ($("#news-content").is(':visible')) {
                            currentWindow = "news-content";
                        }
                        else if ($("#live-content").is(':visible')) {
                            currentWindow = "live-content";
                        }
                        else if ($("#search-content").is(':visible')) {
                            currentWindow = "search-content";
                        }
                        var listElement = $($("#" + currentWindow).find("#" + id)).parent();

                        if ($(window).width() < 1024) {

                            NewsMap.lokalreporterView.moveMap();
                        }


                        listElement.css("border", "10px solid #3a9bd8");

                        $('#scroll-wrapper').scrollTop(0);

                        var scrollTop = $('#scroll-wrapper').scrollTop();

                        var from = $("#lokalreporter-header").height();


                        $('#scroll-wrapper').animate({
                            scrollTop: listElement.offset().top - scrollTop - from
                        });//, 1000);


                        setTimeout(function () {
                            listElement.css("border", "");

                        }, 7000);

                    });

                    $(markerPopup).attr("id", pfad.id);

                    markers.addLayer(marker);
                    //  }
                }
                if (markers != null && map != null) {
                    map.addLayer(markers);
                }
                if (initLoading) {

                    map.setView(new L.LatLng(48.9533, 11.3973));
                    map.setZoom(8);
                    initLoading = false;
                }
                else {
                    map.setView(new L.LatLng(lat, lon));
                }

                //setChronoView(tempData);

                tempData.length = 0;
                markersSet = true;


            }

            map.on('popupopen', function (e) {
                $(".marker-popup").dotdotdot();

            });

            changeMapSize();
        },

        changeMarkerColor = function (id) {

            var allMarkers = markers.getLayers();
            for (var i = 0; i < allMarkers.length; i++) {
                if ($(allMarkers[i]).attr("data-id") == id) {
                    markers.refreshClusters();
                    markers.zoomToShowLayer(allMarkers[i], function () {
                    });
                    map.setView([allMarkers[i]._latlng.lat, allMarkers[i]._latlng.lng], 16);
                    markers.refreshClusters();
                }
            }
            changeMapSize();
        },

        enterListen = function () {

            $('#tag-search-input').keypress(function (e) {
                if (e.which == 13) {
                    getArticle($('#tag-search-input').val().toLowerCase(), searchSelect);
                    $autoComplete.empty().hide();
                    return false;    //<---- Add this line
                }
            });


        },

        getLatLonFromCity = function () {
            /*
             $.ajax({
             url: "http://nominatim.openstreetmap.org/search?format=xml&q=gerolsbach",
             type: 'GET',
             success: function (data) {
             var parsedData = $.parseXML(data);
             $data=$(parsedData);
             $lati = $data.find()
             console.log(parsedData);
             }});
             */
        },

        calculateDistance = function (lat1, lon1, lat2, lon2) {


            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;


            function deg2rad(deg) {
                return deg * (Math.PI / 180)
            }

        },

        setChronoView = function (data) {

            $(".accordion-navigation").remove();
            //$(document).foundation()

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                region;
            for (i = 0; i < data.length; i++) {

                //  if (i != 0 && data[i - 1].title != data[i].title) {  //|| data.length == 2 mit in schleife ?

                EIDI = "a" + i;
                artikelTitel = data[i].title;
                artikelLink = data[i].link;

                if (data[i].geoData[2] != undefined) {
                    if (data[i].geoData[2].name != undefined) {
                        artikelOrt = data[i].geoData[2].name;
                    }
                    else artikelOrt = "Unbekannt";
                }
                else artikelOrt = "Unbekannt";

                pubDate = data[i].date;

                if (data[i].geoData[0] != undefined) {
                    if (data[i].geoData[0].name != undefined) {
                        region = data[i].geoData[0].name;
                    }
                    else region = "Unbekannt";
                }
                else region = "Unbekannt";

                accord = $('<li class="accordion-navigation">' +
                    '<a class="accordItem" href="#' + EIDI + '">' + '<div class="chronoPubDate" >' + pubDate + '</div>' + artikelTitel + '</a>' +
                    '<div' + ' id="' + EIDI + '" class="accordDiv content disabled">' + artikelOrt + ',' + region + '<br/><a href="' + artikelLink + '" id="' + EIDI + '" class="content" target="_blank">' +

                    '<i class="fi-arrow-right"> </i>zum Artikel</a>' +
                    '</div> </li>');

                $("#chrono-wrapper").append(accord);
                $("#chrono-wrapper").css("position", "absolute");
                $("#chrono-wrapper").css("width", "100%");

            }
            $(document).foundation();
        },

        tagSearchClicked = function () {
            var query = ($('#tag-search-input').val());

            var selectedFunction;

            if (searchSelect == "location") {
                selectedFunction = "locAuto";
            }
            else if (searchSelect == "title") {
                selectedFunction = "titleAuto";
            }

            else if (searchSelect == "region") {
                selectedFunction = "regAuto";
            }
            else if (searchSelect == "tag") {
                selectedFunction = "tagAuto";
            }

            var queryItem = [query, selectedFunction];

            var queryExists = false;
            for (var i = 0; i < searchQueries.length; i++) {
                var obj = searchQueries[i];
                if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {
                    swal("Suchanfrage existiert bereits");
                    queryExists = true;
                    return false;
                }
            }
            if (!queryExists) {
                searchQueries.push(queryItem);

                var $queryLi = $("<li class='query-item'>");

                var $queryClose = $("<i class='fi-x remove-query'>");
                $queryLi.html(query);
                $($queryLi).append($queryClose);
                $($queryLi).attr('data-show', query);

                if (query != "") {
                    $("#search-queries").append($queryLi);
                }

                getArticleByQuery();
            }
            $('#autocomplete').empty().hide();
        },

        autocomplete = function () {

            $('#tag-search-input').on('input', function (e) {
                $autoComplete.empty().show();
                $(that).trigger("setAutocompletePosition");
                var min_length = 1; // min caracters to display the autocomplete
                var keyword = $('#tag-search-input').val();
                if (keyword.length == 0) {
                    $autoComplete.hide();
                }
                if (keyword.length >= min_length) {
                    var selectedFunction;

                    switch (searchSelect) {
                        case "tag":
                            selectedFunction = "tagAuto";
                            break;
                        case "location":
                            selectedFunction = "locAuto";
                            break;
                        case "region":
                            selectedFunction = "regAuto";
                            break;
                        case "title":
                            selectedFunction = "titleAuto";
                            break;
                    }

                    $.ajax({
                        url: "http://" + location.host + "/NewsMap/get_data.php",
                        type: 'GET',
                        data: {func: selectedFunction, keyword: keyword, date: dateSelectionVal},
                        success: function (data) {
                            $autoComplete.empty();
                            var parsedData = JSON.parse(data);
                            $autoComplete.show();

                            var removedDuplicates = [];

                            if (selectedFunction == "tagAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.name, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.name);
                                    }
                                });
                            }
                            else if (selectedFunction == "locAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.city, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.city);
                                    }
                                });
                            }
                            else if (selectedFunction == "regAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.region, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.region);
                                    }
                                });
                            }
                            else if (selectedFunction == "titleAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.title, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.title);
                                    }
                                });
                            }

                            $.each(removedDuplicates, function (key) {
                                var display_name = removedDuplicates[key];

                                var $li = $("<li>");
                                $li.attr("index", key).html(display_name);
                                $autoComplete.append($li);
                            });
                            $("#autocomplete li").on("click", function () {
                                var query = $(this).html();
                                $("#tag-search-input").val(query);
                                var queryItem = [query, selectedFunction];

                                $autoComplete.empty().hide();
                                var queryExists = false;
                                for (var i = 0; i < searchQueries.length; i++) {
                                    var obj = searchQueries[i];
                                    if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {
                                        swal("Suchanfrage existiert bereits");
                                        queryExists = true;
                                        return false;
                                    }
                                }
                                if (!queryExists) {
                                    searchQueries.push(queryItem);

                                    var $queryLi = $("<li class='query-item'>");
                                    //$queryLi.html($('#tag-search-input').val());
                                    var $queryClose = $("<i class='fi-x remove-query'>");
                                    $queryLi.html(query);
                                    $($queryLi).append($queryClose);
                                    $($queryLi).attr('data-show', query);
                                    $("#search-queries").append($queryLi);


                                    $("#tag-search-input").val($(this).html());

                                    //getArticle($('#tag-search-input').val(), selectedFunction);
                                    getArticleByQuery();
                                }
                            });
                        }
                    });
                }
            });
        },

        getArticle = function (selectedQuery, selectedFunction) {

            if (selectedQuery == "") {
                getAllArticles();
            }
            else {

                if (selectedFunction == "tagAuto") {
                    selectedFunction = "tag";
                }
                else if (selectedFunction == "locAuto") {
                    selectedFunction = "location";
                }
                else if (selectedFunction == "regAuto") {
                    selectedFunction = "region";
                }
                else if (selectedFunction == "titleAuto") {
                    selectedFunction = "title";
                }

                $.ajax({
                    type: "GET",
                    url: "http://" + location.host + "/NewsMap/get_data.php",
                    data: {func: selectedFunction, query: selectedQuery, date: dateSelectionVal},
                    beforeSend: function () {
                        $loading.show();
                    },
                    success: function (data) {
                        if (JSON.parse(data).length == 0) {
                            console.log("Keine Ergebnisse");
                            swal("Keine Ergebnisse zu Ihrer Anfrage gefunden", null, "error");
                        }
                        else {
                            //console.log("SUCHE: SQL-AJAX-Ergebnisse", JSON.parse(data));
                            markersSet = false;
                            addMarker(JSON.parse(data));

                        }
                    },
                    error: function (HTTPREQUEST) {
                        swal("Fehler bei der Datenbankanbindung", null, "error");
                    },
                    complete: function () {
                        $loading.hide();
                    }
                });
            }
        },

        getArticleByQuery = function () {

            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/NewsMap/get_data.php",
                data: {func: "getQueries", queries: searchQueries, date: dateSelectionVal},
                beforeSend: function () {
                    $loading.show();
                },
                success: function (data) {
                    if (JSON.parse(data).length == 0) {
                        console.log("Keine Ergebnisse");
                        swal("Keine Ergebnisse zu Ihrer Anfrage gefunden", null, "error");
                    }
                    else {
                        markersSet = false;
                        addMarker(JSON.parse(data));

                    }


                },
                error: function () {
                    swal("Fehler bei der Datenbankanbindung", null, "error");
                },
                complete: function () {
                    $loading.hide();
                }
            });
        },

        _getArticle = function (articleID) {
            for (var i = 0; i < foundArticles.length; i++) {
                if (articleID == foundArticles[i].post_id) {
                    return foundArticles[i];
                }
            }
            return "0";
        },

        selectChanged = function () {
            searchSelect = $("#search-select").val();
            $("#tag-search-input").val("");
        },

        radiusSelectChanged = function () {
            var radiusSelectVal = radiusSelect.val();
            markersSet = false;
            addMarker(lastData);
            $(that).trigger("identifyLocation");
        },

        dateSelection = function () {
            $dateSelect.on("change", function () {
                dateSelectionVal = $(this).val();
                if (searchQueries.length == 0) {
                    getAllArticles();
                }
                else {
                    getArticleByQuery();
                }
            });
        },

        fbshareCurrentPage = function () {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle()) + "&t=" + document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
            return false;
        },

        setUpEmailLink = function () {
            var link = "mailto: ?body=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle());
            return link;

        },

        twitterCurrentArticle = function () {
            {
                window.open("https://twitter.com/intent/tweet?text=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle()), 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                return false;
            }
        },


        _setLocation = function (lat, long) {
            // Removing old markers
            myLat = lat;
            myLng = long;
            if (myLocation != null) {
                map.removeLayer(myLocation);
            }
            map.setView(new L.LatLng(lat, long));

            var myLocationIcon = L.icon({
                iconUrl: 'img/mylocationicon.png',
                iconSize: [50, 50], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -100] // point from which the popup should open relative to the iconAnchor
            });

            var myLocationMarker = L.marker([lat, long], {icon: myLocationIcon});
            myLocation = myLocationMarker;
            map.addLayer(myLocationMarker);
            myLocationMarker.bindPopup("<div class='marker-popup my-location'><h3 class='marker-title'>Ihr Standort!</h3></div>").openPopup();

            $.ajax({
                url: "http://api.geonames.org/findNearbyPlaceNameJSON?lat=" + myLat + "&lng=" + myLng + "&username=mopat",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    var query = data["geonames"][0]["name"],
                        selectedQuery = "locAuto";

                    var queryItem = [query, selectedQuery];

                    var queryExists = false;
                    for (var i = 0; i < searchQueries.length; i++) {
                        var obj = searchQueries[i];
                        if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {

                            queryExists = true;
                            return false;
                        }
                    }

                    if (!queryExists) {
                        searchQueries.push(queryItem);

                        var $queryLi = $("<li class='query-item'>");

                        var $queryClose = $("<i class='fi-x remove-query'>");
                        $queryLi.html(query);
                        $($queryLi).append($queryClose);
                        $($queryLi).attr('data-show', query);

                        if (query != "") {
                            $("#search-queries").append($queryLi);
                        }
                        if (radiusSelect.val() == 6666) {
                            getAllArticles();
                        }
                        else
                            getArticleByQuery();
                    } else {
                        swal("Suchanfrage existiert bereits");
                    }
                },
                error: function () {
                    swal("Fehler beim Laden der Standortinformationen", null, "error");
                }
            });
        },

        checkFavorites = function () {

            if ($("#favorites-list li").size() == 0) {
                $("#favorites-list").html("<li id='no-favorites-info'>Noch keine Favoriten in Ihrer Liste.</li>")
            }
            else $("#no-favorites-info").remove();
        },

        addToFavorites = function (article) {
            if ($.inArray(article, favorites) == -1) {
                favorites.push(article);

                var display_name = favorites[favorites.length - 1].title;

                var $li = $("<li>");
                $li.attr("index", favorites.length - 1).html(display_name);
                $li.attr("class", "favorites-li");

                $("#favorites-list").append($li);

                checkFavorites();
            }
        },

        showFavorites = function () {
            markersSet = false;
            if (!favoritesVisible && !(jQuery.isEmptyObject(favorites))) {
                favoritesVisible = true;
                addMarker(favorites);
            }
            else if (favoritesVisible) {
                favoritesVisible = false;
                addMarker(lastData);
            }
        },

        showFavArticle = function (index) {
            map.setView(new L.LatLng(favorites[index].lat, favorites[index].lon));
            $(that).trigger("showMenuLeftForFavorite", favorites[index]);
        },

        removeQuery = function (query) {
            $.each(searchQueries, function (index) {
                if (searchQueries[index][0] == query) {
                    searchQueries.splice(index, 1);
                    return false;
                }
            });
            if (searchQueries.length == 0) {
                $("#radius-select").val("6666");
                getAllArticles();
            }
            else {
                getArticleByQuery();
            }
        };

    that.changeMarkerColor = changeMarkerColor;
    that.getArticlesFromApi = getArticlesFromApi;
    that.setArticlesFromApi = setArticlesFromApi;
    that.setUpEmailLink = setUpEmailLink;
    that.twitterCurrentArticle = twitterCurrentArticle;
    that.fbshareCurrentPage = fbshareCurrentPage;
    that._setLocation = _setLocation;
    that._getArticle = _getArticle;
    that.tagSearchClicked = tagSearchClicked;
    that.selectChanged = selectChanged;
    that.radiusSelectChanged = radiusSelectChanged;
    that.addToFavorites = addToFavorites;
    that.showFavorites = showFavorites;
    that.showFavArticle = showFavArticle;
    that.removeQuery = removeQuery;
    that.changeMapSize = changeMapSize;
    that.enableExtraMarkers = enableExtraMarkers;
    that.init = init;

    return that;
}());
