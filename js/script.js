// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('.filters button');

// NASA API key
const apiKey = 'kf1rGa8vs3dZt8W3INpyoNFDyf7GIflTBk4ANt2K';

// Listen for button click to fetch images
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  // Fetch and display images
  fetchAPODImages(startDate, endDate);
});

// Get modal elements
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const modalClose = document.getElementById('modal-close');

// Array of fun space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "The footprints on the Moon will be there for millions of years.",
  "There are more trees on Earth than stars in the Milky Way.",
  "One million Earths could fit inside the Sun.",
  "Saturn is the only planet that could float in water.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Space is completely silent because there is no air to carry sound.",
  "Jupiter has the shortest day of all the planets.",
  "The hottest planet in our solar system is Venus."
];

// Show a random space fact above the gallery
const spaceFactDiv = document.getElementById('space-fact');
if (spaceFactDiv) {
  // Pick a random fact
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const fact = spaceFacts[randomIndex];
  // Display the fact
  spaceFactDiv.textContent = `🌌 Space Fact: ${fact}`;
}

// Function to fetch APOD images for 9 consecutive days
function fetchAPODImages(startDate, endDate) {
  // Show loading message with icon
  gallery.innerHTML = '<p style="text-align:center;font-size:1.2em;">🔄 Loading space photos...</p>';

  // Build the NASA APOD API URL
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from the API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // If the API returns a single object, put it in an array
      const images = Array.isArray(data) ? data : [data];

      // Limit to 9 images
      const limitedImages = images.slice(0, 9);

      // Clear the gallery and remove the loading message
      gallery.innerHTML = '';

      // If there are no images, show a message
      if (limitedImages.length === 0) {
        gallery.innerHTML = '<p>No images found for this date range.</p>';
        return;
      }

      // Loop through the images and add them to the gallery
      limitedImages.forEach(item => {
        // Create a div for each gallery card
        const card = document.createElement('div');
        card.className = 'gallery-item';

        if (item.media_type === 'image') {
          // If it's an image, show the image, title, and date
          card.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.date}</p>
          `;

          // Add click event to open modal with details
          card.addEventListener('click', () => {
            modalImg.src = item.url;
            modalImg.alt = item.title;
            modalTitle.textContent = item.title;
            modalDate.textContent = item.date;
            modalExplanation.textContent = item.explanation;
            modal.style.display = 'flex';
          });
        } else if (item.media_type === 'video') {
          // If it's a video, show a thumbnail (if available) and a link
          // NASA APOD provides a thumbnail_url for some videos
          const thumbnail = item.thumbnail_url ? item.thumbnail_url : 'https://upload.wikimedia.org/wikipedia/commons/7/75/Video-Icon.png';
          card.innerHTML = `
            <img src="${thumbnail}" alt="Video thumbnail for ${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.date}</p>
            <a href="${item.url}" target="_blank" rel="noopener" class="video-link">Watch Video</a>
          `;

          // Optional: Show modal with explanation when card is clicked (not the link)
          card.addEventListener('click', (event) => {
            // Only open modal if not clicking the link
            if (event.target.tagName.toLowerCase() !== 'a') {
              modalImg.src = thumbnail;
              modalImg.alt = `Video thumbnail for ${item.title}`;
              modalTitle.textContent = item.title;
              modalDate.textContent = item.date;
              modalExplanation.textContent = item.explanation + '\n\nClick "Watch Video" to view.';
              modal.style.display = 'flex';
            }
          });
        }

        // Add the card to the gallery
        gallery.appendChild(card);
      });
    })
    .catch(error => {
      // Show error message if something goes wrong
      gallery.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
      console.error('Error fetching APOD data:', error);
    });
}

// Close modal when close button is clicked
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Optional: Close modal when clicking outside modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

