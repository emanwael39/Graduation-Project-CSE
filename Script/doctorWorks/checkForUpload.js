

// const button = document.querySelector("#btn1");
// const url = new URL(window.location.href);
// const params = new URLSearchParams(url.search);
// const BubbleSheetStudent = params.get("BubbleSheetStudent");


// fetch("http://localhost:3000/Doctor/checkForUpload", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ BubbleSheetStudent: BubbleSheetStudent }),
// })
//     .then((response) => response.json())
//     .then((data) => {
//         const compelte = data.message;
//         const count = data.totalPages;
//         console.log(count);

//         if (compelte === "All pages are complete!") {
//             const successMessage = document.createElement("div");
//             successMessage.innerText = "🎉 Congratulations! All pages are complete!";
//             successMessage.classList.add("message", "success");
//             document.body.appendChild(successMessage);

//             button.style.display = "inline-block";
//             button.addEventListener("click", () => {
//                 const idDoctor = params.get("id");
//                 const AnswerBubbleSheet = params.get("AnswerBubbleSheet");
//                 const BubbleSheetStudent = params.get("BubbleSheetStudent");
//                 setTimeout(() => {
//                     let url = new URL(
//                         "http://localhost:3000/Doctor/progrssCorrcetBubbleSheed"
//                     );

//                     url.searchParams.set("id", idDoctor);
//                     url.searchParams.set("AnswerBubbleSheet", AnswerBubbleSheet);
//                     url.searchParams.set("BubbleSheetStudent", BubbleSheetStudent);
//                     url.searchParams.set("pagesNumber", count);

//                     window.location = url;
//                 }, 1000);
//             });
//         } else {
//             const loadingMessage = document.createElement("div");
//             loadingMessage.innerText = "⏳ Waiting for all pages to download...";
//             loadingMessage.classList.add("message", "loading");
//             document.body.appendChild(loadingMessage);

//             const loadingSpinner = document.createElement("div");
//             loadingSpinner.innerText = "⏳";
//             loadingSpinner.classList.add("spinner");
//             document.body.appendChild(loadingSpinner);
//         }
//     });

