async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);

    console.log(json)

    for (let i = 0; i < Object.keys(json).length; i++) {
        dataItem = json[i];

        if (dataItem.sheetIdentifier === "Grants") {
            var $funding = $(`<h3 class="font-alt" style="color: black; font-size: 1.2em;">${dataItem['Title']}</h3><h4 class="font-alt"><i class="fa fa-fw"></i>&nbsp;${dataItem['Agency']} &nbsp;&nbsp; <i class="fa fa-fw"></i>&nbsp;${dataItem['Duration']} &nbsp;&nbsp; <i class="fa fa-fw"></i>&nbsp;${dataItem['Amount']} &nbsp;&nbsp; Role: ${dataItem['Role']}</h4>`);
            $('#funding-list').append($funding);
        } else if (dataItem.sheetIdentifier === "Funding Agencies") {
            var $galleryItem = $(`<div class="col-sm-6 col-md-3 col-lg-3"><a href="${dataItem['Website']}" target="_blank"><img src="${dataItem['LogoPath']}" alt="${dataItem['Title']} Logo"></a></div>`);
            $('#gallery-container').append($galleryItem);
        }
    }

    // Add clearfix after every 4th item (adjust based on your layout)
    $('#gallery-container .col-md-3:nth-child(4n)').after('<div class="clearfix visible-md-block"></div>');
    $('#gallery-container .col-lg-3:nth-child(4n)').after('<div class="clearfix visible-lg-block"></div>');
}

$(window).on('load', function () {
    getData("https://script.google.com/macros/s/AKfycbzHC7eqrlPxvnpm7QOM4uv1sRgXVTmeGu1SVUmRazpH-Mt20zF4WRwa8RfRL9gzcmSQ/exec"); // REPLACE with your App Script URL
});
