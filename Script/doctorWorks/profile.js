// console.log("ahmed")
// const url = new URL(window.location.href);
// const params = new URLSearchParams(url.search);
// const idDoctor = params.get('id')
// fetch('http://localhost:3000/Doctor/DoctorProfile',{
//     method :"POST",
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ idDoctor: idDoctor})
// }).then(response => response.json())
// .then((data)=>{
//     console.log(data.doctorDetails)
// })
// console.log("ahmed");
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idDoctor = params.get('id');

fetch('http://localhost:3000/Doctor/DoctorProfile', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idDoctor: idDoctor })
})
    .then(response => response.json())
    .then((data) => {
        const doctor = data.doctorDetails;

        if (doctor) {
            // تعبئة القيم في الصفحة
            document.getElementById("doctor-img").src = `/images/${doctor.image.filename}`;
            document.getElementById("doctor-name").innerText = `DR. ${doctor.nameDoctor}`;
            document.getElementById("doctor-email").innerText = doctor.emailDoctor;

            document.getElementById("doctor-department").innerText = `Department: ${doctor.departmentDoctor}`;
            document.getElementById("doctor-specialization").innerText = `Specialization: ${doctor.specializationDoctor}`;
            document.getElementById("doctor-office").innerText = `Office number: ${doctor.officeDoctor}`;
            document.getElementById("doctor-experience").innerText = `Years of experience: ${doctor.expDoctor}`;
            document.getElementById("doctor-phone").innerText = `Doctor's Number: ${doctor.phoneDoctor}`;
        } else {
            console.error("No doctor details found");
        }
    })
    .catch(error => {
        console.error("Error fetching doctor profile:", error);
    });
