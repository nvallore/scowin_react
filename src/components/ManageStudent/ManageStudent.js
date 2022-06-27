import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import './manageStudent.css';
import Table from '../common/table/table';
import { columnStudents } from '../../data/studentData';
import Button from 'react-bootstrap/Button'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { useForm, Controller } from "react-hook-form";
import * as studentDetailsService from '../../services/manage-students-service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Styling for popup modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ManageStudent() {

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, control } = useForm(
    { mode: "onChange" }
  );
  const [isEditFlow, setEditFlow] = useState(false);
  const startDate = new Date('01/01/2005');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailsOpen, setdetailsOpen] = useState(false);
  const [studentData, setStudentsDetailsData] = useState([]);
  const [excelUploadStudentData, setexcelUploadStudentData] = useState([]);

  // To show modal for bulk upload
  const showModal = () => {
    setModalIsOpen(true);
  };

  // To close bulk upload modal
  const closeModal = () => { setModalIsOpen(false); };

  // To show modal to add/edit student details
  const showDetails = () => { setdetailsOpen(true); }

  // To close modal and reset the modal form data
  const closeDetails = () => {
    setEditFlow(false);
    setdetailsOpen(false);
    reset();
  }

  // Submiting data to create or edit student on click of submit in popup modal
  const submitDetails = (data) => {
    data = {
      ...data
    };
    if (!isEditFlow) {
      // Creating and submitting data for creating student details
      studentDetailsService.addStudent(data).then(
        _ => {
          closeDetails();
          studentDetailsService.getStudentsDetails().then(
            res => setStudentsDetailsData(res)
          )
        }
      ).catch(error => {
        document.getElementById("add-error-message").innerText = "Record with this ID is already present, please verify and try again.";
      }
      );
    } else {
      // Creating and submitting data for editing student details based on ID
      studentDetailsService.editStudentDetails(data).then(
        _ => {
          closeDetails();
          studentDetailsService.getStudentsDetails().then(
            res => setStudentsDetailsData(res)
          )
        }
      ).catch(error => {
        document.getElementById("add-error-message").innerText = "There is some issue with the Network please reload and try again.";
      });
    }
  };

  // Open popup modal and setup form data when clicked on edit 
  const editClicked = (editRowData) => {
    columnStudents.forEach((header) => {
      setValue(header.field, editRowData[header.field]);
    });
    setEditFlow(true);
    showDetails();
  };

  // Download excel template for bulk upload
  const downloadTemplate = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'bulkUpload'
    const csvData = [{ id: '', studentName: '', dob: '', gender: '', bloodGroup: '', grade: '', section: '', aadharID: '', existingComorbidites: '' }]
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    closeModal();
  };

  const fileReader = (event) => {
    let fileObj = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array", cellText: false, cellDates: true });
      let firstSheet = workbook.SheetNames[0];
      const elements = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
      validateExcelData(elements);
    };
    reader.readAsArrayBuffer(fileObj);
  };

  const validateExcelData = (excelData) => {
    let formatedError = "<ul>";
    let validData = [];
    excelData.forEach((row, index) => {
      let isRowValid = true;
      if (row['id'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: id, 
              Error: Field is required
            </li>`
        );
      } else if (row['id'].toString().length > 5 || row['id'].toString().length < 1) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: id, 
              Error: Maximum value is 5, ex. 88777
            </li>`
        );
      }
      if (row['studentName'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: studentName, 
              Error: Field is required
            </li>`
        );
      } else if (!(/^[a-zA-Z ]*$/.test(row['studentName']))) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: studentName,
              Error: Value doesn't match the correct validation
            </li>`
        );
      }
      if (row['dob'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: dob, 
              Error: Field is required
            </li>`
        );
      } else if (!((new Date().getFullYear() - new Date(row['dob'].toString()).getFullYear()) > 10)) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: dob, 
              Error: Age should be more than 10 and date format should be YYYY-MM-DD
            </li>`
        );
      }
      if (row['gender'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: gender, 
              Error: Field is required
            </li>`
        );
      } else if (!(['Male', 'Female', 'Other'].includes(row['gender']))) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: gender, 
              Error: Value should be Male, Female or Other
            </li>`
        );
      }
      if (row['bloodGroup'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: bloodGroup, 
              Error: Field is required
            </li>`
        );
      } else if (!(/^(A|B|AB|O)[+-]$/.test(row['bloodGroup']))) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: bloodGroup, 
              Error: Value doesn't match the correct validation, eg. A+, B+, AB+
            </li>`
        );
      }
      if (row['grade'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: grade, 
              Error: Field is required
            </li>`
        );
      } else if (!(row['grade'] >= 1 || row['grade'] < 11)) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: grade, 
              Error: Grade should be between 1 to 10
            </li>`
        );
      }
      if (row['section'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: section, 
              Error: Field is required
            </li>`
        );
      } else if (!(['A', 'B'].includes(row['section']))) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: section, 
              Error: section should be A or B
            </li>`
        );
      }
      if (row['aadharID'] === undefined) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: aadharID, 
              Error: Field is required
            </li>`
        );
      } else if (!(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(row['aadharID']))) {
        isRowValid = false;
        formatedError = formatedError.concat(`
            <li>
              Row Number:${index} ,Field: aadharID, 
              Error: Value doesn't match the required pattern
            </li>`
        );
      }
      if (isRowValid) {
        validData.push(row);
      }
    })
    formatedError = formatedError.concat("</ul>");
    document.getElementById("excel-upload-errors").innerHTML = formatedError;
    document.getElementById("excel-warning-message").innerText = "Errors if any will be neglected and the remaining data will be created";
    if (validData.length < 1) {
      document.getElementById("excel-upload-submit").disabled = true;
    } else {
      document.getElementById("excel-upload-submit").disabled = false;
    }
    setexcelUploadStudentData(validData);
  }

  const excelUploadSubmit = () => {
    studentDetailsService.addStudent(excelUploadStudentData).then(
      response => {
        closeModal();
        studentDetailsService.getStudentsDetails().then(
          res => setStudentsDetailsData(res)
        )
      }
    ).catch(error => {
      document.getElementById("excel-error-message").innerText = "Records with Duplicate ID's found please review the excel data and try again";
      document.getElementById("excel-upload-submit").disabled = true;
    }
    );
  }

  useEffect(() => {
    studentDetailsService.getStudentsDetails().then(
      res => setStudentsDetailsData(res)
    )
  }, []);

  return (
    <Fragment>
      <div>
        <div className='button-section'>
          <Button className='vaccination-drive-button' onClick={showModal}>Upload Students</Button>
          <Button className='vaccination-drive-button' onClick={showDetails}>Add New Student</Button>
        </div>
        <Modal
          open={modalIsOpen}
          onClose={closeModal}
        >
          <Box sx={style}>
            <div className='popup-section'>
              <h5 className='popup-header'>Upload Students Details</h5>
            </div>
            <div className='upload-students-content'>
              <p>Upload Student details Excel by filling all details in the below template</p>
              <input type="file" onChange={fileReader} className='upload-file' accept=".xlsx, .xls" />
              <div id="errorFile" className="errorFile"></div>
              <p className='download-template' onClick={downloadTemplate}>Download Template</p>
              <div id="excel-upload-errors" className="errorFile"></div>
              <div id="excel-warning-message" className="uploadWarning"></div>
              <Button id="excel-upload-submit" onClick={excelUploadSubmit} disabled={excelUploadStudentData.length === 0} className='submit-button'>Submit</Button>
              <div id="excel-error-message" className="errorFile"></div>
            </div>
          </Box>
        </Modal>
        <Modal
          open={detailsOpen}
          onClose={closeDetails}
        >
          <Box sx={style}>
            <div className='popup-section'>
              <h5 className='popup-header'>{isEditFlow ? 'Update Student Details' : 'Add Student Details'}</h5>
            </div>
            <form onSubmit={handleSubmit(submitDetails)}>
              <input className="form-input" type="number" disabled={isEditFlow} placeholder="Student ID" {...register("id", {
                required: "This is a required field", maxLength: {
                  value: 5,
                  message: "Maximum value is 5, ex. 88777"
                }
              })} />
              {errors.id && <p className='alert-danger'>{errors.id.message}</p>}
              <input className="form-input" type="text" placeholder="Enter Name" {...register("studentName", {
                required: "This is a required field.", pattern: {
                  value: /^[a-zA-Z ]*$/,
                  message: "Value doesn't match the correct validation"
                }
              })} />
              {errors.studentName && <p className='alert-danger'>{errors.studentName.message}</p>}
              <div className='form-select-section'>
                <label>Date of Birth</label>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <DatePicker
                      id="dob"
                      className="form-input"
                      placeholderText="Select DOB"
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      startDate={startDate}
                      maxDate={new Date('2015/12/31')}
                    />
                  )}
                  rules={{ required: true }}
                />
                {errors.dob && <p className='alert-danger'>{errors.dob.message}</p>}
              </div>
              <div className='gender-class'>
                <label>Gender</label>
                <input type="radio" value="Male" className="gender" name="gender" id="male"  {...register("gender", { required: "This is a required field" })} /> Male
                <input type="radio" value="Female" className="gender" name="gender" id="female"  {...register("gender")} /> Female
                <input type="radio" value="Other" className="gender" name="gender" id="other"  {...register("gender")} /> Other
                {errors.gender && <p className='alert-danger'>{errors.gender.message}</p>}
              </div>
              <input className="form-input" type="text" placeholder="Blood Group" {...register("bloodGroup", {
                required: "This is a required field", pattern: {
                  value: /^(A|B|AB|O)[+-]$/,
                  message: "Value doesn't match the correct validation, eg. A+, B+, AB+"
                }
              })} />
              {errors.bloodGroup && <p className='alert-danger'>{errors.bloodGroup.message}</p>}
              <div className='form-select-section'>
                <label> Grade </label>
                <select className="form-select" id="grade" {...register("grade", { required: "This is a required field" })}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
                {errors.grade && <p className='alert-danger'>{errors.grade.message}</p>}
              </div>
              <div className='form-select-section'>
                <label>Section</label>
                <select className="form-select" {...register("section", { required: "This is a required field" })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
                {errors.section && <p className='alert-danger'>{errors.section.message}</p>}
              </div>
              <input className="form-input" id="aadhar" type="number" placeholder="Aadhar Card Number" {...register("aadharID", { required: "This is a required field", pattern: { value: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, message: "Value doesn't match the required pattern" } })} />
              {errors.aadharID && <p className='alert-danger'>{errors.aadharID.message}</p>}
              <TextField id="outlined-basic" label="Existing Comorbidites" placeholder='Existing Comorbidites' variant="outlined" multiline rows={5}  {...register("existingComorbidites")} />
              <Button type='submit' className='submit-button' disabled={!isValid} >Submit</Button>
              <div id="add-error-message" className="errorFile"></div>
            </form>
          </Box>
        </Modal>
        <Table columns={columnStudents} rows={studentData} header="Student Details" isEdit={true} parentCallback={editClicked} />
      </div>
    </Fragment>
  )
}
export default ManageStudent;
