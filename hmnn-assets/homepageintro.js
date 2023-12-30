async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    let jsonData = JSON.parse(y);

    // Assuming jsonData contains both image data and IntroText
    let slidesContainer = $('.hero-slider ul.slides');

    for (let i = 0; i < jsonData.length; i++) {
        let item = jsonData[i];

        // Check if the image path is defined
        if (item.ImagePath) {
            // Create li element
            let liElement = $('<li>').addClass('bg bg-dark');

            // Set background image style
            liElement.css('background-image', 'url("' + item.ImagePath + '")');

            // Append li element to the slides container
            slidesContainer.append(liElement);
        }

        // If IntroText is available, set it to the #introtext element
        if (item.IntroText) {
            $('#introtext').text(item.IntroText);
        }
    }

    // Initialize FlexSlider without specific options
    $('.hero-slider').flexslider();
    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');
}

$(window).on('load', function () {
    getData("https://script.google.com/macros/s/AKfycbxrRL38ieeXrF2QvOqQ7SyVrrSdWdwI_BGQVOxQJoYdvbG4X8pxf8_UgKx4P0Hf9VeJ5Q/exec");
});
