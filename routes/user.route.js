// //user.route.js

// const express = require("express")
// const userController = require("../controller/user.controller.js")
// const auth = require("../middleware/auth.js")

// const router = express.Router()


// //get
// router.get("/login",  auth.check_user_not_auth, userController.login_view   ) 
// router.get("/register", auth.check_user_not_auth, userController.register_view )

// //post
// router.post("/register-user" , auth.check_user_not_auth, userController.save_user )
// router.post("/login-user" , auth.check_user_not_auth, userController.login_user )




// module.exports = router




//user.route.js

const express = require("express")
const userController = require("../controller/user.controller.js")
const addPatientController = require("../controller/addPatient.controller.js")
const appointmentController = require("../controller/appointment.controller.js"); 

const router = express.Router()


//get
router.get("/login", userController.login_view   ) 
router.get("/register", userController.register_view )


router.get("/addUser", userController.addUser_view )

router.get("/addPatient", addPatientController.patients_view )
router.get("/appointment", appointmentController.appointment_view )



//post
router.post("/register-user" , userController.save_user )
router.post("/login-user" , userController.login_user )


router.post("/staff/addPatient", addPatientController.save_addPatient);
router.get("/staff/patient", addPatientController.patients_view);


// // Edit Patient Route
// router.get("/staff/editPatient/:id", addPatientController.editPatient);
// router.post("/staff/editPatient/:id", addPatientController.updatePatient);


// Delete Patient Route
router.get("/staff/deletePatient/:id", addPatientController.deletePatient);


// //update patient

// router.post("/staff/updatePatient", addPatientController.updatePatient);

// Update patient status
router.post("/staff/updatePatientStatus", addPatientController.updatePatientStatus);



//APPOINTMENT

// Route to edit an appointment (GET)
router.get("/staff/editAppointment/:id", appointmentController.editAppointment_view);

// Route to update an appointment (POST)
router.post("/staff/editAppointment/:id", appointmentController.save_editAppointment);

// Route to delete an appointment (GET)
router.get("/staff/deleteAppointment/:id", appointmentController.deleteAppointment);



// GET route to display staff login page
router.get("/staff/login", userController.login_staff_view);

// POST route to handle staff login
router.post("/staff/login-staff", userController.login_staff);



module.exports = router

