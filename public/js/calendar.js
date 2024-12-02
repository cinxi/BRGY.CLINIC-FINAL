// document.addEventListener("DOMContentLoaded", () => {
//     const calendarDates = document.getElementById("calendar-dates");
//     const currentMonth = document.getElementById("current-month");
//     const prevMonth = document.getElementById("prev-month");
//     const nextMonth = document.getElementById("next-month");

//     let date = new Date();

//     const renderCalendar = () => {
//         calendarDates.innerHTML = "";
//         const month = date.getMonth();
//         const year = date.getFullYear();

//         currentMonth.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

//         const firstDay = new Date(year, month, 1).getDay();
//         const lastDate = new Date(year, month + 1, 0).getDate();

//         for (let i = 0; i < firstDay; i++) {
//             const emptyCell = document.createElement("div");
//             emptyCell.classList.add("date");
//             calendarDates.appendChild(emptyCell);
//         }

//         for (let i = 1; i <= lastDate; i++) {
//             const dateCell = document.createElement("div");
//             dateCell.classList.add("date");
//             dateCell.textContent = i;

//             if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
//                 dateCell.classList.add("today");
//             }

//             dateCell.addEventListener("click", () => {
//                 alert(`Selected Date: ${i} ${date.toLocaleString("default", { month: "long" })} ${year}`);
//             });

//             calendarDates.appendChild(dateCell);
//         }
//     };

//     prevMonth.addEventListener("click", () => {
//         date.setMonth(date.getMonth() - 1);
//         renderCalendar();
//     });

//     nextMonth.addEventListener("click", () => {
//         date.setMonth(date.getMonth() + 1);
//         renderCalendar();
//     });

//     renderCalendar();
// });
