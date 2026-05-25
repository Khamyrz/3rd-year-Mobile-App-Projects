// Store Logo Upload
document.addEventListener('DOMContentLoaded', function() {
    // Store Logo Upload
    const logoUploadBtn = document.querySelector('.upload-actions .btn');
    const logoPreview = document.querySelector('.logo-preview img');
    
    if (logoUploadBtn) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        logoUploadBtn.parentNode.appendChild(fileInput);

        logoUploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Settings Navigation
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            
            // Update active nav item
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Show target section
            settingsSections.forEach(section => {
                section.style.display = section.id === targetId ? 'block' : 'none';
            });
        });
    });

    // Store Information Form
    const storeInfoForm = document.getElementById('storeInfoForm');
    if (storeInfoForm) {
        storeInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Store information updated successfully!', 'success');
        });
    }

    // Payment Settings
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    paymentMethodCards.forEach(card => {
        const removeBtn = card.querySelector('.btn-danger');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove this payment method?')) {
                    card.remove();
                    showNotification('Payment method removed successfully!', 'success');
                }
            });
        }
    });

    // Bank Information Form
    const bankInfoForm = document.getElementById('bankInfoForm');
    if (bankInfoForm) {
        bankInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Bank information updated successfully!', 'success');
        });
    }

    // Shipping Methods
    const addShippingBtn = document.querySelector('.add-shipping-method');
    const shippingModal = document.getElementById('shippingMethodModal');
    const closeModalBtn = shippingModal?.querySelector('.btn-close');
    const cancelModalBtn = shippingModal?.querySelector('.btn-secondary');
    const shippingMethodForm = document.getElementById('shippingMethodForm');

    if (addShippingBtn && shippingModal) {
        addShippingBtn.addEventListener('click', () => {
            shippingModal.style.display = 'block';
        });

        closeModalBtn.addEventListener('click', () => {
            shippingModal.style.display = 'none';
        });

        cancelModalBtn.addEventListener('click', () => {
            shippingModal.style.display = 'none';
        });

        shippingMethodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(shippingMethodForm);
            
            // Create new shipping method item
            const newMethod = document.createElement('div');
            newMethod.className = 'shipping-method-item';
            newMethod.innerHTML = `
                <div class="method-info">
                    <h4>${formData.get('method-name')}</h4>
                    <p>${formData.get('delivery-time')}</p>
                    <p class="price">₱${formData.get('price')}</p>
                </div>
                <div class="method-actions">
                    <button class="btn btn-outline-primary">Edit</button>
                    <button class="btn btn-danger">Delete</button>
                </div>
            `;

            // Add event listeners to new buttons
            const deleteBtn = newMethod.querySelector('.btn-danger');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this shipping method?')) {
                    newMethod.remove();
                    showNotification('Shipping method deleted successfully!', 'success');
                }
            });

            // Insert before the "Add" button
            addShippingBtn.parentNode.insertBefore(newMethod, addShippingBtn);
            
            // Close modal and reset form
            shippingModal.style.display = 'none';
            shippingMethodForm.reset();
            showNotification('Shipping method added successfully!', 'success');
        });
    }

    // Notification Settings
    const notificationForm = document.getElementById('notificationForm');
    if (notificationForm) {
        notificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Notification preferences saved successfully!', 'success');
        });
    }

    // Account Settings
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = accountForm.querySelector('input[name="new-password"]')?.value;
            const confirmPassword = accountForm.querySelector('input[name="confirm-password"]')?.value;

            if (password && password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            showNotification('Account settings updated successfully!', 'success');
        });
    }

    // Security Settings
    const twoFactorToggle = document.getElementById('twoFactor');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', () => {
            if (twoFactorToggle.checked) {
                // Here you would typically open a modal or redirect to 2FA setup
                showNotification('Two-factor authentication enabled!', 'success');
            } else {
                if (confirm('Are you sure you want to disable two-factor authentication?')) {
                    showNotification('Two-factor authentication disabled!', 'warning');
                } else {
                    twoFactorToggle.checked = true;
                }
            }
        });
    }

    // View Sessions Button
    const viewSessionsBtn = document.querySelector('.security-option .btn-outline-primary');
    if (viewSessionsBtn) {
        viewSessionsBtn.addEventListener('click', () => {
            // Here you would typically open a modal showing active sessions
            alert('Active Sessions:\n\n• Current Session (This Device)\n• Mobile App - Last active: 2 hours ago\n• Web Browser - Last active: Yesterday');
        });
    }
});

// Utility function to show notifications
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add notification to the page
    document.body.appendChild(notification);

    // Add show class for animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 6px;
        background: white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-success {
        background: #d4edda;
        color: #155724;
    }

    .notification-error {
        background: #f8d7da;
        color: #721c24;
    }

    .notification-warning {
        background: #fff3cd;
        color: #856404;
    }

    .notification i {
        font-size: 1.2em;
    }
`;
document.head.appendChild(style); 