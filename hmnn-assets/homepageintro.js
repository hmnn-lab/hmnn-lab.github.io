let introText = '';

function updatePaddingTop() {
    // Calculate the height of the header element
    let headerHeight = $('.site-header').outerHeight();

    // Update padding-top for each li element with a background image
    $('.hero-slider ul.slides li').each(function() {
        $(this).css('top', headerHeight + 'px');
    });
}

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
            let liElement = $('<li>').addClass('bg-dark-20 bg-dark');

            // Set background image style
            liElement.css('background-image', 'url("' + item.ImagePath + '")');
            
            // Set background position to left top
            liElement.css('background-position', 'left top');

            // Append li element to the slides container
            slidesContainer.append(liElement);
        }

        // If IntroText is available, set it to the #introtext element
        if (item.IntroText) {
            introText = item.IntroText;
        }

        // Check if IntroTextHighlight exists
        if (item.IntroTextHighlight) {
            // Append IntroTextHighlight with increased font size and bold
            introText = '<h4 style="font-size: 1.2em;"><b>' + item.IntroTextHighlight + '</b></h4> ' + introText;
        }
    }

    // Set the introText to the #introtext element
    $('#introtext').html(introText);

    // Initialize FlexSlider without specific options
    $('.hero-slider').flexslider();
    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');

    // Update padding-top initially
    updatePaddingTop();
}

$(window).on('load', function () {
    getData("https://script.google.com/macros/s/AKfycbxrRL38ieeXrF2QvOqQ7SyVrrSdWdwI_BGQVOxQJoYdvbG4X8pxf8_UgKx4P0Hf9VeJ5Q/exec");
});

// Update padding-top when the window is resized
$(window).on('resize', function () {
    updatePaddingTop();
});
