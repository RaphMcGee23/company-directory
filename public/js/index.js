// Makes contains case insensitive
jQuery.expr[':'].contains = function (a, i, m) {
  return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0;
};

// Jquery validator options
jQuery.validator.setDefaults({
  errorElement: 'span',
  errorPlacement: function (error, element) {
    error.addClass('invalid-feedback');
    element.closest('.form-group').append(error);
  },
  highlight: function (element, errorClass, validClass) {
    $(element).addClass('is-invalid');
  },
  unhighlight: function (element, errorClass, validClass) {
    $(element).removeClass('is-invalid');
  }
});

// Create tables

function refreshTables() {
  if ($('#searchBar')) {
    $('#searchBar').val('');
  }
  if($('#searchBarMobile')){
    $('#searchBarMobile').val('');
  }
  $.ajax({
    url: 'php/getAll.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      
      // Clear tables and decks
      $('#employeeBody').empty();
      $('#departmentBody').empty();
      $('#locationBody').empty();
      $('.card-deck').empty();
      // Personnel table
      for (var i = 0; i < result.data.personnel.length; i++) {
        // Mobile
        $('#employeeBody').append(`
          <tr class="employeeTableRow" data-val="${result.data.personnel[i].id}">
            <td><button class="btn employeeEditButton" data-val="${result.data.personnel[i].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn employeeDeleteButton" data-val="${result.data.personnel[i].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></td>
            <td>${result.data.personnel[i].lastName}</td>
            <td>${result.data.personnel[i].firstName}</td>
          </tr>
        `);
        // Desktop
        $('#employeeCardDeck').append(`
          <div class="card my-2 employee-card" data-val="${result.data.personnel[i].id}">
            <div class="card-body">
              <span class="float-right"><button class="btn employeeEditButton" data-val="${result.data.personnel[i].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn employeeDeleteButton" data-val="${result.data.personnel[i].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></span>
              <h4 class="card-title m-0">${result.data.personnel[i].firstName} ${result.data.personnel[i].lastName}</h4>
              <h5 class="card-text">${result.data.personnel[i].jobTitle}</h5>
              <p class="card-text m-0">Department: <span class="font-weight-bold">${result.data.personnel[i].department}</span></p>
              <p class="card-text m-0">Location: <span class="font-weight-bold">${result.data.personnel[i].location}</span></p>
              <p class="card-text m-0">Email: <span class="font-weight-bold">${result.data.personnel[i].email}</span></p>
            </div>
          </div>
        `);
      }
      // Click event handler for employee cards
      $('.employee-card').click(function () {
        $(this).toggleClass("selected-card");
        if ($('.selected-card').length === 0) {
          $('#employeeMassDeleteButtonCard').addClass('d-md-none');
          $('#employeeMassDeleteButtonCard').removeClass('d-md-inline');
        } else {
          $('#employeeMassDeleteButtonCard').removeClass('d-md-none');
          $('#employeeMassDeleteButtonCard').addClass('d-md-inline');
        }
      });
      // Click event handler for employee table rows
      $('.employeeTableRow').click(function () {
        $(this).toggleClass("selected-row");
        if ($('.selected-row').length === 0) {
          $('#employeeMassDeleteButtonTable').addClass('d-none');
          $('#employeeMassDeleteButtonTable').removeClass('d-sm-inline');
        } else {
          $('#employeeMassDeleteButtonTable').removeClass('d-none');
          $('#employeeMassDeleteButtonTable').addClass('d-sm-inline');
        }
      });
      // Mass delete card button
      $('#employeeMassDeleteButtonCard').click(function () {
        $('#employeeMassDeleteBody').empty();
        $('#employeeMassDelete').modal('toggle');
        $('#employeeMassDeleteBody').append(`
        <h4>Are you sure you want to delete ${$('.selected-card').length} rows?</h4>
        <hr>
        <button class="btn btn-primary float-right px-5" id="employeeMassDeleteConfirm">Delete</button>
        <button class="btn btn-danger float-right mx-2" onclick="$('#employeeMassDelete').modal('toggle');">Cancel</button>
        `);
        $('#employeeMassDeleteConfirm').click(function () {
          let selected = [];
          for(let i=0; i<$('.selected-card').length;i++){
            selected.push($('.selected-card')[i].attributes[1].value);
          }
          console.log(selected);
          $.ajax({
            url: 'php/deleteMassEmployees.php',
            dataType: 'json',
            type: 'POST',
            data: {
              ids: selected
            },
            success: function (result) {
              $('#employeeMassDelete').modal('toggle');
              refreshTables();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            }
          });
        });
      });
      // Mass delete table button
      $('#employeeMassDeleteButtonTable').click(function () {
        $('#employeeMassDeleteBody').empty();
        $('#employeeMassDelete').modal('toggle');
        $('#employeeMassDeleteBody').append(`
        <h4>Are you sure you want to delete ${$('.selected-row').length} rows?</h4>
        <hr>
        <button class="btn btn-primary float-right px-5" id="employeeMassDeleteConfirm">Delete</button>
        <button class="btn btn-danger float-right mx-2" onclick="$('#employeeMassDelete').modal('toggle');">Cancel</button>
        `);
        $('#employeeMassDeleteConfirm').click(function () {
          let selected = [];
          for(let i=0; i<$('.selected-row').length;i++){
            selected.push($('.selected-row')[i].attributes[1].value);
          }
          $.ajax({
            url: 'php/deleteMassEmployees.php',
            dataType: 'json',
            type: 'POST',
            data: {
              ids: selected
            },
            success: function (result) {
              $('#employeeMassDelete').modal('toggle');
              refreshTables();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            }
          });
        });
      });
      // Add modal
      $('#employeeAddButton').click(function () {
        $.ajax({
          url: 'php/getDepartments.php',
          dataType: 'json',
          type: 'GET',
          success: function (result) {
            $('#employeeAddBody').empty();
            $('#employeeAdd').modal('toggle');
            $('#employeeAddBody').append(employeeForm(result.data.departments, '#employeeAdd', 'Add'));
            $("form[name='employeeAdd']").validate({
              rules: {
                firstName: {
                  required: true,
                  minlength: 2
                },
                lastName: {
                  required: true,
                  minlength: 2
                },
                email: {
                  required: true,
                  email: true
                },
                department: {
                  required: true,
                },
                jobTitle: {
                  required: true,
                  minlength: 2
                }
              },
              messages: {
                firstName: "Please enter a first name",
                lastName: "Please enter a last name",
                jobTitle: "Please enter a job title",
                department: "Please select a valid department",
                email: "Please enter a valid email address",
              },
              submitHandler: function (form) {
                $.ajax({
                  url: 'php/insertEmployee.php',
                  type: 'POST',
                  dataType: 'text',
                  data: {
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    department: $('#department').val(),
                    jobTitle: $('#jobTitle').val(),
                  },
                  success: function (result) {
                    $('#employeeAdd').modal('toggle');
                    refreshTables();
                  }
                })
              }
            })
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        })
      });
      // Delete modal
      $('.employeeDeleteButton').click(function (e) {
        e.stopPropagation();
        $('#employeeDelete').modal('toggle');
        $.ajax({
          url: 'php/getEmployee.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          beforeSend: function () {
            $('#employeeDeleteBody').empty();
          },
          success: function (result) {
            
            $('#employeeDeleteBody').append(`
              <h4>Are you sure you want to delete?</h4>
              <h5>${result.employee[0].firstName} ${result.employee[0].lastName}</h5>
              <hr>
              <button class="btn btn-primary float-right px-5" id="employeeDeleteConfirm">Delete</button>
              <button class="btn btn-danger float-right mx-2" onclick="$('#employeeDelete').modal('toggle');">Cancel</button>
            `);
            $('#employeeDeleteConfirm').click(function () {
              $.ajax({
                url: 'php/deleteEmployee.php',
                type: 'POST',
                dataType: 'text',
                data: {
                  id: e.target.attributes[1].value
                },
                success: function () {
                  $('#employeeDelete').modal('toggle');
                  refreshTables();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                }
              });
            });
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        })
      });
      // Edit modal
      $('.employeeEditButton').click(function (e) {
        e.stopPropagation();
        $('#employeeEdit').modal('toggle');
        $.ajax({
          url: 'php/getEmployee.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          success: function (result) {
            
            $('#employeeEditBody').append(employeeForm(result.departments, '#employeeEdit', 'Edit'));
            $('#firstName').val(result.employee[0].firstName);
            $('#lastName').val(result.employee[0].lastName);
            $('#email').val(result.employee[0].email);
            $('#jobTitle').val(result.employee[0].jobTitle);
            $('#department').val(result.employee[0].department);
            $("form[name='employeeEdit']").validate({
              rules: {
                firstName: {
                  required: true,
                  minlength: 2
                },
                lastName: {
                  required: true,
                  minlength: 2
                },
                email: {
                  required: true,
                  email: true
                },
                department: {
                  required: true,
                },
                jobTitle: {
                  required: true,
                  minlength: 2
                }
              },
              messages: {
                firstName: "Please enter a first name",
                lastName: "Please enter a last name",
                jobTitle: "Please enter a job title",
                department: "Please select a valid department",
                email: "Please enter a valid email address",
              },
              submitHandler: function (form) {
                $.ajax({
                  url: 'php/editEmployee.php',
                  type: 'POST',
                  dataType: 'text',
                  data: {
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    department: $('#department').val(),
                    jobTitle: $('#jobTitle').val(),
                    id: result.employee[0].id
                  },
                  success: function (result) {
                    $('#employeeEdit').modal('toggle');
                    refreshTables();
                  }
                })
              }
            })
          },
          beforeSend: function (result) {
            $('#locationEditBody').empty();
            $('#departmentEditBody').empty();
            $('#employeeEditBody').empty();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      });
      // Department table
      for (var j = 0; j < result.data.departments.length; j++) {
        // Mobile
        $('#departmentBody').append(`
          <tr>
            <td><button class="btn departmentEditButton" data-val="${result.data.departments[j].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn departmentDeleteButton" data-val="${result.data.departments[j].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></td>
            <td>${result.data.departments[j].name}</td>
            <td>${result.data.departments[j].location}</td>
          <tr>
        `);
        // Desktop
        $('#departmentCardDeck').append(`
          <div class="card my-2">
            <div class="card-body department-card">
              <span class="float-right"><button class="btn departmentEditButton" data-val="${result.data.departments[j].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn departmentDeleteButton" data-val="${result.data.departments[j].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></span>
              <h4 class="card-title m-0">${result.data.departments[j].name}</h4>
              <h5 class="card-text">${result.data.departments[j].location}</h5>
            </div>
          </div>
        `);
      }
      // Delete modal
      $('.departmentDeleteButton').click(function (e) {
        e.stopPropagation();
        $('#departmentDelete').modal('toggle');
        $.ajax({
          url: 'php/getDepartment.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          beforeSend: function () {
            $('#departmentDeleteBody').empty();
          },
          success: function (result) {
            
            if (result.data.departments.count === "0") {
              $('#departmentDeleteBody').append(`
              <h4>Are you sure you want to delete?</h4>
              <h5>${result.data.departments[0].name}</h5>
              <hr>
              <div class="d-flex justify-content-end">
                <button class="btn btn-danger mx-2" onclick="$('#departmentDelete').modal('toggle');">Cancel</button>
                <button class="btn btn-primary px-5" id="departmentDeleteConfirm">Delete</button>
              </div>
            `);
              $('#departmentDeleteConfirm').click(function () {
                $.ajax({
                  url: 'php/deleteDepartment.php',
                  type: 'POST',
                  dataType: 'text',
                  data: {
                    id: e.target.attributes[1].value
                  },
                  success: function () {
                    $('#departmentDelete').modal('toggle');
                    refreshTables();
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                  }
                });
              });
            } else {
              $('#departmentDeleteBody').append(`<div class="alert alert-danger d-block my-3" role="alert">Personnel rows depend on this department! Please delete dependants first.</div><button class="btn btn-primary float-right" onclick="$('#departmentDelete').modal('toggle');">Close</button>`);
            }

          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        })
      });
      // Add modal
      $('#departmentAddButton').click(function () {
        $.ajax({
          url: 'php/getLocations.php',
          dataType: 'json',
          type: 'GET',
          success: function (result) {
            $('#departmentAddBody').empty();
            $('#departmentAdd').modal('toggle');
            $('#departmentAddBody').append(departmentForm(result.data.locations, '#employeeAdd', 'Add'));
            $("form[name='departmentAdd']").validate({
              rules: {
                department: {
                  required: true,
                },
                location: {
                  required: true,
                }
              },
              messages: {
                department: "Please enter a department name",
                location: "Please select a location"
              },
              submitHandler: function (form) {
                $.ajax({
                  url: 'php/insertDepartment.php',
                  type: 'POST',
                  dataType: 'text',
                  data: {
                    department: $('#department').val(),
                    location: $('#location').val(),
                  },
                  success: function (result) {
                    $('#departmentAdd').modal('toggle');
                    refreshTables();
                  }
                })
              }
            })
          },
          error: function (result) {

          }
        });
      });
      // Edit modal
      $('.departmentEditButton').click(function (e) {
        e.stopPropagation();
        $('#departmentEdit').modal('toggle');
        $.ajax({
          url: 'php/getDepartment.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          success: function (result) {
            $('#departmentEditBody').append(departmentForm(result.data.locations, '#departmentEdit', 'Edit'));
            $('#department').val(result.data.departments[0].name);
            $('#location').val(result.data.departments[0].locationName);
            $("form[name='departmentEdit']").validate({
              rules: {
                department: {
                  required: true,
                },
                location: {
                  required: true,
                }
              },
              messages: {
                department: "Please enter a valid department",
                location: "Please select a valid location",
              },
              submitHandler: function (form) {
                $.ajax({
                  url: 'php/editDepartment.php',
                  type: 'POST',
                  dataType: 'text',
                  data: {
                    department: $('#department').val(),
                    location: $('#location').val(),
                    id: result.data.departments[0].id
                  },
                  success: function (result) {
                    $('#departmentEdit').modal('toggle');
                    refreshTables();
                  }
                })
              }
            })
          },
          beforeSend: function (result) {
            $('#locationEditBody').empty();
            $('#departmentEditBody').empty();
            $('#employeeEditBody').empty();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      });
      // Location table
      for (var k = 0; k < result.data.locations.length; k++) {
        // Mobile
        $('#locationBody').append(`
          <tr>
            <td><button class="btn locationEditButton" data-val="${result.data.locations[k].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn locationDeleteButton" data-val="${result.data.locations[k].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></td>
            <td>${result.data.locations[k].name}</td>
          <tr>
        `);
        // Desktop
        $('#locationCardDeck').append(`
            <div class="card location-card my-2">
              <div class="card-body">
                <span class="float-right"><button class="btn locationEditButton" data-val="${result.data.locations[k].id}"><i class="far fa-edit" style="pointer-events:none;"></i></button><button class="btn locationDeleteButton" data-val="${result.data.locations[k].id}"><i class="far fa-trash-alt" style="pointer-events:none;"></i></button></span>
                <h4 class="card-title m-0">${result.data.locations[k].name}</h4>
              </div>
            </div>
          `);
      }
      // Delete modal
      $('.locationDeleteButton').click(function (e) {
        e.stopPropagation();
        $('#locationDelete').modal('toggle');
        $.ajax({
          url: 'php/getLocation.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          beforeSend: function () {
            $('#locationDeleteBody').empty();
          },
          success: function (result) {
            if (result.data.count === "0") {
              $('#locationDeleteBody').append(`
              <h4>Are you sure you want to delete?</h4>
              <h5>${result.data.locations[0].name}</h5>
              <hr>
              <div class="d-flex justify-content-end">
                <button class="btn btn-danger mx-2" onclick="$('#locationDelete').modal('toggle');">Cancel</button>
                <button class="btn btn-primary px-5" id="locationDeleteConfirm">Delete</button>
              </div>
            `);
              $('#locationDeleteConfirm').click(function () {
                $.ajax({
                  url: 'php/deleteLocation.php',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    id: result.data.locations[0].id
                  },
                  success: function () {
                    $('#locationDelete').modal('toggle');
                    refreshTables();
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                  }
                });
              });
            } else {
              $('#locationDeleteBody').append(`<div class="alert alert-danger d-block my-3" role="alert">Department rows depend on this location! Please delete dependants first.</div><button class="btn btn-primary float-right" onclick="$('#locationDelete').modal('toggle');">Close</button>`);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        })
      });
      // Add modal
      $('#locationAddButton').click(function () {
        $('#locationAddBody').empty();
        $('#locationAdd').modal('toggle');
        $('#locationAddBody').append(locationForm('#locationAdd', 'Add'));
        $("form[name='locationAdd']").validate({
          rules: {
            department: {
              required: true,
            },
            location: {
              required: true,
            }
          },
          messages: {
            location: "Please enter a location"
          },
          submitHandler: function (form) {
            $.ajax({
              url: 'php/insertLocation.php',
              type: 'POST',
              dataType: 'json',
              data: {
                location: $('#location').val(),
              },
              success: function (result) {
                $('#locationAdd').modal('toggle');
                refreshTables();
              }
            })
          }
        });
      });
      // Edit modal
      $('.locationEditButton').click(function (e) {
        e.stopPropagation();
        $('#locationEdit').modal('toggle');
        $.ajax({
          url: 'php/getLocation.php',
          dataType: 'json',
          type: 'GET',
          data: {
            id: e.target.attributes[1].value
          },
          success: function (result) {
            
            $('#locationEditBody').append(locationForm('#locationEdit', 'Edit'));
            $('#location').val(result.data.locations[0].name);
            $("form[name='locationEdit']").validate({
              rules: {
                location: {
                  required: true,
                }
              },
              messages: {
                location: "Please select a valid location",
              },
              submitHandler: function (form) {
                $.ajax({
                  url: 'php/editLocation.php',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    location: $('#location').val(),
                    id: result.data.locations[0].id
                  },
                  success: function (result) {
                    $('#locationEdit').modal('toggle');
                    refreshTables();
                  }
                })
              }
            })
          },
          beforeSend: function (result) {
            $('#locationEditBody').empty();
            $('#departmentEditBody').empty();
            $('#employeeEditBody').empty();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}


// Modals

// Employee Form

function employeeForm(departments, modal, type) {
  if (departments && modal && type) {
    var deptOpts = "";
    for (let i = 0; i < departments.length; i++) {
      deptOpts += "<option>" + departments[i].name + "</option>";
    }
    return `
    <form name="employee${type}">
    <div class="form-group">
      <label for="firstName">First name:</label>
      <input type="text" class="form-control" id="firstName" name="firstName" placeholder="First name...">
    </div>
    <div class="form-group">
      <label for="lastName">Last name:</label>
      <input type="text" class="form-control" id="lastName" name="lastName" placeholder="Last name...">
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" class="form-control" id="email" name="email" placeholder="Email address...">
    </div>
    <div class="form-group">
      <label for="jobTitle">Job title:</label>
      <input type="text" class="form-control" id="jobTitle" name="jobTitle" placeholder="Job title...">
    </div>
    <div class="form-group">
      <label for="department">Department:</label>
      <select class="form-control" id="department" name="department">
        ${deptOpts}
      </select>
    </div>
    <hr>
    <button type="submit" class="btn btn-primary float-right px-5">${type}</button>
    <button type="button" class="btn btn-danger float-right mx-2" onclick="$('${modal}').modal('toggle');">Cancel</button>
    </form>
    `;
  }
}

function departmentForm(locations, modal, type) {
  if (locations && modal && type) {
    var locOpts = "";
    for (let i = 0; i < locations.length; i++) {
      locOpts += "<option>" + locations[i].name + "</option>";
    }
  }
  return `
  <form name="department${type}">
    <div class="form-group">
      <label for="department">Department name: </label>
      <input type="text" class="form-control" id="department" name="department" placeholder="Department name...">
    </div>
    <div class="form-group">
      <label for="location">Location:</label>
      <select class="form-control" id="location" name="location">
        ${locOpts}
      </select>
    </div>
    <hr>
    <button type="submit" class="btn btn-primary float-right px-5">${type}</button>
    <button type="button" class="btn btn-danger float-right mx-2" onclick="$('${modal}').modal('toggle');">Cancel</button>
  </form>
  `;
}

function locationForm(modal, type) {
  return `
  <form name="location${type}">
    <div class="form-group">
      <label for="location">Location name: </label>
      <input type="text" class="form-control" id="location" name="location" placeholder="Location name...">
    </div>
    <hr>
    <button type="submit" class="btn btn-primary float-right px-5">${type}</button>
    <button type="button" class="btn btn-danger float-right mx-2" onclick="$('${modal}').modal('toggle');">Cancel</button>
  </form>
  `;
}

$(document).ready(function () {
  //preloader
  if ($('#preloader').length) {
    $('#preloader').delay(500).fadeOut('slow', function () {
      $(this).remove();
    });
  }

  // Search event handler
  $('#searchBar').keyup(function () {
    $('.employee-card').removeClass('d-none');
    var filter = $(this).val();
    $('#employeeCardDeck').find('.card .card-body h4:not(:contains("' + filter + '"))').parent().parent().addClass('d-none');
  });

  $('#searchBarMobile').keyup(function(){
    var filter = $(this).val().toLowerCase();
    $('#employeeTable tbody tr').filter(function(){
      $(this).toggle($(this).text().toLowerCase().indexOf(filter) > -1);
    });
  });
  // Load tables
  refreshTables();


});