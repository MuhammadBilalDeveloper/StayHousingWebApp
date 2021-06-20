var allPaymentsData = [];

$(function () {
    $("#DateCalled").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate:"today"
        }
    );

    $("#FromDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );

    $("#ToDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );


    $('#StatusSelect').select2(
        { placeholder: "Select" }
    );
    var st = ["Live", "Processing", "Change of address","Proof of benefit required", "Claim Closed","Claim Suspended"]

    $("#StatusSelect").empty();
    $("#StatusSelect").append($("<option></option>"));
    $.each(st, function (i, item) {
        $("#StatusSelect").append($("<option></option>").val(item).html(item));
    });

    $('#PaymentStatus').select2(
        { placeholder: "Select" }
    );
    var pst = ["Received", "Partially received", "Not received"]
    $("#PaymentStatus").empty();
    $("#PaymentStatus").append($("<option></option>"));
    $.each(pst, function (i, item) {
        $("#PaymentStatus").append($("<option></option>").val(item).html(item));
    });

    $("#paymentCheckForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#paymentCheckForm").parsley().on("form:success", function (formInstance) {
        InsertPayment();
    });
    $(document).delegate('#paymentCheck-modal', 'hidden.bs.modal', function (e) {
        e.preventDefault();     
        ClearPaymentForm();
    });

    $(document).delegate('#FromDate', 'change', function (e) {
        e.preventDefault();
        calculateTotalAmount();
    });
    $(document).delegate('#ToDate', 'change', function (e) {
        e.preventDefault();
        calculateTotalAmount();
    });
    $(document).delegate('#PaymentStatus', 'change', function (e) {
        e.preventDefault();
        if ($(this).val() == "Received") {
            $("#VerifyAmount").val($("#VerifyTotalAmount").val());
            $("#VerifyRemainingAmount").val(0);
        } else if ($(this).val() == "Not received") {
            $("#VerifyAmount").val(0);
            $("#VerifyRemainingAmount").val($("#VerifyTotalAmount").val());
        }
    });
    $(document).delegate('#VerifyAmount', 'keyup', function (e) {
        e.preventDefault();
        if ($("#PaymentStatus").val() == "Partially received") {
            if (($("#VerifyTotalAmount").val() - $(this).val()).toFixed(2) >= 0)
                $("#VerifyRemainingAmount").val(($("#VerifyTotalAmount").val() - $(this).val()).toFixed(2));
            else {
                Swal.fire(
                    'Invalid Input!',
                    'Received amount cannot be greater than total owed amount',
                    'error'
                );
                $(this).val("");
                $("#VerifyRemainingAmount").val("");
            }
        }
        else if ($("#PaymentStatus").val() == "Not received")
            $("#VerifyAmount").val(0);
        else if ($("#PaymentStatus").val() == "Received")
            $("#VerifyAmount").val($("#VerifyTotalAmount").val());
    });

    $("#CheckOutDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );

    $(document).delegate('#CheckOutDate', 'change', function (e) {
        e.preventDefault();
        if ($(this).val() != "") {
            $("#LeaversStatusSelectDIV").removeClass("hidden");
            $("#LeaversStatusSelect").attr("required","");
        } else if (!$("#LeaversStatusSelectDIV").hasClass("hidden")) {
            $("#LeaversStatusSelectDIV").addClass("hidden");
            $("#LeaversStatusSelect").removeAttr("required");
        }
    });

    $('#GeneralStatusSelect').select2({
        placeholder: "Select"
    });

    $('#LeaversStatusSelect').select2({
        placeholder: "Select"
    });

    var gst = ["In Pay", "Out Pay"]
    var pst = ["Blue", "Grey", "Orange"]
    var lst = ["Leavers Outstanding", "Leavers cleared"]

    $("#GeneralStatusSelect").empty();
    $("#GeneralStatusSelect").append($("<option></option>"));
    $.each(gst, function (i, item) {
        $("#GeneralStatusSelect").append($("<option></option>").val(item).html(item));
    });

    $("#LeaversStatusSelect").empty();
    $("#LeaversStatusSelect").append($("<option></option>"));
    $.each(lst, function (i, item) {
        $("#LeaversStatusSelect").append($("<option></option>").val(item).html(item));
    });

    $("#statusChangeForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#statusChangeForm").parsley().on("form:success", function (formInstance) {
        ChangeTenantsStatusByPayment();
    });
    $("#paymentVerifyForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#paymentVerifyForm").parsley().on("form:success", function (formInstance) {
        InsertPaymentVerification();
    });
    LoadTenantsDetails();
    LoadAllPaymentsByTenantsID();
})

function calculateTotalAmount() {
    if ($("#ToDate").val() != "" && $("#FromDate").val() != "") {
        var Period = $("#FromDate").val() + "to" + $("#ToDate").val();
        if (allPaymentsData.length > 0) {
            $.each(allPaymentsData, function (i, item) {
                if (item.Period == Period) {
                    Swal.fire({
                        title: 'Would you like to replace the existing payment check?',
                        text: "Note: There is an existing payment check on your selected period!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, replace it!',
                        cancelButtonText: 'No, create new!',

                    }).then((result) => {
                        if (result.value) {
                            $("#ID").val(item.ID);
                        }
                    });
                }
            })
        }
        var a = moment($("#FromDate").val(), 'YYYY-MM-DD');
        var b = moment($("#ToDate").val(), 'YYYY-MM-DD');
        var diffDays = b.diff(a, 'days') + 1;
        var DailyRate = $("#DailyRate").val();
        $("#TotalAmount").val((diffDays * DailyRate).toFixed(2));
    }
}

function LoadTenantsDetails() {

    var dbmodel = { 'ID': $("#TID").val() };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/LoadTenantsDetails",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = "";
            $.each(results.data, function (i, item) {
                $("#DailyRate").val(item.DailyRate);
                $("#GeneralStatusSelect").val(item.Status).trigger("change");

                var fullname = item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname;

                $("#pageTitle").html("<a href='/Payments/'> <i class='mdi mdi-arrow-left-circle'></i> " + fullname + "</a>");

                htm += "<tr>" +
                    "<td>Full Name</td>" +
                    "<td>" + fullname + "</td></tr>" +
                    "<tr>" +
                    "<td>NI</td>" +
                    "<td>" + item.NI + "</td></tr>" +
                    "<tr>" +
                    "<td>CRN</td>" +
                    "<td>" + item.CRN + "</td></tr>" +
                    "<tr>" +
                    "<td>DOB</td>" +
                    "<td>" + item.DOB + "</td></tr>" +
                    "<tr>" +
                    "<td>Address</td>" +
                    "<td>" + item.Address + "</td></tr>" +
                    "<tr>" +
                    "<td>Room Number</td>" +
                    "<td>" + item.RoomNo + "</td></tr>" +
                    "<tr>" +
                    "<td>Referral</td>" +
                    "<td>" + item.Referral + "</td></tr>" +
                    "<tr>" +
                    "<td>General Status</td>" +
                    "<td>" + item.Status + "</td></tr>"+
                    "<tr>" +
                    "<td>Joining Date</td>" +
                    "<td>" + item.FirstCheckin + "</td></tr>" +
                    "<tr>" +
                    "<td>Total Owed Amount</td>" +
                    "<td>" + item.TotalOwedAMount + "</td></tr>";

               
                $("#bigCardImage").prop("src", item.ImagePath);
                if (item.ProfileStatus == "Blue")
                    $("#bigCardImage").addClass("img-blue-circle");
                else if (item.ProfileStatus == "Grey")
                    $("#bigCardImage").addClass("img-grey-circle");
                else if (item.ProfileStatus == "Orange")
                    $("#bigCardImage").addClass("img-orange-circle");

                $("#TenantsName").text(fullname);
                $("#tenantsStatusBtn").text(item.Status);
                $("#TenantsID").val(item.TenantsID);
            })

            $("#tenantsDetailsTable tbody").html(htm);
            
            


        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function InsertPayment() {
    var ID = $("#ID").val();
    var TenantsID = $("#TenantsID").val();
    var DateCalled = FlatPickerDateToSQLDate($("#DateCalled").val());
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var Period = FlatPickerDateToSQLDate(FromDate) + "to" + FlatPickerDateToSQLDate(ToDate);
    var Amount = 0;
    var TotalOwedAmount = $("#TotalAmount").val();
    var RemainingAmount = $("#RemainingAmount").val();
    var Status = $("#StatusSelect").val();
    var GStatus = $("#GeneralStatusSelect").val();
    var Comments = $("#Comments").val();

    var dbModel = {'ID': ID, 'TenantsID': TenantsID, 'DateCalled': DateCalled, 'Period': Period, 'Amount': Amount, 'TotalOwedAmount': TotalOwedAmount, 'Status': Status, 'GStatus': GStatus, 'Comments': Comments }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/InsertPayment",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Payment has been saved',
                'success'
            );
            ClearPaymentForm();
            LoadAllPaymentsByTenantsID();
            LoadTenantsDetails();
            $("#paymentCheck-modal").modal('hide');
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function LoadAllPaymentsByTenantsID() {
    var TenantsID = $("#TenantsID").val();
    var dbModel = { 'TenantsID': TenantsID};
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/LoadAllPaymentsByTenantsID",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            allPaymentsData = results.data;
            var data = [];
            $.each(results.data, function (i, item) {
                
                var dt = item.Period.split("to");
                var fm = OriginalToHuman(dt[0]);
                var to = OriginalToHuman(dt[1]);
                var obj = {
                    'DateCalled': item.DateCalled,
                    'Period': fm+' to '+to,
                    'TotalOwedAmount': item.TotalOwedAmount,
                    'Amount': item.Amount,
                    'RemainingAmount': item.RemainingAmount,
                    'Status': item.Status,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedPayment(' + item.ID + ')"  style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-1" onclick="DeletePayment(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'+
                        '<a href="javascript: void(0);" class="ml-1" onclick="VerifyPayment(' + item.ID + ',\'' + item.TotalOwedAmount+'\')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-shield-check-outline"></i></a>'
                }

                data.push(obj);
            });


            $('#paymentCallTable').DataTable({
                destroy: true,
                data: data,
                order: [],
                columns: [

                    { data: 'DateCalled' },
                    { data: 'Period' },
                    { data: 'TotalOwedAmount' },
                    { data: 'Amount' },
                    { data: 'RemainingAmount' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-center', targets: [0,1,2,3,4,5,6] },
                    { orderable: false, targets: [-1] }
                ],
                footerCallback: function (tfoot, data, start, end, display) {
                    var api = this.api();
                    $(api.column(1).footer()).html("Total: ");

                    $(api.column(2).footer()).html(
                        api.column(2).data().reduce(function (a, b) {
                            return a + b;
                        }, 0).toFixed(2)
                    );
                    $(api.column(3).footer()).html(
                        api.column(3).data().reduce(function (a, b) {
                            return a + b;
                        }, 0).toFixed(2)
                    );
                    $(api.column(4).footer()).html(
                        api.column(4).data().reduce(function (a, b) {
                            return a + b;
                        }, 0).toFixed(2)
                    );
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
        }
    });

}

function loadOutStandingAmount() {
    var outstandingdata = allPaymentsData.filter(x => x.RemainingAmount > 0);
    var data = [];
    $.each(outstandingdata, function (i, item) {
        var dt = item.Period.split("to");
        var fm = OriginalToHuman(dt[0]);
        var to = OriginalToHuman(dt[1]);

        var obj = {
            'Period': fm + " to " + to,
            'Amount':item.RemainingAmount
        }

        data.push(obj);
    })

    $('#outstandingAmountTable').DataTable({
        destroy: true,
        data: data,
        order: [],
        columns: [

            { data: 'Period' },
            { data: 'Amount' },
        ],
        columnDefs: [
            { className: 'text-center', targets: [0,1] },
        ],
        footerCallback: function (tfoot, data, start, end, display) {
            var api = this.api();
            $(api.column(1).footer()).html(
                api.column(1).data().reduce(function (a, b) {
                    return a+b;
                }, 0).toFixed(2)
            );
        }
    });
}


function DeletePayment(ID) {
    var dbModel = { 'ID': ID }
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: You can't revert this!",
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
                url: "/Payments/DeletePayment",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    LoadAllPaymentsByTenantsID();
                    Swal.fire(
                        'Deleted!',
                        'Payment has been deleted.',
                        'success'
                    );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 403) {
                        var response = $.parseJSON(jqXHR.responseText);
                        Swal.fire('Permission denied!', 'You have no access to this action.','error');
                    } else {
                        toastr.error('Something went wrong!', 'Error!');
                    }
                }
            });

        }
    })
}

function LoadSelectedPayment(ID) {
    var dbModel = { 'ID': ID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/LoadSelectedPayment",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            $.each(results.data, function (i, item) {
                $("#ID").val(item.ID);
                $("#TotalAmount").val(item.TotalOwedAmount); 
                $("#Amount").val(item.Amount); 
                $("#RemainingAmount").val(item.RemainingAmount); 
                $("#StatusSelect").val(item.Status).trigger("change");
                $("#GeneralStatusSelect").val(item.GStatus).trigger("change");
                $("#Comments").val(item.Comments);
          
                $("#DateCalled").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.DateCalled)
                    }
                );

                var period = item.Period.split("to");

                $("#FromDate").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: period[0]
                    }
                );

                $("#ToDate").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: period[1]
                    }
                );

                $("#TotalAmount").val(item.TotalOwedAmount);

                $("#paymentCheck-modal").modal('show');

                //if (item.RemainingAmount == 0) {
                //    $("#PaymentStatus").val("Received").trigger('change');
                //} else if (item.Amount == 0) {
                //    $("#PaymentStatus").val("Not received").trigger('change');
                //} else {
                //    $("#PaymentStatus").val("Partially received").trigger('change');
                //}

                
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function ClearPaymentForm(){
    $("#ID").val("");
    $("#Amount").val("");
    $("#TotalAmount").val("");
    $("#RemainingAmount").val("");
    $("#StatusSelect").val("").trigger("change");
    $("#PaymentStatus").val("").trigger("change");
    $("#Comments").val("");
    $("#DateCalled").val("");
    $("#Period").val("");
  
    $("#DateCalled").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "today"
        }
    );

    $('#FromDate').flatpickr().clear();
    $('#ToDate').flatpickr().clear();
}

function ChangeTenantsStatusByPayment() {

    var TenantsID = $("#TenantsID").val();
    var Status = $("#GeneralStatusSelect").val();
    var CheckOutDate = $("#CheckOutDate").val();
    var LeaversStatus = $("#LeaversStatusSelect").val();

    var dbModel = { 'ID': ID, 'TenantsID': TenantsID, 'Status': Status, 'CheckOutDate': CheckOutDate, 'LeaversStatus': LeaversStatus }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/ChangeTenantsStatusByPayment",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Tenants data has been saved',
                'success'
            );
            LoadAllPaymentsByTenantsID();
            LoadTenantsDetails();
            $("#statusChange-modal").modal("hide");
            clearChangeStatusForm();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function clearChangeStatusForm(){
    $("#GeneralStatusSelect").val("").trigger("change");
    $("#CheckOutDate").val("");
    $('#CheckOutDate').flatpickr().clear();
    $("#LeaversStatusSelect").val("").trigger("change");
    $("#LeaversStatusSelectDIV").addClass("hidden");
    $("#LeaversStatusSelect").removeAttr("required");
}

function VerifyPayment(ID,amount) {
    $("#PaymentID").val(ID);
    $("#VerifyTotalAmount").val(amount);
    $("#paymentVerify-modal").modal("show");
}

function InsertPaymentVerification() {
    var ID = $("#PaymentID").val();
    var Amount = $("#VerifyAmount").val();
    var RemainingAmount = $("#VerifyRemainingAmount").val();
    var Status = $("#PaymentStatus").val();

    var dbModel = { 'ID': ID, 'Amount': Amount, 'RemainingAmount': RemainingAmount, 'Status': Status, }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Payments/InsertPaymentVerification",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Verified!',
                'Payment has been verified.',
                'success'
            );
            clearPaymentVerificationForm();
            LoadAllPaymentsByTenantsID();
            $("#paymentVerify-modal").modal('hide');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function clearPaymentVerificationForm(){
    $("#PaymentStatus").val("").trigger("change");
    $("#VerifyTotalAmount").val("");
    $("#VerifyAmount").val("");
    $("#VerifyRemainingAmount").val("");
    $("#PaymentID").val("");
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

    return db[2] + '-' + month + '-' + db[0];
}
function OriginalToHuman(dt) {
    var db = dt.split("-");
    var month = "";
    if (db[1] == "01")
        month = "Jan";
    else if (db[1] == "02")
        month = "Feb";
    else if (db[1] == "03")
        month = "Mar";
    else if (db[1] == "04")
        month = "Apr";
    else if (db[1] == "05")
        month = "May";
    else if (db[1] == "06")
        month = "Jun";
    else if (db[1] == "07")
        month = "Jul";
    else if (db[1] == "08")
        month = "Aug";
    else if (db[1] == "09")
        month = "Sep";
    else if (db[1] == "10")
        month = "Oct";
    else if (db[1] == "11")
        month = "Nov";
    else if (db[1] == "12")
        month = "Dec";

    return db[2] + ' ' + month + ' ' + db[0];
}

function FlatPickerDateToSQLDate(dt) {
    if (dt == "" || dt == null) {
        return "";
    } else {
        var db = dt.split("-");
        return db[2] + '-' + db[1] + '-' + db[0];
 
   }
}

