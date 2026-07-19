// Detect current language
const path = window.location.pathname;

let lang = "en"; // Default language

if (path.includes("/tw/")) {
    lang = "tw";
}
else if (path.includes("/jp/")) {
    lang = "jp";
}


const text = {
    en: {
        name: "Name",
        email: "Email",
        date: "Date",
        time: "Time",
        guests: "Guests",
        route: "Route",

        experience: "Experience Plan",
        castle: "Osaka Castle",
        tsutenkaku: "Tsutenkaku",

        dateLimit: "Please select a date within the next 6 months.",

        full:"FULL",
        seatsLeft: (n) => `${n} seats left`,

        redirect: "Redirecting to Payment...",
        confirm: "Confirm Booking",
        bookingFailed: "Booking failed.",
        checkoutNotFound: "Checkout URL not found."
        
    },

    tw: {
        name: "姓名",
        email: "電子郵件",
        date: "日期",
        time: "時間",
        guests: "人數",
        route: "路線",

        experience: "體驗方案",
        castle: "大阪城",
        tsutenkaku: "通天閣",

        dateLimit: "請選擇未來六個月內的日期。",

        full:"已滿",
        seatsLeft: (n) => `剩餘 ${n} 個名額`,

        redirect: "正在前往付款...",
        confirm: "確認預約",
        bookingFailed: "預約失敗。",
        checkoutNotFound: "找不到付款網址。"
        
    },

    jp: {
        name: "お名前",
        email: "メールアドレス",
        date: "日付",
        time: "時間",
        guests: "人数",
        route: "コース",

        experience: "体験プラン",
        castle: "大阪城",
        tsutenkaku: "通天閣",

        dateLimit: "6か月以内の日付を選択してください。",

        full:"満席",
        seatsLeft: (n) => `残り${n}席`,

        redirect: "決済ページへ移動中...",
        confirm: "予約を確定",
        bookingFailed: "予約に失敗しました。",
        checkoutNotFound: "決済URLが見つかりません。"

    }
    
};

const t = text[lang];





let bookingData = {};

const dateInput =
    document.getElementById("tourDate");

const today = new Date();

today.setHours(0,0,0,0);

const maxDate = new Date(today);

maxDate.setMonth(
    maxDate.getMonth() + 6
);

function formatDate(date){

    const year = date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2,"0");

    const day =
        String(
            date.getDate()
        ).padStart(2,"0");

    return `${year}/${month}/${day}`;

}

dateInput.min =
    formatDate(today);

dateInput.max =
    formatDate(maxDate);
    

emailjs.init("Td2m62JzPU_tpTuzV");

document
.getElementById("bookingForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const name =

    document.getElementById("name").value;

    const email =

    document.getElementById("email").value;

    const date =
    document.getElementById("tourDate").value;

    const displayDate = date.replace(/-/g, "/");

    const time =

    document.getElementById("tourTime").value;

    const guests =

    document.getElementById("guests").value;

    const route =

    document.querySelector(

    'input[name="tourRoute"]:checked'

).value;

let displayRoute = route;

if (route === "Experience Plan") {
    displayRoute = t.experience;
} else if (route === "Osaka Castle") {
    displayRoute = t.castle;
} else if (route === "Tsutenkaku") {
    displayRoute = t.tsutenkaku;
}

bookingData = {
    name,
    email,
    date,
    time,
    guests,
    route
};

const selectedDate = new Date(date);

if (
    selectedDate < today ||
    selectedDate > maxDate
) {
    alert(t.dateLimit);
    return;
}

const html = `
<div class="booking-summary">

    <div class="booking-row">
        <span>${t.name}</span>
        <strong>${name}</strong>
    </div>

    <div class="booking-row">
        <span>${t.email}</span>
        <strong>${email}</strong>
    </div>

    <div class="booking-row">
        <span>${t.date}</span>
        <strong>${displayDate}</strong>
    </div>

    <div class="booking-row">
        <span>${t.time}</span>
        <strong>${time}</strong>
    </div>

    <div class="booking-row">
        <span>${t.guests}</span>
        <strong>${guests}</strong>
    </div>

    <div class="booking-row">
        <span>${t.route}</span>
        <strong>${displayRoute}</strong>
    </div>

</div>
`;

document.getElementById("confirmContent").innerHTML = html;

document.getElementById("confirmModal").style.display = "flex";

});





async function checkAvailability() {

    const selectedDate =
    document.getElementById("tourDate").value.replace(/-/g, "/");

    if (!selectedDate) return;

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec"
    );

    const bookings =

        await response.json();

    console.log("Bookings:", bookings);

    const times = [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00"
    ];
    const now = new Date();

    const currentDate =
    formatDate(now);

    const currentHour =
    now.getHours();

    const select =
        document.getElementById("tourTime");

    select.innerHTML = "";

    times.forEach(function(time){

        if (selectedDate === currentDate) {

            const tourHour =
                Number(time.split(":")[0]);

            if (tourHour <= currentHour + 1) {
                return;
            }

        }

        let bookedGuests = 0;

        bookings.forEach(function(booking){

            console.log("selectedDate =", selectedDate);
            console.log("booking.date =", booking.date);

            console.log("time option =", time);
            console.log("booking.time =", booking.time);

        const bookingDate =
            booking.date;

            if(
                bookingDate === selectedDate &&
                booking.time === time
            ){
                bookedGuests +=
                    Number(booking.guests);
            }

        });

        const remaining =
             7 - bookedGuests;
            
        if (
            select.options.length === 0
        ) {
            updateGuestsOptions(remaining);
        }

        const option =
            document.createElement("option");

        option.value = time;
        option.dataset.remaining = remaining;

        if (remaining <= 0) {

            option.textContent =
                `${time} (${t.full})`;

            option.disabled = true;

        } else {

            option.textContent =
                `${time} (${t.seatsLeft(remaining)})`;

        }

        select.appendChild(option);

    });
    if (select.options.length > 0) {

    const firstOption =
        select.options[0];

    const remaining =
        Number(
            firstOption.dataset.remaining
        );

    updateGuestsOptions(
        remaining
    );

    }

}
document

.getElementById("tourDate")

.addEventListener(

    "change",

    checkAvailability

);

function updateGuestsOptions(maxGuests) {
    const guestsSelect = document.getElementById("guests");
    guestsSelect.innerHTML = "";

    for (
        let i = 1;
        i <= maxGuests;
        i++
    ) {
        const option = 
            document.createElement("option");
        option.value = i;
        option.textContent = i;
        guestsSelect.appendChild(option);
    }
}

document
.getElementById("tourTime")
.addEventListener(
    "change",
    function(){

        const selectedOption =
            this.options[
                this.selectedIndex
            ];

        const remaining =
            Number(
                selectedOption.dataset.remaining
            );

        updateGuestsOptions(
            remaining
        );

    }
);

    document
        .getElementById("editBooking") 
        .addEventListener("click", () => {

    document
        .getElementById("confirmModal").style.display = "none";

});

    document
        .getElementById("confirmBooking")
        .addEventListener("click", () => {

            const btn = document.getElementById("confirmBooking");

                btn.disabled = true;

                btn.textContent = t.redirect;

            console.log("Start");

/*            
    emailjs.send(
    "service_rq3a2lp",
    "template_server",
    {
        name: bookingData.name,
        email: bookingData.email,
        date: bookingData.date,
        tourTime: bookingData.time,
        guests: bookingData.guests,
        route: bookingData.route,
        message: "New Booking Request"
    }
)

.then(() => {
*/

    console.log("Before Fetch");
    return fetch(
    "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec",
    {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            name: bookingData.name,
            email: bookingData.email,
            date: bookingData.date,
            time: bookingData.time,
            guests: bookingData.guests,
            route: bookingData.route
        })
    }
)

.then(async response => {

    console.log("HTTP Status:", response.status);

    const text = await response.text();

    console.log("Body:", text);

    return JSON.parse(text);

})

.then(data => {

    console.log("Apps Script:", data);

    console.log(data);

        if (data.result !== "success") {

    btn.disabled = false;
    btn.textContent = t.confirm;

    alert(
        data.message || t.bookingFailed
    );

    return;

}

        if (!data.checkoutUrl) {

    btn.disabled = false;
    btn.textContent = t.confirm;

    alert(t.checkoutNotFound);

    return;

        }

    window.location.href = data.checkoutUrl;

})

.catch(async error => {

    console.error(error);

    alert(
        JSON.stringify(error)
    );

    btn.disabled = false;

    btn.textContent = t.confirm;

});

});