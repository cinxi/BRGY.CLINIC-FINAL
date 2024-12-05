// appointment.controller.js

const models = require("../models");


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

        // Fetch appointments data
        const appointments = await models.Appointment.findAll({
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }],
            attributes: ['Appointment_ID', 'Appointment_Date', 'Appointment_Time', 'Appointment_Purpose', 'Appointment_Status']
        });

        // Format the appointment data
        const appointmentList = appointments.map(appointment => ({
            id: appointment.Appointment_ID,
            patientName: `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`,
            date: new Date(appointment.Appointment_Date).toLocaleDateString("en-CA"),
            time: appointment.Appointment_Time,
            purpose: appointment.Appointment_Purpose,
            status: appointment.Appointment_Status
        }));

        // Debugging logs
        console.log("Patient List:", patientList);
        console.log("Appointment List:", appointmentList);

        res.render("staff/logs", { message, patientList, appointmentList, error: null });
    } catch (error) {
        console.error("Error fetching patients or appointments:", error);
        res.render("staff/logs", { message, patientList: [], appointmentList: [], error: "Failed to load data" });
    }
};

// Fetch patients and render the appointment view
const appointment_view = async (req, res) => {
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

        // Fetch appointments data
        const appointments = await models.Appointment.findAll({
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }],
            attributes: ['Appointment_ID', 'Appointment_Date', 'Appointment_Time', 'Appointment_Purpose', 'Appointment_Status']
        });

        // Format the appointment data
        const appointmentList = appointments.map(appointment => ({
            id: appointment.Appointment_ID,
            patientName: `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`,
            date: new Date(appointment.Appointment_Date).toLocaleDateString("en-CA"),
            time: appointment.Appointment_Time,
            purpose: appointment.Appointment_Purpose,
            status: appointment.Appointment_Status
        }));

        // Debugging logs
        console.log("Patient List:", patientList);
        console.log("Appointment List:", appointmentList);

        res.render("staff/appointment", { message, patientList, appointmentList, error: null });
    } catch (error) {
        console.error("Error fetching patients or appointments:", error);
        res.render("staff/appointment", { message, patientList: [], appointmentList: [], error: "Failed to load data" });
    }
};



// Add new appointment
const save_addAppointment = (req, res) => {
    const appointment_data = {
        Patient_ID: req.body.Patient_ID,
        Users_ID: req.body.Users_ID,
        Appointment_Date: req.body.Appointment_Date,
        Appointment_Time: req.body.Appointment_Time,
        Appointment_Purpose: req.body.Appointment_Purpose,
        Appointment_Status: req.body.Appointment_Status 
    };

    console.log("Appointment data:", appointment_data);

    models.Appointment.create(appointment_data)
        .then(result => {
            console.log("Appointment added successfully:", result);
            res.redirect("/staff/appointment");
        })
        .catch(error => {
            console.error("Error adding appointment:", error);
            res.redirect("/appointment?message=ServerError");
        });
};


// View for editing an appointment (edit only status)
const editAppointment_view = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        // Fetch the appointment details by ID
        const appointment = await models.Appointment.findOne({
            where: { Appointment_ID: appointmentId },
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }]
        });

        if (!appointment) {
            return res.redirect("/staff/appointment?message=AppointmentNotFound");
        }

        // Render the modal with current appointment data
        const patientName = `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`;
        res.render("staff/appointment", {
            appointment,
            patientName,
            message: req.query.message || null
        });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.redirect("/staff/appointment?message=ErrorFetchingAppointment");
    }
};

// Save edited appointment status only
const save_editAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { Appointment_Status } = req.body;

    try {
        const appointment = await models.Appointment.findOne({ where: { Appointment_ID: appointmentId } });

        if (!appointment) {
            return res.redirect("/staff/appointment?message=AppointmentNotFound");
        }

        // Update only the status of the appointment
        appointment.Appointment_Status = Appointment_Status;

        await appointment.save();

        console.log("Appointment status updated successfully");
        res.redirect("/staff/appointment?message=AppointmentStatusUpdated");
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.redirect("/staff/appointment?message=ErrorUpdatingAppointment");
    }
};


// // Delete an appointment by ID
// const deleteAppointment = async (req, res) => {
//     const appointmentId = req.params.id;
//     try {
//         const appointment = await models.Appointment.findOne({ where: { Appointment_ID: appointmentId } });

//         if (!appointment) {
//             return res.redirect("/staff/appointment?message=AppointmentNotFound");
//         }

//         // Delete the appointment
//         await appointment.destroy();

//         console.log("Appointment deleted successfully");
//         res.redirect("/staff/appointment?message=AppointmentDeleted");
//     } catch (error) {
//         console.error("Error deleting appointment:", error);
//         res.redirect("/staff/appointment?message=ErrorDeletingAppointment");
//     }
// };

// Approve an appointment
const approveAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const appointment = await models.Appointment.findOne({ where: { Appointment_ID: appointmentId } });

        if (!appointment) {
            return res.redirect("/staff/appointment?message=AppointmentNotFound");
        }

        // Update status to "Approved"
        appointment.Appointment_Status = "Approved";
        await appointment.save();

        console.log("Appointment approved successfully");
        res.redirect("/staff/appointment?message=AppointmentApproved");
    } catch (error) {
        console.error("Error approving appointment:", error);
        res.redirect("/staff/appointment?message=ErrorApprovingAppointment");
    }
};



// Mark an appointment as completed (but keep it in the database)
const markAsComplete = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const appointment = await models.Appointment.findOne({ where: { Appointment_ID: appointmentId } });

        if (!appointment) {
            return res.redirect("/staff/appointment?message=AppointmentNotFound");
        }

        // Update status to "Completed"
        appointment.Appointment_Status = "Completed";
        await appointment.save();

        console.log("Appointment marked as complete");
        res.redirect("/staff/appointment?message=AppointmentCompleted");
    } catch (error) {
        console.error("Error marking appointment as complete:", error);
        res.redirect("/staff/appointment?message=ErrorMarkingAppointmentComplete");
    }
};
// Fetch approved appointments and format for calendar display
const fetchApprovedAppointments = async (req, res) => {
    try {
        const appointments = await models.Appointment.findAll({
            where: { Appointment_Status: "Approved" },
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName', 'Patient_ContactNumber']
            }],
            attributes: ['Appointment_ID', 'Appointment_Date', 'Appointment_Time', 'Appointment_Purpose']
        });

        const approvedAppointments = appointments.map(appointment => ({
            id: appointment.Appointment_ID,
            patientName: `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`,
            date: new Date(appointment.Appointment_Date).toISOString().split('T')[0],
            time: appointment.Appointment_Time,
            purpose: appointment.Appointment_Purpose,
            contact: appointment.Patient.Patient_ContactNumber
        }));

        // Send data as JSON
        res.json(approvedAppointments);
    } catch (error) {
        console.error("Error fetching approved appointments:", error);
        res.status(500).json({ error: "Failed to fetch approved appointments" });
    }
};




module.exports = {
    fetchApprovedAppointments,
    appointment_view,
    save_addAppointment,
    editAppointment_view,
    save_editAppointment,
    // deleteAppointment,
    approveAppointment,
    markAsComplete,
    logs_view

    
    


    
    
};
