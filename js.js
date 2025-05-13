let users = {};
let userCount = 0;

function convertTo24HourFormat(timeStr, period) {
    let [hours, minutes] = timeStr.split(/[:.]/).map(Number);
    if (isNaN(hours)) return null;
    if (isNaN(minutes)) minutes = 0;

    if (period === "PM" && hours !== 12) {
        hours += 12;
    } else if (period === "AM" && hours === 12) {
        hours = 0;
    }

    return hours + minutes / 60;
}

function handleClick() {
    let name = document.getElementById('username').value.trim();

    let fromStr = document.getElementById('fromTime').value;
    let fromPeriod = document.getElementById('fromPeriod').value;

    let toStr = document.getElementById('toTime').value;
    let toPeriod = document.getElementById('toPeriod').value;

    let from = convertTo24HourFormat(fromStr, fromPeriod);
    let to = convertTo24HourFormat(toStr, toPeriod);

    if (!name || from === null || to === null) {
        alert("يرجى إدخال بيانات صحيحة.");
        return;
    }

    let spansNextDay = false;
    if (to <= from) {
        to += 24;
        spansNextDay = true;
    }

    userCount++;
    let key = `user${userCount}`;
    users[key] = {
        name: name,
        work_time_from: from,
        work_time_to: to,
        next_day: spansNextDay,
        role: "user"
    };

    addpersoninlist(users[key]);
}

function khata3dad() {
    let busyTimes = new Set();

    Object.values(users).forEach(user => {
        let from = user.work_time_from;
        let to = user.work_time_to;

        for (let t = from; t < to; t += 0.25) {
            busyTimes.add(Math.round(t * 100) / 100);
        }
    });

    let available = [];
    for (let t = 0; t < 24; t += 0.25) {
        let rounded = Math.round(t * 100) / 100;
        if (!busyTimes.has(rounded)) {
            available.push(rounded);
        }
    }

    let ranges = [];
    if (available.length > 0) {
        let start = available[0];
        let end = start;

        for (let i = 1; i < available.length; i++) {
            if (Math.abs(available[i] - end - 0.25) < 0.001) {
                end = available[i];
            } else {
                ranges.push({ from: start, to: end });
                start = available[i];
                end = start;
            }
        }
        ranges.push({ from: start, to: end });
    }

    let resultDiv = document.getElementById("availableTimes");
    resultDiv.innerHTML = "";

    if (ranges.length === 0) {
        resultDiv.innerHTML = `<p class="text-danger fw-bold">لا توجد ساعات متاحة اليوم.</p>`;
    } else {
        ranges.forEach(range => {
            let text = (range.from === range.to)
                ? `متاح في الساعة ${formatHour(range.from)}`
                : `متاح من ${formatHour(range.from)} إلى ${formatHour(range.to)}`;
            let p = document.createElement("p");
            p.className = "mb-1";
            p.textContent = text;
            resultDiv.appendChild(p);
        });
    }
}

function formatHour(decimalHour) {
    let dayInfo = "";
    if (decimalHour >= 24) {
        decimalHour -= 24;
        dayInfo = " (اليوم التالي)";
    }

    let hour = Math.floor(decimalHour);
    let minutes = Math.round((decimalHour - hour) * 60);
    let suffix = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    displayHour = displayHour === 0 ? 12 : displayHour;

    let minutesStr = minutes.toString().padStart(2, '0');
    return `${displayHour}:${minutesStr} ${suffix}${dayInfo}`;
}

function addpersoninlist(user) {
    let list = document.getElementById("userList");

    let listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";

    let fromText = formatHour(user.work_time_from);
    let toText = formatHour(user.work_time_to);

    listItem.innerHTML = `
        <div>
            <strong>${user.name}</strong>
            <span class="text-muted small ms-2">
                من: ${fromText} إلى: ${toText}
            </span>
        </div>
        <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">X</button>
    `;
    list.appendChild(listItem);
}

function resetAll() {

    document.getElementById('username').value = "";
    document.getElementById('fromTime').value = "";
    document.getElementById('toTime').value = "";
    document.getElementById('fromPeriod').value = "AM";
    document.getElementById('toPeriod').value = "AM";

    users = {};
    userCount = 0;

    document.getElementById("userList").innerHTML = "";

    document.getElementById("availableTimes").innerHTML = "";
}
