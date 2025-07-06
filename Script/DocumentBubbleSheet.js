
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


function toggleDropdown() {
    document.getElementById('dropdown').classList.toggle('hidden');
}
async function showMaterials(department) {
    try {
        const response = await fetch('http://localhost:3000/Admine/Doctor/AddCourse', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
       
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        const filteredMaterials = data.filter(item => 
            item.department.toLowerCase() === department.toLowerCase()
        );

        const materialsList = document.getElementById(`${department.toLowerCase()}Materials`);
        if (!materialsList) return;

        materialsList.innerHTML = filteredMaterials.length > 0 
            ? filteredMaterials.map(material => `
                <li class="mb-2 cursor-pointer p-2 bg-blue-200 rounded-lg hover:bg-blue-300" 
                    onclick="selectMaterial('${department}', '${material.materialText}')">
                    ${material.materialText}
                </li>
            `).join("")
            : "<li class='p-2 text-gray-500'>No materials available</li>";

        // إظهار القسم المطلوب وإخفاء الباقي
        document.querySelectorAll("#materials > div").forEach(div => div.classList.add("hidden"));
        document.getElementById(department.toLowerCase()).classList.remove("hidden");

        // إغلاق القائمة بعد الاختيار
        document.getElementById('dropdown').classList.add('hidden');

    } catch (error) {
        console.error("Error fetching materials:", error);
    }
}

function selectMaterial(department, material) {
    document.getElementById('categoryName').value = department;
    document.getElementById('materialName').value = material;
    console.log(`Selected: ${department} - ${material}`);
}




const send = document.querySelector(".btn");
send.addEventListener('click', (e) => {
    e.preventDefault();
    const Department = document.querySelector(".input1").value;
    const CourseName = document.querySelector(".input2").value;
    const CourseCode = document.querySelector(".input3").value;
    const CourseLevel = document.querySelector(".input4").value;
    const Semester = document.querySelector(".input5").value;
    const Instructor = document.querySelector(".input6").value;
    const Date = ""
    const Time = document.querySelector(".input8").value;
    const FuLLMark = document.querySelector(".input9").value;
    const fORm = document.querySelector(".input10").value;
    const NumberofQuestions = document.querySelector(".input11").value;
    const NumberofColumns =""

    if (Department === '' || CourseName === '' || CourseCode === '' || CourseLevel === '' || Semester === '' || Instructor === '' || Time === '' || FuLLMark === '' || fORm === '' || NumberofQuestions === '' ) {
        showAlert("Please complete the form!", 'danger');
    } else {
        // showAlert("Please wait until added in the list", 'info');
        showAlert("You have add Document to list successfully!", 'success');

        fetch('http://localhost:3000/Admine/Doctor/AddCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Department: Department,
                CourseName: CourseName,
                CourseCode: CourseCode,
                CourseLevel: CourseLevel,
                Semester: Semester,
                Instructor: Instructor,
                Date: Date,
                Time: Time,
                FuLLMark: FuLLMark,
                fORm: fORm,
                NumberofQuestions: NumberofQuestions,
                NumberofColumns: NumberofColumns
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create PDF');
            }
            return response.blob();  // Get the PDF as a Blob (binary large object)
        })
        .then(blob => {
     
            showAlert("You have add Document to list successfully!", 'success');
        })
        .catch(error => {
            showAlert(`Error: ${error.message}`, 'danger');
        });
    }
});
