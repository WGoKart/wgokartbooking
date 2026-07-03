document
.getElementById("cancelBtn")
.addEventListener(
"click",
function(){

    const bookingId =
    document.getElementById("bookingId").value;

    const email =
    document.getElementById("email").value;

    document.getElementById("result").textContent =
    `Booking ID: ${bookingId}
Email: ${email}`;

});