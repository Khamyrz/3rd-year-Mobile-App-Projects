// Ride management functionality
const Rides = {
    // Current ride state
    currentRide: null,
    riderMarker: null,
    customerMarker: null,
    routePolyline: null,
    
    // Initialize ride functionality
    init() {
        // Attach event listeners for customer ride requests
        const requestRideBtn = document.getElementById('request-ride-btn');
        if (requestRideBtn) {
            requestRideBtn.addEventListener('click', () => this.requestRide());
        }
        
        // Attach event listeners for rider actions
        const riderStatusToggle = document.getElementById('rider-status-toggle');
        if (riderStatusToggle) {
            riderStatusToggle.addEventListener('change', (e) => this.updateRiderStatus(e.target.checked));
        }

        // Attach event listeners for ride control buttons
        const startRideBtn = document.getElementById('start-ride-btn');
        if (startRideBtn) {
            startRideBtn.addEventListener('click', () => this.startRide());
        }

        const completeRideBtn = document.getElementById('complete-ride-btn');
        if (completeRideBtn) {
            completeRideBtn.addEventListener('click', () => this.completeRide());
        }

        const cancelRideBtn = document.getElementById('cancel-ride-btn');
        if (cancelRideBtn) {
            cancelRideBtn.addEventListener('click', () => this.cancelRide());
        }

        const cancelRideBtnRider = document.getElementById('cancel-ride-btn-rider');
        if (cancelRideBtnRider) {
            cancelRideBtnRider.addEventListener('click', () => this.cancelRide());
        }
        
        // Initialize location tracking
        this.initLocationTracking();
        
        // Initialize ride status polling
        this.startStatusPolling();

        // Add collapsible functionality to ride panels
        const customerPanel = document.getElementById('ride-request-form');
        const riderPanel = document.getElementById('ride-requests');
        
        if (customerPanel) {
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'collapse-btn';
            collapseBtn.innerHTML = '▼';
            collapseBtn.onclick = () => {
                customerPanel.classList.toggle('collapsed');
                collapseBtn.innerHTML = customerPanel.classList.contains('collapsed') ? '▲' : '▼';
            };
            customerPanel.insertBefore(collapseBtn, customerPanel.firstChild);
        }

        if (riderPanel) {
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'collapse-btn';
            collapseBtn.innerHTML = '▼';
            collapseBtn.onclick = () => {
                riderPanel.classList.toggle('collapsed');
                collapseBtn.innerHTML = riderPanel.classList.contains('collapsed') ? '▲' : '▼';
            };
            riderPanel.insertBefore(collapseBtn, riderPanel.firstChild);
        }

        // Initialize real-time listeners
        this.initRealTimeListeners();
    },

    // Initialize location tracking
    initLocationTracking() {
        if ('geolocation' in navigator) {
            // Start watching position for riders when they're on an active ride
            if (Auth.currentUser?.userType === 'rider') {
                this.watchRiderLocation();
            }
        } else {
            showToast('Geolocation is not supported by your browser', 'error');
        }
    },

    // Initialize real-time listeners
    initRealTimeListeners() {
        if (!Auth.currentUser) return;

        const isRider = Auth.currentUser.userType === 'rider';
        const isCustomer = Auth.currentUser.userType === 'customer';

        // Listen for active ride updates
        if (isCustomer) {
            DB.getActiveRideForCustomer(Auth.currentUser.id).then(ride => {
                if (ride) {
                    this.currentRide = ride;
                    this.updateRideUI();
                    // Listen for ride updates
                    DB.onRideUpdated(ride.id, (updatedRide) => {
                        this.currentRide = updatedRide;
                        this.updateRideUI();
                    });
                    // Listen for rider location updates if ride is accepted
                    if (ride.riderId) {
                        DB.onRiderLocationUpdated(ride.riderId, (rider) => {
                            if (rider.currentLat && rider.currentLng) {
                                this.updateLocationMarkers();
                            }
                        });
                    }
                }
            });
        } else if (isRider) {
            const rider = DB.getRiderByUserId(Auth.currentUser.id);
            if (rider) {
                DB.getActiveRideForRider(rider.id).then(ride => {
                    if (ride) {
                        this.currentRide = ride;
                        this.updateRideUI();
                        // Listen for ride updates
                        DB.onRideUpdated(ride.id, (updatedRide) => {
                            this.currentRide = updatedRide;
                            this.updateRideUI();
                        });
                    }
                });

                // Start location tracking for rider
                this.watchRiderLocation();
            }
        }
    },

    // Watch rider's location
    watchRiderLocation() {
        if (!Auth.currentUser || Auth.currentUser.userType !== 'rider') return;

        navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Update rider's location in Firebase
                const rider = await DB.getRiderByUserId(Auth.currentUser.id);
                if (rider) {
                    await DB.updateRider(rider.id, {
                        currentLat: latitude,
                        currentLng: longitude,
                        lastUpdated: firebase.database.ServerValue.TIMESTAMP
                    });
                }
                
                // Update rider's marker on the map
                if (riderMap && this.currentRide) {
                    if (!this.riderMarker) {
                        this.riderMarker = L.marker([latitude, longitude], {
                            icon: L.divIcon({
                                className: 'rider-marker',
                                html: '🏍️',
                                iconSize: [30, 30]
                            })
                        }).addTo(riderMap);
                    } else {
                        this.riderMarker.setLatLng([latitude, longitude]);
                    }
                    
                    // Update routes
                    this.updateRouteDisplay();
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                showToast('Unable to get your location. Please check your GPS settings.', 'error');
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
    },

    // Update route display
    updateRouteDisplay(start, end, map) {
        if (!start || !end || !map) return;

        // Clear existing routes
        if (this.pickupRoutePolyline) {
            map.removeLayer(this.pickupRoutePolyline);
            this.pickupRoutePolyline = null;
        }
        if (this.destinationRoutePolyline) {
            map.removeLayer(this.destinationRoutePolyline);
            this.destinationRoutePolyline = null;
        }

        const currentUser = Auth.currentUser;
        const isRider = currentUser?.userType === 'rider';
        const isCustomer = currentUser?.userType === 'customer';

        if (!this.currentRide) return;

        const pickupCoords = this.currentRide.pickupLocation.coordinates;
        const destinationCoords = this.currentRide.destinationLocation.coordinates;

        // Draw pickup route (blue line)
        if (this.riderMarker && pickupCoords) {
            const riderPos = this.riderMarker.getLatLng();
            this.pickupRoutePolyline = L.polyline([
                [riderPos.lat, riderPos.lng],
                pickupCoords
            ], {
                color: '#2196F3', // Blue color
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10',
                className: 'pickup-route'
            }).addTo(map);
        }

        // Draw destination route (red line)
        if (pickupCoords && destinationCoords) {
            this.destinationRoutePolyline = L.polyline([
                pickupCoords,
                destinationCoords
            ], {
                color: '#F44336', // Red color
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10',
                className: 'destination-route'
            }).addTo(map);
        }

        // Fit map bounds to show all relevant points
        const bounds = L.latLngBounds([]);
        
        if (this.riderMarker) {
            bounds.extend(this.riderMarker.getLatLng());
        }
        if (pickupCoords) {
            bounds.extend(pickupCoords);
        }
        if (destinationCoords) {
            bounds.extend(destinationCoords);
        }

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
                padding: [50, 50]
            });
        }
    },

    // Update maps with current locations
    updateLocationMarkers() {
        if (!this.currentRide) return;

        const rider = DB.getRiderById(this.currentRide.riderId);
        if (!rider) return;

        const pickupCoords = this.currentRide.pickupLocation.coordinates;
        const destinationCoords = this.currentRide.destinationLocation.coordinates;

        // Update customer map
        if (customerMap && Auth.currentUser?.userType === 'customer') {
            // Show rider's location
            if (rider.currentLat && rider.currentLng) {
                if (!this.riderMarker) {
                    this.riderMarker = L.marker([rider.currentLat, rider.currentLng], {
                        icon: L.divIcon({
                            className: 'rider-marker',
                            html: '🏍️',
                            iconSize: [30, 30]
                        })
                    }).addTo(customerMap);
                } else {
                    this.riderMarker.setLatLng([rider.currentLat, rider.currentLng]);
                }
            }

            // Show pickup location
            if (pickupCoords && !this.customerMarker) {
                this.customerMarker = L.marker(pickupCoords, {
                    icon: L.divIcon({
                        className: 'customer-marker',
                        html: '📍',
                        iconSize: [30, 30]
                    })
                }).addTo(customerMap);
            }

            // Update routes
            this.updateRouteDisplay(
                [rider.currentLat, rider.currentLng],
                pickupCoords,
                customerMap
            );
        }

        // Update rider map
        if (riderMap && Auth.currentUser?.userType === 'rider') {
            // Show pickup location
            if (pickupCoords && !this.customerMarker) {
                this.customerMarker = L.marker(pickupCoords, {
                    icon: L.divIcon({
                        className: 'customer-marker',
                        html: '📍',
                        iconSize: [30, 30]
                    })
                }).addTo(riderMap);
            }

            // Show destination marker
            if (destinationCoords && !this.destinationMarker) {
                this.destinationMarker = L.marker(destinationCoords, {
                    icon: L.divIcon({
                        className: 'destination-marker',
                        html: '🎯',
                        iconSize: [30, 30]
                    })
                }).addTo(riderMap);
            }

            // Update routes for rider
            if (rider.currentLat && rider.currentLng) {
                this.updateRouteDisplay(
                    [rider.currentLat, rider.currentLng],
                    pickupCoords,
                    riderMap
                );
            }
        }
    },

    // Start the ride
    async startRide() {
        try {
            if (!this.currentRide) {
                showToast('No active ride found', 'error');
                return;
            }

            // Update ride status
            const updatedRide = DB.updateRide(this.currentRide.id, {
                status: 'in_progress',
                startedAt: new Date().toISOString()
            });

            if (!updatedRide) {
                showToast('Failed to start ride', 'error');
                return;
            }

            this.currentRide = updatedRide;
            this.updateRideUI();

            // Enable complete ride button
            document.getElementById('complete-ride-btn').disabled = false;
            document.getElementById('start-ride-btn').disabled = true;

            showToast('Ride started successfully!', 'success');
        } catch (error) {
            console.error('Error starting ride:', error);
            showToast('Failed to start ride', 'error');
        }
    },

    // Complete the ride
    async completeRide() {
        try {
            if (!this.currentRide) {
                showToast('No active ride found', 'error');
                return;
            }

            // Update ride status
            const updatedRide = DB.updateRide(this.currentRide.id, {
                status: 'completed',
                completedAt: new Date().toISOString()
            });

            if (!updatedRide) {
                showToast('Failed to complete ride', 'error');
                return;
            }

            this.currentRide = null;
            
            // Clean up markers and route
            this.cleanupMapObjects();

            // Show ride requests view for rider
            if (Auth.currentUser?.userType === 'rider') {
                document.getElementById('active-ride-details-rider').classList.remove('active');
                document.getElementById('ride-requests').classList.add('active');
            }

            showToast('Ride completed successfully!', 'success');
        } catch (error) {
            console.error('Error completing ride:', error);
            showToast('Failed to complete ride', 'error');
        }
    },

    // Cancel the ride
    async cancelRide() {
        try {
            if (!this.currentRide) {
                showToast('No active ride found', 'error');
                return;
            }

            // Update ride status
            const updatedRide = DB.updateRide(this.currentRide.id, {
                status: 'cancelled',
                cancelledAt: new Date().toISOString(),
                cancelledBy: Auth.currentUser.userType
            });

            if (!updatedRide) {
                showToast('Failed to cancel ride', 'error');
                return;
            }

            this.currentRide = null;
            
            // Clean up markers and route
            this.cleanupMapObjects();

            // Reset UI based on user type
            if (Auth.currentUser?.userType === 'customer') {
                document.getElementById('active-ride-details').classList.remove('active');
                document.getElementById('ride-request-form').classList.add('active');
            } else if (Auth.currentUser?.userType === 'rider') {
                document.getElementById('active-ride-details-rider').classList.remove('active');
                document.getElementById('ride-requests').classList.add('active');
            }

            showToast('Ride cancelled successfully', 'success');
        } catch (error) {
            console.error('Error cancelling ride:', error);
            showToast('Failed to cancel ride', 'error');
        }
    },

    // Clean up map objects
    cleanupMapObjects() {
        if (this.riderMarker) {
            if (customerMap) customerMap.removeLayer(this.riderMarker);
            if (riderMap) riderMap.removeLayer(this.riderMarker);
            this.riderMarker = null;
        }
        
        if (this.customerMarker) {
            if (customerMap) customerMap.removeLayer(this.customerMarker);
            if (riderMap) riderMap.removeLayer(this.customerMarker);
            this.customerMarker = null;
        }

        if (this.destinationMarker) {
            if (customerMap) customerMap.removeLayer(this.destinationMarker);
            if (riderMap) riderMap.removeLayer(this.destinationMarker);
            this.destinationMarker = null;
        }
        
        if (this.pickupRoutePolyline) {
            if (customerMap) customerMap.removeLayer(this.pickupRoutePolyline);
            if (riderMap) riderMap.removeLayer(this.pickupRoutePolyline);
            this.pickupRoutePolyline = null;
        }

        if (this.destinationRoutePolyline) {
            if (customerMap) customerMap.removeLayer(this.destinationRoutePolyline);
            if (riderMap) riderMap.removeLayer(this.destinationRoutePolyline);
            this.destinationRoutePolyline = null;
        }
    },

    // Request a new ride
    async requestRide() {
        try {
            // Get current user
            const customer = Auth.currentUser;
            if (!customer) {
                showToast('Please log in to request a ride', 'error');
                return;
            }
            
            // Get pickup and destination locations
            const pickupLocation = document.getElementById('pickup-location').value;
            const destinationLocation = document.getElementById('destination-location').value;
            
            if (!pickupLocation || !destinationLocation) {
                showToast('Please enter both pickup and destination locations', 'error');
                return;
            }
            
            // Get coordinates from the map marker for pickup
            const pickupCoords = currentMarker ? [currentMarker.getLatLng().lat, currentMarker.getLatLng().lng] : null;
            
            if (!pickupCoords) {
                showToast('Please set your pickup location on the map', 'error');
                return;
            }

            // Check if there are any available riders
            const availableRiders = DB.getAvailableRiders();
            if (!availableRiders || availableRiders.length === 0) {
                showToast('No riders are currently available. Please try again later.', 'error');
                return;
            }
            
            // Create the ride request
            const rideRequest = DB.createRide({
                customerId: customer.id,
                pickupLocation: {
                    address: pickupLocation,
                    coordinates: pickupCoords
                },
                destinationLocation: {
                    address: destinationLocation
                },
                status: 'requested',
                requestedAt: new Date().toISOString()
            });
            
            // Update UI
            this.currentRide = rideRequest;
            this.updateRideUI();
            
            // Show success message
            showToast('Ride requested successfully! Waiting for a rider...', 'success');
            
            // Show active ride details
            document.getElementById('ride-request-form').classList.remove('active');
            document.getElementById('active-ride-details').classList.add('active');

            // Expand bottom sheet to show ride details
            const bottomSheet = document.getElementById('customer-bottom-sheet');
            if (bottomSheet) {
                bottomSheet.classList.remove('collapsed');
            }
            
        } catch (error) {
            console.error('Error requesting ride:', error);
            showToast('Failed to request ride. Please try again.', 'error');
        }
    },
    
    // Update rider's availability status
    async updateRiderStatus(isAvailable) {
        try {
            const rider = DB.getRiderByUserId(Auth.currentUser.id);
            if (!rider) {
                showToast('Rider profile not found', 'error');
                return;
            }
            
            // Update rider availability
            DB.updateRider(rider.id, { isAvailable });
            
            // Update UI
            document.getElementById('rider-status-text').textContent = isAvailable ? 'Online' : 'Offline';
            
            // If going offline, hide any pending requests
            if (!isAvailable) {
                document.getElementById('ride-requests-list').innerHTML = '<p class="empty-message">You are currently offline</p>';
            } else {
                // If going online, start checking for requests
                this.loadPendingRequests();
            }
            
        } catch (error) {
            console.error('Error updating rider status:', error);
            showToast('Failed to update status. Please try again.', 'error');
        }
    },
    
    // Load pending ride requests for riders
    async loadPendingRequests() {
        try {
            const pendingRequests = DB.getPendingRideRequests();
            const requestsList = document.getElementById('ride-requests-list');
            
            if (!pendingRequests || pendingRequests.length === 0) {
                requestsList.innerHTML = '<p class="empty-message">No ride requests available</p>';
                return;
            }
            
            // Display each request with customer details and locations
            requestsList.innerHTML = pendingRequests.map(request => {
                const customer = DB.getUserById(request.customerId);
                return `
                    <div class="request-card" data-request-id="${request.id}">
                        <div class="request-header">
                            <div class="customer-info">
                                <div class="profile-circle">
                                    <span>${customer.firstName[0]}${customer.lastName[0]}</span>
                                </div>
                                <div class="customer-details">
                                    <h3>${customer.firstName} ${customer.lastName}</h3>
                                    <p class="request-time">${this.formatRequestTime(request.requestedAt)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="request-locations">
                            <div class="location pickup">
                                <span class="dot"></span>
                                <p>${request.pickupLocation.address}</p>
                            </div>
                            <div class="location-divider"></div>
                            <div class="location destination">
                                <span class="dot"></span>
                                <p>${request.destinationLocation.address}</p>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="btn btn-primary accept-request-btn" onclick="Rides.acceptRide('${request.id}')">
                                <span class="btn-icon">✓</span>
                                Accept Request
                            </button>
                            <button class="btn btn-secondary view-on-map-btn" onclick="Rides.viewRequestOnMap('${request.id}')">
                                <span class="btn-icon">🗺️</span>
                                View on Map
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading requests:', error);
            showToast('Failed to load ride requests', 'error');
        }
    },
    
    // Format request time to relative time
    formatRequestTime(timestamp) {
        const requestTime = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - requestTime) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    },

    // View request location on map
    viewRequestOnMap(requestId) {
        const request = DB.getRideById(requestId);
        if (!request || !request.pickupLocation.coordinates) {
            showToast('Unable to show location on map', 'error');
            return;
        }

        // Center map on pickup location
        const [lat, lng] = request.pickupLocation.coordinates;
        if (riderMap) {
            riderMap.setView([lat, lng], 15);

            // Add or update marker
            if (this.customerMarker) {
                riderMap.removeLayer(this.customerMarker);
            }
            this.customerMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'customer-marker',
                    html: '📍',
                    iconSize: [30, 30]
                })
            }).addTo(riderMap);

            // Collapse bottom sheet partially to show more map
            const bottomSheet = document.getElementById('rider-bottom-sheet');
            if (bottomSheet) {
                bottomSheet.classList.add('collapsed');
            }
        }
    },

    // Accept a ride request
    async acceptRide(requestId) {
        try {
            const rider = DB.getRiderByUserId(Auth.currentUser.id);
            if (!rider) {
                showToast('Rider profile not found', 'error');
                return;
            }

            // Check if rider is available
            if (!rider.isAvailable) {
                showToast('You must be online to accept rides', 'error');
                return;
            }

            // Check if the request is still available
            const request = DB.getRideById(requestId);
            if (!request || request.status !== 'requested') {
                showToast('This ride request is no longer available', 'error');
                this.loadPendingRequests(); // Refresh the list
                return;
            }
            
            // Update ride status
            const updatedRide = DB.updateRide(requestId, {
                riderId: rider.id,
                status: 'accepted',
                acceptedAt: new Date().toISOString()
            });
            
            if (!updatedRide) {
                showToast('Failed to accept ride', 'error');
                return;
            }

            // Update rider's availability
            DB.updateRider(rider.id, { isAvailable: false });
            
            // Update UI
            this.currentRide = updatedRide;
            this.updateRideUI();
            
            // Show success message
            showToast('Ride accepted successfully!', 'success');
            
            // Show active ride details
            document.getElementById('ride-requests').classList.remove('active');
            document.getElementById('active-ride-details-rider').classList.add('active');

            // Expand bottom sheet
            const bottomSheet = document.getElementById('rider-bottom-sheet');
            if (bottomSheet) {
                bottomSheet.classList.remove('collapsed');
            }

            // Center map on pickup location
            if (updatedRide.pickupLocation.coordinates) {
                const [lat, lng] = updatedRide.pickupLocation.coordinates;
                if (riderMap) {
                    riderMap.setView([lat, lng], 15);
                }
            }
            
        } catch (error) {
            console.error('Error accepting ride:', error);
            showToast('Failed to accept ride. Please try again.', 'error');
        }
    },
    
    // Update ride UI based on current status
    updateRideUI() {
        if (!this.currentRide) return;
        
        const isCustomer = Auth.currentUser.userType === 'customer';
        const isRider = Auth.currentUser.userType === 'rider';
        
        if (isCustomer) {
            // Update customer UI
            document.getElementById('ride-status-badge').textContent = this.currentRide.status;
            document.getElementById('active-pickup-address').textContent = this.currentRide.pickupLocation.address;
            document.getElementById('active-destination-address').textContent = this.currentRide.destinationLocation.address;
            
            if (this.currentRide.riderId) {
                const rider = DB.getRiderById(this.currentRide.riderId);
                const riderUser = DB.getUserById(rider.userId);
                
                document.getElementById('rider-name').textContent = `${riderUser.firstName} ${riderUser.lastName}`;
                document.getElementById('rider-vehicle').textContent = rider.vehicleModel;
                document.getElementById('rider-phone-display').textContent = riderUser.phone;
                document.getElementById('rider-initials').textContent = riderUser.firstName[0] + riderUser.lastName[0];
                
                // Enable contact buttons
                document.getElementById('call-rider-btn').disabled = false;
                document.getElementById('message-rider-btn').disabled = false;
            }

            // Update location markers
            this.updateLocationMarkers();
        } else if (isRider) {
            // Update rider UI
            document.getElementById('rider-ride-status-badge').textContent = this.currentRide.status;
            document.getElementById('rider-pickup-address').textContent = this.currentRide.pickupLocation.address;
            document.getElementById('rider-destination-address').textContent = this.currentRide.destinationLocation.address;
            
            const customer = DB.getUserById(this.currentRide.customerId);
            document.getElementById('customer-name-display').textContent = `${customer.firstName} ${customer.lastName}`;
            document.getElementById('customer-phone-display').textContent = customer.phone;
            document.getElementById('customer-initials').textContent = customer.firstName[0] + customer.lastName[0];

            // Update location markers
            this.updateLocationMarkers();

            // Update ride control buttons
            const startRideBtn = document.getElementById('start-ride-btn');
            const completeRideBtn = document.getElementById('complete-ride-btn');
            
            if (this.currentRide.status === 'accepted') {
                startRideBtn.disabled = false;
                completeRideBtn.disabled = true;
            } else if (this.currentRide.status === 'in_progress') {
                startRideBtn.disabled = true;
                completeRideBtn.disabled = false;
            }
        }
    },
    
    // Start polling for ride status updates
    startStatusPolling() {
        setInterval(() => {
            if (Auth.currentUser) {
                if (Auth.currentUser.userType === 'customer') {
                    const activeRide = DB.getActiveRideForCustomer(Auth.currentUser.id);
                    if (activeRide && (!this.currentRide || activeRide.status !== this.currentRide.status)) {
                        this.currentRide = activeRide;
                        this.updateRideUI();
                    }
                } else if (Auth.currentUser.userType === 'rider') {
                    const rider = DB.getRiderByUserId(Auth.currentUser.id);
                    if (rider && rider.isAvailable) {
                        this.loadPendingRequests();
                    }
                    
                    const activeRide = DB.getActiveRideForRider(rider.id);
                    if (activeRide && (!this.currentRide || activeRide.status !== this.currentRide.status)) {
                        this.currentRide = activeRide;
                        this.updateRideUI();
                    }
                }
            }
        }, 5000); // Poll every 5 seconds
    },

    // Clean up
    cleanup() {
        DB.cleanup(); // Remove all Firebase listeners
        if (this.locationWatcher) {
            navigator.geolocation.clearWatch(this.locationWatcher);
        }
        this.cleanupMapObjects();
    }
}; 