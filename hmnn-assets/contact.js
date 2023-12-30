async function loadContactData() {
    try {
      let response = await fetch('https://script.google.com/macros/s/AKfycbxeduNfpJHrAm2etAV2Sq83qGJxf4-885QpzvSgA3HWsV6sVINcTir_ofXe_9OBz8JqTg/exec');
      let data = await response.json();
  
      // Use innerHTML to handle line breaks in the phone number
      document.getElementById('phone').innerHTML = data.phone ? data.phone.replace(/\n/g, '<br>') : '';
      document.getElementById('email').innerHTML = `<a href="mailto:${data.email}">${data.email}</a>` || '';
      
      // Use innerHTML to handle line breaks in the address
      document.getElementById('address').innerHTML = data.address ? data.address.replace(/\n/g, '<br>') : '';
    } catch (error) {
      console.error('Error loading contact data:', error);
    }
    $('.loader').fadeOut();
    $('.page-loader').delay(350).fadeOut('slow');
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    loadContactData();
  });
  