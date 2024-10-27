// Show building materials section if the property type is business
document.querySelectorAll('input[name="propertyType"]').forEach(input => {
    input.addEventListener('change', function () {
        const businessMaterials = document.getElementById('business-materials');
        if (this.value === 'business') {
            businessMaterials.classList.remove('d-none');
        } else {
            businessMaterials.classList.add('d-none');
        }
    });
});


// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmVkbGluZW1hcHMiLCJhIjoiWV9ucGRESSJ9.iSFtGLWn-EbkLouWSIMVBQ';

// Function to query the Mapbox API and get address suggestions
function getSuggestions(query) {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&types=address&limit=5`)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.features;
            const suggestionsElement = document.getElementById('suggestions');
            suggestionsElement.innerHTML = ''; // Clear previous suggestions

            if (suggestions.length > 0) {
                suggestions.forEach(function (item) {
                    const option = document.createElement('option');
                    option.value = item.place_name;
                    option.textContent = item.place_name;
                    option.setAttribute('data-coordinates', item.geometry.coordinates);
                    suggestionsElement.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.textContent = 'No suggestions found';
                suggestionsElement.appendChild(option);
            }
        })
        .catch(err => console.error(err));
}

// Add event listener for input field
document.getElementById('mapboxAddress').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 2) {
        getSuggestions(query); // Trigger suggestions when the user has typed more than 2 characters
    } else {
        document.getElementById('suggestions').innerHTML = ''; // Clear suggestions if input is too short
    }
});


document.addEventListener('DOMContentLoaded', function () {
/*     const form = document.getElementById('damageAssessmentForm');
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    let currentStep = 0;
    const userResponses = {}; // Object to store user responses

    form.addEventListener('click', function (e) {
        if (e.target.classList.contains('next-step')) {
            // Store user responses
            const inputs = formSteps[currentStep].querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'radio' && !input.checked) return;
                userResponses[input.name] = input.value;
            });

            // Conditional navigation based on user responses
            if (userResponses['propertyType'] === 'business' && currentStep === 0) {
                // Skip to a specific step for business
                formSteps[currentStep].classList.add('d-none');
                currentStep = 2; // Example: skip to step 3
                formSteps[currentStep].classList.remove('d-none');
            } else {
                formSteps[currentStep].classList.add('d-none');
                currentStep++;
                formSteps[currentStep].classList.remove('d-none');
            }
        } else if (e.target.classList.contains('prev-step')) {
            formSteps[currentStep].classList.add('d-none');
            currentStep--;
            formSteps[currentStep].classList.remove('d-none');
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Form submitted successfully!');
        // Here you can add AJAX to submit the form data to the server
    });
 */
    // Function to populate #propertyAddress when an option in #suggestions is clicked
    document.getElementById('suggestions').addEventListener('click', function (e) {
        if (e.target.tagName === 'OPTION') {
            const selectedOption = e.target;
            const propertyAddressInput = document.getElementById('propertyAddress');
            propertyAddressInput.value = selectedOption.value;

            // Show marker on Mapbox map
            const coordinates = selectedOption.getAttribute('data-coordinates').split(',');
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
                zoom: 15
            });

            new mapboxgl.Marker()
                .setLngLat([parseFloat(coordinates[0]), parseFloat(coordinates[1])])
                .addTo(map);
        }
    });
});
