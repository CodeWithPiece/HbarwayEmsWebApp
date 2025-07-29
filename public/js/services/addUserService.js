app.service('addUserService', function () {
    const baseUrl = '/api';

    this.getRoles = async function (data) {
        return await axios.post(`${baseUrl}/master/roles`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.registerUser = async function (data) {
        return await axios.post(`${baseUrl}/user/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.updateUser = async function (data) {
        return await axios.post(`${baseUrl}/user/update`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.getUsers = async function (data) {
        return await axios.post(`${baseUrl}/user/getUsers`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.getUsersAttendance = async function (data) {
        return await axios.post(`${baseUrl}/user/attendance`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});
