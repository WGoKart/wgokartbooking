// Detect current language
const path = window.location.pathname;

let lang = "en";

if (path.includes("/tw/")) {
    lang = "tw";
}
else if (path.includes("/jp/")) {
    lang = "jp";
}

const text = {

    en: {

        enterInfo: "Please enter your Booking ID and Email.",

        alreadyCancelled: "This booking has already been cancelled.",

        alreadyRequested: "This cancellation request has already been submitted.",

        tooLate: "Online cancellations, refunds, or rescheduling are not accepted on the day before or the day of the tour.",

        notFound: "Booking ID or Email not found.",

        requestSubmitted: "Your cancellation request has been submitted."
    },

    tw: {

        enterInfo: "請輸入您的預約編號和電子郵件。",

        alreadyCancelled: "此預約已取消。",

        alreadyRequested: "此取消申請已送出。",

        tooLate: "活動前一天及當天無法線上取消、退款或改期。",

        notFound: "找不到預約編號或電子郵件。",

        requestSubmitted: "您的取消申請已送出。"
    },

    jp: {

        enterInfo: "予約番号とメールアドレスを入力してください。",

        alreadyCancelled: "この予約はすでにキャンセルされています。",

        alreadyRequested: "このキャンセル申請はすでに送信されています。",

        tooLate: "ツアー前日および当日のオンラインキャンセル・返金・日程変更はできません。",

        notFound: "予約番号またはメールアドレスが見つかりません。",

        requestSubmitted: "キャンセル申請を受け付けました。"
    }

};

const t = text[lang];




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

        document.getElementById("result").textContent = t.enterInfo;

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

        switch (result.message) {

            case "This booking has already been cancelled.":
                resultBox.textContent = t.alreadyCancelled;
                break;

            case "This cancellation request has already been submitted.":
                resultBox.textContent = t.alreadyRequested;
                break;

            case "Online cancellations, refunds, or rescheduling are not accepted on the day before or the day of the tour.":
                resultBox.textContent = t.tooLate;
                break;

            case "Booking ID or Email not found.":
                resultBox.textContent = t.notFound;
                break;

            default:
                resultBox.textContent = t.requestSubmitted;

        }

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