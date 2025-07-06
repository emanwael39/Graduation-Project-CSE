// function showAlert(message, type) {
//     // Create the alert div
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`; 
//     alertDiv.role = 'alert';
//     alertDiv.style.zIndex = 1050; // Ensure the alert is above other content
//     alertDiv.style.height = '60px'; // Set the fixed height
//     alertDiv.style.width = '100%'; // Full width of the viewport
//     alertDiv.style.maxWidth = '600px'; // Optional: max width for larger screens
//     alertDiv.style.display = 'flex'; // Use flexbox for alignment
//     alertDiv.style.alignItems = 'center'; // Center content vertically
//     alertDiv.style.justifyContent = 'space-between'; // Space the message and button
//     alertDiv.style.margin = '0 auto'; // Center horizontally
//     alertDiv.style.padding = '0 15px'; // Add horizontal padding

//     const messageDiv = document.createElement('div');
//     messageDiv.textContent = message;
//     messageDiv.style.fontSize = '20px'; // Set font size
//     messageDiv.style.fontFamily = 'Arial, sans-serif'; // Set font style
//     messageDiv.style.flexGrow = '1'; // Allow message div to grow

//     const closeButton = document.createElement('button');
//     closeButton.type = 'button';
//     closeButton.className = 'btn-close';
//     closeButton.setAttribute('data-bs-dismiss', 'alert');
//     closeButton.setAttribute('aria-label', 'Close');

//     alertDiv.appendChild(messageDiv);
//     alertDiv.appendChild(closeButton);

//     // Append the alert to the body (so it appears on top of all content)
//     document.body.appendChild(alertDiv);

//     // Optionally, remove the alert after 5 seconds
//     setTimeout(() => {
//         alertDiv.remove();
//     }, 5000);
// }

// let doctors = []; // Make doctors a global variable

// fetch("http://localhost:3000/Admine/Doctor/allDoctor", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then((tasks) => tasks.json())
//     .then((data) => {
//         doctors = data; // Store doctors data globally
//         displayProfiles(doctors); // Initial display of all profiles
//         const btns = document.querySelectorAll('.delete');

//         Array.from(btns).forEach(function (btn) {
//             btn.addEventListener('click', () => {
//                 const deletedid = btn.getAttribute("deleteditem"); // Correct attribute spelling
//                 console.log(deletedid); // Print the ID to the console
//                 fetch('http://localhost:3000/Admine/Doctor/allDoctor',{
//                     method: 'DELETE',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({deletedid:deletedid})
//                 }).then(response => response.json())
//                 .then((data)=>{
//                     showAlert("You have deleted Doctor Success",'success')
//                     window.location.reload()
//                 }).catch((e)=>{
//                     showAlert(e,'danger')
//                 })
//             });
//         });
//     })
//     .catch((e) => {
//         console.log(e);
//     });

// // Move displayProfiles outside the fetch to be globally accessible
// function displayProfiles(doctors) {
//     const profileContainer = document.getElementById('profileContainer');
//     profileContainer.innerHTML = doctors.map(generateProfileCard).join('');
// }


// function generateProfileCard(doctor) {
//     return `
//         <div class="profile-card" style="box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 10px; margin: 10px; width: 40vw; display: flex; flex-direction: column; align-items: center; justify-content: center;">
//             <div style="display: flex; justify-content: center; align-items: center; position: relative;">
//                 <img src="/images/${doctor.image.filename}" alt="Image of doctor" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 2px solid #2262C6;">
//                 <span style="position: absolute; top: 50%; left: -70%; transform: translate(-50%, -50%); font-weight: bold; color: #333;">${doctor.nameDoctor}</span>
//             </div>
//             <div class="name" style="text-align: center; margin-top: 10px; color: #384B70;">
//                 <h3>${doctor.nameDoctor}</h3>
//             </div>
//             <div class="email" style="text-align: center; color: #4F6081;">
//                 <p>${doctor.emailDoctor}</p>
//             </div>
//             <div class="details" style="display: none; margin-top: 10px; color: #4F6081;">
//                 <p><strong>Specialization:</strong> ${doctor.specializationDoctor}</p>
//                 <p><strong>Experience:</strong> ${doctor.expDoctor}</p>
//                 <p><strong>Phone:</strong> ${doctor.phoneDoctor}</p>
//                 <p><strong>Office Number:</strong> ${doctor.officeDoctor}</p>
//                 <p><strong>Id:</strong> ${doctor.IdDoctor}</p>
//                 <p><strong>Password:</strong> ${doctor.passDoctor}</p>
//             </div>
//             <div class="buttons" style="display: flex; justify-content: space-between; margin-top: 10px; width: 100%;">
//                 <button class="show-more" onclick="toggleDetails(this)" style="background-color: #2262C6; border-radius: 15px; color: white; padding: 10px 20px; cursor: pointer;">Show more</button>
//                 <button class="delete" deleteditem='${doctor._id}' style="background-color: #EE2F38; border-radius: 15px; color: white; padding: 10px 20px; cursor: pointer;">Delete</button>
//             </div>
//         </div>
//     `;
// }



// // Move searchProfiles outside fetch to be globally accessible
// function searchProfiles() {
//     const searchInput = document.getElementById('searchInput').value.toLowerCase();
//     const filteredDoctors = doctors.filter(doctor => doctor.nameDoctor.toLowerCase().includes(searchInput));
//     displayProfiles(filteredDoctors);
// }

// // Move toggleDetails outside fetch to be globally accessible
// function toggleDetails(button) {
//     const details = button.parentElement.previousElementSibling;
//     if (details.style.display === "none" || details.style.display === "") {
//         details.style.display = "block";
//         button.textContent = "Show less";
//     } else {
//         details.style.display = "none";
//         button.textContent = "Show more";
//     }
// }


// // /////////////////////////////////////////////////////////////////////
// // //fot delete 



let doctors = []; // Make doctors a global variable

// Fetch doctors data and display it
fetch("http://localhost:3000/Admine/Doctor/allDoctor", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then((tasks) => tasks.json())
    .then((data) => {
        if (data.length !== doctors.length) { // Check if the data is different from the previous data
            doctors = data; // Store doctors data globally
            console.log(doctors)
            displayProfiles(doctors); // Initial display of all profiles
            const btns = document.querySelectorAll('.delete');

            Array.from(btns).forEach(function (btn) {
                btn.addEventListener('click', () => {
                    const deletedid = btn.getAttribute("deleteditem"); // Correct attribute spelling
                    console.log(deletedid); // Print the ID to the console
                    fetch('http://localhost:3000/Admine/Doctor/allDoctor',{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({deletedid:deletedid})
                    }).then(response => response.json())
                    .then((data)=>{
                        showAlert("You have deleted Doctor Success",'success')
                        window.location.reload()
                    }).catch((e)=>{
                        showAlert(e,'danger')
                    })
                });
            });
            
        }
    })
    .catch((e) => {
        console.log(e);
    });

// Function to display profiles
function displayProfiles(doctors) {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = ''; // Clear the container before adding new profiles
    profileContainer.innerHTML = doctors.map(generateProfileCard).join('');
}

// Function to generate profile card HTML
function generateProfileCard(doctor) {
    return `
        <div class="profile-card" style="box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 10px; margin: 10px; width: 40vw; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="display: flex; justify-content: center; align-items: center; position: relative;">
                <img src="/images/${doctor.image.filename}" alt="Image of doctor" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 2px solid #2262C6;">
        
            </div>
            <div class="name" style="text-align: center; margin-top: 10px; color: #384B70;">
                <h3>${doctor.nameDoctor}</h3>
            </div>
            <div class="email" style="text-align: center; color: #4F6081;">
                <p>${doctor.emailDoctor}</p>
            </div>
            <div class="details" style="display: none; margin-top: 10px; color: #4F6081;">
                <p><strong>Specialization:</strong> ${doctor.specializationDoctor}</p>
                <p><strong>Experience:</strong> ${doctor.expDoctor}</p>
                <p><strong>Phone:</strong> ${doctor.phoneDoctor}</p>
                <p><strong>Office Number:</strong> ${doctor.officeDoctor}</p>
                <p><strong>Id:</strong> ${doctor.IdDoctor}</p>
                <p><strong>Password:</strong> ${doctor.passDoctor}</p>
            </div>
            <div class="buttons" style="display: flex; justify-content: space-between; margin-top: 10px; width: 100%;">
                <button class="show-more" onclick="toggleDetails(this)" style="background-color: #2262C6; border-radius: 15px; color: white; padding: 10px 20px; cursor: pointer;">Show more</button>
                <button class="delete" deleteditem='${doctor._id}' style="background-color: #EE2F38; border-radius: 15px; color: white; padding: 10px 20px; cursor: pointer;">Delete</button>
            </div>
        </div>
    `;
}

// Function to search and filter profiles
function searchProfiles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredDoctors = doctors.filter(doctor => doctor.nameDoctor.toLowerCase().includes(searchInput));
    displayProfiles(filteredDoctors);
}

// Function to toggle the details visibility
function toggleDetails(button) {
    const details = button.parentElement.previousElementSibling;
    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block";
        button.textContent = "Show less";
    } else {
        details.style.display = "none";
        button.textContent = "Show more";
    }
}

// Function to show alert messages
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`;
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050;
    alertDiv.style.height = '60px';
    alertDiv.style.width = '100%';
    alertDiv.style.maxWidth = '600px';
    alertDiv.style.display = 'flex';
    alertDiv.style.alignItems = 'center';
    alertDiv.style.justifyContent = 'space-between';
    alertDiv.style.margin = '0 auto';
    alertDiv.style.padding = '0 15px';

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.fontSize = '20px';
    messageDiv.style.fontFamily = 'Arial, sans-serif';
    messageDiv.style.flexGrow = '1';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');

    alertDiv.appendChild(messageDiv);
    alertDiv.appendChild(closeButton);

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
