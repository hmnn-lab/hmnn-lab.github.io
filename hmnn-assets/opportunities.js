// Fetch data from the Google Sheets API
async function fetchData() {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwIWSjvXWqm5ccl87yqRpAcpBQGfCVYUK2jLv_Wb6tIu0hiX9NVi64ISfet77W78wpDjQ/exec');
  const data = await response.json();
  return data;
}
// Function to create HTML elements for each highlighted banner
// Function to create HTML elements for each highlighted banner
// Function to create HTML elements for each highlighted banner
function createHighlightedBannerElement(banner) {
  const bannerElement = document.createElement('li');
  bannerElement.className = 'alert alert-info';

  const titleElement = document.createElement('h3');
  titleElement.style.marginTop = '0';
  titleElement.innerHTML = `<strong>${banner.title}</strong>`;

  const descriptionElement = document.createElement('p');
  let description = banner.description;

  // Replace each occurrence of tag with corresponding URL
  banner.urlTagText.split('\n').forEach((tag, index) => {
    const url = banner.url.split('\n')[index];
    description = description.split(tag).join(`<a href="${url}"><b>${tag}</b></a>`);
  });

  descriptionElement.innerHTML = description;

  bannerElement.appendChild(titleElement);
  bannerElement.appendChild(descriptionElement);

  return bannerElement;
}



// Function to render highlighted banners in the HTML
function renderHighlightedBanners(banners) {
  const bannersList = document.getElementById('highlighted-banners-list');

  banners.forEach((banner) => {
    const bannerElement = createHighlightedBannerElement(banner);
    bannersList.appendChild(bannerElement);
  });
}

// Function to create HTML elements for each opportunity
// Function to create HTML elements for each opportunity
function createOpportunityElement(opportunity) {
  const opportunityElement = document.createElement('div');

  const titleElement = document.createElement('h3');
  titleElement.innerHTML = opportunity.title;

  const hrElement = document.createElement('hr');
  hrElement.className = 'divider-w mt-10 mb-20';

  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = opportunity.description;

  opportunity.urlTagText.split('\n').forEach((tag, index) => {
    descriptionElement.innerHTML = descriptionElement.innerHTML.replace(
      new RegExp(tag, 'g'),
      `<a href="${opportunity.url.split('\n')[index]}" target="_blank"><b>${tag}</b></a>`
    );
  });

  opportunityElement.appendChild(titleElement);
  opportunityElement.appendChild(hrElement);
  opportunityElement.appendChild(descriptionElement);

  return opportunityElement;
}


// Function to render opportunities in the HTML
function renderOpportunities(opportunities) {
  const opportunitiesList = document.getElementById('opportunities-list');

  opportunities.forEach((opportunity) => {
    const opportunityElement = createOpportunityElement(opportunity);
    opportunitiesList.appendChild(opportunityElement);
  });
}

// Function to create HTML elements for overall description
function createOverallDescriptionElement(overallDescription) {
  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = overallDescription.description.replace(
    new RegExp(overallDescription.urlTagText, 'g'),
    `<a href="${overallDescription.url}"><b>${overallDescription.urlTagText}</b></a>`
  );

  return descriptionElement;
}

// Function to render overall description in the HTML
function renderOverallDescription(overallDescriptions) {
  const overallDescriptionContainer = document.getElementById('overall-description-container');

  overallDescriptions.forEach((overallDescription) => {
    const descriptionElement = createOverallDescriptionElement(overallDescription);
    overallDescriptionContainer.appendChild(descriptionElement);
  });
}

// Fetch data and render content when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  renderHighlightedBanners(data.HighlightedBanners);
  renderOpportunities(data.OpportunitiesContents);
  renderOverallDescription(data.OverallDescription);
  $('.loader').fadeOut();
  $('.page-loader').delay(350).fadeOut('slow');
});
