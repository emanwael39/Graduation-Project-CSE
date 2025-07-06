
const sendButton = document.querySelector(".But")

function showAlert(message, type) {
    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`;
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050; // Ensure the alert is above other content
    alertDiv.style.height = '60px'; // Set the fixed height
    alertDiv.style.width = '100%'; // Full width of the viewport
    alertDiv.style.maxWidth = '600px'; // Optional: max width for larger screens
    alertDiv.style.display = 'flex'; // Use flexbox for alignment
    alertDiv.style.alignItems = 'center'; // Center content vertically
    alertDiv.style.justifyContent = 'space-between'; // Space the message and button
    alertDiv.style.margin = '0 auto'; // Center horizontally
    alertDiv.style.padding = '0 15px'; // Add horizontal padding

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.fontSize = '20px'; // Set font size
    messageDiv.style.fontFamily = 'Arial, sans-serif'; // Set font style
    messageDiv.style.flexGrow = '1'; // Allow message div to grow

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');

    alertDiv.appendChild(messageDiv);
    alertDiv.appendChild(closeButton);

    // Append the alert to the body (so it appears on top of all content)
    document.body.appendChild(alertDiv);

    // Optionally, remove the alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}




sendButton.addEventListener('click', (event) => {
    const inputId = document.querySelector(".inputId").value
    const inputPassword = document.querySelector(".inputPassword").value
    event.preventDefault();
    if (inputId == "" || inputPassword == "") {
        showAlert("please Compelte The Form", 'danger')
    } else {
        console.log(inputPassword, inputId)
        fetch('http://localhost:3000/Doctor/loginDoctor307f5f6f08c68dc1c04e400f59b4ae765fbafc524190f59b4ae765fbafc52419', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputId: inputId, inputPassword: inputPassword })
        }).then(response => response.json())
            .then((data) => {
                console.log(data)
                if ((data.length === 0)) {
                    showAlert("There is wrong in ID OR Password Try Again", 'danger')
                }
                else {
                    showAlert("Successfily Login ", 'success')
                    const doctor = data[0];
                  localStorage.setItem("identifiyId" , doctor._id)
                  localStorage.setItem("DoctorName" , doctor.nameDoctor)
                  localStorage.setItem("DoctorEmail" , doctor.emailDoctor)
                  localStorage.setItem("DoctorEmail" , doctor.emailDoctor)
                  localStorage.setItem("DoctorDepartment" , doctor.departmentDoctor)
                  localStorage.setItem("Doctorphone" , doctor.phoneDoctor)
                  localStorage.setItem("Y.OF.EXP" , doctor.expDoctor)
                  localStorage.setItem("officeDoctor" , doctor.officeDoctor)
                  localStorage.setItem("imageDoctor" , doctor.image.filename)

                   
                  setTimeout(() => {
                    let url = new URL("http://localhost:3000/Doctor/DoctorHome");
                    url.searchParams.set('id', doctor._id);                              
                    url.searchParams.set('DoctorName', doctor.nameDoctor);
                    window.location = url
                })
               
                }
            }).catch((e) => {
                showAlert('There is error in your connection', 'danger')
            })
    }



})
