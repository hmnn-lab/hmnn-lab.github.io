async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    json = JSON.parse(y);

    console.log(json)

    for (let i = 0; i < Object.keys(json).length; i++) {
        research = json[i];
        // Handle the specific cell value separately, e.g., append it to a paragraph
        let IntroText = research.IntroText;
        $('#introtext').text(IntroText);
    }
}

$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbxrRL38ieeXrF2QvOqQ7SyVrrSdWdwI_BGQVOxQJoYdvbG4X8pxf8_UgKx4P0Hf9VeJ5Q/exec");
})