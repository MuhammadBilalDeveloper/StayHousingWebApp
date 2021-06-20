


$(function () {

    LoadAllHoliday();
    $('#Holiday-modal').on('hidden.bs.modal', function (e) {
        debugger;
        clearHolidayForm();
    });
    $("#HolidayDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            minDate: "today",
            onChange: function () {
                if ($('#HolidayDate').val() !== '' && $('#HolidayEndDate').val() !== '') {
                    var daysDiff = dateDiffInDays(new Date($('#HolidayDate').val().split('-')[2], $('#HolidayDate').val().split('-')[1], $('#HolidayDate').val().split('-')[0]),
                        new Date($('#HolidayEndDate').val().split('-')[2], $('#HolidayEndDate').val().split('-')[1], $('#HolidayEndDate').val().split('-')[0]));
                    if (parseInt(daysDiff) >= 0)
                        $("#HolidayDays").val(daysDiff + 1);
                    else
                        $("#HolidayDays").val(daysDiff);
                }
            }
        }
    );
    $("#HolidayEndDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            minDate: "today",
            onChange: function ()
            {
                if ($('#HolidayDate').val() !== '' && $('#HolidayEndDate').val() !== '') {
                    var daysDiff = dateDiffInDays(new Date($('#HolidayDate').val().split('-')[2], $('#HolidayDate').val().split('-')[1], $('#HolidayDate').val().split('-')[0]),
                        new Date($('#HolidayEndDate').val().split('-')[2], $('#HolidayEndDate').val().split('-')[1], $('#HolidayEndDate').val().split('-')[0]));
                    if (parseInt(daysDiff) >= 0)
                        $("#HolidayDays").val(daysDiff + 1);
                    else 
                        $("#HolidayDays").val(daysDiff);
                }
            }
        }
    );
    $("#ApprovalDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            minDate: "today",
        }
    );
    $("#PermissionDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            minDate: "today",
        }
    );
  
    $("#HolidayForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#HolidayForm").parsley().on("form:success", function (formInstance) {
        debugger;
        if ($("#hndAvailLeaves").val() != null && $("#hndAvailLeaves").val() != "" && $("#hdnLeaves").val() != null && $("#hdnLeaves").val != "") {
            if (parseInt($("#hndAvailLeaves").val()) >= parseInt($("#hdnLeaves").val())) {
                Swal.fire('Permission denied!', 'You have used up all your holidays, the request can not be completed..', 'error');
                return 0;
            }
        }

        InsertHoliday();
    });
    window.Parsley.addValidator('daterangevalidation', {
        validateString: function (value) {
            debugger;
            var allowed = true;

            if ($('#HolidayDate').val() !== '' && $('#HolidayEndDate').val() !== '') {
               
                return new Date($('#HolidayDate').val().split('-')[2], $('#HolidayDate').val().split('-')[1], $('#HolidayDate').val().split('-')[0])
                    <= new Date($('#HolidayEndDate').val().split('-')[2], $('#HolidayEndDate').val().split('-')[1], $('#HolidayEndDate').val().split('-')[0]);
            }

            return allowed;
        },
        messages: {
            en: 'End date must be greater than start date.',
        }
    });

    $(document).delegate('.paginate_button a', 'click', function (e) {
        e.preventDefault();
        var elems = Array.prototype.slice.call($('.switchery').not('[data-switchery="true"]'));
        elems.forEach(function (html) {
            html.onchange = function ()
            {
                ChangeHolidayStatus(html.defaultValue, html.checked);
            };
            new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor: '#6c757d' });
        });
    });
    $("#HolidayApproveForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });
    $("#HolidayApproveForm").parsley().on("form:success", function (formInstance) {
        debugger;
        InsertApproveHoliday();
    })
})

function LoadAllHoliday(Criteria)
{
    debugger;
    if (Criteria == undefined)
        Criteria = 'Booked'
    else
        var dbModel = { 'Status': Criteria };

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Holiday/LoadAllHoliday?Status=" + Criteria,
        data: {},
        async: false,
        dataType: "json",
        success: function (results)
        {
            debugger;
            $("#HolidayEntitlementLabel").text(parseInt(results.count[0].Leaves - results.count[0].AvailLeaves));
            var data = [];

            $.each(results.data, function (i, item) {
                $("#hdnLeaves").val(item.Leaves);
                $("#HolidayEntitlementLabel").text(parseInt(item.Leaves - item.AvailLeaves));
                $("#hndAvailLeaves").val(item.AvailLeaves);
                debugger;
                if (($("#hdnSessionGroupID").val() == '27' || $("#hdnSessionGroupID").val() == '2') && Criteria=='Booked') {
                    //var status = item.IsApproved == true ? "<div class='tdDiv'><input type='checkbox' checked value='" + item.ID + "' class='switchery'/></div>" : "<div class='tdDiv'><input type='checkbox' value='" + item.ID + "'' class='switchery'/></div>";
                    var status = item.Approved;
                    var action = '<a href="javascript: void(0);" class="" onclick="InsertOpenHoliday(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-bed"></i></a><a href="javascript: void(0);" class="ml-1" onclick="EditHoliday(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a><a href="javascript: void(0);" class="ml-1" onclick="DeleteHoliday(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>';
                }
                else if (($("#hdnSessionGroupID").val() == '27' || $("#hdnSessionGroupID").val() == '2') && (Criteria == 'Approved' || Criteria == 'Taken')) {
                    //var status = item.IsApproved == true ? "<div class='tdDiv'><input type='checkbox' checked value='" + item.ID + "' class='switchery'/></div>" : "<div class='tdDiv'><input type='checkbox' value='" + item.ID + "'' class='switchery'/></div>";
                    var status = item.Approved;
                    var action = '<a href="javascript: void(0);" class="ml-1" onclick="DeleteHoliday('+ $.trim(item.ID) + ',\'' + Criteria + '\')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>';
                }
                else if (($("#hdnSessionGroupID").val() != '27' || $("#hdnSessionGroupID").val() != '2') && (Criteria == 'Booked')) {
                    //var status = item.IsApproved == true ? "<div class='tdDiv'><input type='checkbox' checked value='" + item.ID + "' class='switchery'/></div>" : "<div class='tdDiv'><input type='checkbox' value='" + item.ID + "'' class='switchery'/></div>";
                    var status = item.Approved;
                    var action = '<a href="javascript: void(0);" class="ml-1" onclick="EditHoliday(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a><a href="javascript: void(0);" class="ml-1" onclick="DeleteHoliday('+ $.trim(item.ID)+',\''+Criteria+'\')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>';
                }
                else {
                    var status = item.Approved;
                    var action = '';
                }
                //var profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>" : "<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>";
                //var FullName = item.FirstName + ' ' + item.MiddleName + ' ' + item.SurName;
                //var FullNameAndImage = "<div class='tdDiv'>" + profilePic + "<span>" + FullName + "</span></div>";
               
                var obj = {
                    'SLNO': item.SLNO,
                    'FullName': "<div class='tdDiv'>" + item.FullName + "</div>",
                    'Start Date': "<div class='tdDiv'>" + moment(item.HolidayDate).format('LL') + "</div>",
                    'End Date': "<div class='tdDiv'>" + moment(item.HolidayEndDate).format('LL') + "</div>",
                    'Type': "<div class='tdDiv'>" + item.HolidayType + "</div>",
                    'Reason': "<div class='tdDiv'>" + item.Reason + "</div>",
                    'Approved': status,
                    'Days': item.Days,
                    'Approved By': item.ApprovedBy,
                    'Permission': item.PermissionBy,
                    'Actions': action


                }

                data.push(obj);
            });


            $('#holidays-table').DataTable({
                destroy: true,
                data: data,
                columns: [
                    { data: 'SLNO' },
                    { data: 'FullName' },
                    { data: 'Start Date' },
                    { data: 'End Date' },
                    { data: 'Type' },
                    { data: 'Reason' },
                    { data: 'Approved' },
                    { data: 'Days' },
                    { data: 'Approved By' },
                    { data: 'Permission' },
                    { data: 'Actions' }
                ],
                dom: 'Bfrtip',
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5'
                ]
            });

            var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'), changeField = document.querySelector('.switchery-field'));
            elems.forEach(function (html) {
                html.onchange = function ()
                {
                    ChangeHolidayStatus(html.defaultValue, html.checked);
                };
                new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor: '#6c757d' });
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {

                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });

}

function ChangeHolidayStatus(ID, IsApproved)
{
    var dbModel = { 'ID': ID, 'IsApproved': IsApproved };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Holiday/InsertHoliday",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            toastr.success('Holiday Status has been changed!', 'Success!');
            //LoadAllHoliday();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {

                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}


function EditHoliday(ID) {
    debugger;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Holiday/LoadSelectedHoliday?ID=" + ID,
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#ID").val(results.data[0].ID);
            $("#HolidayDate").flatpickr(
                {
                    altInput: false, allowInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "d-m-Y",
                    defaultDate: moment(results.data[0].HolidayDate).format('DD-MM-YYYY'),
                    //minDate: moment(results.data[0].HolidayDate).format('DD-MM-YYYY'),
                    //minDate: "today",
                    onChange: function () {
                        if ($('#HolidayDate').val() !== '' && $('#HolidayEndDate').val() !== '') {
                            var daysDiff = dateDiffInDays(new Date($('#HolidayDate').val().split('-')[2], $('#HolidayDate').val().split('-')[1], $('#HolidayDate').val().split('-')[0]),
                                new Date($('#HolidayEndDate').val().split('-')[2], $('#HolidayEndDate').val().split('-')[1], $('#HolidayEndDate').val().split('-')[0]));
                            if (parseInt(daysDiff) >= 0)
                                $("#HolidayDays").val(daysDiff + 1);
                            else
                                $("#HolidayDays").val(daysDiff);
                        }
                    }

                }
            );
            $("#HolidayEndDate").flatpickr(
                {
                    altInput: false, allowInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "d-m-Y",
                    defaultDate: moment(results.data[0].HolidayEndDate).format('DD-MM-YYYY'),
                    //minDate: moment(results.data[0].HolidayDate).format('DD-MM-YYYY'),
                    //minDate: "today",
                    onChange: function () {
                        if ($('#HolidayDate').val() !== '' && $('#HolidayEndDate').val() !== '') {
                            var daysDiff = dateDiffInDays(new Date($('#HolidayDate').val().split('-')[2], $('#HolidayDate').val().split('-')[1], $('#HolidayDate').val().split('-')[0]),
                                new Date($('#HolidayEndDate').val().split('-')[2], $('#HolidayEndDate').val().split('-')[1], $('#HolidayEndDate').val().split('-')[0]));
                            if (parseInt(daysDiff) >= 0)
                                $("#HolidayDays").val(daysDiff + 1);
                            else
                                $("#HolidayDays").val(daysDiff);
                        }
                    }
                }
            );
            $("#Reason").val(results.data[0].Reason);
            $("#HolidayDays").val(results.data[0].Days);
            var val = results.data[0].HolidayType;
            $('input[name="HolidayType"][value="' + val + '"]').prop('checked', true);
            $("#Holiday-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {

                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {

                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function DeleteHoliday(ID,Status) {
    debugger;
    var dbModel = { 'ID': ID }
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: Once deleted can't be undo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',

    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Holiday/DeleteHoliday",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    LoadAllHoliday(Status);
                    Swal.fire(
                        'Deleted!',
                        'Holiday has been deleted.',
                        'success'
                    );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 403) {

                        Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
                    } else {

                        toastr.error('Something went wrong!', 'Error!');
                    }
                }
            });

        }
    })


}

function InsertHoliday() {
    debugger;
    var ID = $("#ID").val();
    var HolidayDate = $("#HolidayDate").val();
    var HolidayEndDate = $("#HolidayEndDate").val();
    var Days = $("#HolidayDays").val();
    var HolidayType = $("input[name='HolidayType']:checked").val();
    var Reason = $("#Reason").val();
    //var isActive = parseInt($("input[name='statusRadio']:checked").val());
    var dbModel = { 'ID': ID, 'HolidayDate': FlatPickerDateToSQLDate(HolidayDate), 'HolidayEndDate': FlatPickerDateToSQLDate(HolidayEndDate), 'HolidayType': HolidayType, 'Reason': Reason, 'Days': Days }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Holiday/InsertHoliday",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Holiday data has been saved',
                'success'
            );
            clearHolidayForm();
            $("#Holiday-modal").modal('hide');
            LoadAllHoliday();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {

                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {

                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}
function InsertOpenHoliday(IDD)
{
    $("#Holiday-Approved-modal").modal('show');
    $("#ID").val(IDD)
}
function InsertApproveHoliday() {
    debugger;
    var ID = $("#ID").val();
    var IsApproved = true;
    var ApprovalDate = $("#ApprovalDate").val();
    var PermissionDate = $("#PermissionDate").val();
    var PermissionBy = $("#PermissionBy").val();
    var ApprovedBy = $("#ApprovedBy").val();
    var Permission = true;
    //var HolidayType = $("input[name='HolidayType']:checked").val();
    //var Reason = $("#Reason").val();
    //var isActive = parseInt($("input[name='statusRadio']:checked").val());
    var dbModel = { 'ID': ID, 'ApprovalDate': FlatPickerDateToSQLDate(ApprovalDate), 'PermissionDate': FlatPickerDateToSQLDate(PermissionDate), 'PermissionBy': PermissionBy, 'Permission': Permission, 'IsApproved': IsApproved, 'ApprovedBy': ApprovedBy }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Holiday/InsertApproveHoliday",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Holiday data has been saved',
                'success'
            );
            clearApproveHolidayForm();
            $("#Holiday-Approved-modal").modal('hide');
            $('.nav-tabs li:eq(1) a').click();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {

                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {

                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function clearHolidayForm() {
    $("#ID").val("");
    $("#HolidayDate").val("");
    $("#HolidayEndDate").val("");
    $("#HolidayDays").val("");
    $('input[name="HolidayType"][value="1"]').prop('checked', true);
    $("#Reason").val("");
}
function clearApproveHolidayForm() {
    $("#ID").val("");
    $("#ApprovalDate").val("");
    $("#PermissionDate").val("");
    $("#PermissionBy").val("");
    $("#Permission").val("");
    $("#ApprovedBy").val("");
    
}




function FlatPickerDateToSQLDate(dt) {
    if (dt == "" || dt == null) {
        return "";
    } else {
        var db = dt.split("-");
        return db[2] + '-' + db[1] + '-' + db[0];

    }
}
function HumanToOriginal(dt) {
    var db = dt.split(" ");
    var month = "";
    if (db[1] == "Jan")
        month = "01";
    else if (db[1] == "Feb")
        month = "02";
    else if (db[1] == "Mar")
        month = "03";
    else if (db[1] == "Apr")
        month = "04";
    else if (db[1] == "May")
        month = "05";
    else if (db[1] == "Jun")
        month = "06";
    else if (db[1] == "Jul")
        month = "07";
    else if (db[1] == "Aug")
        month = "08";
    else if (db[1] == "Sep")
        month = "09";
    else if (db[1] == "Oct")
        month = "10";
    else if (db[1] == "Nov")
        month = "11";
    else if (db[1] == "Dec")
        month = "12";

    return db[0] + '-' + month + '-' + db[2];
}
function dateDiffInDays(date1, date2) {
    // round to the nearest whole number
    debugger;
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
}



