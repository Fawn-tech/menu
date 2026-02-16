const RESTAURANT_HOURS = {
    open: 11, // 11 AM
    close: 22 // 10 PM
};

// Phone number validation for Kenyan format
const KENYAN_PHONE_REGEX = /^(?:\+254|0)[17]\d{8}$/;

// Initialize localStorage if not exists
function initializeStorage() {
    if (!localStorage.getItem('reservations')) {
        localStorage.setItem('reservations', JSON.stringify([]));
    }
    if (!localStorage.getItem('menuItems')) {
        localStorage.setItem('menuItems', JSON.stringify([
            { id: 1, name: 'Nyama Choma', price: 1500, category: 'Main' },
            { id: 2, name: 'Ugali Sukuma', price: 350, category: 'Main' },
            { id: 3, name: 'Samaki wa Kupaka', price: 1200, category: 'Main' }
        ]));
    }
}

// Validate phone number (Kenyan format)
function validatePhoneNumber(phone) {
    return KENYAN_PHONE_REGEX.test(phone);
}

// Validate date is not in the past
function validateDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// Validate time is within restaurant hours
function validateTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const timeInHours = hours + minutes / 60;
    return timeInHours >= RESTAURANT_HOURS.open && timeInHours < RESTAURANT_HOURS.close;
}

// Display error message in red color below the input field
function showError(elementId, message) {
    const existingError = document.getElementById(`${elementId}-error`);
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.id = `${elementId}-error`;
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    const inputElement = document.getElementById(elementId);
    inputElement.parentNode.appendChild(errorDiv);
    inputElement.style.borderColor = 'red';
}

// Clear error message
function clearError(elementId) {
    const existingError = document.getElementById(`${elementId}-error`);
    if (existingError) {
        existingError.remove();
    }
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
        inputElement.style.borderColor = '';
    }
}

// Display success message in green color above the form
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.id = 'success-message';
    successDiv.style.backgroundColor = '#d4edda';
    successDiv.style.color = '#155724';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '0.5rem';
    successDiv.style.marginBottom = '1rem';
    successDiv.style.textAlign = 'center';
    successDiv.style.border = '1px solid #c3e6cb';
    successDiv.innerHTML = message;
    
    const form = document.querySelector('.reservation-form');
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const successElement = document.getElementById('success-message');
        if (successElement) {
            successElement.remove();
        }
    }, 5000);
}

// Save reservation to localStorage
function saveReservation(reservationData) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const newReservation = {
        id: Date.now(),
        ...reservationData,
        createdAt: new Date().toISOString()
    };
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    return newReservation;
}

// Clear form fields
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('guests').value = '';
    document.getElementById('special-requests').value = '';
    document.getElementById('subscribe').checked = true;
    
    // Clear any error messages
    const errorMessages = document.querySelectorAll('[id$="-error"]');
    errorMessages.forEach(error => error.remove());
    
    // Reset border colors
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.style.borderColor = '');
}

// Add custom menu item to localStorage
function addCustomMenuItem(itemName, itemPrice, itemCategory) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const newItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemPrice),
        category: itemCategory
    };
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    return newItem;
}

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    let isValid = true;
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    const specialRequests = document.getElementById('special-requests').value.trim();
    const subscribe = document.getElementById('subscribe').checked;
    
    // Clear all previous errors
    ['name', 'phone', 'date', 'time', 'guests'].forEach(clearError);
    
    // Validate name
    if (!name) {
        showError('name', 'Please enter your full name');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate phone
    if (!phone) {
        showError('phone', 'Please enter your phone number');
        isValid = false;
    } else if (!validatePhoneNumber(phone)) {
        showError('phone', 'Please enter a valid Kenyan phone number (e.g., +254... or 07...)');
        isValid = false;
    }
    
    // Validate date
    if (!date) {
        showError('date', 'Please select a reservation date');
        isValid = false;
    } else if (!validateDate(date)) {
        showError('date', 'Reservation date cannot be in the past');
        isValid = false;
    }
    
    // Validate time
    if (!time) {
        showError('time', 'Please select a reservation time');
        isValid = false;
    } else if (!validateTime(time)) {
        showError('time', 'Reservations are only available from 11 AM to 10 PM');
        isValid = false;
    }
    
    // Validate guests
    if (!guests) {
        showError('guests', 'Please select number of guests');
        isValid = false;
    }
    
    if (isValid) {
        // Create reservation object
        const reservationData = {
            name,
            phone,
            date,
            time,
            guests,
            specialRequests: specialRequests || 'None',
            subscribe
        };
        
        // Save to localStorage
        saveReservation(reservationData);
        
        // Show success message
        showSuccessMessage(`
            ✅ Reservation booked successfully!<br>
            <strong>${name}</strong>, we look forward to seeing you on ${new Date(date).toLocaleDateString()} at ${time}.<br>
            Booking reference: #${Date.now().toString().slice(-6)}
        `);
        
        // Clear the form
        clearForm();
        
        // Optional: Add sample menu item for demonstration (you can remove this in production)
        // This demonstrates how to add custom menu items
        if (subscribe) {
            console.log('User subscribed to newsletter');
        }
        
        // You can uncomment this to test adding custom menu items
        // addCustomMenuItem('Special Dish', 850, 'Specials');
    }
}

// Add real-time validation
function addRealTimeValidation() {
    // Phone number real-time validation
    document.getElementById('phone').addEventListener('input', function() {
        if (this.value) {
            if (validatePhoneNumber(this.value)) {
                clearError('phone');
                this.style.borderColor = 'green';
            } else {
                this.style.borderColor = 'orange';
            }
        } else {
            this.style.borderColor = '';
        }
    });
    
    // Date real-time validation
    document.getElementById('date').addEventListener('change', function() {
        if (this.value) {
            if (validateDate(this.value)) {
                clearError('date');
                this.style.borderColor = 'green';
            } else {
                showError('date', 'Reservation date cannot be in the past');
                this.style.borderColor = 'red';
            }
        }
    });
    
    // Time real-time validation
    document.getElementById('time').addEventListener('change', function() {
        if (this.value) {
            if (validateTime(this.value)) {
                clearError('time');
                this.style.borderColor = 'green';
            } else {
                showError('time', 'Reservations are only available from 11 AM to 10 PM');
                this.style.borderColor = 'red';
            }
        }
    });
}

// Initialize the page
function initializePage() {
    initializeStorage();
    
    // Add form submit event listener
    const form = document.querySelector('.reservation-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add real-time validation
    addRealTimeValidation();
    
    // Set minimum date for date input (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    
    // Set default time if empty
    const timeInput = document.getElementById('time');
    if (!timeInput.value) {
        timeInput.value = '12:00';
    }
    
    console.log('Reservation system initialized');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions for use in other scripts (if needed)
window.reservationSystem = {
    validatePhoneNumber,
    validateDate,
    validateTime,
    saveReservation,
    addCustomMenuItem,
    getReservations: () => JSON.parse(localStorage.getItem('reservations')) || [],
    getMenuItems: () => JSON.parse(localStorage.getItem('menuItems')) || []
};