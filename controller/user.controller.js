

// user.controller.js

const { where } = require("sequelize");
const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login_view = (req, res) => {
    const message = req.query.message || null;
    res.render("login", { message });
};

const register_view = (req, res) => {
    const message = req.query.message;
    res.render("register", { message });
};

const addUser_view = (req, res) => {
    const message = req.query.message;
    res.render("addUser", { message });
};

const save_user = (req, res) => {
    const ConfirmPassword_data = req.body.ConfirmPassword_data;

    const user_data = {
        FirstName: req.body.firstName_data,
        LastName: req.body.lastName_data,
        Admin_Birthdate: req.body.birthdate_data,
        Admin_Gender: req.body.gender_data,
        ContactNumber: req.body.contactNumber_data,
        Username: req.body.Username_data,
        Password: req.body.Password_data,
    };

    console.log("Admin registration data:", user_data);
    console.log("Confirm password:", ConfirmPassword_data);

    // Validate password confirmation
    if (ConfirmPassword_data !== user_data.Password) {
        return res.redirect("register?message=PasswordNotMatch");
    }

    // Hash the password before saving to the database
    user_data.Password = bcrypt.hashSync(user_data.Password, 10);
    console.log("Hashed password:", user_data.Password);

    // Insert to the 'admin' table
    models.admin.create(user_data)
        .then(result => {
            res.redirect("/login");
        })
        .catch(error => {
            console.error("Database insertion error:", error);
            res.redirect("register?message=ServerError");
        });
};

const login_user = (req, res) => {
    const user_data = {
        Username: req.body.Username,
        Password: req.body.Password,
    };

    console.log("Login attempt:", user_data);

    // Check if the user exists in the 'admin' table
    models.admin.findOne({ where: { Username: user_data.Username } })
        .then(result => {
            if (!result) {
                console.log("Admin not found in database");
                return res.render("login", { message: "Admin not found" });
            }

            console.log("Admin found:", result);

            // Compare the entered password with the hashed password from the database
            const passwordMatch = bcrypt.compareSync(user_data.Password, result.Password);
            console.log("Password match result:", passwordMatch);

            if (passwordMatch) {
                // Password is correct, generate token
                const token = jwt.sign({ id: result.Admin_ID, Username: result.Username }, "secretKey", { expiresIn: '1h' });
                res.cookie("token", token); // Set the token as a cookie
                console.log("Login successful.");

                // Redirect to Admin dashboard (since there is no specific role)
                return res.redirect("/admin/Admindashboard"); // Redirect to Admin dashboard
            } else {
                console.log("Incorrect password");
                return res.render("login", { message: "Incorrect password" });
            }
        })
        .catch(error => {
            console.error("Error during login:", error);
            res.render("login", { message: "Server error" });
        });
};



// LOGIN SA CLINIC STAFF

const login_staff_view = (req, res) => {
    const message = req.query.message || null; // Optional message for errors or notifications
    res.render("staff/login", { message });
};

const login_staff = (req, res) => {
    const { Username, Password } = req.body;

    // Check if staff exists in the database
    models.ClinicStaff.findOne({ where: { Username } })
        .then(staff => {
            if (!staff) {
                return res.render("staff/login", { message: "User not found" });
            }

            // Compare password with hashed password
            const passwordMatch = bcrypt.compareSync(Password, staff.Password);

            if (!passwordMatch) {
                return res.render("staff/login", { message: "Incorrect password" });
            }

            // Successful login
            const token = jwt.sign(
                { id: staff.Users_ID, Username: staff.Username },
                "secretKey",
                { expiresIn: "1h" }
            );

            res.cookie("token", token); // Set JWT as a cookie
            res.redirect("/staff/Staffdashboard"); // Redirect to staff dashboard
        })
        .catch(error => {
            console.error("Error during login:", error);
            res.render("staff/login", { message: "Server error" });
        });
};




module.exports = {
    login_view,
    register_view,
    save_user,
    login_user,
    addUser_view,
    login_staff,
    login_staff_view

};
