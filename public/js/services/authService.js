app.service('authService', function () {
    const baseUrl = '/api';

    this.doLogin = async function (data) {
        return await axios.post(`${baseUrl}/user/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.doLogout = async function (data) {
        return await axios.post(`${baseUrl}/user/logout`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});
