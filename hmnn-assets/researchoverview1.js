async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);

    console.log(json)

    for (let i = 0; i < Object.keys(json).length; i++) {
        research = json[i];

        // Create a new section for each research item
        let $section = $('<section class="module-alternate">');
        let $container = $('<div class="container">');
        let $row = $('<div class="row">');

        // Column for the image
        let $imageCol = $(`<div class="col-sm-6 col-md-5 col-lg-5"><img src="${research['Infographic']}" alt="Title of Image" /></div>`);

        // Column for the details
        let $detailsCol = $('<div class="col-sm-6 col-md-7 col-lg-7"><div class="work-details"></div></div>');

        // Title
        let $title = $(`<h3 class="work-details-title font-alt">${research['Title']}</h3>`);

        // Horizontal line
        let $hr = $('<hr class="divider-w mt-10 mb-10">');

        // Summary/Paragraph
        let $summary = $(`<p>${research['Summary']}</p>`);

        // Append elements to the DOM
        $detailsCol.find('.work-details').append($title, $hr, $summary);
        $row.append($imageCol, $detailsCol);
        $container.append($row);
        $section.append($container);

        // Append the section to the research list
        $('#research-list').append($section);
    }
}

$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbwnDkN9bWjq1iG6b-NjCXr9b5E-a-9XHGjWUM7vAhio5tt3slqron9VC-da0fiTsxVh/exec");
})