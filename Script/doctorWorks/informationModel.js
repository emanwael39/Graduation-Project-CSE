

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`;
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.width = '90%';
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    alertDiv.style.borderRadius = '10px';
    alertDiv.style.backgroundColor = type === 'success' ? '#d4edda' : type === 'danger' ? '#f8d7da' : '#cce5ff';
    alertDiv.style.color = type === 'success' ? '#155724' : type === 'danger' ? '#721c24' : '#004085';
    alertDiv.innerHTML = `
      <div class="container">
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 2000);
}
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idDoctor = params.get('id');
// جلب البيانات من السيرفر
fetch('http://localhost:3000/Doctor/informationModel', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idDoctor: idDoctor })
})
    .then(response => response.json())
    .then(data => {
        console.log(data);

        if (!data.documents || data.documents.length === 0) {
            showAlert('No courses found for the doctor.', 'warning');
            return;
        }

        // إنشاء dropdown لعرض أسماء الكورسات
        const courseDropdown = document.createElement('select');
        courseDropdown.className = 'form-select course-dropdown';
        courseDropdown.style.width = '50%';
        courseDropdown.style.margin = '15px auto';
        courseDropdown.innerHTML = '<option selected disabled>Select a Course</option>';

        // استخدم data.documents بدلاً من data
        data.documents.forEach(course => {
            const option = document.createElement('option');
            option.value = course._id;
            option.textContent = `${course.CourseName} (${course.CourseCode})`;
            courseDropdown.appendChild(option);
        });

        document.body.prepend(courseDropdown);

        // حدث عند اختيار الكورس
        courseDropdown.addEventListener('change', (e) => {
            const selectedCourseId = e.target.value;
            const selectedCourse = data.documents.find(course => course._id === selectedCourseId);

            if (selectedCourse) {
                document.querySelector(".input1").value = selectedCourse.Department;
                document.querySelector(".input2").value = selectedCourse.CourseName;
                document.querySelector(".input3").value = selectedCourse.CourseCode;
                document.querySelector(".input4").value = selectedCourse.CourseLevel;
                document.querySelector(".input5").value = selectedCourse.Semester;
                document.querySelector(".input6").value = selectedCourse.Instructor;
                document.querySelector(".input7").value = selectedCourse.Date;
                document.querySelector(".input8").value = selectedCourse.Time;
                document.querySelector(".input9").value = selectedCourse.FuLLMark;
                document.querySelector(".input10").value = selectedCourse.fORm;
                document.querySelector(".input11").value = selectedCourse.NumberofQuestions;

                showAlert(`Course ${selectedCourse.CourseName} loaded successfully!`, 'success');
            }
        });
    })
    .catch(error => {
        console.error(error);
        showAlert(`Error: ${error.message}`, 'danger');
    });

// إرسال البيانات
const send = document.querySelector(".send");
send.addEventListener('click', (e) => {
    e.preventDefault();

    const Department = document.querySelector(".input1").value;
    const CourseName = document.querySelector(".input2").value;
    const CourseCode = document.querySelector(".input3").value;
    const CourseLevel = document.querySelector(".input4").value;
    const Semester = document.querySelector(".input5").value;
    const Instructor = document.querySelector(".input6").value;
    const Date = document.querySelector(".input7").value;
    const Time = document.querySelector(".input8").value;
    const FuLLMark = document.querySelector(".input9").value;
    const fORm = document.querySelector(".input10").value;
    const NumberofQuestions = document.querySelector(".input11").value;

    if (Department === '' || CourseName === '' || CourseCode === '' || CourseLevel === '' || Semester === '' || Instructor === '' || Date === '' || Time === '' || FuLLMark === '' || fORm === '' || NumberofQuestions === '') {
        showAlert("Please complete the form!", 'danger');
    } else {
        showAlert("Please wait until save Information", 'info');
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const modelName = params.get('modelName')

        fetch('http://localhost:3000/Doctor/informationModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modelName, Department, CourseName, CourseCode, CourseLevel, Semester, Instructor, Date, Time, FuLLMark, fORm, NumberofQuestions
            })
        })
            .then(response => response.json())
            // .then(data => {
            //     console.log(data.message)
            //     if (data.message == 'Model saved successfully!') {
            //         showAlert("Information saved successfully", 'success');
            //         const url = new URL(window.location.href);
            //         const params = new URLSearchParams(url.search);
            //         const idDoctor = params.get('id')
            //         const modelName = params.get('modelName')
            //         setTimeout(() => {
            //             let url = new URL("http://localhost:3000/Doctor/AddQuestion");
            //             url.searchParams.set('id', idDoctor);
            //             url.searchParams.set('modelName', modelName);
            //             window.location = url
            //         })

            //     }
            // })
            .then(data => {
                console.log(data.message)
                if (data.message == 'Model saved successfully!') {
                    showAlert("Information saved successfully", 'success');
                    const url = new URL(window.location.href);
                    const params = new URLSearchParams(url.search);
                    const idDoctor = params.get('id')
                    const modelName = params.get('modelName')
                    setTimeout(() => {
                        let url = new URL("http://localhost:3000/Doctor/mymatrials");
                        url.searchParams.set('id', idDoctor);
                        url.searchParams.set('modelName', modelName);
                        url.searchParams.set('course', CourseName);
                        window.location = url
                    })

                }
            })
            .catch(error => {
                showAlert(`Error: ${error.message}`, 'danger');
            });
    }
});

