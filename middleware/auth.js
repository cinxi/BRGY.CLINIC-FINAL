
const jwt = require("jsonwebtoken");
const models = require("../models");

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/staff/login?message=SessionExpired");
    }

    try {
        const decoded = jwt.verify(token, "secretKey");
        models.ClinicStaff.findByPk(decoded.id)
            .then((staff) => {
                if (!staff) {
                    return res.redirect("/staff/login?message=UserNotFound");
                }
                req.staff = staff; // Attach staff details to the request
                next();
            })
            .catch(() => res.redirect("/staff/login?message=ServerError"));
    } catch (error) {
        return res.redirect("/staff/login?message=InvalidToken");
    }
};

module.exports = { authenticateUser };



