let hours = [];
for (let i = 0; i < 24; i++) {
    hours.push(i);
}


let users = {};
let userCount = 0;

function handleClick() {
    let name = document.getElementById('username').value;
    let from = parseInt(document.getElementById('fromTime').value);
    let to = parseInt(document.getElementById('toTime').value);

    if (!name || isNaN(from) || isNaN(to)) {
        alert("يرجى ملء جميع الحقول بشكل صحيح");
        return;
    }

    userCount++;
    let key = `user${userCount}`;
    users[key] = {
        name: name,
        work_time_from: from,
        work_time_to: to,
        role: "user"
    };

    addpersoninlist(users[key]); 
}



function khata3dad() {
    let busyHours = [];


    Object.values(users).forEach(user => {
        for (let i = user.work_time_from; i <= user.work_time_to; i++) {
            busyHours.push(i);
        }
    });

    busyHours = [...new Set(busyHours)];

    let availableHours = hours.filter(hour => !busyHours.includes(hour));
    availableHours.sort((a, b) => a - b);

    let ranges = [];
    if (availableHours.length > 0) {
        let start = availableHours[0];
        let end = start;

        for (let i = 1; i < availableHours.length; i++) {
            if (availableHours[i] === end + 1) {
                end = availableHours[i];
            } else {
                ranges.push({ from: start, to: end });
                start = availableHours[i];
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
                ? `متاح في الساعة ${range.from}`
                : `متاح من ${range.from} إلى ${range.to}`;
            let p = document.createElement("p");
            p.className = "mb-1";
            p.textContent = text;
            resultDiv.appendChild(p);
        });
    }
}

function addpersoninlist(user) {
    let list = document.getElementById("userList");

    let listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";

    listItem.innerHTML = `
        <div>
            <strong>${user.name}</strong>
            <span class="text-muted small ms-2">من: ${user.work_time_from} إلى: ${user.work_time_to}</span>
        </div>
        <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">X</button>
    `;

    list.appendChild(listItem);
}
