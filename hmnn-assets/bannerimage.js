// Function to update the background image based on window size
function updateBackgroundImage() {
  var windowWidth = window.innerWidth;
  var backgroundImage = document.getElementById("background-image");

  if (windowWidth < 800) {
    backgroundImage.style.backgroundImage = 'url(/assets/images/pub_background_13.png)';
    backgroundImage.style.paddingTop = '200px';
  } else if (windowWidth < 1100) {
    backgroundImage.style.backgroundImage = 'url(assets/images/pub_background_14.png)';
    backgroundImage.style.paddingTop = '200px';
  } else {
    backgroundImage.style.backgroundImage = 'url(assets/images/pub_background_15.png)';
    backgroundImage.style.paddingTop = '140px';
  }
}

// Trigger the function when the window is resized
window.addEventListener('resize', updateBackgroundImage);

// Trigger the function on page load
window.onload = updateBackgroundImage;
