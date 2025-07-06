// const uploadPdfButton = document.querySelector("#btn1")
// const uploadPdfValue = document.querySelector("#pdf")
// function showAlert(message, type) {
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`;
//     alertDiv.role = 'alert';
//     alertDiv.style.zIndex = 1050;
//     alertDiv.style.margin = '0 auto';
//     alertDiv.innerHTML = `
//       <div class="container">
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//       </div>
//     `;
//     document.body.appendChild(alertDiv);

//     setTimeout(() => {
//         alertDiv.remove();
//     }, 2000);
// }

// uploadPdfButton.addEventListener('click', () => {
//     uploadPdfButton.disabled=true
//     console.log("ahmed")
//     const formData = new FormData();
//     if (uploadPdfValue.files.length > 0) {
//         formData.append("file", uploadPdfValue.files[0]); 

//     } else {
//         // console.log("No image file selected.");
//         showAlert("No image file selected.", 'danger')
//     }
//     fetch('http://localhost:3000/Doctor/uploadBubbelSheets', {
//         method: 'POST',
//         body: formData
//     })

//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
//             return res.json(); // تحليل الاستجابة إلى JSON
//         })
//         .then((data) => {
//             if (data.message == "Process completed successfully") {
//                 console.log('File Name:', data.fileName);
//                 // console.log('pageCount:', data.pageCount);
//                 // const fname=data.fileName
//                 // const extractedName = fileName.replace(/\.pdf$/, '');
//                 const url = new URL(window.location.href);
//                 const params = new URLSearchParams(url.search);
//                 const idDoctor = params.get('id')
//                 const AnswerBubbleSheet = params.get('AnswerBubbleSheet')
              
//                 let url1 = new URL("http://localhost:3000/Doctor/checkForUpload");
    
//                 url1.searchParams.set('id', idDoctor);
//                 url1.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);
//                 url1.searchParams.set('BubbleSheetStudent',data.fileName)

//                 window.location = url1

//             }
//         })
//         .catch((error) => {
//             console.error('Error:', error.message);
//         });


// })                                                     




const uploadPdfButton = document.querySelector("#btn1");
const uploadPdfValue = document.querySelector("#pdf");

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`;
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050;
    alertDiv.style.margin = '0 auto';
    alertDiv.innerHTML = `
        <div class="container">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 2000);
}

uploadPdfButton.addEventListener('click', () => {
    uploadPdfButton.disabled = true; // منع الضغط المتكرر
    const formData = new FormData();

    if (uploadPdfValue.files.length > 0) {
        formData.append("file", uploadPdfValue.files[0]);
    } else {
        showAlert("No PDF file selected.", 'danger');
        uploadPdfButton.disabled = false;
        return;
    }

    fetch('http://localhost:3000/Doctor/uploadBubbelSheets', {
        method: 'POST',
        body: formData
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        if (data.message === "Process completed successfully") {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            const idDoctor = params.get('id');
            const AnswerBubbleSheet = params.get('AnswerBubbleSheet');

            const redirectUrl = new URL("http://localhost:3000/Doctor/checkForUpload");
            redirectUrl.searchParams.set('id', idDoctor);
            redirectUrl.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);
            redirectUrl.searchParams.set('BubbleSheetStudent', data.fileName);

            window.location.href = redirectUrl.toString();
        } else {
            showAlert("Upload failed. Try again.", 'danger');
            uploadPdfButton.disabled = false;
        }
    })
    .catch((error) => {
        console.error('Error:', error.message);
        showAlert("An error occurred during upload.", 'danger');
        uploadPdfButton.disabled = false;
    });
});
