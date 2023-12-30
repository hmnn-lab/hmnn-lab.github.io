async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);

    console.log(json)

    for (let i = 0; i < Object.keys(json).length; i++) {
        research = json[i];

        if (research.hasOwnProperty("MethodsDescription")) {
            // Handle the specific cell value separately, e.g., append it to a paragraph
            let MethodsDescription = research.MethodsDescription;
            $('#methods-description').text(MethodsDescription);
        } 
        else if (research.hasOwnProperty("Method") && research.hasOwnProperty("Image Path")) {
            // Handle portfolio items
            let $portfolioItem = $('<li class="work-item illustration webdesign">');
            let $thumbnail = $(`<div class="post-thumbnail"><img src="${research['Image Path']}" alt="Portfolio Item" /></div>`);
            let $header = $('<div class="post-header font-alt">');
            let $method = $(`<h2 class="post-title text-center"><a href="#">${research['Method']}</a></h2>`);

            $header.append($method);
            $portfolioItem.append($thumbnail, $header);
            $('#methods-list').append($portfolioItem);
        }
        else {
            // Create a new section for each research item
            let $section = $('<section class="module-alternate">');
            let $container = $('<div class="container">');
            let $row = $('<div class="row">');

            // Column for the image
            let $imageCol = $(`<div style="padding-left: 15px; padding-right: 15px;"><img src="${research['Infographic']}" alt="Title of Image" /></div>`);

            // Column for the details
            let $detailsCol = $('<div style="padding-left: 15px; padding-right: 15px;"><div class="work-details"></div></div>');

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
        $('.loader').fadeOut();
        $('.page-loader').delay(350).fadeOut('slow');
    }
}

$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbwnDkN9bWjq1iG6b-NjCXr9b5E-a-9XHGjWUM7vAhio5tt3slqron9VC-da0fiTsxVh/exec");
})