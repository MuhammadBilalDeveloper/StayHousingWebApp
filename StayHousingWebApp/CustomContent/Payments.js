$(function () {
    $("#DOBFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#JoiningDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#LastPaymentDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#DateCalledFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $(document).delegate('#TenantsFilterBTN', 'click', function (e, data) {
        e.preventDefault();
        filterTenantsGrid();
    });
    $(document).delegate('#ClearFilterBTN', 'click', function (e, data) {
        e.preventDefault();
        clearFilters();
    });
    LoadAllTenants("ALL");
})

function LoadAllTenants(Status) {
    var NI = $("#NINumberFilter").val().trim();
    var FullName = $("#FullNameFilter").val().trim();
    var CRN = $("#CRNFilter").val().trim();
    var Address = $("#AddressFilter").val().trim();
    var Referral = $("#ReferralFilter").val().trim();
    var DOB = $("#DOBFilter").val();
    var JoiningDate = $("#JoiningDateFilter").val();
    var JoiningDate = $("#JoiningDateFilter").val();
    var JoiningDate = $("#JoiningDateFilter").val();
    var LastPaymentDate = $("#LastPaymentDateFilter").val();
    var DateCalled = $("#DateCalledFilter").val();

    var dbModel = {
        'NI': NI, 'FullName': FullName, 'CRN': CRN, 'Address': Address, 'Referral': Referral, 'DOB': DOB, 'JoiningDate': JoiningDate,
        'LastPaymentDate': LastPaymentDate, 'DateCalled': DateCalled, 'Status': Status
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/LoadAllTenants",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {
                var profilePic = "";
                if (item.ProfileStatus == "Blue") {
                    profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle img-blue-circle' style='height:40px;width:40px;'>" : "<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle img-blue-circle' style='height:40px;width:40px;'>";
                } else if (item.ProfileStatus == "Orange") {
                    profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle img-orange-circle' style='height:40px;width:40px;'>" : "<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle img-orange-circle' style='height:40px;width:40px;'>";
                } else if (item.ProfileStatus == "Grey") {
                    profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle img-grey-circle' style='height:40px;width:40px;'>" : "<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle img-grey-circle' style='height:40px;width:40px;'>";
                } else {
                    profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>" : "<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>";
                }
                var FullName = item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname;
                var FullNameAndImage = "<div class='tdDiv'>" + profilePic + "<span>" + FullName + "</span></div>";

                var obj = {
                    'FullName': '<a href="/Payments/checkList/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                    'NI': item.NI,
                    'CRN': item.CRN,
                    'LastPaymentDate': item.LastPaymentDate,
                    'DateCalled': item.DateCalled,
                    'Status': item.Status,
                 
                }
                data.push(obj);
            });

            $('#tenants-table').DataTable({
                destroy: true,
                dom: "<'row'<'col-md-4'l><'col-md-7'f><'col-md-1'B>>" +
                    "<'row'<'col-md-6'><'col-md-6'>>" +
                    "<'row'<'col-md-12't>><'row'<'col-md-4'i><'col-md-8'p>>",
                buttons: [
                    {
                        text: 'Filter',
                        attr: {
                            class: 'btn btn-sm btn-success waves-effect waves-light',
                            id: 'FilterBTN1'
                        },
                        action: function (e, dt, node, config) {
                            //alert('Button activated');
                        }
                    }
                ],
                data: data,
                columns: [
                    { data: 'FullName' },
                    { data: 'NI' },
                    { data: 'CRN' },
                    { data: 'LastPaymentDate' },
                    { data: 'DateCalled' },
                    { data: 'Status' },
                ],
                columnDefs: [
                    //{ className: 'text-center', targets: [1,2] },
                    { orderable: false, targets: [-1] },
                    { visible: false, targets: [-1] }
                ],
                rowCallback: function (row, data) {
                    if (!data.Status.includes("Pay")) {
                        if (data.Status == 'Leavers cleared')
                            $(row).addClass('grayRow');
                        else
                            $(row).addClass('warningRow');
                    } else {
                        $(row).addClass('brightRow');
                    }
                }
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        },
        complete: function () {
            $("#FilterBTN1").attr('data-toggle', 'modal');
            $("#FilterBTN1").attr('data-target', '#right-modal');
        }
    });

}

function filterTenantsGrid() {
 

    if ($("#allTab").hasClass("active")) {
        LoadAllTenants("ALL");
    } else if ($("#activeTab").hasClass("active")) {
        LoadAllTenants("Active");
    } else if ($("#leaversTab").hasClass("active")) {
        LoadAllTenants("Leavers");
    } else if ($("#outstandingTab").hasClass("active")) {
        LoadAllTenants("Leavers Outstanding");
    } else if ($("#clearedTab").hasClass("active")) {
        LoadAllTenants("Leavers cleared");
    }
    $("#right-modal").modal("hide");
}

function clearFilters() {
    $("#NINumberFilter").val("");
    $("#FullNameFilter").val("");
    $("#CRNFilter").val("");
    $("#AddressFilter").val("");
    $("#ReferralFilter").val("");

    $("#DOBFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#JoiningDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#LastPaymentDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );
    $("#DateCalledFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
        }
    );

    $("#DOBFilter").flatpickr().clear();
    $("#JoiningDateFilter").flatpickr().clear();
    $("#LastPaymentDateFilter").flatpickr().clear();
    $("#DateCalledFilter").flatpickr().clear();

    if ($("#allTab").hasClass("active")) {
        LoadAllTenants("ALL");
    } else if ($("#activeTab").hasClass("active")) {
        LoadAllTenants("Active");
    } else if ($("#leaversTab").hasClass("active")) {
        LoadAllTenants("Leavers");
    } else if ($("#outstandingTab").hasClass("active")) {
        LoadAllTenants("Leavers Outstanding");
    } else if ($("#clearedTab").hasClass("active")) {
        LoadAllTenants("Leavers cleared");
    }

    $("#right-modal").modal("hide");
}