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

const resultBox = document.getElementById("result");

resultBox.textContent = result.message;

// 預設清除顏色
resultBox.style.color = "";

// 已取消（綠色）
if (result.message === "This booking has already been cancelled.") {

    resultBox.style.color = "#0B8043";

}
// 其餘錯誤（紅色）
else if (

    result.message === "This cancellation request has already been submitted." ||

    result.message === "Online cancellations, refunds, or rescheduling are not accepted on the day before or the day of the tour." ||

    result.message === "Booking ID or Email not found."

) {

    resultBox.style.color = "#D93025";

}
// 成功送出取消申請（黃色）
else {

    resultBox.style.color = "#f4b400";

}

});