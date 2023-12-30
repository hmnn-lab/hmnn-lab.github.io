// Fetch data from the Google Sheets API
async function fetchData() {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwNkYqdJVeLw8mXtH5QQy-o2FzB0Gh078XA0mCOSMT2juvt3gLRTuMUY-FUhV71RqDlGQ/exec');
  const data = await response.json();
  return data;
}

function createResourcesElement(resource) {
  const resourceElement = document.createElement('div');

  const titleElement = document.createElement('h3');
  titleElement.innerHTML = resource.title;

  const hrElement = document.createElement('hr');
  hrElement.className = 'divider-w mt-10 mb-20';

  const descriptionElement = document.createElement('p');
  const descriptionLines = resource.description.split('\n');
  descriptionElement.innerHTML = descriptionLines.map(line => `<li>${line}</li>`).join('');
  descriptionElement.innerHTML = `<ul>${descriptionElement.innerHTML}</ul>`;

  resource.urlTagText.split('\n').forEach((tag, index) => {
    descriptionElement.innerHTML = descriptionElement.innerHTML.replace(
      new RegExp(tag, 'g'),
      `<a href="${resource.url.split('\n')[index]}" target="_blank"><b>${tag}</b></a>`
    );
  });

  resourceElement.appendChild(titleElement);
  resourceElement.appendChild(hrElement);
  resourceElement.appendChild(descriptionElement);

  return resourceElement;
}

// Function to render opportunities in the HTML
function renderResources(resources) {
  const resourcesList = document.getElementById('resources-list');

  resources.forEach((resource) => {
    const resourcesElement = createResourcesElement(resource);
    resourcesList.appendChild(resourcesElement);
  });
  $('.loader').fadeOut();
  $('.page-loader').delay(350).fadeOut('slow');
}

// Fetch data and render content when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  renderResources(data.resourcesContents);
});
