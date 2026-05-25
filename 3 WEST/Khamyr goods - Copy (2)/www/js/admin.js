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
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.getAttribute('data-tab');
                document.querySelectorAll('.admin-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(`${tabName}-content`).classList.remove('hidden');
            });
        });
        
        // Logout button
        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            Auth.logout();
        });
    },
    
    // Load dashboard data
    loadData() {
        this.loadRiders();
        this.loadCustomers();
        this.loadPasswordRequests();
    },
    
    // Load riders data
    loadRiders() {
        const riders = DB.getRiders();
        const ridersTableBody = document.querySelector('#riders-table tbody');
        
        ridersTableBody.innerHTML = '';
        
        riders.forEach(rider => {
            const user = DB.getUserById(rider.userId);
            if (!user) return;
            
            const row = document.createElement('tr');
            const status = rider.isApproved ? 'Approved' : 'Pending Approval';
            const statusClass = rider.isApproved ? 'approved' : 'pending-approval';
            
            row.innerHTML = `
                <td>${rider.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.age}</td>
                <td class="${statusClass}">${status}</td>
                <td>
                    ${!rider.isApproved ? 
                        `<button class="btn btn-primary approve-rider-btn" data-id="${rider.id}">Review & Approve</button>` : 
                        `<button class="btn btn-danger disapprove-rider-btn" data-id="${rider.id}">Disapprove</button>`
                    }
                    <button class="btn btn-secondary view-rider-btn" data-id="${rider.id}">View Details</button>
                </td>
            `;
            
            // Add event listeners
            const approveBtn = row.querySelector('.approve-rider-btn');
            if (approveBtn) {
                approveBtn.addEventListener('click', () => this.reviewAndApproveRider(rider.id));
            }
            
            const disapproveBtn = row.querySelector('.disapprove-rider-btn');
            if (disapproveBtn) {
                disapproveBtn.addEventListener('click', () => this.disapproveRider(rider.id));
            }
            
            const viewBtn = row.querySelector('.view-rider-btn');
            viewBtn.addEventListener('click', () => this.viewRiderDetails(rider.id));
            
            ridersTableBody.appendChild(row);
        });
    },
    
    // Load customers data
    loadCustomers() {
        const customers = DB.getCustomers();
        const customersTableBody = document.querySelector('#customers-table tbody');
        
        customersTableBody.innerHTML = '';
        
        customers.forEach(customer => {
            const user = DB.getUserById(customer.userId);
            if (!user) return;
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.age}</td>
                <td>
                    <button class="btn btn-secondary view-customer-btn" data-id="${customer.id}">View Details</button>
                </td>
            `;
            
            // Add event listeners
            const viewBtn = row.querySelector('.view-customer-btn');
            viewBtn.addEventListener('click', () => this.viewCustomerDetails(customer.id));
            
            customersTableBody.appendChild(row);
        });
    },
    
    // Load password reset requests
    loadPasswordRequests() {
        const requests = DB.getPasswordResets();
        const tableBody = document.querySelector('#password-reset-table tbody');
        
        tableBody.innerHTML = '';
        
        requests.forEach(request => {
            const user = DB.getUserById(request.userId);
            if (!user) return;
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.userType}</td>
                <td>${new Date(request.requestDate).toLocaleString()}</td>
                <td>
                    <button class="btn btn-primary reset-password-btn" data-id="${request.id}" data-user-id="${user.id}">Reset Password</button>
                </td>
            `;
            
            // Add event listeners
            const resetBtn = row.querySelector('.reset-password-btn');
            resetBtn.addEventListener('click', () => this.resetPassword(request.id, user.id));
            
            tableBody.appendChild(row);
        });
    },
    
    // Review and approve rider
    reviewAndApproveRider(riderId) {
        const rider = DB.getRiderById(riderId);
        if (!rider) {
            showToast('Rider not found', 'error');
            return;
        }
        
        const user = DB.getUserById(rider.userId);
        if (!user) {
            showToast('User not found', 'error');
            return;
        }
        
        // Show confirmation dialog with rider details
        const confirmApproval = confirm(`
            Please review the following rider details before approval:
            
            Personal Information:
            - Name: ${user.firstName} ${user.lastName}
            - Email: ${user.email}
            - Phone: ${user.phone}
            - Age: ${user.age}
            - Address: ${user.address}
            
            Required Documents:
            - Photo ID: ${rider.photoUrl ? '✓ Uploaded' : '✗ Missing'}
            - Vehicle Photo: ${rider.vehiclePhotoUrl ? '✓ Uploaded' : '✗ Missing'}
            - License Photo: ${rider.licensePhotoUrl ? '✓ Uploaded' : '✗ Missing'}
            
            Are you sure you want to approve this rider? They will be able to log in and start accepting rides immediately.
        `);
        
        if (confirmApproval) {
            try {
                // Update rider status
                DB.updateRider(riderId, { 
                    isApproved: true,
                    approvedAt: new Date().toISOString(),
                    approvedBy: Auth.currentUser.id
                });
                
                showToast(`Successfully approved rider: ${user.firstName} ${user.lastName}`, 'success');
                
                // Reload riders table
                this.loadRiders();
            } catch (error) {
                console.error('Error approving rider:', error);
                showToast('Failed to approve rider. Please try again.', 'error');
            }
        }
    },
    
    // Disapprove a rider
    disapproveRider(riderId) {
        const rider = DB.getRiderById(riderId);
        if (!rider) {
            showToast('Rider not found', 'error');
            return;
        }
        
        const user = DB.getUserById(rider.userId);
        if (!user) {
            showToast('User not found', 'error');
            return;
        }
        
        const reason = prompt(`
            Please enter the reason for disapproving ${user.firstName} ${user.lastName}:
            (This will prevent them from logging in until re-approved)
        `);
        
        if (reason) {
            try {
                // Update rider status
                DB.updateRider(riderId, { 
                    isApproved: false,
                    disapprovalReason: reason,
                    disapprovedAt: new Date().toISOString(),
                    disapprovedBy: Auth.currentUser.id
                });
                
                showToast(`Successfully disapproved rider: ${user.firstName} ${user.lastName}`, 'success');
                
                // Reload riders table
                this.loadRiders();
            } catch (error) {
                console.error('Error disapproving rider:', error);
                showToast('Failed to disapprove rider. Please try again.', 'error');
            }
        }
    },
    
    // View rider details
    viewRiderDetails(riderId) {
        const rider = DB.getRiderById(riderId);
        if (!rider) {
            showToast('Rider not found', 'error');
            return;
        }
        
        const user = DB.getUserById(rider.userId);
        if (!user) {
            showToast('User not found', 'error');
            return;
        }
        
        const approvalStatus = rider.isApproved ? 'Approved' : 'Pending Approval';
        const approvalInfo = rider.isApproved ? 
            `Approved on: ${new Date(rider.approvedAt).toLocaleString()}` :
            rider.disapprovalReason ? `Disapproved: ${rider.disapprovalReason}` : 'Awaiting approval';
        
        alert(`
            Rider Details:
            
            Personal Information:
            - Name: ${user.firstName} ${user.lastName}
            - Email: ${user.email}
            - Phone: ${user.phone}
            - Age: ${user.age}
            - Address: ${user.address}
            
            Required Documents:
            - Photo ID: ${rider.photoUrl ? '✓ Uploaded' : '✗ Missing'}
            - Vehicle Photo: ${rider.vehiclePhotoUrl ? '✓ Uploaded' : '✗ Missing'}
            - License Photo: ${rider.licensePhotoUrl ? '✓ Uploaded' : '✗ Missing'}
            
            Account Status:
            - Status: ${approvalStatus}
            - ${approvalInfo}
            - Currently: ${rider.isAvailable ? 'Available' : 'Unavailable'}
            
            Rating: ${rider.rating}/5
            
            Use the "${rider.isApproved ? 'Disapprove' : 'Review & Approve'}" button to change approval status.
        `);
    },
    
    // View customer details
    viewCustomerDetails(customerId) {
        const customer = DB.getCustomerById(customerId);
        if (!customer) return;
        
        const user = DB.getUserById(customer.userId);
        if (!user) return;
        
        alert(`
            Customer Details:
            
            Name: ${user.firstName} ${user.lastName}
            Email: ${user.email}
            Phone: ${user.phone}
            Age: ${user.age}
            Address: ${user.address}
            
            Rating: ${customer.rating}/5
        `);
    },
    
    // Reset password
    resetPassword(requestId, userId) {
        // Generate new random password
        const newPassword = Math.random().toString(36).substring(2, 10);
        
        // Update user password
        DB.updateUser(userId, { password: newPassword });
        
        // Delete the request
        DB.deletePasswordReset(requestId);
        
        // Show new password
        alert(`Password has been reset to: ${newPassword}\n\nPlease share this with the user.`);
        
        // Reload password requests
        this.loadPasswordRequests();
    }
}; 