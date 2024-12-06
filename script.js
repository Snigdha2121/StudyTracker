const calendarSnigdha = document.getElementById("calendar-snigdha");
const calendarDivyanshi = document.getElementById("calendar-divyanshi");
const dashboard = document.getElementById("dashboard");
const selectedDateElement = document.getElementById("selected-date");
const summary = document.getElementById("summary");

let currentMonth = 1; // Default to January
let currentYear = 2024; // Default to year 2024

// Load saved data from localStorage
let studyData = JSON.parse(localStorage.getItem("studyData")) || {};

// Currently selected person and day
let currentPerson = null;
let currentDay = null;

// Generate a calendar for the selected month and year
function generateCalendar(container, person) {
    container.innerHTML = ""; // Clear the calendar
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.className = "day";
        day.textContent = i;

        // Highlight days based on data
        const key = `${person}-${currentMonth}-${currentYear}-${i}`;
        if (studyData[key] === true) {
            day.classList.add("completed");
        } else if (studyData[key] === false) {
            day.classList.add("not-completed");
        }

        // Add click event to open the dashboard
        day.onclick = () => openDashboard(person, i);
        container.appendChild(day);
    }
}

// Open the dashboard to update status
function openDashboard(person, day) {
    dashboard.classList.remove("hidden");
    selectedDateElement.textContent = `${person} - Day ${day}`;
    currentPerson = person;
    currentDay = day;
}

// Update the status of a selected day
function updateStatus(completed) {
    if (!currentPerson || !currentDay) return;

    // Update the studyData object
    const key = `${currentPerson}-${currentMonth}-${currentYear}-${currentDay}`;
    studyData[key] = completed;

    // Save to localStorage
    localStorage.setItem("studyData", JSON.stringify(studyData));

    // Update the calendar display
    if (currentPerson === "Snigdha") {
        generateCalendar(calendarSnigdha, "Snigdha");
    } else if (currentPerson === "Divyanshi") {
        generateCalendar(calendarDivyanshi, "Divyanshi");
    }
}

// Show monthly summary
function showSummary() {
    summary.classList.remove("hidden");
    summary.innerHTML = `<h2>Monthly Summary</h2>`;

    const people = ["Snigdha", "Divyanshi"];
    people.forEach(person => {
        let missedDays = 0;
        for (let i = 1; i <= 31; i++) {
            const key = `${person}-${currentMonth}-${currentYear}-${i}`;
            if (studyData[key] === false) missedDays++;
        }
        summary.innerHTML += `<p>${person} missed ${missedDays} days. Fine: ₹${missedDays}</p>`;
    });
}

// Update the calendar when month or year changes
function updateCalendar() {
    currentMonth = parseInt(document.getElementById("month").value);
    currentYear = parseInt(document.getElementById("year").value);

    // Regenerate calendars for the selected month and year
    generateCalendar(calendarSnigdha, "Snigdha");
    generateCalendar(calendarDivyanshi, "Divyanshi");
}

// Initialize the calendars
updateCalendar();