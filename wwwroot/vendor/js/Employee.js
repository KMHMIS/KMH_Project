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
    getDeparment();
    getDesignation();
    getTableEmployee();
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

//Fill DropDown Deparment
function getDeparment() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Deparment/GetDeparmentByActive?action=GetDeparmentByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetDeparment,
        error: function (error) {
            console.log(error.responseText);

        },
        
    });
  
}
function onSuccessGetDeparment(data, status) {


    $('#Deparment').empty();
    $("#Deparment").append("<option value='" + 0 + "'>--Select Department--</option>").show();
    $.each(data.data, function (i, item) {
        $("#Deparment").append("<option value='" + item.DeparmentID + "'>" + item.DeparmentName + "</option>").show();
    });
   /* console.log(data);*/



}

//Fill DropDown Designation
function getDesignation() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Designation/GetDesignationByActive?action=GetDesignationByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetDesignation,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetDesignation(data, status) {


    $('#Designation').empty();
    $("#Designation").append("<option value='" + 0 + "'>--Select Designation--</option>").show();

    $.each(data.data, function (i, item) {
        $("#Designation").append("<option value='" + item.DesignationID + "'>" + item.DesignationName + "</option>").show();
    });
}

//Get Employee Table 
function getTableEmployee()
{
   
    $('#tblEmployee').DataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'Employee/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {

        },
        "columns": [
            { "data": "FirstName", "autoWidth": true },
            { "data": "LastName", "autoWidth": true },
            { "data": "DeparmentName", "autoWidth": true },
            { "data": "DesignationName", "autoWidth": true },
            { "data": "JoiningDate", "autoWidth": true },
            { "data": "DateOfBirth", "autoWidth": true },
            { "data": "Salary", "autoWidth": true },
            { "data": "Email", "autoWidth": true },
            { "data": "PhoneNo1", "autoWidth": true },
            { "data": "Address", "autoWidth": true },
            
            {
                "data": 'EmployeeID', "weight": "50px" , "render": function (data) {
                    return '<button type="button" id="' + data + '" class="btn btn-primary btnEdit"><i class="material-icons">edit</i></button> <button type="button" id="' + data + '" class="btn btn-danger btnDelete"><i class="material-icons">delete</i></button>'
                    
                }
                
            }
        ]
    });
}

//OnClick Edit Button
$(document).on("click", ".btnEdit", function () {
    $("#btnSave").hide();
    $("#btnUpdate").show();
    $("#divInput").show();

    UpdateEmployeeID = $(this).attr("id");
 
    var currentRow = $(this).closest("tr");
    var col1 = currentRow.find("td:eq(0)").text();
    var col2 = currentRow.find("td:eq(1)").text();
    var col3 = currentRow.find("td:eq(2)").text();
    var col4 = currentRow.find("td:eq(3)").text();
    var col5 = currentRow.find("td:eq(4)").text();
    var col6 = currentRow.find("td:eq(5)").text();
    var col7 = currentRow.find("td:eq(6)").text();
    var col8 = currentRow.find("td:eq(7)").text();
    var col9 = currentRow.find("td:eq(8)").text();
    var col10 = currentRow.find("td:eq(9)").text();

    $('#firstName').val(col1);
    $('#lastName').val(col2);
    $('#Deparment').val(col3);
    $('#Designation').val(col4);
    $('#joiningDate').val(col5);
    $('#dateOfBirth').val(col6);
    $('#salary').val(col7);
    $('#emailAddress').val(col8);
    $('#phoneNo1').val(col9);
    $('#address').val(col10);
    //alert(col1 + "\n" + col2 + "\n" + col3 + col4 + "\n" + col5 + "\n" + col6 + "\n" + col7 + "\n" + col8 + "\n" + col9 + "\n" + col10 );
});

//OnClick Delete Button
$(document).on("click", ".btnDelete", function () {
    /*alert("Are You Sure Deleted");*/
    UpdateEmployeeID = $(this).attr("id");
    Swal.fire({
        title: 'Are you sure?',
        text: "Filter will be deleted permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: "#61affe",
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        reverseButtons: true
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                type: "DELETE",
                url: apiUrl + 'Employee/DeleteEmployee?action=delete&id=' + UpdateEmployeeID,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    const element = document.getElementById(UpdateEmployeeID);
                    element.remove();
                    // $('#btnDynamicFilters' + id).remove();
                    getTableEmployee();
                },
                error: function (error) {
                    console.log(error);

                },
                cache: false,
            });
        }
    })

});
 // Handle the click event for the "Edit" button
//$('#tblEmployee tbody').on('click', '.editButton', function () {
//    debugger;
//    var id = $(this).data('EmployeeId');

//    // Make an AJAX request to get the data for the selected ID
//    $.ajax({
//        url: apiUrl + 'Employee/GetEmployeeData?id=' + id + '&action=GetEmployeeData', // Replace with your API endpoint
//        method: 'GET',
//        success: function (response) {
//            console.log(response);
//            // Populate the form fields with the data from the API response
//            $('#firstName').val(response.name);
//            $('#lastName').val(response.email);

//            // Perform any other necessary actions for editing the data
//            // ...

//            // Example: Saving the row ID
//            var rowId = response.EmployeeId;
//        }
//    });
//});

//function editButton() {

//    var data = table.row($(this).parents('tr')).data();
//    alert("The ID is: " + data[0]);
//}
//$('#editButton').on('click', function () {
//    debugger;
//    var currentRow = $(this).closest("tr");
//    var col1 = currentRow.find("td:eq(0)").text();
//    var col2 = currentRow.find("td:eq(1)").text();
//    var col3 = currentRow.find("td:eq(2)").text();

//    alert(col1 + "\n" + col2 + "\n" + col3);
//});
//All Input Clear
function clear() {
    $("#firstName").val("");
    $("#lastName").val("");

    //$("#Deparment option[value='']").prop("selected", true);
    //$("#Designation option[value='']").prop("selected", true);

    //$("#Deparment option").filter(function () {
    //    return $(this).val() === '';
    //}).prop("selected", true);
    //$("#Deparment option:selected:empty").prop("selected", true);
    //$("#Deparment").empty();
    //$("#Designation").empty();
    $("#joiningDate").val("");
    $("#relievingDate").val("");
    $("#dateOfBirth").val("");
    $("#salary").val("");
    $("#emailAddress").val("");
    $("#phoneNo1").val("");
    $("#phoneNo2").val("");
    $("#lastCompanyName").val("");
    $("#address").val("");
    $('#error_message').html('');
    getDeparment();
    getDesignation();
    $("#btnSave").show();
    $("#btnUpdate").hide();
}

//Click Clear Button
$('#btnClear').on('click', function () {
    clear();

});

//Click Insert Button
$('#btnSave').on('click', function () {

    debugger;
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var Deparment = $('#Deparment').val();
    var Designation = $('#Designation').val();
    var JoiningDate = $('#joiningDate').val();
    var RelievingDate = $('#relievingDate').val();
    var DateOfBirth = $('#dateOfBirth').val();
    var Salary = $('#salary').val();
    var Email = $('#emailAddress').val();
    var PhoneNo1 = $('#phoneNo1').val();
    var PhoneNo2 = $('#phoneNo2').val();
    var LastCompanyName = $('#lastCompanyName').val();
    var Address = $('#address').val();
    var EmployeeId = employeeId;
    
    if (FirstName == "") {
        $('#firstName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#firstName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action:'insert',
        firstName: FirstName,
        lastName: LastName,
        deparmentID: Deparment,
        designationID: Designation,
        joiningDate: JoiningDate,
        relievingDate: RelievingDate,
        dateOfBirth: DateOfBirth,
        salary: Salary,
        email: Email,
        phoneNo1: PhoneNo1,
        phoneNo2: PhoneNo2,
        lastCompanyName: LastCompanyName,
        address: Address,
        CreatedBy: EmployeeId
    };

   // console.log(obj);
    $.ajax({
        type: "POST",
        url: apiUrl + 'Employee/InsertEmployee',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //console.log(result);

            if (result.status == true) {
                let timerInterval
                Swal.fire({
                    icon: 'success',
                    type: 'success',
                    title: 'Record Saved',
                    timer: 5000,
                    confirmButtonColor: "#61affe",
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    clear();
                    getTableEmployee();
                    $("#divInput").hide();

                })
             
            }
            else {
                alert(result.message);
            }

        },
        error: function (error) {
            console.log(error.response);


        }
    });

});

//Click Update Button
$('#btnUpdate').on('click', function () {

    debugger;
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var Deparment = $('#Deparment').val();
    var Designation = $('#Designation').val();
    var JoiningDate = $('#joiningDate').val();
    var RelievingDate = $('#relievingDate').val();
    var DateOfBirth = $('#dateOfBirth').val();
    var Salary = $('#salary').val();
    var Email = $('#emailAddress').val();
    var PhoneNo1 = $('#phoneNo1').val();
    var PhoneNo2 = $('#phoneNo2').val();
    var LastCompanyName = $('#lastCompanyName').val();
    var Address = $('#address').val();
    var EmployeeId = employeeId;

    if (FirstName == "") {
        $('#firstName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#firstName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'update',
        employeeID: UpdateEmployeeID,
        firstName: FirstName,
        lastName: LastName,
        deparmentID: Deparment,
        designationID: Designation,
        joiningDate: JoiningDate,
        relievingDate: RelievingDate,
        dateOfBirth: DateOfBirth,
        salary: Salary,
        email: Email,
        phoneNo1: PhoneNo1,
        phoneNo2: PhoneNo2,
        lastCompanyName: LastCompanyName,
        address: Address,
        UpdatedBy: EmployeeId
    };

    // console.log(obj);
    $.ajax({
        type: "PUT",
        url: apiUrl + 'Employee/UpdateEmployee',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //console.log(result);

            if (result.status == true) {
                let timerInterval
                Swal.fire({
                    icon: 'success',
                    type: 'success',
                    title: 'Record Udpated',
                    timer: 5000,
                    confirmButtonColor: "#61affe",
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    clear();
                    getTableEmployee();
                    $("#divInput").hide();
                    
                })

            }
            else {
                alert(result.message);
            }

        },
        error: function (error) {
            console.log(error.response);


        }
    });

});

//Click Add Button
$('#btnAdd').on('click', function () {
   
    $("#divInput").show();
    clear();
});

//Click Close Button
$('#btnClose').on('click', function () {

    $("#divInput").hide();
    clear(); 
});


// Logout
$(document).on("click", ".btnLogout", function () {
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