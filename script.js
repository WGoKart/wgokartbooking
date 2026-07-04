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

    return `${year}-${month}-${day}`;

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

    const time =

    document.getElementById("tourTime").value;

    const guests =

    document.getElementById("guests").value;

    const route =

    document.querySelector(

    'input[name="tourRoute"]:checked'

).value;

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
    alert(
        "Please select a date within the next 6 months."
    );
    return;
}

const html = `

    <h3>Please confirm your booking:</h3>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    <p><strong>Route:</strong> ${route}</p>
    `;
    document.getElementById("confirmContent").innerHTML = html;
    document.getElementById("confirmModal").style.display = "flex";

    return;

});

async function checkAvailability() {

    const selectedDate =
        document.getElementById("tourDate").value;

    if (!selectedDate) return;

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec"
    );

    const bookings =
        await response.json();

    const times = [
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00"
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

            if (tourHour <= currentHour + 2) {
                return;
            }

        }

        let bookedGuests = 0;

        bookings.forEach(function(booking){

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

        if(remaining <= 0){

            option.textContent =
                `${time} (FULL)`;

            option.disabled = true;

        }else{

            option.textContent =
                `${time} (${remaining} seats left)`;

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

    return fetch(
        "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec",
        {
            method: "POST",
            body: JSON.stringify({
                name: bookingData.name,
                email: bookingData.email,
                date: bookingData.date,
                time: bookingData.time,
                guests: bookingData.guests,
                route: bookingData.route
            })
        }
    );

})

.then(response => response.json())

.then(data => {

    return emailjs.send(
        "service_rq3a2lp",
        "template_Client",
        {
            name: bookingData.name,
            email: bookingData.email,
            date: bookingData.date,
            tourTime: bookingData.time,
            guests: bookingData.guests,
            route: bookingData.route,
            bookingId: data.bookingId
        }

    )

    .then(() => data);

})

.then(data => {

    console.log(data);

    let paymentLink = "";

    if (bookingData.guests == 1) {
        paymentLink = "https://buy.stripe.com/14AfZgePS0Vz0BNbU3eZ20w";
    } else if (bookingData.guests == 2) {
        paymentLink = "https://buy.stripe.com/3cI14mePS47L98j7DNeZ20x";
    } else if (bookingData.guests == 3) {
        paymentLink = "https://buy.stripe.com/aFa14m5fi7jX84f5vFeZ20y";
    } else if (bookingData.guests == 4) {
        paymentLink = "https://buy.stripe.com/3cIdR87nq7jX70be2beZ20z";
    } else if (bookingData.guests == 5) {
        paymentLink = "https://buy.stripe.com/8x2aEW7nq33H1FR7DNeZ20A";
    } else if (bookingData.guests == 6) {
        paymentLink = "https://buy.stripe.com/bJe3cuazCbAd3NZaPZeZ20B";
    } else if (bookingData.guests == 7) {
        paymentLink = "https://buy.stripe.com/3cI8wObDGdIlesD1fpeZ20C";
    }

    window.location.href = paymentLink;

})

.catch(error => {

    console.error(error);

    alert("Booking failed. Please try again.");

});

});