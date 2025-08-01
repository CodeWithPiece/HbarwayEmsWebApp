app.controller('loginController', function ($scope, authService) {

    $scope.formData = {
        UserMobileNo: '',
        UserPassword: ''
    };

    $scope.doLogin = async function () {
        await authService.doLogin($scope.formData)
            .then(function (response) {
                if (response.data.status) {
                    if (response.data.data.RoleId === 1 || response.data.data.RoleId === 3) {
                        sessionStorage.setItem('user', JSON.stringify(response.data.data));
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'slideDown',
                            timeOut: 1000,
                            positionClass: 'toast-bottom-right'
                        };
                        toastr.success('Employee management system', `Welcome back ${response.data.data.UserName}`);
                        setTimeout(function () {
                            window.location.href = "/dashboard";
                        }, 1000);
                    } else {
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'slideDown',
                            timeOut: 1500,
                            positionClass: 'toast-bottom-right'
                        };
                        toastr.error('Employee management system', `Invalid login credentials.`);
                    }
                }
            })
            .catch(function (error) {
                console.error('Login error:', error.response.data);
                if (error.response.data.message.toLowerCase().includes("token")) {
                    sessionStorage.removeItem('user');
                    window.location.href = "/";
                } else {
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        timeOut: 1500,
                        positionClass: 'toast-bottom-right'
                    };
                    toastr.error('Employee management system', error.response.data.message);
                }
            });
    }
});
