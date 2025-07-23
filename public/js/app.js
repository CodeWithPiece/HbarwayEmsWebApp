var app = angular.module('myApp', []);

app.run(function ($rootScope, authService) {
    const user = sessionStorage.getItem('user');
    const currentPath = window.location.pathname;

    if (user) {
        $rootScope.currentUser = JSON.parse(user);
    }

    if (!user && currentPath !== '/') {
        window.location.href = "/";
    }
    else if (user && (currentPath === '/')) {
        window.location.href = "/dashboard";
    }

    $rootScope.doLogout = () => {
        authService.doLogout({ Id: $rootScope.currentUser.UserId, UserId: $rootScope.currentUser.UserId })
            .then(function (response) {
                if (response.data.status) {
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        timeOut: 1000,
                        positionClass: 'toast-bottom-right'
                    };
                    toastr.success('Employee management system', `See you soon.`);
                    setTimeout(function () {
                        sessionStorage.removeItem('user');
                        window.location.href = "/";
                    }, 1000);
                }
            })
            .catch(function (error) {
                if (error.response.data.message.toLowerCase().includes("token")) {
                    sessionStorage.removeItem('user');
                    window.location.href = "/";
                }
            });
    }

});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);