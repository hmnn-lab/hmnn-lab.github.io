async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);

    console.log(json)

    for (let i = 0; i < Object.keys(json).length; i++) {
        funds = json[i];

        var $funding = $(`<h3 class = "font-alt">${funds['Title']}</h3><h4 class = "font-alt"><i class="fa fa-fw"></i> ${funds['Agency']} &nbsp;&nbsp; <i class="fa fa-fw"></i> ${funds['Duration']} &nbsp;&nbsp; <i class="fa fa-fw"></i> ${funds['Amount']}</h4><h5 class = "font-alt">${funds['Summary']}</h5>`);
        $('#funding-list').append($funding);
    }
}

$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbzHC7eqrlPxvnpm7QOM4uv1sRgXVTmeGu1SVUmRazpH-Mt20zF4WRwa8RfRL9gzcmSQ/exec");
})