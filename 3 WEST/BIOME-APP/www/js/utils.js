// Common utility functions for all dashboards

// Format currency
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString();
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get time ago
function getTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    
    return 'just now';
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
    const re = /^(\+63|0)9\d{9}$/;
    return re.test(phone);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Show loading spinner
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-content">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading...</span>
        </div>
    `;
    document.body.appendChild(spinner);
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Show confirmation dialog
function showConfirmation(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <p>${message}</p>
            <div class="dialog-buttons">
                <button class="btn btn-secondary cancel-btn">Cancel</button>
                <button class="btn btn-primary confirm-btn">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    // Add button functionality
    const confirmBtn = dialog.querySelector('.confirm-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', () => {
        dialog.remove();
        if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        dialog.remove();
        if (onCancel) onCancel();
    });
}

// Show error message
function showError(message) {
    showNotification(message, 'error');
}

// Show success message
function showSuccess(message) {
    showNotification(message, 'success');
}

// Show warning message
function showWarning(message) {
    showNotification(message, 'warning');
}

// Show info message
function showInfo(message) {
    showNotification(message, 'info');
}

// Export functions
export {
    formatCurrency,
    formatDate,
    formatTime,
    getTimeAgo,
    validateEmail,
    validatePhone,
    showNotification,
    showLoading,
    hideLoading,
    showConfirmation,
    showError,
    showSuccess,
    showWarning,
    showInfo
}; 