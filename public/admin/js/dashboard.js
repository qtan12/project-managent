// Enhanced revenue data with multiple datasets
const revenueData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [{
        label: 'Doanh thu (triệu VNĐ)',
        data: [120, 150, 180, 200, 250, 300],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3
    }, {
        label: 'Mục tiêu (triệu VNĐ)',
        data: [100, 120, 150, 180, 220, 280],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
    }]
};

const salesDistributionData = {
    labels: ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện', 'Khác'],
    datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
        ]
    }]
};

const ordersData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [{
        label: 'Số đơn hàng',
        data: [12, 19, 3, 5, 2, 3, 8],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

const categoriesData = {
    labels: ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện'],
    datasets: [{
        label: 'Số lượng bán',
        data: [156, 89, 67, 45],
        backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Revenue Chart (Enhanced Line Chart)
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        callback: function(value) {
                            return value + 'M';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#475569'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + 'M VNĐ';
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderJoinStyle: 'round',
                    borderCapStyle: 'round'
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Add period filter functionality
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on period
            const period = this.getAttribute('data-period');
            updateRevenueChart(period);
        });
    });

    // Function to update chart based on period
    function updateRevenueChart(period) {
        let newData, newLabels;
        
        switch(period) {
            case '1m':
                newLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                newData = [70, 85, 95, 110];
                break;
            case '3m':
                newLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3'];
                newData = [120, 150, 180];
                break;
            case '6m':
            default:
                newLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'];
                newData = [120, 150, 180, 200, 250, 300];
                break;
        }
        
        revenueChart.data.labels = newLabels;
        revenueChart.data.datasets[0].data = newData;
        revenueChart.update('active');
    }

    // Sales Distribution Chart (Doughnut Chart)
    const salesDistCtx = document.getElementById('salesDistributionChart').getContext('2d');
    new Chart(salesDistCtx, {
        type: 'doughnut',
        data: salesDistributionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Orders Chart (Bar Chart)
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ordersCtx, {
        type: 'bar',
        data: ordersData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Categories Chart (Horizontal Bar Chart)
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'bar',
        data: categoriesData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});