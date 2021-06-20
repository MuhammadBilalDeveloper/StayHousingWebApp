Dropzone.autoDiscover = false;

var HouseCameFromArr = [];

$(function () {
   
    $("#propertyImageForm").dropzone({
        url: "/property/InsertPropertyImages",
        autoProcessQueue: false,
        parallelUploads: 10,
        addRemoveLinks: true,
        uploadMultiple: true,
        init: function () {
            var submitButton = document.querySelector("#imageSaveButton");
            myDropzone = this;
            submitButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($("#PropertyID").val()!="")
                    myDropzone.processQueue();
                else
                    toastr.warning('Please save the basic information first!', 'Error!');
            });
            myDropzone.on('sendingmultiple', function (file, xhr, formData) {
                formData.append('PropertyID', $("#PropertyID").val());
            });
            myDropzone.on("successmultiple", function (files,response) {
                myDropzone.removeAllFiles();
                toastr.success('Image uploaded successfully!', 'Success!');
                LoadPropertyImages($("#PropertyID").val());
            });
        },
    });
 

    $("#certificateImageForm").dropzone({
        url: "/property/InsertPropertyCertificates",
        autoProcessQueue: false,
        parallelUploads: 10,
        addRemoveLinks: true,
        uploadMultiple: true,
        init: function () {
            var submitButton = document.querySelector("#certificateSaveButton");
            myCertificateDropzone = this;
            submitButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($("#PropertyID").val() != "") {

                    if ($("#CertificateType").val() == "") {
                        toastr.warning('Please select Certificate Type!', 'Invalid input!');
                    } else if ($("#ExpairyDate").val() == "") {
                        toastr.warning('Please select a expairy date!', 'Invalid input!');
                    } else {
                        myCertificateDropzone.processQueue();
                    }
                }
                else
                    toastr.warning('Please save the basic information first!', 'Error!');
            });
            myCertificateDropzone.on('sendingmultiple', function (file, xhr, formData) {
                formData.append('PropertyID', $("#PropertyID").val());
                formData.append('CertificateType', $("#CertificateType").val());
                formData.append('ExpairyDate',FlatPickerDateToSQLDate($("#ExpairyDate").val()));
            });
            myCertificateDropzone.on("successmultiple", function (files, response) {
                myCertificateDropzone.removeAllFiles();
                toastr.success('File uploaded successfully!', 'Success!');
                LoadPropertyCertificates($("#PropertyID").val());
            });
        },
    });

    $("#ExpairyDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y"
        }
    );

    $("#LanlordCertificateImageForm").dropzone({
        url: "/property/InsertPropertyLandlordID",
        autoProcessQueue: false,
        parallelUploads: 10,
        addRemoveLinks: true,
        uploadMultiple: true,
        init: function () {
            var submitButton = document.querySelector("#LanlordCertificateSaveButton");
            myLandlordDropzone = this;
            submitButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($("#PropertyID").val() != "")
                    myLandlordDropzone.processQueue();
                else
                    toastr.warning('Please save the basic information first!', 'Error!');
            });
            myLandlordDropzone.on('sendingmultiple', function (file, xhr, formData) {
                formData.append('PropertyID', $("#PropertyID").val());
            });
            myLandlordDropzone.on("successmultiple", function (files, response) {
                myLandlordDropzone.removeAllFiles();
                toastr.success('File uploaded successfully!', 'Success!');
                LoadPropertyLandlordIDs($("#PropertyID").val());
            });
        },
    });


    $("#PropertyBasicForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#PropertyBasicForm").parsley().on("form:success", function (formInstance) {
        InsertProperty();
    });

    $('#PropertyTypeSelect').select2(
        { placeholder: "Select" }
    );
    $('#CompanySelect').select2({
        placeholder: "Select"
    });
    $("#LeaseDuration").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "d/m/Y",
            dateFormat: "d-m-Y",
            mode: "range"
        }
    );
    $("#CouncilActiveDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "d/m/Y",
            dateFormat: "d-m-Y",
            default: "today"
        }
    );

    $(document).delegate('#AddPropertyBtn', 'click', function (e) {
        e.preventDefault();
        clearPropertyForm();
    });

    $(document).delegate('#propertyForm-modal', 'hidden.bs.modal', function (e) {
        e.preventDefault();
        LoadAllProperty();
    });

    $(document).delegate('#WeeklyRate', 'keyup', function (e) {
        e.preventDefault();
        var wrate = $(this).val();
        var drate = (wrate / 7).toFixed(2);
        $("#DailyRate").val(drate);
    });
    $(document).delegate('#PorpertyFilterBTN', 'click', function (e) {
        e.preventDefault();
        LoadAllProperty();
        $("#right-modal").modal("hide");
    });
    $(document).delegate('#ClearFilterBTN', 'click', function (e) {
        e.preventDefault();
        clearFilters();
    });

    LoadAllPropertyType();
    LoadAllProperty();

    $("#WeeklyRate").val(0);
    $("#DailyRate").val(0);
})


function LoadAllPropertyType() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadAllPropertyType",
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#PropertyTypeSelect").empty();
            $("#PropertyTypeSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#PropertyTypeSelect").append($("<option></option>").val(item.ID).html(item.Title));
            });

            $("#CompanySelect").empty();
            $("#CompanySelect").append($("<option></option>"));
            $.each(results.data[0].CompanyModelList, function (i, item) {
                $("#CompanySelect").append($("<option></option>").val(item.ID).html(item.Company));
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function LoadPropertyDetails(ID) {
    var dbModel = {'ID':ID}
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
                htm += "<tr><td>Address</td>" +
                    "<td>" + item.Address + "</td></tr>" +
                    "<tr><td>Area</td>" +
                    "<td>" + item.Area + "</td></tr>" +
                    "<tr><td>Post Code</td>" +
                    "<td>" + item.Postcode + "</td></tr>" +
                    "<tr><td>Number Of Rooms</td>" +
                    "<td>" + item.NumberOfRooms + "</td></tr>" +
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
                    "<td>" + item.CouncilActiveDate + "</td></tr>";

            })

            var htmOl = "<ol class='carousel-indicators'>";
            var htmMidDiv = "<div class='carousel-inner'>";            
            $.each(results.data[0].PropertyImagesList, function (j, item2) {
                if (j == 0) {

                    htmOl += "<li data-target='#PropertyImageCarousel' data-slide-to='" + j + "' class='active'></li>";
                    htmMidDiv += "<div class='carousel-item active'>" +
                        "<img class='d-block img-fluid' src='" + item2.ImagePath + "' height='350'>" +
                        "</div>";
                }
                else {

                    htmOl += "<li data-target='#PropertyImageCarousel' data-slide-to='" + j + "'></li>";
                    htmMidDiv += "<div class='carousel-item'>" +
                        "<img class='d-block w-100' src='" + item2.ImagePath + "' height='350'>" +
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
                    "<div class='col-3'><span><i class='mdi mdi-file mx-2'></i></span>" + item3.ExpairyDate + "</div>" +
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
                     
            var carousleHtm = htmOl + htmMidDiv + htmprev + htmnext;
            $("#PropertyImageCarousel").html(carousleHtm);
            $("#propertyViewBasicInfo tbody").html(htm);
            $("#PropertyCertificatePreview2").html(htmCert);
            $("#PropertyLandlordIDPreview2").html(htmLand);



            $("#propertyView-modal").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function InsertProperty() {
    
    var dbmodel = {
        "ID": $("#ID").val(),
        "PropertyTypeID":$("#PropertyTypeSelect").val(),
        "Address":$("#Address").val(),
        "Area": $("#Area").val(),
        "PostCode": $("#PostCode").val(),
        "PropertyTypeSelect": $("#PropertyTypeSelect").val(),
        "HouseCameFrom": $("#HouseCameFrom").val(),
        "NumberOfRooms": $("#NumberOfRooms").val(),
        "LeaseDuration": $("#LeaseDuration").val(),
        "LandlordName": $("#LandlordName").val(),
        "LandlordContactNo": $("#LandlordContactNo").val(),
        "SupportWorker": $("#SupportWorker").val(),
        "CouncilActiveDate":FlatPickerDateToSQLDate($("#CouncilActiveDate").val()),
        "WeeklyRate": $("#WeeklyRate").val(),
        "DailyRate": $("#DailyRate").val(),
        "HousingAssociation": $("#HousingAssociation").val(),
        "Company": $("#CompanySelect").val()
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/InsertProperty",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            if (results.success == true) {
                toastr.success('Property has been saved!', 'Success!');
                $("#PropertyID").val(results.data);
            }

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


function LoadAllProperty() {
    HouseCameFromArr = [];
    var Address = $("#AddressFilter").val().trim();
    var Area = $("#AreaFilter").val().trim();
    var PostCode = $("#PostCodeFilter").val();
    var PropertyType = $("#PropertyTypeFilter").val();
    var PropertyCameFrom = $("#PropertyCameFromFilter").val();
    var NumberOfRooms = $("#NumberOfRoomsFilter").val();
    var SupportWorker = $("#SupportWorkerFilter").val();
    var LandlordName = $("#LandlordNameFilter").val();


    var dbModel = { 'Address': Address, 'Area': Area, 'Postcode': PostCode, 'PropertyType': PropertyType, 'HouseCameFrom': PropertyCameFrom, 'NumberOfRooms': NumberOfRooms, 'SupportWorker': SupportWorker, 'LandlordName': LandlordName }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadAllProperty",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {
                HouseCameFromArr.push(item.HouseCameFrom);
                var obj = {
                    'Address': '<a href="/Property/Details/'+item.ID+'"> <span style="cursor:pointer;">'+ item.Address+'</span></a>',
                    'Area': item.Area,
                    'NumberOfRooms': item.NumberOfRooms,
                    'OccupiedRoom': item.OccupiedRoom,
                    'EmptyRoom': item.EmptyRoom,
                    'CompanyName': item.CompanyName,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadEditData(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-2" onclick="DeleteProperty(' + item.ID +",\'"+item.PropertyID+'\')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
                }

                data.push(obj);
            });


            $('#property-table').DataTable({
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
                    { data: 'Address' },
                    { data: 'Area' },
                    { data: 'NumberOfRooms' },
                    { data: 'OccupiedRoom' },
                    { data: 'EmptyRoom' },
                    { data: 'CompanyName' },
                    { data: 'Actions' }
                ],
                columnDefs:[
                    //{ className: 'text-center', targets: [1, 2,3,4] },
                    { orderable: false, targets: [-1] }
                ]
            });

            $('#HouseCameFrom').autocomplete({
                lookup: HouseCameFromArr.filter(onlyUnique)
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function DeleteProperty(ID, PropertyID) {
    var dbModel = { "ID": ID, "PropertyID": PropertyID }

    Swal.fire({
        title: 'Are you sure?',
        text: "Note: You cannot revert this!",
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
                url: "/Property/DeleteProperty",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    if (results.success == true) {
                        toastr.success('Property has been deleted!', 'Deleted!');
                        LoadAllProperty();
                    }
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

    });
}

function LoadEditData(ID) {
    var dbmodel = { "ID": ID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadSelectedProperty",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {

            $.each(results.data, function (i, item) {

                $("#ID").val(item.ID);
                $("#PropertyID").val(item.PropertyID);
                $("#PropertyTypeSelect").val(item.PropertyTypeID).trigger("change");
                $("#Address").val(item.Address);
                $("#Area").val(item.Area);
                $("#PostCode").val(item.Postcode);
                $('#PropertyTypeSelect').select2('data', { id: item.PropertyTypeID, text: item.PropertyType });
                $("#HouseCameFrom").val(item.HouseCameFrom);
                $("#NumberOfRooms").val(item.NumberOfRooms);
                $("#LandlordContactNo").val(item.LandlordContactNo);
                $("#LandlordName").val(item.LandlordName);
                $("#SupportWorker").val(item.SupportWorker);
                $("#CouncilActiveDate").val(item.CouncilActiveDate);
                $("#WeeklyRate").val(item.WeeklyRate);
                $("#DailyRate").val(item.DailyRate);
                $("#HousingAssociation").val(item.HousingAssociation);
                $("#CompanySelect").val(item.Company).trigger("change");
                $("#LeaseDuration").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "d-m-Y",
                        mode: "range",
                        defaultDate: item.LeaseDuration.split("to")
                    }
                );
                $("#CouncilActiveDate").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.CouncilActiveDate)
                    }
                );

                LoadPropertyImages(item.PropertyID);
                LoadPropertyCertificates(item.PropertyID);
                LoadPropertyLandlordIDs(item.PropertyID);
            })

            $("#propertyForm-modal").modal("show");
            $('#PropertyTypeSelect').select2(
                { placeholder: "Select" }
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

function LoadPropertyImages(PropertyID) {
    var dbModel = { "PropertyID": PropertyID}
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadPropertyImages",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = "";
            $.each(results.data, function (i,item) {
                htm += "<div class='col-md-3 py-1'>"+
                    "<i class='mdi mdi-close btn-danger' onclick='deletePropertyImages("+item.ID+",\""+item.ImagePath+"\")' style='position:absolute;right:15px;cursor:pointer;'></i>" +
                    "<img class='img-fluid rounded' src='" + item.ImagePath + "' height='150px'></div>"
            })

            $("#PropertyImagesPreview").html(htm);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function deletePropertyImages(ID, ImagePath) {
    var dbModel = {"ID": ID, "ImagePath": ImagePath }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/DeletePropertyImage",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            if (results.success == true) {
                toastr.success('Image has been deleted!', 'Deleted!');
                LoadPropertyImages($("#PropertyID").val());
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function LoadPropertyCertificates(PropertyID) {
    var dbModel = { "PropertyID": PropertyID }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadPropertyCertificates",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = "";
            $.each(results.data, function (i, item) {
                htm += "<div class='col-md-12 py-1'  style='border:1px solid #EEE;'><div class='row'>" +
                    "<div class='col-7'><span><i class='mdi mdi-file mx-2'></i></span>" + item.CertificateType + "</div>" +
                    "<div class='col-3'>" + item.ExpairyDate + "</div>" +
                    "<div class='col-2'><a href='" + item.FilePath + "' download><i class='mdi mdi-download mr-2 text-muted vertical-middle'></i></a>" +
                    " <span style='cursor:pointer;' onclick='DeletePropertyCertificate(" + item.ID + ",\"" + item.FilePath+"\");'><i class='mdi mdi-delete mr-2 text-muted vertical-middle'></i></span></div>" +
                    "</div></div>"
            })

            $("#PropertyCertificatePreview").html(htm);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function DeletePropertyCertificate(ID, FilePath) {
    var dbModel = { "ID": ID, "FilePath": FilePath }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/DeletePropertyCertificate",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            if (results.success == true) {
                toastr.success('File has been deleted!', 'Deleted!');
                LoadPropertyCertificates($("#PropertyID").val());
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function LoadPropertyLandlordIDs(PropertyID) {
    var dbModel = { "PropertyID": PropertyID }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/LoadPropertyLandlordIDs",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm = "";
            $.each(results.data, function (i, item) {
                htm += "<div class='col-md-12 py-1'  style='border:1px solid #EEE;'><div class='row'>" +
                    "<div class='col-10'><span><i class='mdi mdi-file mx-2'></i></span>" + item.FilePath.slice(34) + "</div>" +
                    "<div class='col-2'><a href='" + item.FilePath + "' download><i class='mdi mdi-download mr-2 text-muted vertical-middle'></i></a>" +
                    " <span style='cursor:pointer;' onclick='DeletePropertyLandlordID(" + item.ID + ",\"" + item.FilePath + "\");'><i class='mdi mdi-delete mr-2 text-muted vertical-middle'></i></span></div>" +
                    "</div></div>"
            })

            $("#PropertyLandlordIDPreview").html(htm);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function DeletePropertyLandlordID(ID, FilePath) {
    var dbModel = { "ID": ID, "FilePath": FilePath }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Property/DeletePropertyLandlordID",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {
            if (results.success == true) {
                toastr.success('File has been deleted!', 'Deleted!');
                LoadPropertyLandlordIDs($("#PropertyID").val());
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function clearPropertyForm() {
    $("#ID").val("");
    $("#PropertyID").val("");
    $("#Address").val("");
    $("#PostCode").val("");
    $("#PropertyTypeSelect").val("").trigger("change");
    $("#HouseCameFrom").val("");
    $("#NumberOfRooms").val("");
    $("#SupportWorker").val("");
    $("#LandlordName").val("");
    $("#LandlordContactNo").val("");
    $("#WeeklyRate").val(0),
    $("#DailyRate").val(0)
    $("#HousingAssociation").val("")
    $("#CompanySelect").val("").trigger("change");
    $("#LeaseDuration").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "d/m/Y",
            dateFormat: "d-m-Y",
            mode: "range",
            defaultDate:""
        }
    );
    $("#CouncilActiveDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "d/m/Y",
            dateFormat: "d-m-Y",
            defaultDate: "today"
        }
    );

    $("#propertyForm-modal").modal("show");
    $('#PropertyTypeSelect').select2(
        { placeholder: "Select" }
    );


    $("#PropertyImagesPreview").empty();
    $("#PropertyCertificatePreview").empty();
    $("#PropertyLandlordIDPreview").empty();
}

function clearFilters(){
    $("#AddressFilter").val("");
    $("#AreaFilter").val("");
    $("#PostCodeFilter").val("");
    $("#PropertyTypeFilter").val("");
    $("#PropertyCameFromFilter").val("");
    $("#NumberOfRoomsFilter").val("");
    $("#SupportWorkerFilter").val("");
    $("#LandlordNameFilter").val("");
    LoadAllProperty();
    $("#right-modal").modal("hide");
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

function FlatPickerDateToSQLDate(dt) {
    if (dt == "" || dt == null) {
        return "";
    } else {
        var db = dt.split("-");
        return db[2] + '-' + db[1] + '-' + db[0];
    }
}

