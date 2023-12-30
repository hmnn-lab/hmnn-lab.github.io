async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    const json = JSON.parse(y);

    // Group publications by affiliation and then by year
    const publicationsByAffiliation = groupPublicationsByAffiliation(json);

    // Sort affiliations based on the latest year
    const sortedAffiliations = Object.keys(publicationsByAffiliation).sort((a, b) => {
        const maxYearA = Math.max(...Object.keys(publicationsByAffiliation[a]));
        const maxYearB = Math.max(...Object.keys(publicationsByAffiliation[b]));
        return maxYearB - maxYearA;
    });

    const $gridContainer = $('#publications-list');

    sortedAffiliations.forEach((affiliation, affiliationIndex) => {
        const affiliationPublications = publicationsByAffiliation[affiliation];
        const $affiliationContainer = $(`<div class="well well-sm"><h3 class="font-alt text-center" style="margin-top: 0;"><strong>${affiliation}</strong></h3></div>`);

        $gridContainer.append($affiliationContainer);

        const years = Object.keys(affiliationPublications).sort((a, b) => b - a);

        years.forEach((year, yearIndex) => {
            const isExpandedClass = affiliationIndex === 0 && yearIndex === 0 ? ' expanded' : ' collapsed';
            const expandSymbol = affiliationIndex === 0 && yearIndex === 0 ? '<i class="fas fa-caret-down"></i>' : '<i class="fas fa-caret-right"></i>';

            const $yearTitle = $(`<div class="year-title${isExpandedClass} rounded-box"><h3>${year}</h3><span class="expand-icon">${expandSymbol}</span></div>`);
            const $publicationsContainer = $(`<div class="publications-container${isExpandedClass}"></div>`);

            if (!(affiliationIndex === 0 && yearIndex === 0)) {
                $publicationsContainer.hide();
            }

            // Sort months in descending order
            const months = Object.keys(affiliationPublications[year]).sort((a, b) => {
                const monthOrder = [
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ];

                return monthOrder.indexOf(b) - monthOrder.indexOf(a);
            });

            months.forEach(month => {
                const publications = affiliationPublications[year][month];
                publications.forEach(pub => {
                    const $publication = createPublicationElement(pub);
                    $publicationsContainer.append($publication);
                });
            });

            $affiliationContainer.append($yearTitle);
            $affiliationContainer.append($publicationsContainer);

            $yearTitle.click(function () {
                $publicationsContainer.slideToggle(200);
                const $expandIcon = $(this).find('.expand-icon');
                $expandIcon.html($publicationsContainer.hasClass('expanded') ? '<i class="fas fa-caret-right"></i>' : '<i class="fas fa-caret-down"></i>');
                $publicationsContainer.toggleClass('expanded');
            });
        });
    });
    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');
}

function groupPublicationsByAffiliation(json) {
    const publicationsByAffiliation = {};

    json.forEach(pub => {
        const affiliation = pub['AFFILIATION'];
        const year = pub['YEAR'];
        const month = pub['MONTH'];

        if (affiliation) {
            if (!publicationsByAffiliation[affiliation]) {
                publicationsByAffiliation[affiliation] = {};
            }

            if (!publicationsByAffiliation[affiliation][year]) {
                publicationsByAffiliation[affiliation][year] = {};
            }

            if (!publicationsByAffiliation[affiliation][year][month]) {
                publicationsByAffiliation[affiliation][year][month] = [];
            }

            publicationsByAffiliation[affiliation][year][month].push(pub);
        }
    });

    return publicationsByAffiliation;
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
        const year = pub['YEAR'];
        if (year) {
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
    let citText = pub['CITATION'];
    let title = pub['TITLE'];

    // Escape special characters in the title for regular expression
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search for the escaped title in the citText and wrap it with <b> tags
    let modifiedcit = citText.replace(new RegExp(escapedTitle, 'g'), `<b>${title}</b>`);


    if (pub.hasOwnProperty('PDF') && pub['PDF'] !== "") {
        $publication = $(`
            <div class="grid-item font-alt" style="padding-left: 20px;">
                <h4 style="margin-bottom: 0;">${modifiedcit}</h4>
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
                <h4 style="margin-bottom: 0;">${modifiedcit}</h4>
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
