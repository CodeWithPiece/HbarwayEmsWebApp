app.service('dashboardService', function () {
    const baseUrl = '/api';

    this.getDashboardData = async function (data) {
        return await axios.post(`${baseUrl}/master/dashboard`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});
