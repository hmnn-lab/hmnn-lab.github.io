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
        const $affiliationContainer = $(`<div class="affiliation-container rounded-box2 expandable"><h3>${affiliation}</h3></div>`);

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

            const publications = affiliationPublications[year];
            publications.forEach(pub => {
                const $publication = createPublicationElement(pub);
                $publicationsContainer.append($publication);
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
}

function groupPublicationsByAffiliation(json) {
    const publicationsByAffiliation = {};

    json.forEach(pub => {
        const affiliation = pub['AFFILIATION'];
        const year = pub['YEAR'];

        if (affiliation) {
            if (!publicationsByAffiliation[affiliation]) {
                publicationsByAffiliation[affiliation] = {};
            }

            if (!publicationsByAffiliation[affiliation][year]) {
                publicationsByAffiliation[affiliation][year] = [];
            }

            publicationsByAffiliation[affiliation][year].push(pub);
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

    // Search for the mainSubject in the newsText and wrap it with <b> tags
    let modifiedcit = citText.replace(new RegExp(title, 'g'), `<b>${title}</b>`);


    if (pub.hasOwnProperty('PDF') && pub['PDF'] !== "") {
        $publication = $(`
            <div class="grid-item font-alt" style="padding-left: 20px;">
                <h4 style="color: black; margin-bottom: 0;">${modifiedcit}</h4>
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
                <h4 style="color: black; margin-bottom: 0;">${modifiedcit}</h4>
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
