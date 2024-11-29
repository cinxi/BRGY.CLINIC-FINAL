// const jwt = require("jsonwebtoken");
// const models = require("../models");

// const attachUser = async (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.redirect("/patient/login");
//     }

//     try {
//         const decoded = jwt.verify(token, "your_secret_key");
//         const user = await models.Patient.findOne({ where: { Patient_ID: decoded.id } });

//         if (!user) {
//             res.clearCookie("token");
//             return res.redirect("/patient/login");
//         }

//         // Attach user details to `res.locals` for use in views
//         res.locals.firstName = user.Patient_FirstName || "N/A";
//         res.locals.lastName = user.Patient_LastName || "N/A";

//         next();
//     } catch (error) {
//         console.error(error);
//         res.clearCookie("token");
//         res.redirect("/patient/login");
//     }
// };

// module.exports = attachUser;
