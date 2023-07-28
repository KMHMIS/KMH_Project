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
    /*$('#btnSave').empty();*/

    $('#mnu_forms_link').click();

    const uniqueFormNames = {};
    var URLFormName = '';
    console.log(data.data);
    $.each(data.data, function (i, item) {
        // Check if the FormName is not already in the lookup table
        if (!uniqueFormNames[item.FormName]) {
            // If it's not a duplicate, add it to the lookup table and append the list item
            uniqueFormNames[item.FormName] = true;
            
            $("#sub_mnu_forms").append("<li class='sub_forms'><a href='" + item.URL + "'>" + item.FormName + "</a></li>").show();
            
            var hashes = window.location.href.slice(window.location.href.indexOf('/') + 1).split('/');
            URLFormName = hashes[hashes.length - 1].trim();
        }
       
    });
    //Get current form rights
    var form_rights = data.data.filter(function (i, key) {
        return i.FormName.toLowerCase() == URLFormName.toLowerCase();
    });

    // Clear the #btnSave div before adding buttons
    $('#btnSave').empty();
    $("#btnSave").append('<button type="button" class="btn btn-success btn1" title="Save Record" value="' + item.ActionName + '"><i class="material-icons">save</i></button>');
  

    const uniqueActionNames = {};

    $.each(data.data, function (i, item) {
        if (!uniqueActionNames[item.ActionName]) {
            uniqueActionNames[item.ActionName] = true;
        }
    });

    // Show the #btnSave div after adding buttons
    $('#btnSave').show();

    //$.each(data.data, function (i, item) {
      //  $("#sub_mnu_forms").append("<li class='sub_forms'><a href = '" + item.URL + "'> " + item.FormName + "</a></li >").show();
    /*    $("#Employee").append("<option value='" + item.EmployeeID + "'>" + item.EmployeeName + "</option>").show();*/
    //});
   /* console.log(data);*/

}

//$(document).on("click", "#sub_mnu_forms", function () {
//    //alert('Hello user');
//    /*$('#btnSave').remove();*/
//    /*const uniqueFormNames = {};*/

//    $.each(data.data, function (i, item) {
//        //if (!uniqueFormNames[item.ActionName]) {
//        //    uniqueFormNames[item.ActionName] = true;
//            $("#btnSave").append('<button type="button" class="btn btn-success btn1" title="Save Record" value="' + item.ActionName + '"><i class="material-icons">save</i></button>').show();
//        /*}*/
//    });

//});

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