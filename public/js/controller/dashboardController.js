app.controller('dashboardController', async function ($scope, $timeout, $rootScope, dashboardService) {

    $scope.getDashboardData = async function () {
        await dashboardService.getDashboardData({ Id: $rootScope.currentUser.UserId, UserId: $rootScope.currentUser.UserId, Month: 6, Year: 2025 })
            .then(function (response) {
                $timeout(function () {
                    $scope.dashBoardData = response.data.data;
                });
            })
            .catch(function (error) {
                console.error('API Error:', error.response.data);
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
    };

    await $scope.getDashboardData();

});
