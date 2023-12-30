// Function to format dates as "Day Month Year"
function formatDate(startDate, endDate) {
    // Assuming the date format is DD/MM/YYYY in the spreadsheet
    const startParts = startDate.split('/');
    const endParts = endDate.split('/');

    // Creating Date objects with the correct format
    const startDateObj = new Date(`${startParts[1]}/${startParts[0]}/${startParts[2]}`);
    const endDateObj = new Date(`${endParts[1]}/${endParts[0]}/${endParts[2]}`);

    // Formatting the date range as "DD - DD Month YYYY"
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedStartDate = startDateObj.toLocaleDateString('en-US', options);
    const formattedEndDate = endDateObj.toLocaleDateString('en-US', options);

    return `${formattedStartDate} - ${formattedEndDate}`;
}


// Function to determine if a date is in the future
function isFutureDate(date) {
    const currentDate = new Date();
    const eventDate = new Date(date.replace(/-/g, '/'));
    return eventDate > currentDate;
}

async function getEventData(url) {
    let x = await fetch(url);
    let y = await x.text();

    return JSON.parse(y);
}

function createEventList(eventData, containerId) {
    const $container = $(`#${containerId}`);

    eventData.forEach(event => {
        const $workItem = $('<div class="col-sm-6 col-md-8 col-lg-8">');
        const $sliderContainer = $('<div class="post-images-slider">');
        const $slider = $('<ul class="slides">');
        const $detailsContainer = $('<div class="col-sm-6 col-md-4 col-lg-4">');
        const $details = $('<div class="work-details">');

        // Check if there are images available
        if (event.ImagePaths && event.ImagePaths.some(path => path.trim() !== '')) {
            // Add images to the slider
            event.ImagePaths.forEach(imagePath => {
                if (imagePath.trim() !== '') {
                    const $slide = $(`<li><img class="center-block" src="${imagePath}" alt="Slider Image" draggable="false"></li>`);
                    $slider.append($slide);
                }
            });

            // Append the slides to the slider container
            $sliderContainer.append($slider);

            // Append the slider container to the work item
            $workItem.append($sliderContainer);
        }

        // Add event details
        const $title = $(`<h3 class="work-details-title font-alt">${event.Title}</h3>`);
        const $summary = $(`<p>${event.Summary}</p>`);
        const $locationdate = $(`<ul>`);

        // Add the location if available
        if (event.Location) {
            $locationdate.append(`<li><i class="fa fa-fw"></i>&nbsp;&nbsp;${event.Location}</li>`);
        }

        // Add the date if available
        if (event.StartDate) {
            $locationdate.append(`<li><i class="fa fa-fw"></i>&nbsp;&nbsp;${formatDate(event.StartDate, event.EndDate)}</li>`);
        }

        // Add the link if available
        if (event.Link) {
            $locationdate.append(`<li><i class="fa fa-fw"></i>&nbsp;&nbsp;<a href="${event.Link}" target="_blank">Event Link</a></li>`);
        }

        $locationdate.append(`</ul>`);

        // Append elements to the work details
        $details.append($title, $summary, $locationdate);
        $detailsContainer.append($details);

        // Check if there are images available before appending work item
        if (event.ImagePaths && event.ImagePaths.some(path => path.trim() !== '')) {
            // Append the work details to the container
            $container.append($workItem, $detailsContainer);

            // Initialize FlexSlider (assuming you've included the FlexSlider library)
            $sliderContainer.flexslider({
                animation: "slide",
                controlNav: true,
                directionNav: true,
            });
        } else {
            // If no images, only append details container
            $container.append($detailsContainer);
        }
    });
}

// Rest of your code remains unchanged





$(window).on('load', async function () {
    const eventData = await getEventData("https://script.google.com/macros/s/AKfycbxl3u97VfzrPckKJqZJmukcXVzbdxCSzTSFoz10ae3_aFYE8Eo_DCmfXMvdx6jUhbSq/exec");
    console.log('Fetched eventData:', eventData);

    const upcomingEvents = eventData.filter(event => event.Status === 'Upcoming');
    console.log('Upcoming Events:', upcomingEvents);

    const pastEvents = eventData.filter(event => event.Status === 'Past');
    console.log('Past Events:', pastEvents);

    createEventList(upcomingEvents, 'upcoming-events-container');
    createEventList(pastEvents, 'past-events-container');
    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');
});
