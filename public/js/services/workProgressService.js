app.service('workProgressService', function () {
    const baseUrl = '/api';

    this.getUploadedDocuments = async function (data) {
        return await axios.post(`${baseUrl}/taskdocument/getDocuments`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});
