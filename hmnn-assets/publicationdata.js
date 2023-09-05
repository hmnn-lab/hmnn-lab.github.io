async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    const json = JSON.parse(y);

    // Sort the publications by year
    const sortedJson = json.sort((a, b) => {
        const yearA = extractYearFromCitation(a['Citation']);
        const yearB = extractYearFromCitation(b['Citation']);
        return yearB - yearA;
    });

    const publicationsByYear = groupPublicationsByYear(sortedJson);

    const $gridContainer = $('#publications-list');

    const years = Object.keys(publicationsByYear).reverse();

    years.forEach((year, index) => {
        if (publicationsByYear.hasOwnProperty(year)) {
            const isExpandedClass = index === 0 ? '' : ' collapsed';
            const expandSymbol = index === 0 ? '<i class="fas fa-caret-right"></i>' : '<i class="fas fa-caret-right"></i>';
    
            const $yearTitle = $(`<div class="year-title${isExpandedClass} rounded-box"><h3>${year}</h3><span class="expand-icon">${expandSymbol}</span></div>`);
    
            $gridContainer.append($yearTitle);
    
            const $publicationsContainer = $(`<div class="publications-container${isExpandedClass}"></div>`); // Remove the initial style
    
            if (index === 0) {
                $publicationsContainer.css({ 'display': 'block', 'opacity': '1' }); // Set initial style for the first year
            }
    
            const publications = publicationsByYear[year];
            publications.forEach(pub => {
                const $publication = createPublicationElement(pub);
                $publicationsContainer.append($publication);
            });
    
            $gridContainer.append($publicationsContainer);
    
            if (index !== 0) {
                $publicationsContainer.hide();
            }
    
            $yearTitle.click(function () {
                $publicationsContainer.slideToggle(200);
                const $expandIcon = $(this).find('.expand-icon');
                const isExpanded = $publicationsContainer.hasClass('expanded');
                $expandIcon.css('transform', isExpanded ? 'rotate(0deg)' : 'rotate(90deg)');
                $publicationsContainer.toggleClass('expanded');
            });
    
            // Rotate the expand icon for the first year
            if (index === 0) {
                const $expandIcon = $yearTitle.find('.expand-icon');
                $expandIcon.css('transform', 'rotate(90deg)');
                $publicationsContainer.addClass('expanded'); // Ensure it's marked as expanded
            }
        }
    });
}

function extractYearFromCitation(citation) {
    const match = citation.match(/\((\d{4})\)/);
    if (match) {
        return parseInt(match[1]);
    }
    return null;
}

function groupPublicationsByYear(json) {
    const publicationsByYear = {};
    json.forEach(pub => {
        const year = extractYearFromCitation(pub['Citation']);
        if (year !== null) {
            if (!publicationsByYear[year]) {
                publicationsByYear[year] = [];
            }
            publicationsByYear[year].push(pub);
        }
    });
    return publicationsByYear;
}

function createPublicationElement(pub) {
    let $publication;

    if (pub.hasOwnProperty('PDF') && pub['PDF'] !== "") {
        $publication = $(`
            <div class="grid-item font-alt" style="padding-left: 20px;">
                <h4 style="color: black; margin-bottom: 0;">${pub['Citation']}</h4>
                <h4 style="margin-top: 0;">
                    <a href="https://doi.org/${pub['DOI']}" target="_blank">${pub['DOI']}</a>&nbsp;&nbsp;
                    <a href="${pub['PDF']}" target="_blank">
                        <img width="20" height="20" src="hmnn-assets/icons/pdf-48.png" style="margin-bottom: 5px;" />
                    </a>
                </h4>
            </div>
        `);
    } else {
        $publication = $(`
            <div class="grid-item font-alt" style="padding-left: 20px;">
                <h4 style="color: black; margin-bottom: 0;">${pub['Citation']}</h4>
                <h4 style="margin-top: 0;">
                    <a href="https://doi.org/${pub['DOI']}" target="_blank">${pub['DOI']}</a>
                </h4>
            </div>
        `);
    }

    return $publication;
}



$(window).on('load', function () {
    getData("https://script.google.com/macros/s/AKfycbyiEeDS64SrjXGGAcxcmiPGpt_2G3CxlL-89yqPxXQbbe-Bp-pOSk3ULjd2O3eumm_b/exec");
})
