const url = window.location.href;
const params = new URLSearchParams(new URL(url).search);

const year = params.get("Year");
const fs = params.get("f/s");
const field = params.get("field");

console.log(year);
console.log(fs);
console.log(field);
document.querySelector(".year").value = year;
document.querySelector(".term").value = fs;
document.querySelector(".department").value = field;

fetch('http://localhost:3000/Admine/Doctor/Addinglist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
})
    .then(response => response.json())
    .then((data) => {
        console.log(data);

        const selectElement = document.getElementById("doctor");

        // التأكد من أن البيانات مصفوفة
        if (Array.isArray(data)) {
            data.forEach(doctor => {
                const option = document.createElement("option");
                option.value = doctor.nameDoctor // تعيين الـ id كـ value
                option.textContent = doctor.nameDoctor; // اسم الدكتور في القائمة
                selectElement.appendChild(option);
            });
        } else {
            console.error("البيانات غير متوقعة:", data);
        }
    })
    .catch(error => console.error("حدث خطأ أثناء جلب البيانات:", error));

///////////////////////////////////////////////////////////////////////////////////////////
fetch('http://localhost:3000/Admine/Doctor/Addinglist', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
})
    .then(response => response.json())
    .then((data) => {
        console.log(data);

        const departmentInput = document.querySelector(".department").value; // جلب قيمة القسم من الإدخال
        const materialsContainer = document.querySelector(".mt-2"); // المكان اللي هيتحط فيه الـ Materials

        // تفريغ المواد القديمة
        materialsContainer.innerHTML = "";

        // التأكد إن البيانات مصفوفة
        if (Array.isArray(data)) {
            data.forEach(material => {
                if (material.department === departmentInput) { // لو القسم متطابق
                    const materialId = `material-${material._id}`;

                    // إنشاء عنصر جديد للماتريال
                    const materialDiv = document.createElement("div");
                    materialDiv.innerHTML = `
                    <input type="checkbox" id="${materialId}" name="materials" value="${material.materialText}" class="mr-2">
                    <label for="${materialId}" class="text-gray-700">${material.materialText}</label>
                `;

                    // إضافة العنصر إلى القائمة
                    materialsContainer.appendChild(materialDiv);
                }
            });
        } else {
            console.error("البيانات غير متوقعة:", data);
        }


    })
    .catch(error => console.error("حدث خطأ أثناء جلب البيانات:", error));

/////////////////////////////////////////////
document.querySelector(".next").addEventListener("click", function () {
    const selectedTeam = document.getElementById("team").value;
    const selectedDoctor = document.querySelector(".doctorSelect").value;

    const selectedMaterials = [];

    document.querySelectorAll('input[name="materials"]:checked').forEach((checkbox) => {
        selectedMaterials.push(checkbox.value);
    });



    const yearValue = document.querySelector("#year").value
    const departmentValue = document.querySelector("#department").value
    console.log(yearValue, departmentValue, selectedTeam, selectedDoctor, selectedMaterials)

    fetch('http://localhost:3000/Admine/Doctor/Addinglist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            yearValue, 
            departmentValue, 
            selectedTeam, 
            selectedDoctor, 
            selectedMaterials 
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log("Response from server:", data);
    
       
    
        let table = document.getElementById("dataTable");
        if (!table) {
            table = document.createElement("table");
            table.id = "dataTable";
            table.className = "styled-table"; // إضافة كلاس للتنسيق
            document.body.appendChild(table);
    
            // إنشاء رأس الجدول
            let thead = table.createTHead();
            let headerRow = thead.insertRow();
            ["Year", "Department", "Team", "Doctor", "Materials"].forEach(text => {
                let th = document.createElement("th");
                th.innerText = text;
                headerRow.appendChild(th);
            });
    
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
        }
    
        let tbody = table.getElementsByTagName('tbody')[0];
    
        // إضافة البيانات للجدول
        let newRow = tbody.insertRow();
        newRow.insertCell(0).innerText = yearValue;
        newRow.insertCell(1).innerText = departmentValue;
        newRow.insertCell(2).innerText = selectedTeam;
        newRow.insertCell(3).innerText = selectedDoctor;
        newRow.insertCell(4).innerText = selectedMaterials.join(", ");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("❌ Failed to add to the list");
    });
    
});