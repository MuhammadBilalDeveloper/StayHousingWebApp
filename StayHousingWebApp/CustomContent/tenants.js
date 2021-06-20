var contactList = [];
var issueList = [];
var CriminalConvictionList = [];
var tenantsDocsList = [];
var NIArr = [];
var SupportWorkerList = [];

$(function () {
    $("#DOBFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );
    $("#JoiningDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );
    $("#DOB").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-1990",
        }
    );
    $("#CheckInDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );
    
    $('.dropify').dropify({
        messages: {
            'default': 'Click or drag and drop a image file here',
            'replace': 'Click or drag and drop image file here to replace',
            'remove': 'Remove',
            'error': 'Ooops, something wrong happended.'
        }
    });

    $("#tenantsForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#tenantsForm").parsley().on("form:success", function (formInstance) {
        InsertTenant();
    });

    $("#changeAddressForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#changeAddressForm").parsley().on("form:success", function (formInstance) {
        ChangeTenantAddress();
    });
       
    $("#CheckInDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );

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
            $("#ProfileStatusSelect").val("Orange").trigger("change");
            $("#LeaversStatusSelectDIV").removeClass("hidden");   
            $("#LeaversStatusSelect").attr("required","")
        } else if (!$("#LeaversStatusSelectDIV").hasClass("hidden")) {
            $("#ProfileStatusSelect").val("").trigger("change");
            $("#LeaversStatusSelect").val("").trigger("change");
            $("#LeaversStatusSelect").removeAttr("required")
            $("#LeaversStatusSelectDIV").addClass("hidden");
        }
    });


    $("#CriminalConvictionDate").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );

    
    $('#StatusSelect').select2({
        placeholder: "Select"
    });
    $('#ProfileStatusSelect').select2({
        placeholder: "Select"
    });
    $('#LeaversStatusSelect').select2({
        placeholder: "Select"
    });
    $('#AddressSelect').select2({
        placeholder: "Search"
    });
    $('#ExistingTenantsNewAddress').select2({
        placeholder: "Search"
    });
    $('#changeTenantsNewAddressSelect').select2({
        placeholder: "Search"
    });
    $('#RoomNoSelect').select2({
        placeholder: "Select"
    });
    $('#ExistingRoomNoSelect').select2({
        placeholder: "Select"
    });
    $('#changeRoomNoSelect').select2({
        placeholder: "Select"
    });

    $('#ExistingStatusSelect').select2({
        placeholder: "Select"
    });

    $('#ExistingTenantsSelect').select2({
        placeholder: "Select"
    });

    $('#SupportWorkerSelect').select2({
        placeholder: "Select"
    });

    var supportWorkerSelectList = ["Case Worker", "Mental Health Nurse", "Probation Officer", "Psychologist", "Social Worker","Support Worker"]

    $("#SupportWorkerSelect").empty();
    $("#SupportWorkerSelect").append($("<option></option>"));
    $.each(supportWorkerSelectList, function (i, item) {
        $("#SupportWorkerSelect").append($("<option></option>").val(item).html(item));
    });


    $(document).delegate('#AddressSelect', 'change', function (e) {
        e.preventDefault();
        LoadRoomsByAddress($(this).val());
        $("#SupportWorker").val($(this).find(':selected').attr('data-support'));
    });

    $(document).delegate('#ExistingTenantsNewAddress', 'change', function (e) {
        e.preventDefault();
        LoadRoomsByAddressExisting($(this).val());
    });

    $(document).delegate('#changeTenantsNewAddressSelect', 'change', function (e) {
        e.preventDefault();
        LoadRoomsByChangeAddress($(this).val());
    });

    $(document).delegate('#RoomNoSelect', 'change', function (e) {
        e.preventDefault(); 

        if ($(this).find(':selected').attr('data-isoccupied') == 1) {

            var entrydate = $(this).find(':selected').attr('data-entrydate');
            var checkoutdate = $("#CheckOutDate").val();

            if (checkoutdate != "") {
                entrydate = HumanToOriginal(entrydate);
                entrydate = FlatPickerDateToSQLDate(entrydate);
                checkoutdate = FlatPickerDateToSQLDate(checkoutdate);
                var entrydt = new Date(entrydate);
                var checkoutdt = new Date(checkoutdate);
                if (entrydt < checkoutdt) {

                    Swal.fire({
                        title: "Already Occupied by" + $(this).find(':selected').attr('data-fullname'),
                        text: "Do you want to replace the person?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',

                    }).then((result) => {
                        if (result.value) {

                            Swal.fire({
                                title: '',
                                text: "Move " + $(this).find(':selected').attr('data-fullname') + " to the leavers list or change address.",
                                icon: 'info',
                                showCancelButton: true,
                                focusConfirm: false,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Move To Leavers',
                                cancelButtonText: 'Change Address',
                            }).then((results2) => {
                                if (results2.value) {
                                    MoveToLeavers($(this).find(':selected').attr('data-tenantsid'));
                                } else {
                                    $("#changeTenantsID").val($(this).find(':selected').attr('data-tenantsid'));
                                    $("#exsitingWindow").val("0");

                                    $("#changeAddress-modal").modal("show");

                                    $("#RoomNoSelect").val("");
                                    $("#RoomNoSelect").select2({
                                        placeholder: "Select"
                                    });

                                }
                            })

                        } else {
                            $(this).val("");
                            $(this).select2({
                                placeholder: "Select"
                            });
                        }
                    })
                }
            } else {
                Swal.fire({
                    title: "Already Occupied by" + $(this).find(':selected').attr('data-fullname'),
                    text: "Do you want to replace the person?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',

                }).then((result) => {
                    if (result.value) {

                        Swal.fire({
                            title: '',
                            text: "Move " + $(this).find(':selected').attr('data-fullname') + " to the leavers list or change address.",
                            icon: 'info',
                            showCancelButton: true,
                            focusConfirm: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Move To Leavers',
                            cancelButtonText: 'Change Address',
                        }).then((results2) => {
                            if (results2.value) {
                                MoveToLeavers($(this).find(':selected').attr('data-tenantsid'));
                            } else {
                                $("#changeTenantsID").val($(this).find(':selected').attr('data-tenantsid'));
                                $("#exsitingWindow").val("0");

                                $("#changeAddress-modal").modal("show");

                                $("#RoomNoSelect").val("");
                                $("#RoomNoSelect").select2({
                                    placeholder: "Select"
                                });

                            }
                        })

                    } else {
                        $(this).val("");
                        $(this).select2({
                            placeholder: "Select"
                        });
                    }
                })
            }
        }
    });

    $(document).delegate('#changeRoomNoSelect', 'change', function (e) {
        e.preventDefault();
        if ($(this).find(':selected').attr('data-isoccupied') == 1) {
            Swal.fire({
                title: "Already Occupied!!!",
                text: "Please select a room that is not occupied!",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            }).then(result => {
                $(this).val("");
                $(this).select2({
                    placeholder: "Select"
                });
                
            });
        }
    });

    $(document).delegate('#ExistingTenantsSelect', 'change', function (e) {
        e.preventDefault();
        var ad = $(this).find(':selected').attr('data-propertyid');
        var rm = $(this).find(':selected').attr('data-roomno');
        var st = $(this).find(':selected').attr('data-status');
        var img = $(this).find(':selected').attr('data-img');
        $("#ExistingTenantsNewAddress").val(ad).trigger("change");
        $("#ExistingRoomNoSelect").val(rm).trigger("change", [{ auto: true }]);
        $("#ExistingStatusSelect").val(st).trigger("change", [{ auto: true }]);
        $("#ExistingTenantsImage").prop("src", img);

        LoadPreviousAddressByTenantsID($(this).val());

    });

    $(document).delegate('#ExistingRoomNoSelect', 'change', function (e, data) {
        e.preventDefault();
        if ($(this).find(':selected').attr('data-isoccupied') == 1 && !(typeof data !== "undefined")) {
            Swal.fire({
                title: "Already Occupied by" + $(this).find(':selected').attr('data-fullname'),
                text: "Do you want to replace the person?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',

            }).then((result) => {
                if (result.value) {

                    Swal.fire({
                        title: '',
                        text: "Move " + $(this).find(':selected').attr('data-fullname') + " to the leavers list or change address.",
                        icon: 'info',
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Move To Leavers',
                        cancelButtonText: 'Change Address',
                    }).then((results2) => {
                        if (results2.value) {
                            MoveToLeavers($(this).find(':selected').attr('data-tenantsid'));
                        } else {
                            $("#changeTenantsID").val($(this).find(':selected').attr('data-tenantsid'));
                            $("#exsitingWindow").val("1");
                            $("#changeAddress-modal").modal("show");
                            $("#ExistingRoomNoSelect").val("").trigger("change");

                        }
                    })

                } else {
                    $(this).val("");
                    $(this).select2({
                        placeholder: "Select"
                    });
                }
            })
        } else if ($(this).find(':selected').attr('data-isoccupied') == 0 && !(typeof data !== "undefined")) {
            changeAddressByExistingRoomDDL();
        }
    });

    $(document).delegate('#TenantsForm-modal', 'hidden.bs.modal', function (e) {
        e.preventDefault();
        $('#tenantsTabs').each(function () {
            $(this).find('li>a').each(function () {                
                var tb = $(this);
                if (tb.hasClass("active")) {
                    loadTenantsByStatus(tb.text());
                }               
            });
        });
        
        TenantFormClear();
        
    });

    $(document).delegate('#ExistingStatusSelect', 'change', function (e,data) {
        e.preventDefault();
        if (typeof data === "undefined")
            ChangeTenantsStatus($("#ExistingTenantsSelect").val(),$(this).val());
    });

    $(document).delegate('#addMoreContact', 'click', function (e, data) {
        e.preventDefault();
        var number = $("#ContactNo").val();
        var label = $("#ContactLabel").val();

        if (number != "" && label != "") {
            var obj = {'ID':"0", 'number': number, 'label': label }
            contactList.push(obj);
            loadContactList(contactList);
            $("#ContactNo").val("");
            $("#ContactLabel").val("");
        }
    });

    $(document).delegate('#addMoreIssues', 'click', function (e, data) {
        e.preventDefault();
        var Issue = $("#Issue").val();

        if (Issue != "") {
            var obj = { 'ID': "0", 'Issue': Issue}
            issueList.push(obj);
            loadIssueList(issueList);
            $("#Issue").val("");
        }
    });

    $(document).delegate('#addMoreCriminalConviction', 'click', function (e, data) {
        e.preventDefault();
        var CriminalConviction = $("#CriminalConviction").val();
        var CriminalConvictionDate =FlatPickerDateToSQLDate($("#CriminalConvictionDate").val());

        if (CriminalConviction != "" && CriminalConvictionDate != "") {
            var obj = { 'ID': "0", 'CriminalConviction': CriminalConviction, 'ConvictionDate': CriminalConvictionDate }
            CriminalConvictionList.push(obj);
            loadCriminalConvictionList(CriminalConvictionList);
            $("#CriminalConviction").val("");
            $("#CriminalConvictionDate").flatpickr(
                {
                    altInput: false,allowInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "d-m-Y",
                }
            );
        }
    });

    $(document).delegate('#addMoreSupportWorker', 'click', function (e, data) {
        e.preventDefault();
        var SupportWorker = $("#SupportWorkerSelect").val();
        var Name = $("#SupportWorkerName").val();
        var MobileNumber = $("#SupportWorkerMobileNumber").val();
        var TelephoneNumber = $("#SupportWorkerTelephoneNumber").val();
        var Email = $("#SupportWorkerEmail").val();

        if (SupportWorker != "" && Name != "") {
            var obj = { 'ID': "0", 'SupportWorker': SupportWorker, 'Name': Name,  'MobileNumber': MobileNumber, 'TelephoneNumber': TelephoneNumber, 'Email': Email }
            SupportWorkerList.push(obj);
            LoadSupportWorker(SupportWorkerList);
            $("#SupportWorkerSelect").val("").trigger("change");
            $("#SupportWorkerName").val("");
            $("#SupportWorkerMobileNumber").val("");
            $("#SupportWorkerTelephoneNumber").val("");
            $("#SupportWorkerEmail").val("");
        }
    });

    $('#tenantsFiles').on('change', function (e) {        
        
        $.each(e.target.files, function (i, item) {
            tenantsDocsList.push(e.target.files[i]);
        })              
        loadDocumentsList(tenantsDocsList);
    })
    $(document).delegate('#ClearFilterBTN', 'click', function (e, data) {
        e.preventDefault();
        clearFilters();
    });
    $(document).delegate('#TenantsFilterBTN', 'click', function (e, data) {
        e.preventDefault();
        filterTenantsGrid();
    });


    LoadAllProperty();
    LoadAllTenants();
})

function loadContactList(conList){

    var htm ="<thead><tr><td class='text-center'>Number</td><td class='text-center'>label</td><td class='text-center'>Action</td></tr></thead><tbody>";
    $.each(conList, function (i,item) {
        htm += "<tr><td class='text-center'>" + item.number + "</td><td class='text-center'>" + item.label + "</td><td class='text-center'><i onclick='removeContact(\"" + item.number +"\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></td></tr>"
    })
    htm += "</tbody>";
    $("#contactTable").empty();
    $("#contactTable").html(htm);
}

function removeContact(num) {
    contactList = contactList.filter(x => x.number != num);
    loadContactList(contactList);
}

function loadIssueList(conList) {

    var htm = "<thead><tr><td class='text-center'>Issue</td><td class='text-center'>Action</td></tr></thead><tbody>";
    $.each(conList, function (i, item) {
        htm += "<tr><td class='text-center'>" + item.Issue + "</td><td class='text-center'><i onclick='removeIssue(\"" + item.Issue + "\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></td></tr>"
    })
    htm += "</tbody>";
    $("#issueTable").empty();
    $("#issueTable").html(htm);
}

function removeIssue(iss) {
    issueList = issueList.filter(x => x.Issue != iss);
    loadIssueList(issueList);
}

function loadCriminalConvictionList(conList) {

    var htm = "<thead><tr><td class='text-center'>CriminalConviction</td><td class='text-center'>Date</td><td class='text-center'>Action</td></tr></thead><tbody>";
    $.each(conList, function (i, item) {
        htm += "<tr><td class='text-center'>" + item.CriminalConviction + "</td><td class='text-center'>" + item.ConvictionDate + "</td><td class='text-center'><i onclick='removeConviction(\"" + item.CriminalConviction + "\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></td></tr>"
    })
    htm += "</tbody>";
    $("#criminalTable").empty();
    $("#criminalTable").html(htm);
}

function removeConviction(conv) {
    CriminalConvictionList = CriminalConvictionList.filter(x => x.CriminalConviction != conv);
    loadCriminalConvictionList(CriminalConvictionList);
}

function loadDocumentsList(DocsList) {
    var emb = "";
    $.each(DocsList, function (i, item) {
        emb += "<div class='row'><div class='col-10' style='border: 1px solid #EEE;padding: 5px 10px;'>" + item.name + "</div>" +
            "<div class='col-2 text-center' style='border: 1px solid #EEE;padding: 5px 10px;'><i onclick='removeFile(\"" + item.name + "\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></div>" +
            "</div>";
    });

    $("#docsPreview").html(emb);
}

function removeFile(name) {
    tenantsDocsList = tenantsDocsList.filter(x => x.name != name);
    loadDocumentsList(tenantsDocsList);
}

function LoadSupportWorker(swList) {

    var htm = "<thead><tr><td class='text-center'>Worker</td><td class='text-center'>Name</td><td class='text-center'>Mobile</td><td class='text-center'>Telephone</td><td class='text-center'>Email</td><td class='text-center'>Action</td></tr></thead><tbody>";
    $.each(swList, function (i, item) {
        htm += "<tr><td class='text-center'>" + item.SupportWorker + "</td>"
            +"<td class='text-center'>" + item.Name + "</td>"
            + "<td class='text-center'>" + item.MobileNumber + "</td>" 
            + "<td class='text-center'>" + item.TelephoneNumber + "</td>" 
            + "<td class='text-center'>" + item.Email + "</td>"
            + "<td class='text-center'><i onclick='removeSupportWorker(\"" + item.Name + "\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></td></tr>"
    })
    htm += "</tbody>";
    $("#supportWorkerTable").empty();
    $("#supportWorkerTable").html(htm);
}
function removeSupportWorker(name) {
    SupportWorkerList = SupportWorkerList.filter(x => x.Name != name);
    LoadSupportWorker(SupportWorkerList);
}
function LoadAllProperty() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadAllProperty",
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#AddressSelect").empty();
            $("#AddressSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#AddressSelect").append($("<option data-support='" + item.SupportWorker +"'></option>").val(item.PropertyID).html(item.Address));
            });

            $("#ExistingTenantsNewAddress").empty();
            $("#ExistingTenantsNewAddress").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingTenantsNewAddress").append($("<option data-support='" + item.SupportWorker+"'></option>").val(item.PropertyID).html(item.Address));
            });

            $("#changeTenantsNewAddressSelect").empty();
            $("#changeTenantsNewAddressSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#changeTenantsNewAddressSelect").append($("<option data-support='" + item.SupportWorker + "'></option>").val(item.PropertyID).html(item.Address));
            });

            var gst = ["In Pay", "Out Pay"]
            var pst = ["Blue", "Grey", "Orange"]
            var lst = ["Leavers Outstanding", "Leavers cleared"]

            $("#StatusSelect").empty();
            $("#StatusSelect").append($("<option></option>"));
            $.each(gst, function (i, item) {
                $("#StatusSelect").append($("<option></option>").val(item).html(item));
            });

            $("#ProfileStatusSelect").empty();
            $("#ProfileStatusSelect").append($("<option></option>"));
            $.each(pst, function (i, item) {
                $("#ProfileStatusSelect").append($("<option></option>").val(item).html(item));
            });

            $("#LeaversStatusSelect").empty();
            $("#LeaversStatusSelect").append($("<option></option>"));
            $.each(lst, function (i, item) {
                $("#LeaversStatusSelect").append($("<option></option>").val(item).html(item));
            });

            $("#ExistingStatusSelect").empty();
            $("#ExistingStatusSelect").append($("<option></option>"));
            $.each(gst, function (i, item) {
                $("#ExistingStatusSelect").append($("<option></option>").val(item).html(item));
            });     

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function LoadRoomsByAddress(PropertyID) {
    var dbmodel = { 'PropertyID': PropertyID};
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadRoomsByAddress",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            $("#RoomNoSelect").empty();
            $("#RoomNoSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#RoomNoSelect").append($("<option data-fullname='" + item.FullName + "' data-tenantsid='" + item.TenantsID + "' data-entrydate='" + item.EntryDate + "' data-isoccupied='" + item.IsOccupied +"' ></option>").val(item.RoomNo).html(item.RoomNo));
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function LoadRoomsByAddressExisting(PropertyID) {
    var dbmodel = { 'PropertyID': PropertyID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadRoomsByAddress",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            $("#ExistingRoomNoSelect").empty();
            $("#ExistingRoomNoSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingRoomNoSelect").append($("<option data-fullname='" + item.FullName + "' data-tenantsid='" + item.TenantsID + "' data-isoccupied='" + item.IsOccupied + "' ></option>").val(item.RoomNo).html(item.RoomNo));
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function LoadRoomsByChangeAddress(PropertyID) {
    var dbmodel = { 'PropertyID': PropertyID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadRoomsByAddress",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            $("#changeRoomNoSelect").empty();
            $("#changeRoomNoSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#changeRoomNoSelect").append($("<option data-fullname='" + item.FullName + "' data-tenantsid='" + item.TenantsID + "' data-isoccupied='" + item.IsOccupied + "' ></option>").val(item.RoomNo).html(item.RoomNo));
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function InsertTenant() {



    var formData = new FormData();
    formData.append('ID', $("#ID").val());
    formData.append('FirstName', $("#FirstName").val());
    formData.append('MiddleName', $("#MiddleName").val());
    formData.append('Surname', $("#Surname").val());
    formData.append('ContactNo', $("#ContactNo").val());
    formData.append('DOB',FlatPickerDateToSQLDate($("#DOB").val()));
    formData.append('NI', $("#NI").val());
    formData.append('CRN', $("#CRN").val());
    formData.append('Issues', $("#Issues").val());
    formData.append('CriminalConviction', $("#CriminalConviction").val());
    formData.append('Address', $("#AddressSelect").val());
    formData.append('RoomNo', $("#RoomNoSelect").val());
    //formData.append('SupportWorker', $("#SupportWorker").val());
    //formData.append('SocialWorker', $("#SocialWorker").val());
    formData.append('Referral', $("#Referral").val());
    formData.append('ProfileStatus', $("#ProfileStatusSelect").val());
    formData.append('Status', $("#StatusSelect").val());
    formData.append('LeaversStatus', $("#LeaversStatusSelect").val());
    formData.append('CheckInDate',FlatPickerDateToSQLDate($("#CheckInDate").val()));
    formData.append('CheckOutDate', FlatPickerDateToSQLDate($("#CheckOutDate").val()));
    formData.append('Gender', $("input[name='GenderRadio']:checked").val());
    formData.append('PreviousImage', $("#PreviousImage").val())
    formData.append('image', $('#ProfilePic')[0].files[0]); 

    formData.append('TenantsContactsList',JSON.stringify(contactList));
    formData.append('TenantsIssuesList', JSON.stringify(issueList));
    formData.append('CriminalConvictionsList', JSON.stringify(CriminalConvictionList));
    formData.append('SupportWorkerList', JSON.stringify(SupportWorkerList));
    $.each(tenantsDocsList, function (i, item) {
        formData.append("TenantDocs", item);
    })

    

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/InsertTenant",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Tenants data has been saved',
                'success'
            );
            LoadTenantByNI($("#NI").val());
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

function LoadAllTenants() {
    
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadAllTenants",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {

                NIArr.push(item.NI);

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
                    'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                    'NI':  item.NI,
                    'CRN':  item.CRN,
                    'DOB':  item.DOB,
                    'Address': item.Address,
                    'RoomNo': item.RoomNo,
                    'Status': item.Status,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
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
                            id:'FilterBTN1'
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
                    { data: 'DOB' },
                    { data: 'Address' },
                    { data: 'RoomNo' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    //{ className: 'text-center', targets: [4, 5, 6] },
                    { orderable: false, targets: [-1] },
                    { visible: false, targets: [-2] }
                ],
                rowCallback: function (row, data) {
                    if (!data.Status.includes("Pay")) {
                        if (data.Status =='Leavers cleared')
                            $(row).addClass('grayRow');
                        else
                            $(row).addClass('warningRow');
                    } else{
                        $(row).addClass('brightRow');
                    }
                }
            });


            $("#ExistingTenantsSelect").empty();
            $("#ExistingTenantsSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingTenantsSelect").append($("<option data-propertyid='" + item.PropertyID + "'  data-roomno='" + item.RoomNo + "' data-img='" + item.ImagePath + "' data-status='" + item.Status + "' ></option>").val(item.TenantsID).html(item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname));
            }); 

            $('#NI').autocomplete({
                lookup: NIArr.filter(onlyUnique),
                onSelect: function (value) {
                    LoadTenantByNI(value.value);
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
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function loadTenantsByStatus(status) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadAllTenants",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {

                if ((item.Status == 'In Pay' || item.Status == 'Out Pay') && status == 'Active') {

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
                        'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                        'NI': item.NI,
                        'CRN': item.CRN,
                        'DOB': item.DOB,
                        'Address': item.Address,
                        'RoomNo': item.RoomNo,
                        'Status': item.Status,
                        'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                            '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
                    }

                    data.push(obj);
                } else if (status == 'Leavers' && item.Status.includes("Leavers")) {

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
                        'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                        'NI': item.NI,
                        'CRN': item.CRN,
                        'DOB': item.DOB,
                        'Address': item.Address,
                        'RoomNo': item.RoomNo,
                        'Status': item.Status,
                        'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                            '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
                    }

                    data.push(obj);
                }
            });

            if (status == 'ALL') {
                LoadAllTenants();
            }


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
                            id: 'FilterBTN2'
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
                    { data: 'DOB' },
                    { data: 'Address' },
                    { data: 'RoomNo' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-center', targets: [4,5,6] },
                    { orderable: false, targets: [-1] },
                    { visible: false, targets: [-2] }
                ],
                rowCallback: function (row, data) {
                    $(row).addClass('brightRow');
                }
            });

            $("#ExistingTenantsSelect").empty();
            $("#ExistingTenantsSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingTenantsSelect").append($("<option data-propertyid='" + item.PropertyID + "'  data-roomno='" + item.RoomNo + "' data-img='" + item.ImagePath + "' data-status='" + item.Status + "' ></option>").val(item.TenantsID).html(item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname));
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
            $("#FilterBTN2").attr('data-toggle', 'modal');
            $("#FilterBTN2").attr('data-target', '#right-modal');
        }
    });

   
}

function ChangeTenantAddress() {

    var add = $("#changeTenantsNewAddressSelect").val();
    var rm = $("#changeRoomNoSelect").val();
    var prevProp = "";
    if ($("#exsitingWindow").val() == "0") {
        prevProp = $("#AddressSelect").val();
    } else if ($("#exsitingWindow").val() == "1") {
        prevProp = $("#ExistingTenantsNewAddress").val();
    }
  
    var tn = $("#changeTenantsID").val();

    if (add != "" && rm != "" && prevProp != "" && tn != "") {

        var dbmodel = { 'Address': add, 'RoomNo': rm, 'PropertyID': prevProp, 'TenantsID': tn };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Tenants/ChangeTenantAddress",
            data: JSON.stringify(dbmodel),
            async: false,
            dataType: "json",
            success: function (results) {
                if (results.success == true) {


                    toastr.success('Address has been changed.', 'Success!');
                    $("#changeAddress-modal").modal("hide");
                    $("#AddressSelect").trigger("change");

                    $("#ExistingTenantsNewAddress").trigger("change");

                    $("#changeTenantsID").val("");
                    $("#changeTenantsNewAddressSelect").val("").trigger("change");
                    $("#changeRoomNoSelect").val("").trigger("change");


                } else {
                    toastr.error('Operation failed!', 'Error!');
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Something went wrong!', 'Error!');
            }
        });
    } else {
        toastr.error('Something went wrong!', 'Error!');
    }


}

function changeAddressByExistingRoomDDL() {

    Swal.fire({
        title: 'Are you sure?',
        text: "Note: You are going to change the address!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!',

    }).then((result) => {
        if (result.value) {
            var tn = $("#ExistingTenantsSelect").val();
            var ad = $("#ExistingTenantsNewAddress").val();
            var rm = $("#ExistingRoomNoSelect").val();


            if (tn != "" && ad != "" && rm != "") {
                var dbmodel = { 'Address': ad, 'RoomNo': rm, 'PropertyID': "", 'TenantsID': tn }
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/Tenants/ChangeTenantAddress",
                    data: JSON.stringify(dbmodel),
                    async: false,
                    dataType: "json",
                    success: function (results) {
                        if (results.success == true) {
                            toastr.success('Address has been changed.', 'Success!');

                            $.ajax({
                                type: "GET",
                                contentType: "application/json; charset=utf-8",
                                url: "/Tenants/LoadAllTenants",
                                data: {},
                                async: true,
                                dataType: "json",
                                success: function (results) {

                                    $("#ExistingTenantsSelect").empty();
                                    $("#ExistingTenantsSelect").append($("<option></option>"));
                                    $.each(results.data, function (i, item) {
                                        $("#ExistingTenantsSelect").append($("<option data-propertyid='" + item.PropertyID + "'  data-roomno='" + item.RoomNo + "' data-img='" + item.ImagePath + "' data-status='" + item.Status + "' ></option>").val(item.TenantsID).html(item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname));
                                    });

                                    $("#ExistingTenantsSelect").val(tn).trigger("change");
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    toastr.error('Something went wrong!', 'Error!');
                                }
                            });


                        } else {
                            toastr.error('Operation failed!', 'Error!');
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Something went wrong!', 'Error!');
                    }
                });
            }
        }
    })
    

    
}

function MoveToLeavers(TenantsID) {
    var dbmodel = {'TenantsID': TenantsID };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/MoveToLeavers",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            if (results.success == true) {


                toastr.success('Data has been changed.', 'Success!');
                $("#AddressSelect").trigger("change");
                $("#ExistingTenantsNewAddress").trigger("change");



            } else {
                toastr.error('Operation failed!', 'Error!');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function LoadPreviousAddressByTenantsID(TenantsID) {
    var dbmodel = { 'TenantsID': TenantsID };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadPreviousAddressByTenantsID",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            var htm=""
            $.each(results.data, function (i, item) {
                htm += "<tr>" +
                    "<td>" + item.Address + "</td>" +
                    "<td>" + item.RoomNo + "</td>" +
                    "<td>" + item.EntryDate + "</td>" +
                    "<td>" + item.LeaveDate + "</td>" +
                    "</tr>";
            })

            $("#ExistingAddressesTable tbody").html(htm);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function ChangeTenantsStatus(TenantsID, Status) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: You are going to change the status!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!',

    }).then((result) => {
        if (result.value) {
            var dbmodel = { 'TenantsID': TenantsID, 'Status': Status };
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Tenants/ChangeTenantsStatus",
                data: JSON.stringify(dbmodel),
                async: false,
                dataType: "json",
                success: function (results) {
                    if (results.success == true) {

                        toastr.success('Status has been changed.', 'Success!');

                    } else {
                        toastr.error('Operation failed!', 'Error!');
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    toastr.error('Something went wrong!', 'Error!');
                }
            });
        }
    })
    
}

function LoadSelectedTenant(ID) {
    var dbmodel = { 'ID': ID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadSelectedTenant",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            $.each(results.data, function (i, item) {
                $("#ID").val(item.ID);
                $("#FirstName").val(item.FirstName);
                $("#MiddleName").val(item.MiddleName);
                $("#Surname").val(item.Surname);
                $("#DOB").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.DOB),
                    }
                );
                $("#NI").val(item.NI);
                $("#CRN").val(item.CRN);
                //$("#ContactNo").val(item.ContactNo);
                $("#Issues").val(item.Issues);
                $("#CriminalConviction").val(item.CriminalConviction);
                if (item.LeaversStatus == '' || item.LeaversStatus==null) {
                    $("#AddressSelect").val(item.PropertyID).trigger("change");
                    $("#RoomNoSelect").val(item.RoomNo);
                }

                //$("#SupportWorker").val(item.SupportWorker);
                //$("#SocialWorker").val(item.SocialWorker);
                $("#Referral").val(item.Referral);
                $("#ProfileStatusSelect").val(item.ProfileStatus).trigger("change");
                $("#StatusSelect").val(item.Status).trigger("change");
                $('input[name="GenderRadio"][value="' + item.Gender + '"]').prop('checked', true);

                $("#CheckInDate").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.CheckInDate),
                    }
                );

                if (item.CheckOutDate !='') {

                    $("#CheckOutDate").flatpickr(
                        {
                            altInput: false,allowInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "d-m-Y",
                            defaultDate: HumanToOriginal(item.CheckOutDate),
                        }
                    );
                    $("#LeaversStatusSelectDIV").removeClass("hidden");

                    $("#LeaversStatusSelect").val(item.LeaversStatus).trigger("change");
                }

                $("#PreviousImage").val(item.ImagePath);
                UpdateDropifyImg(item.ImagePath);
            });

            contactList = [];
            $.each(results.data[0].TenantsContactsList, function (i,item) {
                contactList.push(item);
            })

            issueList = [];
            $.each(results.data[0].TenantsIssuesList, function (i, item) {
                issueList.push(item);
            })

            CriminalConvictionList = [];
            $.each(results.data[0].CriminalConvictionsList, function (i, item) {
                CriminalConvictionList.push(item);
            })

            tenantsDocsList = [];
            $.each(results.data[0].TenantsDocumentsList, function (i, item) {
                getblob(item.FilePath);
            })

            SupportWorkerList = [];
            $.each(results.data[0].SupportWorkerList, function (i, item) {
                SupportWorkerList.push(item);
            })

            loadContactList(contactList);
            loadIssueList(issueList);
            loadCriminalConvictionList(CriminalConvictionList);
            LoadSupportWorker(SupportWorkerList);

            $("#TenantsForm-modal").modal("show");
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

function LoadTenantByNI(NI) {
    TenantFormClear();
    var dbmodel = { 'NI': NI };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/LoadTenantByNI",
        data: JSON.stringify(dbmodel),
        async: false,
        dataType: "json",
        success: function (results) {
            $.each(results.data, function (i, item) {
                $("#ID").val(item.ID);
                $("#FirstName").val(item.FirstName);
                $("#MiddleName").val(item.MiddleName);
                $("#Surname").val(item.Surname);
                $("#DOB").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.DOB),
                    }
                );
                $("#NI").val(item.NI);
                $("#CRN").val(item.CRN);
                //$("#ContactNo").val(item.ContactNo);
                $("#Issues").val(item.Issues);
                $("#CriminalConviction").val(item.CriminalConviction);
                if (item.LeaversStatus == '' || item.LeaversStatus == null) {
                    $("#AddressSelect").val(item.PropertyID).trigger("change");
                    $("#RoomNoSelect").val(item.RoomNo);
                }
                //$("#SupportWorker").val(item.SupportWorker);
                //$("#SocialWorker").val(item.SocialWorker);
                $("#Referral").val(item.Referral);
                $("#ProfileStatusSelect").val(item.ProfileStatus).trigger("change");
                $("#StatusSelect").val(item.Status).trigger("change");
                $('input[name="GenderRadio"][value="' + item.Gender + '"]').prop('checked', true);

                $("#CheckInDate").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.CheckInDate),
                    }
                );

                if (item.CheckOutDate != '') {

                    $("#CheckOutDate").flatpickr(
                        {
                            altInput: false, allowInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "d-m-Y",
                            defaultDate: HumanToOriginal(item.CheckOutDate),
                        }
                    );
                    $("#LeaversStatusSelectDIV").removeClass("hidden");

                    $("#LeaversStatusSelect").val(item.LeaversStatus).trigger("change");
                } else {

                    $("#CheckOutDate").flatpickr(
                        {
                            altInput: false, allowInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "d-m-Y"
                        }
                    );
                }

                $("#PreviousImage").val(item.ImagePath);
                UpdateDropifyImg(item.ImagePath);
            });

            contactList = [];
            $.each(results.data[0].TenantsContactsList, function (i, item) {
                contactList.push(item);
            })

            issueList = [];
            $.each(results.data[0].TenantsIssuesList, function (i, item) {
                issueList.push(item);
            })

            CriminalConvictionList = [];
            $.each(results.data[0].CriminalConvictionsList, function (i, item) {
                CriminalConvictionList.push(item);
            })

            tenantsDocsList = [];
            $.each(results.data[0].TenantsDocumentsList, function (i, item) {
                getblob(item.FilePath);
            })

            SupportWorkerList = [];
            $.each(results.data[0].SupportWorkerList, function (i, item) {
                SupportWorkerList.push(item);
            })

            loadContactList(contactList);
            loadIssueList(issueList);
            loadCriminalConvictionList(CriminalConvictionList);
            LoadSupportWorker(SupportWorkerList);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function getblob(url) {
    var fname = url.replace('/Content/Images/',"");
    
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
            //alert(dataURLtoFile(e.target.result, fname));
            tenantsDocsList.push(dataURLtoFile(e.target.result, fname.slice(18)));
        };
        reader.onloadend = function (e) {
            //loadDocumentsList(tenantsDocsList);

            var emb = "";
            $.each(tenantsDocsList, function (i, item) {
                emb += "<div class='row'><div class='col-10' style='border: 1px solid #EEE;padding: 5px 10px;'>" + item.name + "</div>" +
                    "<div class='col-2 text-center' style='border: 1px solid #EEE;padding: 5px 10px;'><i onclick='removeFile(\"" + item.name + "\")' class='mdi mdi-delete-outline' style='cursor:pointer;'></i></div>" +
                    "</div>";
            });

            $("#docsPreview").html(emb);
        };
    
    };
    request.send();
}

function dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

function DeleteTenant(ID) {
    var dbModel = { 'ID': ID }
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
            var dbmodel = { 'ID': ID };
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Tenants/DeleteTenant",
                data: JSON.stringify(dbmodel),
                async: false,
                dataType: "json",
                success: function (results) {
                    if (results.success == true) {
                        toastr.success('Tenant has been deleted.', 'Success!');
                        $('#tenantsTabs').each(function () {
                            $(this).find('li>a').each(function () {
                                var tb = $(this);
                                if (tb.hasClass("active")) {
                                    loadTenantsByStatus(tb.text());
                                }
                            });
                        });

                    } else {
                        toastr.error('Operation failed!', 'Error!');
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
    })
    
}

function TenantFormClear() {
    contactList = [];
    issueList = [];
    CriminalConvictionList = [];
    tenantsDocsList = [];
    SupportWorkerList = [];

    $("#ID").val("");
    $("#FirstName").val("");
    $("#MiddleName").val("");
    $("#Surname").val("");
    $("#DOB").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-1990",
        }
    );
    
    $('#CheckInDate').flatpickr().clear();
    $('#CheckOutDate').flatpickr().clear();

    $("#NI").val("");
    $("#CRN").val("");
    $("#ContactNo").val("");
    $("#Issues").val("");
    $("#CriminalConviction").val("");
    $("#AddressSelect").val("");
    $("#RoomNoSelect").val("");

    $('#AddressSelect').select2({
        placeholder: "Search"
    });
    $('#RoomNoSelect').select2({
        placeholder: "Select"
    });

    $("#ProfileStatusSelect").val("").trigger("change");
    $("#StatusSelect").val("").trigger("change");
    $("#LeaversStatusSelect").val("").trigger("change");

    $("#SupportWorker").val("");
    $("#SocialWorker").val("");
    $("#Referral").val("");
    $("#StatusSelect").val("").trigger("change");
    $('input[name="GenderRadio"][value="Male"]').prop('checked', true);
    $('input[name="IsNewRadio"][value="1"]').prop('checked', true).trigger("change");

    $("#PreviousImage").val("");
    UpdateDropifyImg("");


    $("#ExistingTenantsSelect").val("");
    $('#ExistingTenantsSelect').select2({
        placeholder: "Select"
    });
    $("#ExistingRoomNoSelect").val("");
    $('#ExistingRoomNoSelect').select2({
        placeholder: "Select"
    });
    $("#ExistingTenantsNewAddress").val("");
    $('#ExistingTenantsNewAddress').select2({
        placeholder: "Select"
    });
    $("#ExistingStatusSelect").val("");
    $('#ExistingStatusSelect').select2({
        placeholder: "Select"
    });

    $("#ExistingTenantsImage").prop("src", "/Content/Images/avater.jpg");

    $("#ExistingAddressesTable tbody").empty();
    $("#contactTable").empty();
    $("#issueTable").empty();
    $("#criminalTable").empty();
    $("#docsPreview").empty();
    $("#supportWorkerTable").empty();
}

function UpdateDropifyImg(imagenUrl) {

    var drEvent = $('#ProfilePic').dropify(
        {
            defaultFile: imagenUrl
        });
    drEvent = drEvent.data('dropify');
    drEvent.resetPreview();
    drEvent.clearElement();
    drEvent.settings.defaultFile = imagenUrl;
    drEvent.destroy();
    drEvent.init();
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
            dateFormat: "d-m-Y",
        }
    );
    $("#JoiningDateFilter").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
        }
    );

    $("#DOBFilter").flatpickr().clear();
    $("#JoiningDateFilter").flatpickr().clear();

    if ($("#allTab").hasClass("active")) {
        LoadAllTenants();
    } else if ($("#activeTab").hasClass("active")) {
        loadTenantsByStatus('Active');
    } else if ($("#leaversTab").hasClass("active")) {
        loadTenantsByStatus('Leavers');
    }

    $("#right-modal").modal("hide");
}

function filterTenantsGrid() {
    var NI = $("#NINumberFilter").val().trim();
    var FullName = $("#FullNameFilter").val().trim();
    var CRN = $("#CRNFilter").val().trim();
    var Address = $("#AddressFilter").val().trim();
    var Referral = $("#ReferralFilter").val().trim();
    var DOB = $("#DOBFilter").val();
    var JoiningDate = $("#JoiningDateFilter").val();

    var dbModel = { 'NI': NI, 'FullName': FullName, 'CRN': CRN, 'Address': Address, 'Referral': Referral, 'DOB': DOB, 'JoiningDate':JoiningDate}

    if ($("#allTab").hasClass("active")) {
        FilterAllTenants(JSON.stringify(dbModel));
    } else if ($("#activeTab").hasClass("active")) {
        FilterActiveTenants('Active', JSON.stringify(dbModel));
    } else if ($("#leaversTab").hasClass("active")) {
        FilterActiveTenants('Leavers', JSON.stringify(dbModel));
    }

}

function FilterAllTenants(data) {

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/FilterTenants",
        data: data,
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {

                NIArr.push(item.NI);

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
                    'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                    'NI': item.NI,
                    'CRN': item.CRN,
                    'DOB': item.DOB,
                    'Address': item.Address,
                    'RoomNo': item.RoomNo,
                    'Status': item.Status,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
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
                    { data: 'DOB' },
                    { data: 'Address' },
                    { data: 'RoomNo' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-center', targets: [4, 5, 6] },
                    { orderable: false, targets: [-1] },
                    { visible: false, targets: [-2] }
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


            $("#ExistingTenantsSelect").empty();
            $("#ExistingTenantsSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingTenantsSelect").append($("<option data-propertyid='" + item.PropertyID + "'  data-roomno='" + item.RoomNo + "' data-img='" + item.ImagePath + "' data-status='" + item.Status + "' ></option>").val(item.TenantsID).html(item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname));
            });

            $('#NI').autocomplete({
                lookup: NIArr.filter(onlyUnique),
                onSelect: function (value) {
                    LoadTenantByNI(value.value);
                }
            });

            $("#right-modal").modal("hide");

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

function FilterActiveTenants(status,data) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Tenants/FilterTenants",
        data: data,
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {

                if ((item.Status == 'In Pay' || item.Status == 'Out Pay') && status == 'Active') {

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
                        'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                        'NI': item.NI,
                        'CRN': item.CRN,
                        'DOB': item.DOB,
                        'Address': item.Address,
                        'RoomNo': item.RoomNo,
                        'Status': item.Status,
                        'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                            '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
                    }

                    data.push(obj);
                } else if (status == 'Leavers' && item.Status.includes("Leavers")) {

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
                        'FullName': '<a href="/Tenants/Details/' + item.ID + '"> <span style="cursor:pointer;">' + FullNameAndImage + '</span></a>',
                        'NI': item.NI,
                        'CRN': item.CRN,
                        'DOB': item.DOB,
                        'Address': item.Address,
                        'RoomNo': item.RoomNo,
                        'Status': item.Status,
                        'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                            '<a href="javascript: void(0);" class="ml-2" onclick="DeleteTenant(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>'
                    }

                    data.push(obj);
                }
            });

            if (status == 'ALL') {
                LoadAllTenants();
            }


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
                            id: 'FilterBTN2'
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
                    { data: 'DOB' },
                    { data: 'Address' },
                    { data: 'RoomNo' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-center', targets: [4, 5, 6] },
                    { orderable: false, targets: [-1] },
                    { visible: false, targets: [-2] }
                ],
                rowCallback: function (row, data) {
                    $(row).addClass('brightRow');
                }
            });

            $("#ExistingTenantsSelect").empty();
            $("#ExistingTenantsSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#ExistingTenantsSelect").append($("<option data-propertyid='" + item.PropertyID + "'  data-roomno='" + item.RoomNo + "' data-img='" + item.ImagePath + "' data-status='" + item.Status + "' ></option>").val(item.TenantsID).html(item.FirstName + ' ' + item.MiddleName + ' ' + item.Surname));
            });

            $("#right-modal").modal("hide");
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
            $("#FilterBTN2").attr('data-toggle', 'modal');
            $("#FilterBTN2").attr('data-target', '#right-modal');
        }
    });
}

