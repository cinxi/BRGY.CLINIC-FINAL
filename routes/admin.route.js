

//admin.route.js

const express = require("express");
const admin_Controller = require("../controller/admin.controller.js");
const addPatientController = require("../controller/addPatient.controller.js");
const appointmentController = require("../controller/appointment.controller.js");
const patient_Controller = require("../controller/patient.controller.js");

const router = express.Router();

// Admin Routes


router.get("/admin/patients", patient_Controller.patients_view);
router.get("/admin/landing", admin_Controller.landing_view);
router.get("/admin/Admindashboard", admin_Controller.Admindashboard_view);
router.get("/admin/usermanagement", admin_Controller.usermanagement_view);
router.get("/admin/reports", admin_Controller.reports_view);
router.get("/admin/logs", admin_Controller.logs_view);

// Staff Routes
router.get("/staff/Staffdashboard", admin_Controller.Staffdashboard_view);
router.get("/staff/appointment", appointmentController.appointment_view); 
router.get("/staff/patients", addPatientController.patients_view);


// Add new appointment
router.post("/staff/appointment", appointmentController.save_addAppointment);

// (Admin) Add new user
router.post("/admin/addUser", admin_Controller.addUser);

// Add Patient Route
router.post("/staff/addPatient", addPatientController.save_addPatient);

// Get total clinic staff
router.get("/admin/getTotalClinicStaff", admin_Controller.getTotalClinicStaff);

// Fetch total number of patients
router.get("/staff/getTotalPatients", addPatientController.getTotalPatients);

// Edit user
router.get("/admin/editUser/:id", admin_Controller.editUser);
router.post("/admin/editUser/:id", admin_Controller.updateUser);

// // Delete user
// router.get("/admin/deleteUser/:id", admin_Controller.deleteUser);

// Update User route
router.post("/admin/editUser/:id", admin_Controller.updateUser);


router.get("/admin/getTotalActiveClinicStaff", admin_Controller.getTotalActiveClinicStaff);
router.get('/admin/getTotalActivePatients', admin_Controller.getTotalActivePatients);


// Route for fetching appointment metrics
router.get('/api/appointments/metrics', appointmentController.fetchAppointmentMetrics);

router.get('/admin/getRecentappointments', admin_Controller.getRecentAppointments);

router.get('/admin/getRecentPatients', admin_Controller.getRecentPatients);

module.exports = router;
