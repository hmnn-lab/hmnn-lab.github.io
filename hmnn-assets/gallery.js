async function getData(url) {
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
            let galleryItem = createGalleryItem(item);
            $('#gallery-container').append(galleryItem);
        }
    } catch (error) {
        console.error("Error fetching gallery data:", error);
    }
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
        return `${month}/${year}`;
    }

    return formattedDate;
}

// Rest of your code remains unchanged

function createGalleryItem(item) {
    const galleryItem = `
        <div class="col-sm-6 col-md-3 col-lg-3">
            <div class="gallery-item">
                <div class="gallery-image">
                    <a class="gallery" href="${item.ImagePath}" data-lightbox="gallery" data-title="${item.Year}">
                        <img src="${item.ImagePath}" alt="Gallery Image"/>
                        <div class="gallery-caption">
                            <div class="gallery-icon"><span class="icon-magnifying-glass"></span></div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;
    return galleryItem;
}



$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbyzcWqnZavhOn9h1msPALzc_A27rfoss9gkHxMMXzbtESg_howtD6mP3Ya2dkWbyPa3/exec");
});
