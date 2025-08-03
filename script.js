// JavaScript to handle active navigation links for multi-page setup
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Determine the base file name from the href
        const fileName = linkHref.substring(linkHref.lastIndexOf('/') + 1);

        // Handle index.html (home) specially
        if (fileName === 'index.html' && (currentPath === '/' || currentPath.endsWith('/index.html'))) {
            link.classList.add('active');
            // Special styling for GET APPOINTMENT button when active
            if (link.tagName === 'A' && link.textContent.includes('APPOINTMENT')) {
                link.classList.remove('bg-red-500');
                link.classList.add('bg-blue-600', 'text-white', 'font-semibold');
            }
        } else if (currentPath.endsWith(fileName) && fileName !== 'index.html') {
            link.classList.add('active');
            // Special styling for GET APPOINTMENT button when active
            if (link.tagName === 'A' && link.textContent.includes('APPOINTMENT')) {
                link.classList.remove('bg-red-500');
                link.classList.add('bg-blue-600', 'text-white', 'font-semibold');
            }
        }
    });

    // Function to navigate to service request form with service name
    window.showServiceRequestForm = function(serviceName) {
        // Use localStorage to pass the serviceName to the service-request.html page
        localStorage.setItem('requestedServiceName', serviceName);
        window.location.href = 'service-request.html';
    };

    // Function to toggle the "Other" city input field
    window.toggleOtherCityInput = function() {
        const citySelect = document.getElementById('service-req-city-select');
        const otherCityInputGroup = document.getElementById('other-city-input-group');
        const otherCityInput = document.getElementById('service-req-city-other');

        if (citySelect && otherCityInputGroup && otherCityInput) { // Ensure elements exist
            if (citySelect.value === 'Other') {
                otherCityInputGroup.style.display = 'block';
                otherCityInput.setAttribute('required', 'required');
            } else {
                otherCityInputGroup.style.display = 'none';
                otherCityInput.value = '';
                otherCityInput.removeAttribute('required');
            }
        }
    };

    // Logic specifically for service-request.html to populate service name on load
    if (window.location.pathname.endsWith('service-request.html')) {
        const serviceTitleElement = document.getElementById('service-title');
        const requestedServiceInput = document.getElementById('requested-service');
        const storedServiceName = localStorage.getItem('requestedServiceName');

        if (serviceTitleElement && requestedServiceInput && storedServiceName) {
            serviceTitleElement.textContent = storedServiceName;
            requestedServiceInput.value = storedServiceName;
            localStorage.removeItem('requestedServiceName'); // Clean up localStorage
        }
    }

    // --- Web3Forms Submission Logic for Service Request Form ---
    const serviceRequestFormElement = document.getElementById('service-request-form') ? document.getElementById('service-request-form').querySelector('form') : null;
    if (serviceRequestFormElement) {
        const submitButton = serviceRequestFormElement.querySelector('button[type="submit"]');

        serviceRequestFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();

            // !!! IMPORTANT: REPLACE WITH YOUR OWN KEY FROM WEB3FORMS.COM FOR SERVICE REQUESTS !!!
            const access_key_service_request = "c3cb96ce-eb7e-4952-aa00-3ba1404e8572"; // Placeholder, replace with your actual key

            if(access_key_service_request === "c3cb96ce-eb7e-4952-aa00-3ba1404e8572") { // Check against the placeholder
                alert("Please replace 'c3cb96ce-eb7e-4952-aa00-3ba1404e8572' with your actual Web3Forms access key for service requests in script.js.");
                return;
            }

            const formData = new FormData(serviceRequestFormElement);
            const formObject = Object.fromEntries(formData.entries());

            // Add required properties for Web3Forms
            formObject.access_key = access_key_service_request;
            formObject.subject = `New Service Request: ${formObject.requested_service || 'Not Specified'}`;
            formObject.from_name = "Plumbing Solutions Service Request";
           
            // For testing purposes, we hardcode the sender email.
            formObject.email = "your-receiving-email@example.com"; // Replace with the email where you want to receive service requests

            // Handle the city logic correctly
            if (formObject.city_dropdown === 'Other') {
                formObject.City = formObject.city_other;
            } else {
                formObject.City = formObject.city_dropdown;
            }
            // Clean up temporary fields so they don't appear in the email
            delete formObject.city_dropdown;
            delete formObject.city_other;

            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Sending...`;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formObject)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Success! Your service request has been sent. We will contact you shortly.");
                    serviceRequestFormElement.reset();
                } else {
                    console.error("Error from server:", result);
                    alert(`Error sending service request: ${result.message}. Please try again.`);
                }

            } catch (error) {
                console.error("Service Request Submission Error:", error);
                alert("An error occurred while sending the service request. Please check the console for details.");
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // --- NEW: Web3Forms Submission Logic for Appointment Form ---
    const appointmentFormElement = document.getElementById('appointment') ? document.getElementById('appointment').querySelector('form') : null;

    if (appointmentFormElement) {
        const submitButton = appointmentFormElement.querySelector('button[type="submit"]');

        appointmentFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();

            // !!! IMPORTANT: REPLACE WITH YOUR OWN KEY FROM WEB3FORMS.COM FOR APPOINTMENTS !!!
            const access_key_appointment = "c3cb96ce-eb7e-4952-aa00-3ba1404e8572"; // Get this from Web3Forms.com

            if(access_key_appointment === "YOUR_WEB3FORMS_APPOINTMENT_ACCESS_KEY_HERE") {
                alert("Please replace 'YOUR_WEB3FORMS_APPOINTMENT_ACCESS_KEY_HERE' with your actual Web3Forms access key for appointments in script.js.");
                return;
            }

            const formData = new FormData(appointmentFormElement);
            const formObject = Object.fromEntries(formData.entries());

            // Add required properties for Web3Forms
            formObject.access_key = access_key_appointment;
            formObject.subject = `New Plumbing Appointment: ${formObject.date} at ${formObject.time} for ${formObject.service}`;
            formObject.from_name = "Plumbing Solutions Appointment Booking";
            formObject.email = "your-receiving-email@example.com"; // Replace with the email where you want to receive appointments

            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Booking...`;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formObject)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Success! Your appointment has been booked. We will confirm with you shortly.");
                    appointmentFormElement.reset();
                } else {
                    console.error("Error from server:", result);
                    alert(`Error booking appointment: ${result.message}. Please try again.`);
                }

            } catch (error) {
                console.error("Appointment Submission Error:", error);
                alert("An error occurred while booking the appointment. Please check the console for details.");
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
});