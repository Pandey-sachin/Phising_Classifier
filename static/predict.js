function submitForm(event) {
  event.preventDefault(); // Prevent the default form submission

  var fileInput = document.getElementById('file');
  var websiteLinkInput = document.getElementById('websiteLink');

  var formData = new FormData();

  if (fileInput.files.length > 0) {
    // File input is selected
    for (var i = 0; i < fileInput.files.length; i++) {
      formData.append('files', fileInput.files[i]);
    }
  } else if (websiteLinkInput.value.trim() !== '') {
    // Website link is provided
    formData.append('websiteLink', websiteLinkInput.value.trim());
  } else {
    // No valid input provided
    alert('Please provide at least one input (Prediction Batch Files or Website Link).');
    return;
  }

  // Show the loader
  var loader = document.createElement('div');
  loader.id = 'loader';
  loader.classList.add('loader');
  document.body.appendChild(loader);

  // Disable the submit button while the request is being processed
  var submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  // Send the FormData object to the Flask endpoint using Fetch API
  fetch('/predicted/', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        if (response.headers.get('Content-Type').indexOf('text/csv') !== -1) {
          // Response is a CSV file
          console.log("11111");
          return response.blob();
        } else {
          console.log("22222");
          // Response is a text message
          return response.text();
        }
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(data => {
      // Hide the loader
      loader.style.display = 'none';

      // Enable the submit button
      submitButton.disabled = false;

      // Clear the form inputs
      fileInput.value = '';
      websiteLinkInput.value = '';

      // Display the response
      var predictionResult = document.getElementById('prediction-result');
      predictionResult.style.display = 'block';
      if (typeof data === 'object' && data instanceof Blob) {
        // If the response is a file
        console.log("johncena");
        var downloadButton = document.getElementById('download');
        var fileURL = URL.createObjectURL(data);
        downloadButton.addEventListener('click', function () {
          // Trigger the file download
          window.location.href = fileURL;
        });
        downloadButton.style.display = 'block';
      }

      else {
        // If the response is a text message
        console.log("sachin pandey");
        predictionResult.innerHTML = data ;
      }
    })

    .catch(error => {
      console.log(error);
      // Hide the loader
      loader.style.display = 'none';
      // Enable the submit button
      submitButton.disabled = false;
    });
}
