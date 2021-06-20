$(function () {
    $('#UserStatusSelect').select2(
        { placeholder: "Select" }
    );

    var ust = ["ALL", "Active", "Inactive"];
    $("#UserStatusSelect").empty();
    $("#UserStatusSelect").append($("<option></option>"));
    $.each(ust, function (i, item) {
        $("#UserStatusSelect").append($("<option></option>").val(item).html(item));
    });

    $(document).delegate('#UserExportExcelBtn', 'click', function (e) {
        e.preventDefault();
        if ($("#UserStatusSelect").val() != '')
            window.open("/Report/UserReport?isActive=" + $("#UserStatusSelect").val());
    });


    $('#PropertyStatusSelect').select2(
        { placeholder: "Select" }
    );

    var pst = ["ALL", "Occupied", "Empty"];
    $("#PropertyStatusSelect").empty();
    $("#PropertyStatusSelect").append($("<option></option>"));
    $.each(pst, function (i, item) {
        $("#PropertyStatusSelect").append($("<option></option>").val(item).html(item));
    });


    $(document).delegate('#PropertyExportExcelBtn', 'click', function (e) {
        e.preventDefault();
        if ($("#PropertyStatusSelect").val() != '')
            window.open("/Report/PropertyReport?Status=" + $("#PropertyStatusSelect").val());
    });


    $('#TenantStatusSelect').select2(
        { placeholder: "Select" }
    );

    var pst = ["ALL", "Active", "Leavers"];
    $("#TenantStatusSelect").empty();
    $("#TenantStatusSelect").append($("<option></option>"));
    $.each(pst, function (i, item) {
        $("#TenantStatusSelect").append($("<option></option>").val(item).html(item));
    });


    $(document).delegate('#TenantExportExcelBtn', 'click', function (e) {
        e.preventDefault();
        if ($("#TenantStatusSelect").val() != '')
            window.open("/Report/TenantReport?Status=" + $("#TenantStatusSelect").val());
    });

    $('#PaymentStatusSelect').select2(
        { placeholder: "Select" }
    );

    var pst = ["ALL", "Received", "Partially received","Not received"];
    $("#PaymentStatusSelect").empty();
    $("#PaymentStatusSelect").append($("<option></option>"));
    $.each(pst, function (i, item) {
        $("#PaymentStatusSelect").append($("<option></option>").val(item).html(item));
    });


    $(document).delegate('#PaymentExportExcelBtn', 'click', function (e) {
        e.preventDefault();
        if ($("#PaymentStatusSelect").val() != '')
            window.open("/Report/PaymentReport?Status=" + $("#PaymentStatusSelect").val());
    });

})
