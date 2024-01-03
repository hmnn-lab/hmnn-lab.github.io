async function getPreviewData(url, count) {
  let x = await fetch(url);
  let y = await x.text();

  let json = JSON.parse(y);

  json = json.sort((a, b) => {
    const dateA = new Date(parseDate(a['Date']));
    const dateB = new Date(parseDate(b['Date']));
    return dateB - dateA;
  });

  console.log(json);

  for (let i = 0; i < count && i < json.length; i++) {
    let newsall = json[i];
    let newsText = newsall['News'];
    let mainSubject = newsall['Main Subject'];

    // Check if URLTagText and URL are present
    if (newsall['URLTagText'] && newsall['URL']) {
      // Search for URLTagText in the News column
      const linkPattern = new RegExp(newsall['URLTagText'], 'g');
      const matchedLinks = newsText.match(linkPattern);
      if (matchedLinks) {
        // If found, create links for each match
        matchedLinks.forEach(matchedLink => {
          const url = newsall['URL'];
          const $link = $(`<a href="${url}" target="_blank">${matchedLink}</a>`);
          newsText = newsText.replace(matchedLink, $link.prop('outerHTML'));
        });
      }
    }

    // Search for the mainSubject in the newsText and wrap it with <b> tags
    let modifiedNews = newsall['PersonTag'] ?
    newsText.replace(mainSubject, `<a href="people.html?tag=${newsall['PersonTag']}#pi"><b>${mainSubject}</b></a>`) :
    newsText.replace(mainSubject, `<b>${mainSubject}</b>`);

    // Check if GalleryTagText and GalleryTag are present
    if (newsall['GalleryTagText'] && newsall['GalleryTag']) {
      const galleryTagText = newsall['GalleryTagText'];
      const galleryTag = newsall['GalleryTag'];
      const galleryLink = `<a href="gallery.html?tag=${galleryTag}"><b>${galleryTagText}</b></a>`;
      modifiedNews = modifiedNews.replace(new RegExp(galleryTagText, 'g'), galleryLink);
    }

    let $newsText = $(`<div class="alt-features-item1">${modifiedNews} <b>(${newsall['Date']})</b></div>`);

    // Center-align text using CSS
    $newsText.css('text-align', 'center');

    $('#news-preview').append($newsText);
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
  getPreviewData("https://script.google.com/macros/s/AKfycbzapnBe3PPmxDWml0YlmbtuyB3nceVUlXpqULjB-sRwJsUybbTqcnJdVevbLb705uyb/exec", 4);
});
