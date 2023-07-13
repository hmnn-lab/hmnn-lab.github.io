async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);


    json = json.sort((a, b) => {
        if (a.Number > b.Number) {
          return -1;
        }
      });

    for (let i = 0; i < Object.keys(json).length; i++) {
        pubs = json[i];

        if (pubs.hasOwnProperty('PDF') && pubs['PDF'] != "") {
            var $publication = $(`<div class="grid-item font-alt center" style="grid-row: span 2;"><h4 style="color:black;">[${pubs['Number']}]</h4></div><div class="grid-item font-alt" colspan="2"><h4 style="color:black; margin-bottom: 0;">${pubs['Citation']}</h4></div><div class="grid-item font-alt" style="grid-column-start: 2;"><h4 style="margin-top: 0;"><a href="https://doi.org/${pubs['DOI']}" target="_blank">${pubs['DOI']}</a>&nbsp;&nbsp;<a href="${pubs['PDF']}" target="_blank"><img width="25" height="25" src="hmnn-assets/icons/pdf-48.png" /></a></h4></div>`);
        }

        else {
            var $publication = $(`<div class="grid-item font-alt center" style="grid-row: span 2;"><h4 style="color:black;">[${pubs['Number']}]</h4></div><div class="grid-item font-alt" colspan="2"><h4 style="color:black; margin-bottom: 0;">${pubs['Citation']}</h4></div><div class="grid-item font-alt" style="grid-column-start: 2;"><h4 style="margin-top: 0;"><a href="https://doi.org/${pubs['DOI']}" target="_blank">${pubs['DOI']}</a></h4></div>`);
        }

        $('#publications-list').append($publication);

    }
}

$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbyiEeDS64SrjXGGAcxcmiPGpt_2G3CxlL-89yqPxXQbbe-Bp-pOSk3ULjd2O3eumm_b/exec");
})