/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterView = (function () {
    var that = {},
        init = function () {

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
            for (i = 0; i < data.length; i++) {

                //  if (i != 0 && data[i - 1].title != data[i].title) {  //|| data.length == 2 mit in schleife ?
                EIDI = "a" + i;
                artikelTitel = data[i].title;
                artikelLink = data[i].link;
                artikelOrt = data[i].city;
                pubDate = data[i].pub_date;
                region = data[i].region;
                content = data[i].content;


                var articleListElement = $('<li class="large-12 columns article-list">' + '<article id="' + EIDI + '">'
                        + '<h2 class="article-title">' + artikelTitel + '</h2>' + '<div class="pub-date">' + pubDate + ', ' + artikelOrt + ', ' + region + '</div>' + '<br>'
                        + '<div class="row">' +'<div class="large-4 columns"><img class="article-image" src="http://blog.xebialabs.com/wp-content/uploads/2015/01/news.jpg"></div>' + '<div class="large-8 columns article-entry-summary">' + content + '</div>'
                        + '</div>' + '<button class="read-more-button">' + '<a class="more-link" target="_blank" href = "' + artikelLink + '" >Weiterlesen' + '</a>' + '</button>' + '</article>' + '</li>'
                    )
                    ;

                /* var artikelListElements = $('<li>' +
                 '<a href="#' + EIDI + '">' + '<div>' + pubDate + '</div>' + artikelTitel + '</a>' +
                 '<div' + ' id="' + EIDI + '">' + artikelOrt + ',' + region + '<br/><p>' + content + '</p><br/><a href="' + artikelLink + '" id="' + EIDI + '" class="content" target="_blank">' +

                 '<i class="fi-arrow-right"> </i>zum Artikel</a>' +
                 '</div> </li> <hr>');*/

                $("#news-list").append(articleListElement);
            }
            $(document).foundation();

        };

    that.init = init;
    that.setNachrichten = setNachrichten;
    return that;

}());
