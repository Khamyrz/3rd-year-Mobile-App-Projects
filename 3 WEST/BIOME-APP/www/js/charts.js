// Chart configuration and data management
class DashboardCharts {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            danger: '#F44336',
            info: '#00BCD4'
        };
        // Set fixed height for all charts
        this.chartHeight = 300;
    }

    // Common chart options
    getCommonOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            }
        };
    }

    // Line chart specific options
    getLineChartOptions() {
        return {
            ...this.getCommonOptions(),
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 3,
                    hitRadius: 10,
                    hoverRadius: 5
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        };
    }

    // Bar chart specific options
    getBarChartOptions() {
        return {
            ...this.getCommonOptions(),
            elements: {
                bar: {
                    borderRadius: 4
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        };
    }

    // Doughnut chart specific options
    getDoughnutChartOptions() {
        return {
            ...this.getCommonOptions(),
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    display: true,
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            }
        };
    }

    // Initialize all charts
    initializeCharts() {
        // Set fixed height for all chart containers
        document.querySelectorAll('.chart-card canvas').forEach(canvas => {
            canvas.style.height = `${this.chartHeight}px`;
            canvas.style.width = '100%';
            canvas.style.maxHeight = `${this.chartHeight}px`;
        });

        this.initializeRevenueChart();
        this.initializeUserGrowthChart();
        this.initializeDestinationsChart();
        this.initializeBookingStatusChart();
        this.initializeEarningsChart();
        this.initializeBookingsChart();
        this.initializeReviewsChart();
    }

    // Revenue Chart
    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue',
                    data: [850000, 1200000, 950000, 1400000],
                    borderColor: this.colors.primary,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }]
            },
            options: {
                ...this.getLineChartOptions(),
                scales: {
                    ...this.getLineChartOptions().scales,
                    y: {
                        ...this.getLineChartOptions().scales.y,
                        ticks: {
                            callback: value => '₱' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // User Growth Chart
    initializeUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        this.charts.userGrowth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'New Users',
                    data: [120, 150, 180, 210],
                    borderColor: this.colors.success,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }]
            },
            options: this.getLineChartOptions()
        });
    }

    // Destinations Chart
    initializeDestinationsChart() {
        const ctx = document.getElementById('destinationsChart');
        if (!ctx) return;

        this.charts.destinations = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Palawan', 'Boracay', 'Cebu', 'Siargao', 'Bohol'],
                datasets: [{
                    label: 'Bookings',
                    data: [450, 380, 320, 280, 250],
                    backgroundColor: this.colors.warning
                }]
            },
            options: this.getBarChartOptions()
        });
    }

    // Booking Status Chart
    initializeBookingStatusChart() {
        const ctx = document.getElementById('bookingStatusChart');
        if (!ctx) return;

        this.charts.bookingStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Upcoming', 'Cancelled', 'In Progress'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        this.colors.success,
                        this.colors.primary,
                        this.colors.danger,
                        this.colors.warning
                    ]
                }]
            },
            options: this.getDoughnutChartOptions()
        });
    }

    // Guide Earnings Chart
    initializeEarningsChart() {
        const ctx = document.getElementById('earningsChart');
        if (!ctx) return;

        this.charts.earnings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Earnings',
                    data: [25000, 35000, 28000, 42000],
                    borderColor: this.colors.success,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }]
            },
            options: {
                ...this.getLineChartOptions(),
                scales: {
                    ...this.getLineChartOptions().scales,
                    y: {
                        ...this.getLineChartOptions().scales.y,
                        ticks: {
                            callback: value => '₱' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // Guide Bookings Chart
    initializeBookingsChart() {
        const ctx = document.getElementById('bookingsChart');
        if (!ctx) return;

        this.charts.bookings = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bookings',
                    data: [5, 8, 6, 9, 7, 12, 10],
                    backgroundColor: this.colors.primary
                }]
            },
            options: this.getBarChartOptions()
        });
    }

    // Guide Reviews Chart
    initializeReviewsChart() {
        const ctx = document.getElementById('reviewsChart');
        if (!ctx) return;

        this.charts.reviews = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                datasets: [{
                    data: [45, 30, 15, 5, 5],
                    backgroundColor: [
                        this.colors.success,
                        '#8BC34A',
                        this.colors.warning,
                        '#FF9800',
                        this.colors.danger
                    ]
                }]
            },
            options: this.getDoughnutChartOptions()
        });
    }

    // Update chart data
    updateChartData(chartId, newData) {
        if (this.charts[chartId]) {
            this.charts[chartId].data.datasets[0].data = newData;
            this.charts[chartId].update();
        }
    }

    // Update chart labels
    updateChartLabels(chartId, newLabels) {
        if (this.charts[chartId]) {
            this.charts[chartId].data.labels = newLabels;
            this.charts[chartId].update();
        }
    }

    // Update chart type
    updateChartType(chartId, newType) {
        if (this.charts[chartId]) {
            this.charts[chartId].config.type = newType;
            this.charts[chartId].update();
        }
    }

    // Destroy chart
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboardCharts = new DashboardCharts();
    dashboardCharts.initializeCharts();

    // Add event listeners for period selectors
    document.querySelectorAll('.form-control').forEach(select => {
        select.addEventListener('change', (e) => {
            const chartId = e.target.closest('.chart-card').querySelector('canvas').id;
            const period = e.target.value;
            // Here you would typically fetch new data based on the selected period
            // and update the chart using dashboardCharts.updateChartData()
        });
    });
}); 