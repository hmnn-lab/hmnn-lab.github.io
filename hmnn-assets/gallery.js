async function getData(url, galleryTag) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Sort the gallery items based on month and year
        const sortedGalleryItems = data.galleryItems.sort((a, b) => {
            const dateA = new Date(parseDateString(a.Year));
            const dateB = new Date(parseDateString(b.Year));
            return dateB - dateA;
        });

        for (let i = 0; i < sortedGalleryItems.length; i++) {
            const item = sortedGalleryItems[i];
            // Handle the specific cell value separately, e.g., append it to a paragraph
            let galleryItem = createGalleryItem(item, galleryTag);
            $('#gallery-container').append(galleryItem);
        }

        openSpecificImage(galleryTag); // Call the function to open the specific image
        $('.loader').fadeOut();
        $('.page-loader').delay(350).fadeOut('slow');
    } catch (error) {
        console.error("Error fetching gallery data:", error);
    }
}
function createGalleryItem(item, galleryTag) {
    const isOpen = item.ImageTag === galleryTag;
    const galleryItem = `
        <div class="col-sm-6 col-md-3 col-lg-3">
            <div class="gallery-item">
                <div class="gallery-image">
                    <a class="gallery" href="${item.ImagePath}" data-lightbox="gallery" data-title="(${item.Year}) ${item.Caption}" ${isOpen ? 'data-open="true"' : ''}>
                        <img src="${item.ImagePath}" alt="Gallery Image"/>
                        <div class="gallery-caption">
                            <div class="gallery-icon"><span class="icon-magnifying-glass"></span></div>
                            <div class="caption">${item.Year}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;
    return galleryItem;
}

function parseDateString(dateString) {
    // Convert month names to numbers and remove non-alphanumeric characters
    const formattedDate = dateString.replace(/[^a-zA-Z0-9]/g, '');
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const monthIndex = monthNames.findIndex(month => formattedDate.toLowerCase().includes(month.toLowerCase()));

    if (monthIndex !== -1) {
        const month = monthIndex + 1; // Months are zero-based in JavaScript Date object
        const year = formattedDate.replace(/[^\d]/g, '');
        return `${year}-${month}`; // Modified to YYYY-MM format for proper sorting
    }

    return formattedDate;
}

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryTag = urlParams.get('tag');

    if (galleryTag) {
        getData("https://script.google.com/macros/s/AKfycbyzcWqnZavhOn9h1msPALzc_A27rfoss9gkHxMMXzbtESg_howtD6mP3Ya2dkWbyPa3/exec", galleryTag);
    } else {
        getData("https://script.google.com/macros/s/AKfycbyzcWqnZavhOn9h1msPALzc_A27rfoss9gkHxMMXzbtESg_howtD6mP3Ya2dkWbyPa3/exec");
    }
});

// Open the specific gallery image if the data-open attribute is true
$(document).on('click', '[data-open="true"]', function () {
    const index = $(this).index();
    const $galleryItems = $('[data-lightbox="gallery"]');
    if (index >= 0 && index < $galleryItems.length) {
        $galleryItems.eq(index).trigger('click');
    }
});

// Add this function to programmatically open the specific image based on the tag
function openSpecificImage(galleryTag) {
    const $galleryItems = $('[data-lightbox="gallery"]');
    const $specificItem = $galleryItems.filter(function () {
        return $(this).data('open') === true;
    });

    if ($specificItem.length > 0) {
        $specificItem.trigger('click');
    }
}