
const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const login_view = (req, res) => {
    res.render("patient/login", { message: null }); // Render the login page with no initial message
};


const register_view = (req, res) => {
    res.render("patient/register");
};




const history_view = (req, res) => {
    res.render("patient/history");
};

const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 1000 });
    res.render("login");
};


const registerPatient = async (req, res) => {
    try {
        const { firstName_data, lastName_data, birthdate_data, gender_data, contactNumber_data, Username_data, Password_data, ConfirmPassword_data } = req.body;

        // Check if passwords match
        if (Password_data !== ConfirmPassword_data) {
            return res.render('patient/register', { message: 'Passwords do not match!' });
        }

        // Check if username already exists
        const existingUser = await models.Patient.findOne({ where: { Username: Username_data } });
        if (existingUser) {
            return res.render('patient/register', { message: 'Username is already taken!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password_data, 10);

        // Save new patient to the database
        await models.Patient.create({
        
            Patient_FirstName: req.body.firstName_data,
            Patient_LastName: req.body.lastName_data,
            DateofBirth: req.body.birthdate_data,
            Patient_Gender: req.body.gender_data,
            Patient_ContactNumber: req.body.contactNumber_data,
            Patient_Status: req.body.status,
            Patient_Address: req.body.address_data,
            Username: Username_data,
            Password: hashedPassword,
        });

        // Redirect to login or profile page
        res.redirect('patient/login');  // Or any other route you'd like to redirect to

    } catch (error) {
        console.error(error);
        res.render('patient/register', { message: 'An error occurred. Please try again later.' });
    }
};



const loginPatient = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Check if the user exists
        const user = await models.Patient.findOne({ where: { Username } });
        if (!user) {
            return res.render("patient/login", { message: "Invalid username or password." });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.render("patient/login", { message: "Invalid username or password." });
        }

        // Generate a JWT token with Patient_ID
        const token = jwt.sign(
            {
                id: user.Patient_ID, // Ensure this matches the column name
                username: user.Username,
                firstName: user.Patient_FirstName,
                lastName: user.Patient_LastName,
            },
            "your_secret_key",
            { expiresIn: "1h" }
        );

        // Set the token as a cookie
        res.cookie("token", token, { httpOnly: true });

        // Redirect to the patient's profile or any desired page
        res.redirect("/patient/profile");
    } catch (error) {
        console.error(error);
        res.render("patient/login", { message: "An error occurred. Please try again later." });
    }
};


const profile_view = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        console.log("Decoded Token:", decoded); // Debugging line to inspect the decoded token

        // Fetch full patient details using decoded id
        const patient = await models.Patient.findOne({ where: { Patient_ID: decoded.id } });

        if (!patient) {
            console.error("Patient not found.");
            res.clearCookie("token");
            return res.redirect("/patient/login");
        }

        res.render("patient/profile", {
            firstName: patient.Patient_FirstName || "N/A",
            lastName: patient.Patient_LastName || "N/A",
            gender: patient.Patient_Gender || "N/A",
            birthdate: patient.DateofBirth
                ? patient.DateofBirth.toISOString().split("T")[0]
                : "N/A",
            contactNumber: patient.Patient_ContactNumber || "N/A",
            address: patient.Patient_Address || "N/A",
            status: patient.Patient_Status || "N/A",
        });

    } catch (error) {
        console.error("Error in profile_view:", error.message);
        res.clearCookie("token");
        res.redirect("/patient/login");
    }
};


const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.clearCookie("token");
        res.redirect("/patient/login");
    }
};


const editProfile_view = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        // Fetch patient details from the database
        const patient = await models.Patient.findOne({ where: { Patient_ID: decoded.id } });

        if (!patient) {
            return res.redirect("/patient/login");
        }

        // Render the edit profile view
        res.render("patient/edit", {
            firstName: patient.Patient_FirstName,
            lastName: patient.Patient_LastName,
            gender: patient.Patient_Gender,
            birthdate: patient.DateofBirth.toISOString().split("T")[0], // Convert date to input format
            contactNumber: patient.Patient_ContactNumber,
            address: patient.Patient_Address,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/patient/login");
    }
};

const editProfile = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        // Update the patient details in the database
        await models.Patient.update(
            {
                Patient_FirstName: req.body.firstName,
                Patient_LastName: req.body.lastName,
                Patient_Gender: req.body.gender,
                DateofBirth: req.body.birthdate,
                Patient_ContactNumber: req.body.contactNumber,
                Patient_Address: req.body.address,
            },
            { where: { Patient_ID: decoded.id } }
        );

        res.redirect("/patient/profile");
    } catch (error) {
        console.error(error);
        res.redirect("/patient/profile");
    }
};


const getAppointments = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        const appointments = await models.Appointment.findAll({
            where: { Patient_ID: decoded.id },
            include: [
                {
                    model: models.Patient,
                    as: "Patient",
                    attributes: ["Patient_FirstName", "Patient_LastName"]
                }
            ]
        });

        res.render("patient/appointment", { appointments });
    } catch (error) {
        console.error(error);
        res.redirect("/patient/login");
    }
};

const addAppointment = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        await models.Appointment.create({
            Patient_ID: decoded.id,
            Appointment_Date: req.body.Appointment_Date,
            Appointment_Time: req.body.Appointment_Time,
            Appointment_Purpose: req.body.Appointment_Purpose,
            Appointment_Status: "Scheduled"
        });

        res.redirect("/patient/appointment");
    } catch (error) {
        console.error(error);
        res.render("patient/appointment", { message: "Failed to schedule appointment. Try again." });
    }
};

const appointment_view = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        // Fetch the patient's appointments using their Patient_ID
        const appointments = await models.Appointment.findAll({
            where: { Patient_ID: decoded.id },
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }]
        });
        

        res.render("patient/appointment", { appointments });
    } catch (error) {
        console.error(error);
        res.redirect("/patient/login");
    }
};




module.exports = {
    login_view,
    register_view,
    profile_view,
    appointment_view,
    history_view,
    registerPatient,
    logout,
    loginPatient,
    authenticate,
    editProfile,
    editProfile_view,
    getAppointments,
    addAppointment


};
