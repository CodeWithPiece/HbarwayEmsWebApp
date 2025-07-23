app.controller('userAttendanceController', async function ($scope, $rootScope, $timeout, addUserService) {

    $scope.AttendanceDate = new Date().toLocaleDateString('en-CA');

    $scope.getUsersAttendance = async function (UserName, UserMobileNo, AttendanceDate) {
        await addUserService.getUsersAttendance({ Id: $rootScope.currentUser.UserId, UserName, UserMobileNo, AttendanceDate })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        const table = $('.dataTables-example').DataTable();
                        if (table) table.destroy();
                    });

                    $timeout(function () {
                        $scope.usersAttendance = response.data.data;
                        $timeout(function () {
                            $('.dataTables-example').DataTable({
                                destroy: true,
                                pageLength: 10,
                                responsive: true,
                                order: [],
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    { extend: 'copy' },
                                    { extend: 'csv', title: 'Attendance' },
                                    { extend: 'excel', title: 'Attendance' },
                                    {
                                        extend: 'pdf',
                                        title: 'Attendance',
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
                // console.error('API Error:', error.response.data);
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

    $scope.onLocationClick = function (Latitude, Longitude) {
        if (Latitude && Longitude) {
            // const url = `https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}&travelmode=driving`;
            const url = `https://www.google.com/maps?q=${Latitude},${Longitude}`;
            window.open(url, '_blank');
        }
    }

    $scope.searchAttendance = async function () {
        const [month, day, year] = document.getElementById('AttendanceDate').value.split('/');
        const AttendanceDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        let UserName = '', UserMobileNo = '';
        if ($scope.UserName && $scope.UserName !== 'undefined') {
            UserName = $scope.UserName;
        }

        if ($scope.UserMobileNo && $scope.UserMobileNo !== 'undefined') {
            UserMobileNo = `${$scope.UserMobileNo}`;
        }
        await $scope.getUsersAttendance(UserName, UserMobileNo, AttendanceDate);
    }

    $scope.clearData = async function () {
        $scope.UserName = '';
        $scope.UserMobileNo = '';
        await $scope.getUsersAttendance('', '', $scope.AttendanceDate);
    }

    await $scope.getUsersAttendance('', '', $scope.AttendanceDate);
});
