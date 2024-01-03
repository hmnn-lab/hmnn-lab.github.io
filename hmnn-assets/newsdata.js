async function getData(url) {
  try {
    let x = await fetch(url);
    let y = await x.text();

    const json = JSON.parse(y);

    const sortedJson = json.sort((a, b) => {
      const dateA = new Date(parseDate(a['Date']));
      const dateB = new Date(parseDate(b['Date']));
      return dateB - dateA;
    });

    const groupedByYear = {};
    sortedJson.forEach(newsItem => {
      const year = new Date(parseDate(newsItem['Date'])).getFullYear();
      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
      }
      groupedByYear[year].push(newsItem);
    });

    const years = Object.keys(groupedByYear).sort((a, b) => b - a);

    const $gridContainer = $('#news-list');

    years.forEach((year, index) => {
      const isInitialExpanded = index === 0;
      const isExpandedClass = index === 0 ? '' : ' collapsed';
      const expandSymbol = index === 0 ? '<i class="fas fa-caret-right"></i>' : '<i class="fas fa-caret-right"></i>';

      const $yearTitle = $(`<div class="year-title${isExpandedClass} rounded-box"><h3>${year}</h3><span class="expand-icon">${expandSymbol}</span></div>`);

      $gridContainer.append($yearTitle);

      const $newsContainer = $(`<div class="news-container${isExpandedClass}" ${isInitialExpanded ? 'style="display: block; opacity: 1;"' : ''}></div>`);
      const newsItems = groupedByYear[year];
      newsItems.forEach(newsItem => {
        const newsText = newsItem['News'];
        const mainSubject = newsItem['Main Subject'];
        let highlightedNews = newsItem['PersonTag'] ?
        newsText.replace(mainSubject, `<a href="people.html?tag=${newsItem['PersonTag']}#pi"><b>${mainSubject}</b></a>`) :
        newsText.replace(mainSubject, `<b>${mainSubject}</b>`);
      

        // Check if GalleryTagText and GalleryTag are present
        if (newsItem['GalleryTagText'] && newsItem['GalleryTag']) {
          const galleryTagText = newsItem['GalleryTagText'];
          const galleryTag = newsItem['GalleryTag'];
          const galleryLink = `<a href="gallery.html?tag=${galleryTag}"><span style="color:#498aa8"><b>${galleryTagText}</b></span></a>`;
          highlightedNews = highlightedNews.replace(new RegExp(galleryTagText, 'g'), galleryLink);
        }

        const $newsItem = $('<div class="news-item"></div>'); // Added a class for styling
        const $date = $(`<div class="news-date"><b>[${newsItem['Date']}]</b></div>`);
        const $news = $(`<div class="news-content">${highlightedNews}</div>`);

        // Check if URLTagText and URL are present
        if (newsItem['URLTagText'] && newsItem['URL']) {
          // Search for URLTagText in the News column
          const linkPattern = new RegExp(newsItem['URLTagText'], 'i');
          const matchedLink = newsText.match(linkPattern);
          if (matchedLink) {
            // If found, create a link
            const url = newsItem['URL'];
            const $link = $(`<a href="${url}" target="_blank">${newsItem['URLTagText']}</a>`);
            $news.html(highlightedNews.replace(linkPattern, $link.prop('outerHTML')));
          }
        }

        $newsItem.append($date);
        $newsItem.append($news);
        $newsContainer.append($newsItem);
      });

      $gridContainer.append($newsContainer);

      if (!isInitialExpanded) {
        $newsContainer.hide();
      }

      $yearTitle.click(function () {
        $newsContainer.slideToggle(200);
        const $expandIcon = $(this).find('.expand-icon');
        const isExpanded = $newsContainer.hasClass('expanded');
        $expandIcon.css('transform', isExpanded ? 'rotate(0deg)' : 'rotate(90deg)');
        $newsContainer.toggleClass('expanded');
      });

      // Rotate the expand icon for the first year
      if (isInitialExpanded) {
        const $expandIcon = $yearTitle.find('.expand-icon');
        $expandIcon.css('transform', 'rotate(90deg)');
      }
    });

    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

function parseDate(dateString) {
  const parts = dateString.split('.');
  if (parts.length === 3) {
    return `${parts[1]}.${parts[0]}.${parts[2]}`;
  }
  return dateString;
}

$(window).on('load', function () {
  getData("https://script.google.com/macros/s/AKfycbzapnBe3PPmxDWml0YlmbtuyB3nceVUlXpqULjB-sRwJsUybbTqcnJdVevbLb705uyb/exec");
});
