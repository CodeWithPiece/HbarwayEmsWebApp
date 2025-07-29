app.controller('workAllotmentController', async function ($scope, $rootScope, $timeout, workAllotmentService, addUserService) {

    $scope.todayDate = new Date().toISOString().split("T")[0];

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
        }
    };

    $scope.editTask = async function (task) {
        $scope.TaskId = task.TaskId;
        $scope.UserId = task.AssignedToId;
        $scope.TaskName = task.TaskName;
        $scope.TaskImageUrl = task.TaskImage;
        $scope.TaskDescription = task.TaskDescription;
        $scope.SerialNumberFrom = task.SerialNumberFrom;
        $scope.SerialNumberTo = task.SerialNumberTo;
        $scope.TaskCount = task.TaskCount;
        $scope.TaskAssignedDate = new Date(task.TaskAssignedDate);
        $scope.TaskEndDate = new Date(task.TaskEndDate);
        $scope.DistrictId = task.DistrictId;
        $scope.BlockId = task.BlockId;
        $scope.selectedUser = $scope.users.find(u => u.UserId === task.AssignedToId);
        $scope.selectedDistrict = $scope.districts.find(d => d.Id === task.DistrictId);
        await $scope.getBlocksByDistrict(task.DistrictId);
        $timeout(function () {
            $scope.selectedBlock = $scope.blocks.find(d => d.Id === task.BlockId);
        }, 100);
    };

    $scope.createTask = async function () {
        if ($scope.TaskId) {
            const formData = new FormData();
            formData.append('TaskId', $scope.TaskId);
            formData.append('Id', $rootScope.currentUser.UserId);
            formData.append('UserId', $scope.UserId);
            formData.append('AssignedBy', $rootScope.currentUser.UserId);
            formData.append('DistrictId', $scope.DistrictId);
            formData.append('BlockId', $scope.BlockId);
            formData.append('TaskName', $scope.TaskName);
            formData.append('TaskCount', $scope.TaskCount);
            formData.append('TaskDescription', $scope.TaskDescription);
            formData.append('SerialNumberFrom', $scope.SerialNumberFrom);
            formData.append('SerialNumberTo', $scope.SerialNumberTo);
            formData.append('TaskAssignedDate', $scope.formatToSQLDateTime($scope.TaskAssignedDate));
            formData.append('TaskEndDate', $scope.formatToSQLDateTime($scope.TaskEndDate));
            if ($scope.TaskImage && $scope.TaskImage.name) {
                formData.append('TaskImageUrl', $scope.TaskImageUrl);
                formData.append('TaskImage', $scope.TaskImage);
            }

            await workAllotmentService.updateTask(formData)
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
                            $scope.TaskId = null;
                            $scope.UserId = null;
                            $scope.DistrictId = null;
                            $scope.BlockId = null;
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
        } else {
            if (checkValidation()) {
                const formData = new FormData();
                formData.append('Id', $rootScope.currentUser.UserId);
                formData.append('UserId', $scope.UserId);
                formData.append('AssignedBy', $rootScope.currentUser.UserId);
                formData.append('DistrictId', $scope.DistrictId);
                formData.append('BlockId', $scope.BlockId);
                formData.append('TaskName', $scope.TaskName);
                formData.append('TaskCount', $scope.TaskCount);
                formData.append('TaskDescription', $scope.TaskDescription);
                formData.append('SerialNumberFrom', $scope.SerialNumberFrom);
                formData.append('SerialNumberTo', $scope.SerialNumberTo);
                formData.append('TaskAssignedDate', $scope.formatToSQLDateTime($scope.TaskAssignedDate));
                formData.append('TaskEndDate', $scope.formatToSQLDateTime($scope.TaskEndDate));
                formData.append('TaskImage', $scope.TaskImage);

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
            }
        }
    };

    $scope.formatToSQLDateTime = function (dateInput) {
        const date = new Date(dateInput);
        const pad = (n) => n.toString().padStart(2, '0');
        const ms = (n) => n.toString().padStart(3, '0');
        const istDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const yyyy = istDate.getFullYear();
        const mm = pad(istDate.getMonth() + 1);
        const dd = pad(istDate.getDate());
        const hh = pad(istDate.getHours());
        const mi = pad(istDate.getMinutes());
        const ss = pad(istDate.getSeconds());
        const mss = ms(istDate.getMilliseconds());
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${mss}`;
    };

    function checkValidation() {
        if (!$scope.TaskName || $scope.TaskName.trim() === "") {
            showToast('error', 'Employee Management System', 'Task name is required.');
            return false;
        }
        if (!$scope.TaskDescription || $scope.TaskDescription.trim() === "") {
            showToast('error', 'Employee Management System', 'Task description is required.');
            return false;
        }
        if (!$scope.SerialNumberFrom || $scope.SerialNumberFrom < 1 || !$scope.SerialNumberTo || $scope.SerialNumberTo < 1) {
            showToast('error', 'Employee Management System', 'Serial no is required.');
            return false;
        }
        if (!$scope.TaskCount) {
            showToast('error', 'Employee Management System', 'Total count is required.');
            return false;
        }
        if ($scope.TaskCount < 1) {
            showToast('error', 'Employee Management System', 'Enter valid total count.');
            return false;
        }
        if (!$scope.UserId) {
            showToast('error', 'Employee Management System', 'Select user to assign.');
            return false;
        }
        if (!$scope.DistrictId) {
            showToast('error', 'Employee Management System', 'District is required.');
            return false;
        }
        if (!$scope.BlockId) {
            showToast('error', 'Employee Management System', 'Block is required.');
            return false;
        }
        if (!$scope.TaskImage) {
            showToast('error', 'Employee Management System', 'Task image is required.');
            return false;
        }
        if (!$scope.TaskAssignedDate) {
            showToast('error', 'Employee Management System', 'Assign date is required.');
            return false;
        }
        if (!$scope.TaskEndDate) {
            showToast('error', 'Employee Management System', 'End date is required.');
            return false;
        }
        if (new Date($scope.TaskEndDate) < new Date($scope.TaskAssignedDate)) {
            showToast('error', 'Employee Management System', 'Assign date must be greater or equal to end date.');
            return false;
        }
        return true;
    }

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
                                    {
                                        extend: 'csv',
                                        title: 'Tasks',
                                        exportOptions: {
                                            columns: 'th:not(.noExport)'
                                        },
                                    },
                                    {
                                        extend: 'excel',
                                        title: 'Tasks',
                                        exportOptions: {
                                            columns: 'th:not(.noExport)'
                                        },
                                    },
                                    {
                                        extend: 'pdf',
                                        title: 'Tasks',
                                        orientation: 'landscape',
                                        pageSize: 'A4',
                                        exportOptions: {
                                            columns: 'th:not(.noExport)'
                                        },
                                        customize: function (doc) {
                                            doc.defaultStyle.fontSize = 8;
                                            doc.styles.tableHeader.fontSize = 9;
                                            doc.styles.title.fontSize = 12;

                                            if (
                                                doc.content &&
                                                doc.content[1] &&
                                                doc.content[1].table &&
                                                doc.content[1].table.body
                                            ) {
                                                doc.content[1].table.widths = [
                                                    '8%', '8%', '20%', '8%', '8%', '6%',
                                                    '6%', '6%', '8%', '8%', '6%', '6%'
                                                ];

                                                const tableBody = doc.content[1].table.body;
                                                for (let i = 0; i < tableBody.length; i++) {
                                                    for (let j = 0; j < tableBody[i].length; j++) {
                                                        if (typeof tableBody[i][j] === 'object') {
                                                            tableBody[i][j].alignment = 'left';
                                                            tableBody[i][j].margin = [0, 4];
                                                        }
                                                    }
                                                }

                                                doc.content[1].layout = {
                                                    hLineWidth: () => 0.5,
                                                    vLineWidth: () => 0.5,
                                                    hLineColor: () => '#aaa',
                                                    vLineColor: () => '#aaa',
                                                    paddingLeft: () => 4,
                                                    paddingRight: () => 4,
                                                    paddingTop: () => 2,
                                                    paddingBottom: () => 2
                                                };
                                            }
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
        $scope.TaskAssignedDate = null;
        $scope.TaskEndDate = null;
        $scope.TaskId = null;
        $scope.UserId = null;
        $scope.DistrictId = null;
        $scope.BlockId = null;
        $('.fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
        $('.fileinput .fileinput-filename').text('');
    }

    function showToast(type, title, message) {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 1500,
            positionClass: 'toast-bottom-right'
        };

        switch (type) {
            case 'success':
                toastr.success(message, title);
                break;
            case 'error':
                toastr.error(message, title);
                break;
            case 'info':
                toastr.info(message, title);
                break;
            case 'warning':
                toastr.warning(message, title);
                break;
            default:
                console.warn("Invalid toast type: " + type);
        }
    }

    await $scope.getUsers();
    await $scope.getDistricts();
    await $scope.getTasks();
});
