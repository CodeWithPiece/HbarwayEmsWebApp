app.controller('dashboardController', async function ($scope, $timeout, $rootScope, dashboardService, workProgressService) {

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

    $scope.getUploadedDocuments = async function (SerialNumber, ConsumerName, UserName) {
        await workProgressService.getUploadedDocuments({ Id: $rootScope.currentUser.UserId, SerialNumber, ConsumerName, UserName })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        const table = $('.dataTables-example').DataTable();
                        if (table) table.destroy();
                    });

                    $timeout(function () {
                        $scope.documents = response.data.data;
                        $timeout(function () {
                            $('.dataTables-example').DataTable({
                                destroy: true,
                                pageLength: 10,
                                responsive: true,
                                order: [],
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    { extend: 'copy', exportOptions: { columns: ':not(.noExport)' } },
                                    { extend: 'csv', title: 'WorkProgress', exportOptions: { columns: ':not(.noExport)' } },
                                    { extend: 'excel', title: 'WorkProgress', exportOptions: { columns: ':not(.noExport)' } },
                                    {
                                        extend: 'pdf',
                                        title: 'WorkProgress',
                                        orientation: 'landscape',
                                        pageSize: 'A4',
                                        exportOptions: {
                                            columns: ':not(.noExport)'
                                        },

                                        customize: function (doc) {
                                            // doc.pageMargins = [0, 10, 0, 10];
                                            doc.defaultStyle.fontSize = 6;
                                            doc.styles.tableHeader.fontSize = 8;
                                            doc.styles.title.fontSize = 8;

                                            // Explicit column widths (adjust as needed)
                                            doc.content[1].table.widths = [
                                                '6%',   // Document Id
                                                '3%',   // Task Id
                                                '6%',   // Installed By
                                                '4%',   // Serial No
                                                '6%',   // Installation Type
                                                '6%',   // Is Defective
                                                '8%',  // Consumer Name
                                                '6%',   // Consumer No
                                                '5%',   // Area Pincode
                                                '5%',   // Post Office
                                                '5%',   // Police Station
                                                '5%',   // House Number
                                                '10%',  // House Address
                                                '5%',   // Latitude
                                                '6%',   // Longitude
                                                '15%'   // Upload Location
                                            ];

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

    $scope.onLocationClick = function (Latitude, Longitude) {
        if (Latitude && Longitude) {
            // const url = `https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}&travelmode=driving`;
            const url = `https://www.google.com/maps?q=${Latitude},${Longitude}`;
            window.open(url, '_blank');
        }
    }

    await $scope.getDashboardData();
    await $scope.getUploadedDocuments('', '', '');

});
