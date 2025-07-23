app.controller('addUserController', async function ($scope, $rootScope, $timeout, addUserService) {

    $scope.registerData = {
        UserName: "",
        UserMobileNo: "",
        UserEmailAddress: "",
        UserAddress: "",
        RoleId: "",
        UserPassword: ""
    };

    $scope.loadRoles = async function () {
        await addUserService.getRoles({ Id: $rootScope.currentUser.UserId })
            .then(function (response) {
                // console.log('API Success:', response.data.data);
                $timeout(function () {
                    $scope.roles = response.data.data;
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

    $scope.selectedRoleChanged = function (selectedRole) {
        if (selectedRole) {
            // console.log("Selected Role:", selectedRole.RoleId, selectedRole.RoleName);
            $scope.registerData.RoleId = selectedRole.RoleId;
        }
    };

    $scope.registerUser = async function () {
        await addUserService.registerUser($scope.registerData)
            .then(function (response) {
                if (response.data.status) {
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        timeOut: 1500,
                        positionClass: 'toast-bottom-right'
                    };
                    toastr.success('Employee management system', `User registered successfully.`);
                    $timeout(function () {
                        $scope.clearData();
                        $scope.getUsers();
                    });
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

    $scope.getUsers = async function () {
        await addUserService.getUsers({ Id: $rootScope.currentUser.UserId, PageNumber: 0, PageSize: 0 })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        const table = $('.dataTables-example').DataTable();
                        if (table) table.destroy();
                    });
                    $timeout(function () {
                        $scope.users = response.data.data;
                        $timeout(function () {
                            $('.dataTables-example').DataTable({
                                destroy: true,
                                pageLength: 10,
                                responsive: true,
                                order: [],
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    { extend: 'copy' },
                                    { extend: 'csv', title: 'Users' },
                                    { extend: 'excel', title: 'Users' },
                                    {
                                        extend: 'pdf',
                                        title: 'Users',
                                        orientation: 'landscape',
                                        pageSize: 'A4',
                                        exportOptions: {
                                            columns: ':not(:last-child)'
                                        },
                                        customize: function (doc) {
                                            doc.defaultStyle.fontSize = 8;
                                            doc.styles.tableHeader.fontSize = 9;
                                            doc.styles.title.fontSize = 12;
                                            doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');

                                            // Center vertically and align text left
                                            var tableBody = doc.content[1].table.body;
                                            for (let i = 0; i < tableBody.length; i++) {
                                                for (let j = 0; j < tableBody[i].length; j++) {
                                                    tableBody[i][j].alignment = 'left'; // horizontal
                                                    tableBody[i][j].margin = [0, 4];     // vertical padding for center feel
                                                }
                                            }

                                            // Optional: shrink table to fit page if overflowing
                                            doc.content[1].layout = {
                                                hLineWidth: function () { return 0.5; },
                                                vLineWidth: function () { return 0.5; },
                                                hLineColor: function () { return '#aaa'; },
                                                vLineColor: function () { return '#aaa'; },
                                                paddingLeft: function () { return 4; },
                                                paddingRight: function () { return 4; },
                                                paddingTop: function () { return 2; },
                                                paddingBottom: function () { return 2; }
                                            };

                                        }
                                    },
                                    {
                                        extend: 'print',
                                        exportOptions: {
                                            columns: ':not(.noExport)'
                                        },
                                        customize: function (win) {
                                            $(win.document.body).addClass('white-bg');
                                            $(win.document.body).css('font-size', '10px');

                                            $(win.document.body).find('table')
                                                .addClass('compact')
                                                .css('font-size', 'inherit');
                                        }
                                    }
                                ]
                            });
                        }, 100);
                    });
                }
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

    $scope.clearData = () => {
        $scope.registerData.UserName = "";
        $scope.registerData.UserMobileNo = "";
        $scope.registerData.UserEmailAddress = "";
        $scope.registerData.UserAddress = "";
        $scope.selectedRole = null;
        $scope.registerData.UserPassword = "";
    }
    await $scope.loadRoles();
    await $scope.getUsers();
});
