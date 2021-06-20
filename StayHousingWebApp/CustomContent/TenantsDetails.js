$(function () {

    LoadTenantsDetails();
})

function LoadTenantsDetails() {

    var dbmodel = { 'ID': $("#ID").val() };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadTenantsDetails",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = "";
            $.each(results.data, function (i, item) {
                var fullname = item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname;
                $("#pageTitle").html("<a href='/Tenants/'> <i class='mdi mdi-arrow-left-circle'></i> " + fullname + "</a>");
                htm += "<tr>" +
                    "<td>Name</td>" +
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
                    "<td>Status</td>" +
                    "<td>" + item.Status + "</td></tr>" +
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
            })

            $("#tenantsDetailsTable tbody").html(htm);

            var htmContact = "";
            $.each(results.data[0].TenantsContactsList, function (i, item) {
                htmContact += "<tr><td>" + item.label + "</td><td>" + item.number + "</td></tr>"
            })   
            $("#TenantsContactTable tbody").empty();
            $("#TenantsContactTable tbody").html(htmContact);


            var htmIssue = "";
            $.each(results.data[0].TenantsIssuesList, function (i, item) {
                htmIssue += "<tr><td>" + item.Issue + "</td></tr>"
            })
            $("#TenantsIssueTable tbody").empty();
            $("#TenantsIssueTable tbody").html(htmIssue);

            var htmConviction = "";
            $.each(results.data[0].CriminalConvictionsList, function (i, item) {
                htmConviction += "<tr><td>" + item.CriminalConviction + "</td><td>" + item.ConvictionDate + "</td></tr>"
            })
            $("#TenantsConvictionTable tbody").empty();
            $("#TenantsConvictionTable tbody").html(htmConviction);

            var htmDocument = "";
            $.each(results.data[0].TenantsDocumentsList, function (i, item) {
                htmDocument += "<tr><td>" + item.FilePath.slice(34) + "</td><td class='text-center'><a href='" + item.FilePath + "' download><i class='mdi mdi-download mr-2 text-muted vertical-middle'></i></a></td></tr>"
            })
            $("#TenantsDocumentsTable tbody").empty();
            $("#TenantsDocumentsTable tbody").html(htmDocument);


            var htm2 = "";
            $.each(results.data[0].TenantsAddressList, function (j, item2) {
                htm2 += "<tr>" +
                    "<td>" + item2.Address + "</td>" +
                    "<td>" + item2.RoomNo + "</td>" +
                    "<td>" + item2.EntryDate + "</td>" +
                    "<td>" + item2.LeaveDate + "</td>" +
                    "</tr>";
            })
            $("#TenantsAddressTable tbody").empty();
            $("#TenantsAddressTable tbody").html(htm2);

            var htmSupport = "";
            $.each(results.data[0].SupportWorkerList, function (j, item2) {
                htmSupport += "<tr>" +
                    "<td>" + item2.SupportWorker + "</td>" +
                    "<td>" + item2.Name + "</td>" +
                    "<td>" + item2.MobileNumber + "</td>" +
                    "<td>" + item2.TelephoneNumber + "</td>" +
                    "<td>" + item2.Email + "</td>" +
                    "</tr>";
            })
            $("#TenantsSupportWorkerTable tbody").empty();
            $("#TenantsSupportWorkerTable tbody").html(htmSupport);


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