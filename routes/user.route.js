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

const appointmentController = require("../controller/appointment.controller.js");  // Corrected typo

const router = express.Router()


//get
router.get("/login", userController.login_view   ) 
router.get("/register", userController.register_view )

router.get("/addUser", userController.addUser_view )
router.get("/addPatient", addPatientController.patients_view )

router.get("/saveappointment", appointmentController.appointment_view )




//post
router.post("/register-user" , userController.save_user )
router.post("/login-user" , userController.login_user )



router.post("/admin/addPatient", addPatientController.save_addPatient);
// router.post("/staff/appointment", appointmentController.save_addAppointment);




module.exports = router

