// Ride management functionality
const Rides = {
    // Current ride state
    currentRide: null,
    riderMarker: null,
    customerMarker: null,
    routePolyline: null,
    rideRequestListener: null,
    rideUpdateListener: null,
    
    // Initialize ride functionality
    init() {
        console.log('Initializing Rides module...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // If user is a rider, listen for new ride requests
        if (Auth.currentUser && Auth.currentUser.userType === 'rider') {
            this.listenForRideRequests();
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
    },

    // Set up event listeners
    setupEventListeners() {
        // Customer ride request
        const requestRideBtn = document.getElementById('request-ride-btn');
        if (requestRideBtn) {
            requestRideBtn.addEventListener('click', () => this.requestRide());
        }
        
        // Rider ride acceptance
        document.addEventListener('click', (e) => {
            if (e.target.matches('.accept-ride-btn')) {
                const rideId = e.target.dataset.rideId;
                this.acceptRide(rideId);
            }
        });
        
        // Ride status updates
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
    },

    // Listen for new ride requests (rider only)
    listenForRideRequests() {
        this.rideRequestListener = DB.onRideRequest((ride) => {
            this.displayRideRequest(ride);
        });
    },

    // Display ride request in rider's UI
    displayRideRequest(ride) {
        const requestsList = document.getElementById('ride-requests-list');
        if (!requestsList) return;
        
        const requestElement = document.createElement('div');
        requestElement.className = 'ride-request';
        requestElement.innerHTML = `
            <div class="request-info">
                <h3>New Ride Request</h3>
                <p>From: ${ride.pickupLocation}</p>
                <p>To: ${ride.destinationLocation}</p>
            </div>
            <button class="btn btn-primary accept-ride-btn" data-ride-id="${ride.id}">
                Accept Ride
            </button>
        `;
        
        requestsList.appendChild(requestElement);
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

    // Watch rider's location
    watchRiderLocation() {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // Update rider's location in DB
                if (Auth.currentUser && this.currentRide) {
                    const rider = DB.getRiderByUserId(Auth.currentUser.id);
                    if (rider) {
                        DB.updateRider(rider.id, {
                            currentLat: latitude,
                            currentLng: longitude
                        });
                    }
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
                    
                    // Center map on rider's location
                    riderMap.setView([latitude, longitude], riderMap.getZoom());
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

    // Request a new ride
    async requestRide() {
        const pickupLocation = document.getElementById('pickup-location').value;
        const destinationLocation = document.getElementById('destination-location').value;
        
        if (!pickupLocation || !destinationLocation) {
            showToast('Please select both pickup and destination locations', 'error');
            return;
        }
        
        const customer = await DB.getCustomerByUserId(Auth.currentUser.id);
        if (!customer) {
            showToast('Customer profile not found', 'error');
            return;
        }
        
        const rideData = {
            customerId: customer.id,
            pickupLocation,
            destinationLocation,
            status: 'requested',
            createdAt: new Date().toISOString()
        };
        
        try {
            const ride = await DB.createRide(rideData);
            this.currentRide = ride;
            
            // Listen for updates to this ride
            this.listenForRideUpdates(ride.id);
            
            // Show ride status UI
            this.showRideStatus();
            
            showToast('Ride request sent successfully', 'success');
        } catch (error) {
            console.error('Error requesting ride:', error);
            showToast('Failed to request ride', 'error');
        }
    },
    
    // Accept a ride request (rider)
    async acceptRide(rideId) {
        const rider = await DB.getRiderByUserId(Auth.currentUser.id);
        if (!rider) {
            showToast('Rider profile not found', 'error');
            return;
        }
        
        try {
            await DB.updateRide(rideId, {
                riderId: rider.id,
                status: 'accepted',
                acceptedAt: new Date().toISOString()
            });
            
            // Update rider status
            await DB.updateRider(rider.id, { isAvailable: false });
            
            showToast('Ride accepted successfully', 'success');
        } catch (error) {
            console.error('Error accepting ride:', error);
            showToast('Failed to accept ride', 'error');
        }
    },
    
    // Start a ride (rider)
    async startRide() {
        if (!this.currentRide) return;
        
        try {
            await DB.updateRide(this.currentRide.id, {
                status: 'in_progress',
                startedAt: new Date().toISOString()
            });
            
            showToast('Ride started', 'success');
        } catch (error) {
            console.error('Error starting ride:', error);
            showToast('Failed to start ride', 'error');
        }
    },
    
    // Complete a ride (rider)
    async completeRide() {
        if (!this.currentRide) return;
        
        try {
            await DB.updateRide(this.currentRide.id, {
                status: 'completed',
                completedAt: new Date().toISOString()
            });
            
            // Update rider status
            const rider = await DB.getRiderByUserId(Auth.currentUser.id);
            if (rider) {
                await DB.updateRider(rider.id, { isAvailable: true });
            }
            
            showToast('Ride completed', 'success');
        } catch (error) {
            console.error('Error completing ride:', error);
            showToast('Failed to complete ride', 'error');
        }
    },
    
    // Cancel a ride
    async cancelRide() {
        if (!this.currentRide) return;
        
        try {
            await DB.updateRide(this.currentRide.id, {
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
            });
            
            // If rider cancelled, update their status
            if (Auth.currentUser.userType === 'rider') {
                const rider = await DB.getRiderByUserId(Auth.currentUser.id);
                if (rider) {
                    await DB.updateRider(rider.id, { isAvailable: true });
                }
            }
            
            showToast('Ride cancelled', 'success');
        } catch (error) {
            console.error('Error cancelling ride:', error);
            showToast('Failed to cancel ride', 'error');
        }
    },
    
    // Listen for updates to a specific ride
    listenForRideUpdates(rideId) {
        if (this.rideUpdateListener) {
            this.rideUpdateListener.off();
        }
        
        this.rideUpdateListener = DB.onRideUpdate(rideId, (ride) => {
            this.currentRide = ride;
            this.updateRideUI(ride);
        });
    },
    
    // Update UI based on ride status
    updateRideUI(ride) {
        const statusBadge = document.getElementById('ride-status-badge');
        if (statusBadge) {
            statusBadge.textContent = ride.status.charAt(0).toUpperCase() + ride.status.slice(1);
        }
        
        // Update rider/customer info if available
        if (ride.riderId) {
            this.updateRiderInfo(ride.riderId);
        }
        
        // Enable/disable buttons based on status
        const startRideBtn = document.getElementById('start-ride-btn');
        const completeRideBtn = document.getElementById('complete-ride-btn');
        const cancelRideBtn = document.getElementById('cancel-ride-btn');
        
        if (startRideBtn) {
            startRideBtn.disabled = ride.status !== 'accepted';
        }
        if (completeRideBtn) {
            completeRideBtn.disabled = ride.status !== 'in_progress';
        }
        if (cancelRideBtn) {
            cancelRideBtn.disabled = ['completed', 'cancelled'].includes(ride.status);
        }
    },
    
    // Update rider information in UI
    async updateRiderInfo(riderId) {
        const rider = await DB.getRiderById(riderId);
        if (!rider) return;
        
        const user = await DB.getUserById(rider.userId);
        if (!user) return;
        
        const riderInitials = document.getElementById('rider-initials');
        const riderName = document.getElementById('rider-name');
        const riderVehicle = document.getElementById('rider-vehicle');
        const riderPhone = document.getElementById('rider-phone-display');
        
        if (riderInitials) {
            riderInitials.textContent = `${user.name.charAt(0)}${user.name.split(' ')[1]?.charAt(0) || ''}`;
        }
        if (riderName) {
            riderName.textContent = user.name;
        }
        if (riderVehicle) {
            riderVehicle.textContent = rider.vehicleModel;
        }
        if (riderPhone) {
            riderPhone.textContent = rider.phone;
        }
    },
    
    // Show ride status UI
    showRideStatus() {
        const rideRequestForm = document.getElementById('ride-request-form');
        const activeRideDetails = document.getElementById('active-ride-details');
        
        if (rideRequestForm) {
            rideRequestForm.classList.remove('active');
        }
        if (activeRideDetails) {
            activeRideDetails.classList.add('active');
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
                        this.updateRideUI(activeRide);
                    }
                } else if (Auth.currentUser.userType === 'rider') {
                    const rider = DB.getRiderByUserId(Auth.currentUser.id);
                    if (rider && rider.isAvailable) {
                        this.loadPendingRequests();
                    }
                    
                    const activeRide = DB.getActiveRideForRider(rider.id);
                    if (activeRide && (!this.currentRide || activeRide.status !== this.currentRide.status)) {
                        this.currentRide = activeRide;
                        this.updateRideUI(activeRide);
                    }
                }
            }
        }, 5000); // Poll every 5 seconds
    },
    
    // Clean up listeners
    cleanup() {
        if (this.rideRequestListener) {
            this.rideRequestListener.off();
        }
        if (this.rideUpdateListener) {
            this.rideUpdateListener.off();
        }
    }
}; 