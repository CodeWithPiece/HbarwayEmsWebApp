app.service('workAllotmentService', function () {
    const baseUrl = '/api';

    this.getDistricts = async function (data) {
        return await axios.post(`${baseUrl}/master/district`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.getBlocksByDistrict = async function (data) {
        return await axios.post(`${baseUrl}/master/block`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.getVillagesByBlock = async function (data) {
        return await axios.post(`${baseUrl}/master/village`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.createTask = async function (formData) {
        return await axios.post(`${baseUrl}/task/create`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    this.updateTask = async function (formData) {
        return await axios.post(`${baseUrl}/task/update`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    this.getTasks = async function (data) {
        return await axios.post(`${baseUrl}/task/getTasks`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});
