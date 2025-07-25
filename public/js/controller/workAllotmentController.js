app.controller('workAllotmentController', async function ($scope, $rootScope, $timeout, workAllotmentService, addUserService) {

    $scope.getUsers = async function () {
        await addUserService.getUsers({ Id: $rootScope.currentUser.UserId, PageNumber: 0, PageSize: 0 })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        $scope.users = response.data.data;
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

    $scope.selectedUserChanged = function (selectedUser) {
        if (selectedUser) {
            // console.log("Selected User:", selectedUser.UserId, selectedUser.UserName);
            $scope.UserId = selectedUser.UserId;
        }
    };

    $scope.getDistricts = async function () {
        await workAllotmentService.getDistricts({ Id: $rootScope.currentUser.UserId })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        $scope.districts = response.data.data;
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

    $scope.selectedDistrictChanged = function (selectedDistrict) {
        if (selectedDistrict) {
            // console.log("Selected District:", selectedDistrict.Id, selectedDistrict.Title);
            $scope.DistrictId = selectedDistrict.Id;
            $scope.getBlocksByDistrict(selectedDistrict.Id);
        }
    };

    $scope.getBlocksByDistrict = async function (DistrictId) {
        await workAllotmentService.getBlocksByDistrict({ Id: $rootScope.currentUser.UserId, DistrictId })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        $scope.blocks = response.data.data;
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

    $scope.selectedBlockChanged = function (selectedBlock) {
        if (selectedBlock) {
            // console.log("Selected Bokaro:", selectedBlock.Id, selectedBlock.Title);
            $scope.BlockId = selectedBlock.Id;
            $scope.getVillagesByBlock(selectedBlock.Id);
        }
    };

    $scope.getVillagesByBlock = async function (BlockId) {
        await workAllotmentService.getVillagesByBlock({ Id: $rootScope.currentUser.UserId, BlockId })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        $scope.villages = response.data.data;
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

    $scope.selectedVillageChanged = function (selectedVillage) {
        if (selectedVillage) {
            // console.log("Selected Village:", selectedVillage.Id, selectedVillage.Title);
            $scope.VillageId = selectedVillage.Id;
        }
    };

    $scope.createTask = async function () {
        const formData = new FormData();
        formData.append('Id', $rootScope.currentUser.UserId);
        formData.append('UserId', $scope.UserId);
        formData.append('AssignedBy', $rootScope.currentUser.UserId);
        formData.append('DistrictId', $scope.DistrictId);
        formData.append('BlockId', $scope.BlockId);
        formData.append('VillageId', $scope.VillageId);
        formData.append('TaskName', $scope.TaskName);
        formData.append('TaskCount', $scope.TaskCount);
        formData.append('TaskDescription', $scope.TaskDescription);
        formData.append('SerialNumberFrom', $scope.SerialNumberFrom);
        formData.append('SerialNumberTo', $scope.SerialNumberTo);
        formData.append('TaskAssignedDate', document.getElementById('taskAssignedDate').value);
        formData.append('TaskEndDate', document.getElementById('taskEndDate').value);
        if ($scope.TaskImage) {
            formData.append('TaskImage', $scope.TaskImage);
        }
        await workAllotmentService.createTask(formData)
            .then(function (response) {
                if (response.data.status) {
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        timeOut: 1500,
                        positionClass: 'toast-bottom-right'
                    };
                    toastr.success('Employee management system', `${response.data.message}`);
                    $timeout(function () {
                        $scope.clearData();
                        $scope.getTasks();
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

    $scope.getTasks = async function () {
        await workAllotmentService.getTasks({ Id: $rootScope.currentUser.UserId, UserId: $rootScope.currentUser.UserId })
            .then(function (response) {
                if (response.data.status) {
                    $timeout(function () {
                        const table = $('.dataTables-example').DataTable();
                        if (table) table.destroy();
                    });

                    $timeout(function () {
                        $scope.tasks = response.data.data;
                        $timeout(function () {
                            $('.dataTables-example').DataTable({
                                destroy: true,
                                pageLength: 10,
                                responsive: true,
                                order: [],
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    { extend: 'copy' },
                                    { extend: 'csv', title: 'Tasks' },
                                    { extend: 'excel', title: 'Tasks' },
                                    {
                                        extend: 'pdf',
                                        title: 'Tasks',
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

                                            // Explicit column widths (adjust as needed)
                                            doc.content[1].table.widths = [
                                                '5%',   // Task Id
                                                '8%',   // Task Name
                                                '15%',   // Task Description
                                                '8%',   // Assigned By
                                                '8%',   // Assigned To
                                                '6%',  // Sl No From
                                                '6%',   // Sl No To
                                                '6%',   // Task Count
                                                '8%',   // District
                                                '8%',   // Block
                                                '8%',   // Village
                                                '6%',  // Assigned Date
                                                '6%',   // End Date
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

    $scope.clearData = () => {
        $scope.TaskName = "";
        $scope.TaskCount = "";
        $scope.TaskDescription = "";
        $scope.SerialNumberFrom = "";
        $scope.SerialNumberTo = "";
        $scope.selectedUser = null;
        $scope.selectedDistrict = null;
        $scope.selectedBlock = null;
        $scope.selectedVillage = null;
        $('.fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
        $('.fileinput .fileinput-filename').text('');
    }

    await $scope.getUsers();
    await $scope.getDistricts();
    await $scope.getTasks();
});
