var apiUrl = document.getElementById("apiurl").value;
var webUrl = document.getElementById("webUrl").value;

//Session variable
var username;
var rolename; 
var employeeId;
var email;
var token;

//Udpated ID
var UpdateEmployeeID;

//Page Load Event
$(document).ready(function () {
    GetSession();
    $('#LoginUser').html(username);
    $('#email').html(email);
    getUserForms();
    $('#error_message').html('');

});

//Get Session
function GetSession() {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        url: webUrl +'Accounts/Session',
        success: function (result) {
            username = result.userName;
            rolename = result.roleName;
            employeeId = result.employeeId;
            email = result.email;
            token = result.token;
          },
        error: function (error) {
            console.log(error);
        },
        cache: false,
        async: false,
    });
}

//Fill 
function getUserForms() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Accounts/GetUserFroms?action=GetUserForms&UserName=' + username,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetUserForms,
        error: function (error) {
            console.log(error.responseText);

        },
        
    });
  
}
function onSuccessGetUserForms(data, status) {

    console.log(data.data);
    $('#sub_mnu_forms .sub_forms').remove();
   

    $.each(data.data, function (i, item) {
        $("#sub_mnu_forms").append("<li class='sub_forms'><a href = '" + item.URL + "'> " + item.FormName + "</a></li >").show();
    /*    $("#Employee").append("<option value='" + item.EmployeeID + "'>" + item.EmployeeName + "</option>").show();*/
    });
   /* console.log(data);*/



}



// Logout
$('.btnLogout').on('click', function () {
    $.ajax({
        type: 'POST',
        url: webUrl+ 'Accounts/Logout',
        dataType: "json",
        success: function () {
            window.location.href = "/Accounts/Index";
        },
        error: function () {
            alert('error');
        }
    });
});