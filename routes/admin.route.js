// //admin.route.js

// const express = require("express")
// const admin_Controller = require("../controller/admin.controller.js")
// const auth = require("../middleware/auth.js")

// const router = express.Router()

 
// //get

// router.get("/Admindashboard", auth.check_user_auth, admin_Controller.Admindashboard_view)
// router.get("/usermanagement",  auth.check_user_auth, admin_Controller.usermanagement_view)
// router.get("/logs",  auth.check_user_auth, admin_Controller.logs_view)


// //staff
// router.get("/Staffdashboard",  auth.check_user_auth, admin_Controller.Staffdashboard_view)
// router.get("/appointment",  auth.check_user_auth, admin_Controller.appointment_view)
// router.get("/patients",  auth.check_user_auth, admin_Controller.patients_view)


// router.get("/logout", auth.check_user_auth, admin_Controller.logout)

// module.exports = router


//admin.route.js

const express = require("express");
const admin_Controller = require("../controller/admin.controller.js");
const addPatientController = require("../controller/addPatient.controller.js");
const appointmentController = require("../controller/appointment.controller.js");

const router = express.Router();

// Admin Routes

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




module.exports = router;
