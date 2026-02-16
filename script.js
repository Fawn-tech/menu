// Star Rating Functionality
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.stars .fa-star');
    const ratingText = document.querySelector('.rating-text');
    let currentRating = 0;

    // Add click event listeners to stars
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            updateStars(rating);
            updateRatingText(rating);
        });

        // Add hover effects
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(hoverRating);
        });
    });

    // Reset stars on mouse leave
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            updateStars(currentRating);
        });
    }

    // Function to update star display
    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Function to highlight stars on hover
    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Function to update rating text
    function updateRatingText(rating) {
        const messages = [
            'Click to rate',
            'Poor',
            'Fair',
            'Good',
            'Very Good',
            'Excellent!'
        ];
        if (ratingText) {
            ratingText.textContent = messages[rating] || 'Click to rate';
        }
    }
});
