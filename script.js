const calendarSnigdha = document.getElementById("calendar-snigdha");
const calendarDivyanshi = document.getElementById("calendar-divyanshi");
const dashboard = document.getElementById("dashboard");
const selectedDateElement = document.getElementById("selected-date");
const summary = document.getElementById("summary");

let currentMonth = new Date().getMonth() + 1; // Start from current month
let currentYear = new Date().getFullYear();  // Start from current year

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
        if (studyData[key]) {
            const { DSA, Apti, BothNotCompleted } = studyData[key];
            if (BothNotCompleted) {
                day.classList.add("not-completed");
            } else if (DSA && Apti) {
                day.classList.add("both-completed");
            } else if (DSA) {
                day.classList.add("dsa-completed");
            } else if (Apti) {
                day.classList.add("apti-completed");
            }
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

// Update the status of a specific task
function updateTaskStatus(task) {
    if (!currentPerson || !currentDay) return;

    const key = `${currentPerson}-${currentMonth}-${currentYear}-${currentDay}`;
    if (!studyData[key]) {
        studyData[key] = { DSA: false, Apti: false, BothNotCompleted: false };
    }

    studyData[key][task] = true;
    studyData[key].BothNotCompleted = false; // Reset "not completed" if a task is done

    // Save to localStorage
    localStorage.setItem("studyData", JSON.stringify(studyData));

    // Update the calendar display
    updateCalendar();
}

// Mark both tasks as not completed
function updateStatus() {
    if (!currentPerson || !currentDay) return;

    const key = `${currentPerson}-${currentMonth}-${currentYear}-${currentDay}`;
    if (!studyData[key]) {
        studyData[key] = { DSA: false, Apti: false, BothNotCompleted: false };
    }

    // Mark both tasks as not completed
    studyData[key] = { DSA: false, Apti: false, BothNotCompleted: true };

    // Save to localStorage
    localStorage.setItem("studyData", JSON.stringify(studyData));

    // Update the calendar display
    updateCalendar();
}

// Unmark the status of a selected day
function unmarkStatus() {
    if (!currentPerson || !currentDay) return;

    const key = `${currentPerson}-${currentMonth}-${currentYear}-${currentDay}`;
    delete studyData[key];

    // Save to localStorage
    localStorage.setItem("studyData", JSON.stringify(studyData));

    // Update the calendar display
    updateCalendar();

    // Close the dashboard after unmarking
    dashboard.classList.add("hidden");
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
            if (studyData[key] && studyData[key].BothNotCompleted) {
                missedDays++;
            }
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
