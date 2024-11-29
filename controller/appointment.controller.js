// appointment.controller.js

const models = require("../models");



// Fetch patients and render the appointment view

const appointment_view = async (req, res) => {
    const message = req.query.message || null;

    try {
        // Fetch patients' first and last names along with their IDs
        const patients = await models.Patient.findAll({
            attributes: ['Patient_ID', 'Patient_FirstName', 'Patient_LastName']
        });

        // Format the data for dropdown
        const patientList = patients.map(patient => ({
            id: patient.Patient_ID,
            name: `${patient.Patient_FirstName} ${patient.Patient_LastName}`
        }));

        // Fetch appointments
        const appointments = await models.Appointment.findAll({
            include: [{
                model: models.Patient,
                as: 'Patient',
                attributes: ['Patient_FirstName', 'Patient_LastName']
            }],
            attributes: ['Appointment_ID', 'Appointment_Date', 'Appointment_Time', 'Appointment_Purpose', 'Appointment_Status']
        });


         // Format the appointment data for display
    const appointmentList = appointments.map(appointment => {
    const formattedDate = new Intl.DateTimeFormat('en-CA').format(new Date(appointment.Appointment_Date));  // Format as YYYY-MM-DD
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(`1970-01-01T${appointment.Appointment_Time}`));

    return {
        id: appointment.Appointment_ID,
        patientName: `${appointment.Patient.Patient_FirstName} ${appointment.Patient.Patient_LastName}`,
        date: formattedDate,
        time: formattedTime,
        purpose: appointment.Appointment_Purpose,
        status: appointment.Appointment_Status
    };
});
    
        res.render("staff/appointment", { message, patientList, appointmentList });
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



module.exports = {
    appointment_view,
    save_addAppointment,
    editAppointment_view,
    save_editAppointment,
    // deleteAppointment,
    
    


    
    
};
