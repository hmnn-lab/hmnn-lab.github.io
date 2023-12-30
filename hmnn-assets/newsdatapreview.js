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

    // Search for the mainSubject in the newsText and wrap it with <b> tags
    let modifiedNews = newsText.replace(new RegExp(mainSubject, 'g'), `<b>${mainSubject}</b>`);

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
