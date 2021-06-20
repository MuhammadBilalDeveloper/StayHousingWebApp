$(function () {

    LoadPropertyDetails($("#PropertyID").val());
})

function LoadPropertyDetails(ID) {
    var dbModel = { 'ID': ID }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadPropertyDetails",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = '';
            $.each(results.data, function (i, item) {
                $("#pageTitle").html("<a href='/Property/'> <i class='mdi mdi-arrow-left-circle'></i> " + item.Address + "</a>");
                $("#Address").text(item.Address);

                htm += "<tr><td>Address</td>" +
                    "<td>" + item.Address + "</td></tr>" +
                    "<tr><td>Area</td>" +
                    "<td>" + item.Area + "</td></tr>" +
                    "<tr><td>Post Code</td>" +
                    "<td>" + item.Postcode + "</td></tr>" +
                    "<tr><td>Number Of Rooms</td>" +
                    "<td>" + item.NumberOfRooms + "</td></tr>" +
                    "<tr><td>Weekly Rate</td>" +
                    "<td>" + item.WeeklyRate + "</td></tr>" +
                    "<tr><td>Daily Rate</td>" +
                    "<td>" + item.DailyRate + "</td></tr>" +
                    "<tr><td>Support Worker</td>" +
                    "<td>" + item.SupportWorker + "</td></tr>" +
                    "<tr><td>House Came From</td>" +
                    "<td>" + item.HouseCameFrom + "</td></tr>" +
                    "<tr><td>Landlord Name</td>" +
                    "<td>" + item.HouseCameFrom + "</td></tr>" +
                    "<tr><td>Landlord Contact Number</td>" +
                    "<td>" + item.LandlordContactNo + "</td></tr>" +
                    "<tr><td>Lease Duration</td>" +
                    "<td>" + item.LeaseDuration + "</td></tr>" +
                    "<tr><td>Active Date</td>" +
                    "<td>" + item.CouncilActiveDate + "</td></tr>" +
                    "<tr><td>Housing Association</td>" +
                    "<td>" + item.HousingAssociation + "</td></tr>" +
                    "<tr><td>Company</td>" +
                    "<td>" + item.CompanyName + "</td></tr>";

            })

            var htmOl = "<ol class='carousel-indicators'>";
            var htmMidDiv = "<div class='carousel-inner'>";
            $.each(results.data[0].PropertyImagesList, function (j, item2) {
                if (j == 0) {

                    htmOl += "<li data-target='#PropertyImageCarousel' data-slide-to='" + j + "'></li>";
                    htmMidDiv += "<div class='carousel-item active'>" +
                        "<img class='d-block img-fluid' src='" + item2.ImagePath + "' style='height: 350px !important; width:100% !important;'>" +
                        "</div>";
                }
                else {

                    htmOl += "<li data-target='#PropertyImageCarousel' data-slide-to='" + j + "'></li>";
                    htmMidDiv += "<div class='carousel-item'>" +
                        "<img class='d-block w-100' src='" + item2.ImagePath + "' style='height: 350px !important; width:100% !important;'>" +
                        "</div>";
                }

            })

            htmOl += "</ol>";
            htmMidDiv += "</div>";
            var htmprev = "<a class='carousel-control-prev' href='#PropertyImageCarousel' role='button' data-slide='prev'>" +
                "<span class='carousel-control-prev-icon' aria-hidden='true'></span>" +
                "<span class='sr-only'>Previous</span></a>";

            var htmnext = "<a class='carousel-control-next' href='#PropertyImageCarousel' role='button' data-slide='next'>" +
                "<span class='carousel-control-next-icon' aria-hidden='true'></span>" +
                "<span class='sr-only'>Next</span></a>";



            var htmCert = "";
            $.each(results.data[0].PropertyCertificatesList, function (k, item3) {
                htmCert += "<div class='col-md-12 py-1'  style='border:1px solid #EEE;'><div class='row'>" +
                    "<div class='col-7'><span><i class='mdi mdi-file mx-2'></i></span>" + item3.CertificateType + "</div>" +
                    "<div class='col-3'>" + item3.ExpairyDate + "</div>" +
                    "<div class='col-2'><a href='" + item3.FilePath + "' download><i class='mdi mdi-download mr-2 text-muted vertical-middle'></i></a>" +
                    "</div>" +
                    "</div></div>"
            })

            var htmLand = "";
            $.each(results.data[0].PropertyLandlordIDSList, function (l, item4) {
                htmLand += "<div class='col-md-12 py-1'  style='border:1px solid #EEE;'><div class='row'>" +
                    "<div class='col-10'><span><i class='mdi mdi-file mx-2'></i></span>" + item4.FilePath.slice(34) + "</div>" +
                    "<div class='col-2'><a href='" + item4.FilePath + "' download><i class='mdi mdi-download mr-2 text-muted vertical-middle'></i></a>" +
                    " <span style='cursor:pointer;' onclick='DeletePropertyCertificate(" + item4.ID + ",\"" + item4.FilePath + "\");'><i class='mdi mdi-delete mr-2 text-muted vertical-middle'></i></span></div>" +
                    "</div></div>"
            })

            var htmTenants = ""
            var OccupiedTotal = 0;
            var EmptyTotal = 0;
            var RoomTotal = 0;
            $.each(results.data[0].PropertyTenantsList, function (i, item) {
                htmTenants += "<tr>" +
                    "<td>" + item.RoomNo + "</td>" +
                    "<td>" + item.FullName + "</td>" +
                    "</tr>";

                RoomTotal += 1;

                if (item.FullName != "-")
                    OccupiedTotal += 1;
                else
                    EmptyTotal += 1;


            })

            

            var carousleHtm = htmOl + htmMidDiv + htmprev + htmnext;
            $("#PropertyImageCarousel").html(carousleHtm);
            $("#propertyViewBasicInfo tbody").html(htm);
            $("#PropertyCertificatePreview2").html(htmCert);
            $("#PropertyLandlordIDPreview2").html(htmLand);
            $("#OccupiedTenantsTable tbody").html(htmTenants);

            $("#OccupiedSpan").text(OccupiedTotal);
            $("#EmptySpan").text(EmptyTotal);
            $("#TotalSpan").text(RoomTotal);

            $("#propertyView-modal").modal("show");

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