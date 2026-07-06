const params = new URLSearchParams(window.location.search);

const bookingId = params.get("bookingId");

document.getElementById("bookingId").textContent =
    bookingId || "Unavailable";