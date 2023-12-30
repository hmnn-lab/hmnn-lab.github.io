async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    const json = JSON.parse(y);

    // Group publications by affiliation, year, and month
    const publicationsByAffiliation = groupPublicationsByAffiliation(json);

    // Sort affiliations based on the latest year and month
    const sortedAffiliations = Object.keys(publicationsByAffiliation).sort((a, b) => {
        if (a === 'Others') return 1;
        if (b === 'Others') return -1;

        const maxYearA = Math.max(...Object.keys(publicationsByAffiliation[a]).map(year => parseInt(year)));
        const maxYearB = Math.max(...Object.keys(publicationsByAffiliation[b]).map(year => parseInt(year)));
        return maxYearB - maxYearA;
    });

    const $gridContainer = $('#outreach-list');

    sortedAffiliations.forEach((affiliation, affiliationIndex) => {
        const affiliationPublications = publicationsByAffiliation[affiliation];
        const $affiliationContainer = $(`<div class="well well-sm"><h3 class="font-alt text-center" style="margin-top: 0;"><strong>${affiliation}</strong></h3></div>`);

        $gridContainer.append($affiliationContainer);

        if (affiliation === 'Other') {
            const publications = affiliationPublications['Others'];
            publications.forEach(pub => {
                const $publication = createPublicationElement(pub);
                $affiliationContainer.append($publication);
            });
            return; // Skip sorting and handling 'Others' category
        }

        const years = Object.keys(affiliationPublications).sort((a, b) => b - a);

        years.forEach((year, yearIndex) => {
            const isExpandedClass = affiliationIndex === 0 && yearIndex === 0 ? ' expanded' : ' collapsed';
            const expandSymbol = affiliationIndex === 0 && yearIndex === 0 ? '<i class="fas fa-caret-down"></i>' : '<i class="fas fa-caret-right"></i>';

            const $yearTitle = $(`<div class="year-title${isExpandedClass} rounded-box"><h3>${year}</h3><span class="expand-icon">${expandSymbol}</span></div>`);
            const $publicationsContainer = $(`<div class="publications-container${isExpandedClass}"></div>`);

            if (!(affiliationIndex === 0 && yearIndex === 0)) {
                $publicationsContainer.hide();
            }

            const months = Object.keys(affiliationPublications[year]).sort((a, b) => b - a);

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




function parseMonth(monthYear) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [month, year] = monthYear.split(/(?=\d)/);
    const monthIndex = monthNames.indexOf(month);

    if (monthIndex !== -1 && year) {
        return monthIndex;
    }

    return 0;
}

function createPublicationElement(pub) {
    let $publication;
    let citText = pub['CITATION'];
    let title = pub['TITLE'];

    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let modifiedcit = citText.replace(new RegExp(escapedTitle, 'g'), `<b>${title}</b>`);

    $publication = $(`
        <div class="grid-item font-alt" style="padding-left: 20px;">
            <h4 style="margin-bottom: 0;">${modifiedcit}</h4>
        </div>
    `);

    return $publication;
}

$(window).on('load', function () {
    getData("https://script.google.com/macros/s/AKfycbyQM1TTeXRoMwYa1wWfYgsgbRibtweMcwvEs8SV6ACV66QHPz-EktsgGP-lO24NKKq2/exec");
});
