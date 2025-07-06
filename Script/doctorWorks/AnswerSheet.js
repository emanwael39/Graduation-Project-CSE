const uploadPdfButton = document.querySelector(".btn1")
const uploadPdfValue = document.querySelector("#pdf")
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
    console.log("ahmed")
    uploadPdfButton.disabled=true
    const formData = new FormData();
    if (uploadPdfValue.files.length > 0) {
        // formData.append("image", uploadPdfValue.files[0]);
        formData.append("file", uploadPdfValue.files[0]); 

    } else {
        // console.log("No image file selected.");
        showAlert("No image file selected.", 'danger')
    }
    fetch('http://localhost:3000/Doctor/AnswerSheet', {
        method: 'PATCH',
        body: formData
    })

        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json(); // تحليل الاستجابة إلى JSON
        })
        .then((data) => {
            if (data.message == "Process completed successfully") {
                console.log('File Name:', data.fileName);
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                const idDoctor = params.get('id')
                setTimeout(() => {
                    let url = new URL("http://localhost:3000/Doctor/waitedUpload");

                    url.searchParams.set('id', idDoctor);
                    url.searchParams.set('fileName', data.fileName);

                    window.location = url
                }, 1000)

            }

        })
        .catch((error) => {
            console.error('Error:', error.message);
        });


})