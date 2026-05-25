// Admin Dashboard functionality
const AdminDashboard = {
    // Initialize dashboard
    init() {
        this.setupEventListeners();
        this.loadData();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll('.admin-tab');
        const contents = document.querySelectorAll('.admin-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => {
                    c.classList.add('hidden');
                    c.style.display = 'none';
                });
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                const content = document.getElementById(`${tabName}-content`);
                if (content) {
                    content.classList.remove('hidden');
                    content.style.display = 'block';
                }
                
                // Reload data for the active tab
                this.loadTabData(tabName);
            });
        });
        
        // Logout button
        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
            });
        }
    },
    
    // Load data for specific tab
    loadTabData(tabName) {
        switch (tabName) {
            case 'riders':
                this.loadRiders();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'password-reset':
                this.loadPasswordRequests();
                break;
        }
    },
    
    // Load all dashboard data
    loadData() {
        this.loadRiders();
        this.loadCustomers();
    },
    
    // Load pending verifications
    async loadPendingVerifications() {
        // Approval is no longer required, so this function can be left empty or removed.
        const pendingTableBody = document.querySelector('#pending-verifications-table tbody');
        if (pendingTableBody) {
            pendingTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Approval is no longer required.</td></tr>';
        }
    },
    
    // Load riders data
    async loadRiders() {
        const ridersTableBody = document.querySelector('#riders-table tbody');
        if (!ridersTableBody) return;
        
        ridersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Loading...</td></tr>';
        
        try {
            // Get riders from database
            const snapshot = await firebase.database().ref('users').orderByChild('userType').equalTo('rider').once('value');
            const riders = [];
            
            snapshot.forEach(childSnapshot => {
                riders.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            if (riders.length === 0) {
                ridersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No riders found</td></tr>';
                return;
            }
            
            ridersTableBody.innerHTML = '';
            riders.forEach(rider => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rider.id}</td>
                    <td>${rider.firstName} ${rider.lastName}</td>
                    <td>${rider.email}</td>
                    <td>${rider.phone}</td>
                    <td>${rider.age}</td>
                    <td>
                        <span class="status-badge ${rider.status === 'pending' ? 'pending' : rider.isAvailable ? 'available' : 'unavailable'}">
                            ${rider.status === 'pending' ? 'Pending Verification' : rider.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm view-btn" data-id="${rider.id}">View</button>
                        ${rider.status === 'pending' ? `
                            <button class="btn btn-success btn-sm verify-btn" data-id="${rider.id}">Verify</button>
                            <button class="btn btn-danger btn-sm reject-btn" data-id="${rider.id}">Reject</button>
                        ` : `
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${rider.id}">Delete</button>
                        `}
                    </td>
                `;
                
                // Add event listeners to buttons
                const viewBtn = row.querySelector('.view-btn');
                const verifyBtn = row.querySelector('.verify-btn');
                const rejectBtn = row.querySelector('.reject-btn');
                const deleteBtn = row.querySelector('.delete-btn');
                
                viewBtn.addEventListener('click', () => this.viewRiderDetails(rider.id));
                if (verifyBtn) {
                    verifyBtn.addEventListener('click', () => this.verifyUser(rider.id, 'rider'));
                }
                if (rejectBtn) {
                    rejectBtn.addEventListener('click', () => this.rejectUser(rider.id, 'rider'));
                }
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => this.deleteRider(rider.id));
                }
                
                ridersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading riders:', error);
            ridersTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading riders</td></tr>';
        }
    },
    
    // Load customers data
    async loadCustomers() {
        const customersTableBody = document.querySelector('#customers-table tbody');
        if (!customersTableBody) return;
        
        customersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading...</td></tr>';
        
        try {
            // Get customers from database
            const snapshot = await firebase.database().ref('users').orderByChild('userType').equalTo('customer').once('value');
            const customers = [];
            
            snapshot.forEach(childSnapshot => {
                customers.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            if (customers.length === 0) {
                customersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No customers found</td></tr>';
                return;
            }
            
            customersTableBody.innerHTML = '';
            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.firstName} ${customer.lastName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.age}</td>
                    <td>
                        <span class="status-badge ${customer.status === 'pending' ? 'pending' : 'active'}">
                            ${customer.status === 'pending' ? 'Pending Verification' : 'Active'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm view-btn" data-id="${customer.id}">View</button>
                        ${customer.status === 'pending' ? `
                            <button class="btn btn-success btn-sm verify-btn" data-id="${customer.id}">Verify</button>
                            <button class="btn btn-danger btn-sm reject-btn" data-id="${customer.id}">Reject</button>
                        ` : `
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${customer.id}">Delete</button>
                        `}
                    </td>
                `;
                
                // Add event listeners to buttons
                const viewBtn = row.querySelector('.view-btn');
                const verifyBtn = row.querySelector('.verify-btn');
                const rejectBtn = row.querySelector('.reject-btn');
                const deleteBtn = row.querySelector('.delete-btn');
                
                viewBtn.addEventListener('click', () => this.viewCustomerDetails(customer.id));
                if (verifyBtn) {
                    verifyBtn.addEventListener('click', () => this.verifyUser(customer.id, 'customer'));
                }
                if (rejectBtn) {
                    rejectBtn.addEventListener('click', () => this.rejectUser(customer.id, 'customer'));
                }
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => this.deleteCustomer(customer.id));
                }
                
                customersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading customers:', error);
            customersTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading customers</td></tr>';
        }
    },
    
    // Load password reset requests
    async loadPasswordRequests() {
        const requestsTableBody = document.querySelector('#password-reset-table tbody');
        if (!requestsTableBody) return;
        
        requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';
        
        try {
            // Get password reset requests from database
            const snapshot = await firebase.database().ref('passwordResets').orderByChild('status').equalTo('pending').once('value');
            const requests = [];
            
            snapshot.forEach(childSnapshot => {
                requests.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            if (requests.length === 0) {
                requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No pending password reset requests</td></tr>';
                return;
            }
            
            requestsTableBody.innerHTML = '';
            requests.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.id}</td>
                    <td>${request.userName}</td>
                    <td>${request.email}</td>
                    <td>${request.userType}</td>
                    <td>${new Date(request.requestedAt).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-primary btn-sm reset-btn" data-id="${request.id}">Reset Password</button>
                        <button class="btn btn-danger btn-sm reject-btn" data-id="${request.id}">Reject</button>
                    </td>
                `;
                
                // Add event listeners to buttons
                const resetBtn = row.querySelector('.reset-btn');
                const rejectBtn = row.querySelector('.reject-btn');
                
                resetBtn.addEventListener('click', () => this.resetPassword(request.id));
                rejectBtn.addEventListener('click', () => this.rejectPasswordReset(request.id));
                
                requestsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading password reset requests:', error);
            requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading password reset requests</td></tr>';
        }
    },
    
    // View rider details
    async viewRiderDetails(riderId) {
        try {
            const snapshot = await firebase.database().ref(`users/${riderId}`).once('value');
            const rider = snapshot.val();
            if (rider) {
                // Show rider details in a modal or detailed view
                alert(`
                    Rider Details:
                    Name: ${rider.firstName} ${rider.lastName}
                    Email: ${rider.email}
                    Phone: ${rider.phone}
                    Vehicle: ${rider.vehicleModel}
                    License Plate: ${rider.licensePlate}
                    Status: ${rider.isAvailable ? 'Available' : 'Unavailable'}
                `);
            } else {
                showToast('Rider not found', 'error');
            }
        } catch (error) {
            console.error('Error viewing rider details:', error);
            showToast('Error loading rider details', 'error');
        }
    },
    
    // Delete rider
    async deleteRider(riderId) {
        if (confirm('Are you sure you want to delete this rider?')) {
            try {
                await firebase.database().ref(`users/${riderId}`).remove();
                await firebase.database().ref(`riders/${riderId}`).remove();
                showToast('Rider deleted successfully', 'success');
                this.loadRiders();
            } catch (error) {
                console.error('Error deleting rider:', error);
                showToast('Error deleting rider', 'error');
            }
        }
    },
    
    // View customer details
    async viewCustomerDetails(customerId) {
        try {
            const snapshot = await firebase.database().ref(`users/${customerId}`).once('value');
            const customer = snapshot.val();
            if (customer) {
                // Show customer details in a modal or detailed view
                alert(`
                    Customer Details:
                    Name: ${customer.firstName} ${customer.lastName}
                    Email: ${customer.email}
                    Phone: ${customer.phone}
                    Address: ${customer.address}
                `);
            } else {
                showToast('Customer not found', 'error');
            }
        } catch (error) {
            console.error('Error viewing customer details:', error);
            showToast('Error loading customer details', 'error');
        }
    },
    
    // Delete customer
    async deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await firebase.database().ref(`users/${customerId}`).remove();
                await firebase.database().ref(`customers/${customerId}`).remove();
                showToast('Customer deleted successfully', 'success');
                this.loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                showToast('Error deleting customer', 'error');
            }
        }
    },
    
    // Reset password
    async resetPassword(requestId) {
        try {
            const snapshot = await firebase.database().ref(`passwordResets/${requestId}`).once('value');
            const request = snapshot.val();
            
            if (request) {
                // Generate new password
                const newPassword = Math.random().toString(36).slice(-8);
                
                // Update password in Firebase Auth
                const user = await firebase.auth().getUserByEmail(request.email);
                await user.updatePassword(newPassword);
                
                // Update request status
                await firebase.database().ref(`passwordResets/${requestId}`).update({
                    status: 'completed',
                    completedAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                // Show new password
                alert(`New password for ${request.email}: ${newPassword}`);
                
                // Reload requests
                this.loadPasswordRequests();
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            showToast('Error resetting password', 'error');
        }
    },
    
    // Reject password reset
    async rejectPasswordReset(requestId) {
        if (confirm('Are you sure you want to reject this password reset request?')) {
            try {
                await firebase.database().ref(`passwordResets/${requestId}`).update({
                    status: 'rejected',
                    rejectedAt: firebase.database.ServerValue.TIMESTAMP
                });
                showToast('Password reset request rejected', 'success');
                this.loadPasswordRequests();
            } catch (error) {
                console.error('Error rejecting password reset:', error);
                showToast('Error rejecting password reset request', 'error');
            }
        }
    },
    
    // Verify user
    async verifyUser(userId, userType) {
        // Approval is no longer required, so this function can be left empty or removed.
        showToast('Approval is no longer required.', 'info');
    },

    // Reject user
    async rejectUser(userId, userType) {
        // Approval is no longer required, so this function can be left empty or removed.
        showToast('Approval is no longer required.', 'info');
    },

    // View user details
    async viewUserDetails(userId, userType) {
        try {
            const snapshot = await firebase.database().ref(`pendingVerifications/${userId}`).once('value');
            const user = snapshot.val();
            if (user) {
                let detailsHtml = `
                    <div class="user-details-modal">
                        <h3>User Details</h3>
                        <div class="user-info">
                            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                            <p><strong>Address:</strong> ${user.address || 'N/A'}</p>
                            <p><strong>Age:</strong> ${user.age || 'N/A'}</p>
                            <p><strong>Account Type:</strong> ${user.userType}</p>
                `;

                if (user.userType === 'rider') {
                    detailsHtml += `
                        <p><strong>Vehicle Model:</strong> ${user.vehicleModel || 'N/A'}</p>
                        <p><strong>License Plate:</strong> ${user.licensePlate || 'N/A'}</p>
                        ${user.vehiclePhotoUrl ? `<p><strong>Vehicle Photo:</strong><br><img src="${user.vehiclePhotoUrl}" style="max-width: 300px;"></p>` : ''}
                        ${user.licensePhotoUrl ? `<p><strong>License Photo:</strong><br><img src="${user.licensePhotoUrl}" style="max-width: 300px;"></p>` : ''}
                    `;
                }

                detailsHtml += `
                        </div>
                    </div>
                `;

                // Show the details in a modal or alert
                alert(detailsHtml.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n'));
            } else {
                showToast('User details not found', 'error');
            }
        } catch (error) {
            console.error('Error viewing user details:', error);
            showToast('Error loading user details', 'error');
        }
    }
}; 