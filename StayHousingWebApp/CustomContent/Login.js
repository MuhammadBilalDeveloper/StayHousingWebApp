
$(function () {

    $(document).delegate('#Email', 'keyup change', function (e) {
        e.preventDefault();
        var mail = $(this).val();
        if (!validateEmail(mail)) {
            $(".mail-error").text("Invalid Email! Please enter a valid email.");
            $(".mail-error").addClass("login-error");
            $(this).css("border-color", "red");
            $(this).css("border-left-color", "transparent");
            $(".mail-input").css("border-color", "red");
            $(".mail-input").css("border-right-color", "transparent");
        } else {
            $(".mail-error").text("");
            $(".mail-error").removeClass("login-error");
            $(this).css("border-color", "#3FC3AE");
            $(this).css("border-left-color", "transparent");
            $(".mail-input").css("border-color", "#3FC3AE");
            $(".mail-input").css("border-right-color", "transparent");
        }
    });

    $(document).delegate('#Password', 'keyup change', function (e) {
        e.preventDefault();
        var pass = $(this).val();
        if (pass.length<6) {
            $(".pass-error").text("Invalid Password! Password should at least 6 Char.");
            $(".pass-error").addClass("login-error");
            $(this).css("border-color", "red");
            $(this).css("border-left-color", "transparent");
            $(".pass-input").css("border-color", "red");
            $(".pass-input").css("border-right-color", "transparent");
        } else {
            $(".pass-error").text("");
            $(".pass-error").removeClass("login-error");
            $(this).css("border-color", "#3FC3AE");
            $(this).css("border-left-color", "transparent");
            $(".pass-input").css("border-color", "#3FC3AE");
            $(".pass-input").css("border-right-color", "transparent");
        }
    });

    $(document).delegate('#LoginBtn', 'click', function (e) {
        e.preventDefault();

        preLoginValidation();
    });

    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            preLoginValidation();
        }
    });

})

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function preLoginValidation() {

    var Email = $("#Email").val();
    var Password = $("#Password").val();

    if (validateEmail(Email) && Password.length > 5) {
        GetLoginInfo(Email, Password);
    } else {

        if (Password.length < 6) {
            $(".pass-error").text("Invalid Password! Password should at least 6 Char.");
            $(".pass-error").addClass("login-error");
            $("#Password").css("border-color", "red");
            $("#Password").css("border-left-color", "transparent");
            $(".pass-input").css("border-color", "red");
            $(".pass-input").css("border-right-color", "transparent");
        } else {
            $(".pass-error").text("");
            $(".pass-error").removeClass("login-error");
            $("#Password").css("border-color", "#3FC3AE");
            $("#Password").css("border-left-color", "transparent");
            $(".pass-input").css("border-color", "#3FC3AE");
            $(".pass-input").css("border-right-color", "transparent");
        }

        if (!validateEmail(Email)) {
            $(".mail-error").text("Invalid Email! Please enter a valid email.");
            $(".mail-error").addClass("login-error");
            $("#Email").css("border-color", "red");
            $("#Email").css("border-left-color", "transparent");
            $(".mail-input").css("border-color", "red");
            $(".mail-input").css("border-right-color", "transparent");
        } else {
            $(".mail-error").text("");
            $(".mail-error").removeClass("login-error");
            $("#Email").css("border-color", "#3FC3AE");
            $("#Email").css("border-left-color", "transparent");
            $(".mail-input").css("border-color", "#3FC3AE");
            $(".mail-input").css("border-right-color", "transparent");
        }
    }
}

function GetLoginInfo(Email, Password) {

    var l = Ladda.create(document.getElementById('LoginBtn'));
    l.start();
    setTimeout(function () {
        l.stop();
        var dbModel = { 'Email': Email, 'Password': Password }
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Login/GetLoginInfo",
            data: JSON.stringify(dbModel),
            async: false,
            dataType: "json",
            success: function (results) {
                l.stop();
                if (results.success) {

                    window.location.href = "/Dashboard/Index";
                } else {
                    Swal.fire(
                        'Failed!',
                        results.message,
                        'warning'
                    );
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                l.stop();
                Swal.fire(
                    'Success!',
                    'Something went wrong!',
                    'error'
                );

            }
        });
    }, 1000);

   
}