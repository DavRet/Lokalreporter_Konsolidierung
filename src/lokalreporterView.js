/**
 * Created by Tobias on 07.08.2016.
 */
NewsMap.lokalreporterView = (function () {
    var that = {},
        init = function () {

        },
        setNachrichten = function(data){

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
                artikelOrt = data[i].city;
                pubDate = data[i].pub_date;
                region = data[i].region;

                var artikelDiv = $('<li>' +
                    '<a href="#' + EIDI + '">' + '<div>' + pubDate + '</div>' + artikelTitel + '</a>' +
                    '<div' + ' id="' + EIDI + '">' + artikelOrt + ',' + region + '<br/><a href="' + artikelLink + '" id="' + EIDI + '" class="content" target="_blank">' +

                    '<i class="fi-arrow-right"> </i>zum Artikel</a>' +
                    '</div> </li>');

                $("#news-list").append(artikelDiv);
            }
            $(document).foundation();

        };

    that.init=init;
    that.setNachrichten=setNachrichten;
    return that;

}());
