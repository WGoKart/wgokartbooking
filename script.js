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

emailjs.send(

    "service_rq3a2lp",
    "template_uj7c5ua",
    {

        name: name,
        email: email,
        date: date,
        tourTime: time,
        guests: guests,
        route: route,
        message: "New Booking Request"

    }

)
    .then(function(){

    fetch(

        "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec",

        {

        method: "POST",

        body: JSON.stringify({

        name: name,

        email: email,

        date: date,

        time: time,

        guests: guests,

        route: route

    })

        }

    );

    alert("Booking request sent successfully!");

    document

    .getElementById("bookingForm")

    .reset();

})

.catch(function(error){

    console.log(error);

    alert(

        "Error: " +

        JSON.stringify(error)

    );

});

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

    const select =
        document.getElementById("tourTime");

    select.innerHTML = "";

    times.forEach(function(time){

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