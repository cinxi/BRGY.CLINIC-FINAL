
// admin.conroller.js


const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");




// Other controller

const landing_view = (req, res) => {
    res.render("admin/landing");
};
const Admindashboard_view = (req, res) => {
    res.render("admin/Admindashboard");
};

const reports_view = (req, res) => {
    res.render("admin/reports");
};


const logs_view = async (req, res) => {
    const message = req.query.message || null;

    try {
        // Fetch patients' data
        const patients = await models.Patient.findAll({
            attributes: ['Patient_ID', 'Patient_FirstName', 'Patient_LastName']
        });

        const patientList = patients.map(patient => ({
            id: patient.Patient_ID,
            name: `${patient.Patient_FirstName} ${patient.Patient_LastName}`
        }));

        // Fetch appointments data with createdAt and updatedAt
        const appointments = await models.Appointment.findAll({
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }],
            attributes: [
                'Appointment_ID', 
                'Appointment_Date', 
                'Appointment_Time', 
                'Appointment_Purpose', 
                'Appointment_Status', 
                'createdAt',  // Include createdAt
                'updatedAt'   // Include updatedAt
            ]
        });

        // Format the appointment data
        const appointmentList = appointments.map(appointment => ({
            id: appointment.Appointment_ID,
            patientName: `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`,
            date: new Date(appointment.Appointment_Date).toLocaleDateString("en-CA"),
            time: appointment.Appointment_Time,
            purpose: appointment.Appointment_Purpose,
            status: appointment.Appointment_Status,
            createdAt: new Date(appointment.createdAt).toLocaleString(), // Format createdAt
            updatedAt: new Date(appointment.updatedAt).toLocaleString()  // Format updatedAt
        }));

        // Debugging logs
        console.log("Patient List:", patientList);
        console.log("Appointment List:", appointmentList);

        res.render("admin/logs", { message, patientList, appointmentList, error: null });
    } catch (error) {
        console.error("Error fetching patients or appointments:", error);
        res.render("admin/logs", { message, patientList: [], appointmentList: [], error: "Failed to load data" });
    }
};


//staff
const Staffdashboard_view = (req, res) => {
    res.render("staff/Staffdashboard");
};

const appointment_view = (req, res) => {
    res.render("staff/appointment");
};

const patients_view = (req, res) => {
    res.render("staff/patients");
};



const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 1000 });
    res.render("login");
};



// Fetch clinic staff users from the ClinicStaff model
const usermanagement_view = (req, res) => {
    models.ClinicStaff.findAll()
    .then(users => {
        res.render("admin/usermanagement", { users }); // Pass user data to the view
    })
    .catch(error => {
        console.error("Error fetching clinic staff users:", error);
        res.render("admin/usermanagement", { users: [] }); // Render with an empty array if there's an error
    });
};


// Fetch total clinic staff users
const getTotalClinicStaff = (req, res) => {
    models.ClinicStaff.count()  // Count all clinic staff records in the ClinicStaff table
        .then(totalStaff => {
            res.json({ totalStaff });
        })
        .catch(error => {
            console.error('Error fetching total clinic staff:', error);
            res.status(500).json({ error: 'Unable to fetch data' });
        });
};




// Add new user function
const addUser = (req, res) => {
    const data_addUser = {
        FirstName: req.body.firstName_data,
        LastName: req.body.lastName_data,
        Users_Birthdate: req.body.birthdate_data,
        Users_Gender: req.body.gender_data,
        ContactNumber: req.body.contactNumber_data,
        Users_Status: req.body.status,
        Username: req.body.Username_data,
        Password: req.body.Password_data,
    };

    // Hash the password before saving
    data_addUser.Password = bcrypt.hashSync(data_addUser.Password, 10);
    console.log("Hashed password:", data_addUser.Password);

    // Insert data into the ClinicStaff table
    models.ClinicStaff.create(data_addUser)
        .then(result => {
            console.log("New user added successfully:", result);
            res.redirect("/admin/usermanagement?message=UserAdded");
        })
        .catch(error => {
            console.error("Error adding new user:", error);
            res.redirect("/admin/usermanagement?message=UsernameAlreadyExist!");
        });
};


// Edit User
const editUser = (req, res) => {
    const userId = req.params.id;
    models.ClinicStaff.findOne({
        where: { Users_ID: userId }
    })
    .then(user => {
        if (user) {
            res.render("admin/editUser", { user });  // Pass the user object to the view
        } else {
            res.redirect("/admin/usermanagement?message=UserNotFound");
        }
    })
    .catch(error => {
        console.error("Error fetching user for edit:", error);
        res.redirect("/admin/usermanagement?message=ServerError");
    });
};


// Update User Data
const updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedData = {
        FirstName: req.body.firstName_data,
        LastName: req.body.lastName_data,
        ContactNumber: req.body.contactNumber_data,
        Users_Status: req.body.status,
    };

    models.ClinicStaff.update(updatedData, {
        where: { Users_ID: userId }
    })
    .then(() => {
        res.redirect("/admin/usermanagement?message=UserUpdated");
    })
    .catch(error => {
        console.error("Error updating user:", error);
        res.redirect("/admin/usermanagement?message=ServerError");
    });
};

// // Delete User
// const deleteUser = (req, res) => {
//     const userId = req.params.id;
//     models.user.destroy({
//         where: { Users_ID: userId }
//     })
//     .then(() => {
//         res.redirect("/admin/usermanagement?message=UserDeleted");
//     })
//     .catch(error => {
//         console.error("Error deleting user:", error);
//         res.redirect("/admin/usermanagement?message=ServerError");
//     });
// };


module.exports = {
    Admindashboard_view,
    usermanagement_view,
    logs_view,
    Staffdashboard_view,
    appointment_view,
    patients_view,
    logout,
    addUser,
    getTotalClinicStaff,
    editUser,
    updateUser,
    // deleteUser,
    landing_view,
    reports_view
    
};
