async function getData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Sort the gallery items based on the title (year) in descending order
        const sortedGalleryItems = data.galleryItems.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

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

function createGalleryItem(item) {
    const galleryItem = `
        <div class="col-sm-6 col-md-3 col-lg-3">
            <div class="gallery-item">
                <div class="gallery-image">
                    <a class="gallery" href="${item.ImagePath}" data-lightbox="gallery" data-title="${item.Year}">
                        <img src="${item.ThumbnailPath}" alt="Gallery Image"/>
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
