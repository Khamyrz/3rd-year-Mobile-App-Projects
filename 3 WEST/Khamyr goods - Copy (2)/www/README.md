# Madridejos Habal-Habal Taxi

A ride-hailing web application for Madridejos Habal-Habal Taxi service.

## Setup Instructions

1. Clone this repository
2. Open `index.html` in your web browser
3. Use the following credentials for testing:
   - Admin: username: `admin`, password: `admin123`

## Features

- User registration and authentication (Riders and Customers)
- Real-time location tracking
- Ride booking and management
- Admin dashboard for user management
- Password reset functionality
- Responsive design

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet
├── js/
│   ├── auth.js         # Authentication functionality
│   ├── customer.js     # Customer map and functionality
│   ├── rider.js        # Rider map and functionality
│   ├── admin.js        # Admin dashboard functionality
│   └── app.js          # Main application logic
└── README.md           # This file
```

## Dependencies

- Google Maps JavaScript API
- Leaflet for additional mapping features

## Notes

- This is a demo version using local storage for data persistence
- In a production environment, you would need to:
  1. Replace local storage with a proper backend database
  2. Implement proper security measures
  3. Use environment variables for API keys
  4. Add proper error handling and validation 