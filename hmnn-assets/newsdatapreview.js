async function getPreviewData(url, count) {
  let x = await fetch(url);
  let y = await x.text();

  let json = JSON.parse(y);

  json = json.sort((a, b) => {
    // Convert and sort based on the 'Date' field in descending order
    let dateA = convertToDate(a['Date']);
    let dateB = convertToDate(b['Date']);
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

    $('#news-preview').append($newsText);
  }
}

function convertToDate(dateString) {
  const parts = dateString.split('.');
  const year = parts[2];
  const month = parts[1];
  const day = parts[0];
  return new Date(`${year}-${month}-${day}`);
}

$(window).on('load', function() {
  getPreviewData("https://script.google.com/macros/s/AKfycbzapnBe3PPmxDWml0YlmbtuyB3nceVUlXpqULjB-sRwJsUybbTqcnJdVevbLb705uyb/exec", 4);
});
