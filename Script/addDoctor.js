

function generateRandomID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateRandomPassword(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

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

const send = document.querySelector("#send");

send.addEventListener('click', (e) => {
    e.preventDefault();

    const nameDoctor = document.querySelector("#name").value;
    const emailDoctor = document.querySelector("#d-email").value;
    const phoneDoctor = document.querySelector("#d-number").value;
    const specializationDoctor = document.querySelector("#d-specialization").value;
    const departmentDoctor = document.querySelector("#d-department").value;
    const officeDoctor = document.querySelector("#d-office-number").value;
    const picDoctor = document.querySelector("#d-profile-pic");
    const expDoctor = document.querySelector("#d-years-of-exp").value;

    if (nameDoctor === "" || emailDoctor === "" || phoneDoctor === "" || specializationDoctor === "" || departmentDoctor === "" || officeDoctor === "" || expDoctor === "") {
        showAlert("Please provide all doctor information.", 'danger');
        return;
    }

    if (!picDoctor.files || picDoctor.files.length === 0) {
        showAlert("Please select a profile picture for the doctor.", 'danger');
        return;
    }

    // Generate random ID and Password at the moment of form submission
    const randomID = generateRandomID();
    const randomPassword = generateRandomPassword(10);

    const formData = new FormData();
    formData.append("nameDoctor", nameDoctor);
    formData.append("emailDoctor", emailDoctor);
    formData.append("phoneDoctor", phoneDoctor);
    formData.append("specializationDoctor", specializationDoctor);
    formData.append("departmentDoctor", departmentDoctor);
    formData.append("officeDoctor", officeDoctor);
    formData.append("image", picDoctor.files[0]);
    formData.append("expDoctor", expDoctor);
    formData.append("randomID", randomID);
    formData.append("randomPassword", randomPassword);

    // Debugging log: Check form data before sending
    console.log("Form Data:", {
        nameDoctor,
        emailDoctor,
        phoneDoctor,
        specializationDoctor,
        departmentDoctor,
        officeDoctor,
        expDoctor,
        randomID,
        randomPassword
    });

    fetch('http://localhost:3000/Admine/Doctor/add', {
        method: 'POST',
        body: formData
    })
        .then((res) => {
            console.log("Response status:", res.status);
            return res.json();  // If this fails, it will be caught by the catch block
        })
        .then((data) => {
            console.log("Server Response:", data);
            if (data && data.success) {
                showAlert("Doctor added successfully!", 'success');
                setTimeout(() => {
                    let url = new URL("http://localhost:3000/AdmineWorking78c7dceee96b4f8eb68d7419f32fb6b430bcd09508a23ed28d935ccd37");
                    window.location = url;
                }, 1000);
            } else {
                console.error("Unexpected response data:", data);
                showAlert("Failed to add doctor. The name of doctor or email is repeated please try another", 'danger');
            }
        })
        .catch((error) => {
            console.error("Error occurred:", error);
            showAlert("Failed to add doctor. Please try again or login again.", 'danger');
        });
});
