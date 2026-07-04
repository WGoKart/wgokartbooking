document
.getElementById("cancelBtn")
.addEventListener(
"click",
async function(){

    const bookingId =
        document.getElementById("bookingId").value.trim();

    const email =
        document.getElementById("email").value.trim();

    if (!bookingId || !email) {

        document.getElementById("result").textContent =
            "Please enter your Booking ID and Email.";

        return;

    }

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwFxx0ZkuoSUx_9fFlRH1g6WiXpiZ5kenT0ZPMqhTiU9AhPe94OiUtoKIlP3TZ3VEK3uA/exec",
        {
            method: "POST",
            body: JSON.stringify({

                action: "cancel",

                bookingId: bookingId,

                email: email

            })

        }
    );

    const result = await response.json();

    document.getElementById("result").textContent =
        result.message;

});