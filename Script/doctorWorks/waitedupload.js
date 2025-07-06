

// const startCorrrect = document.querySelector("#button1");
// document.addEventListener("DOMContentLoaded", function () {
//     const loadingCircle = document.querySelector('.loading-circle');
//     const checkmark = document.querySelector('.checkmarks');
//     const nextButton = document.querySelector('.next-button');
//     const progressBarContainer = document.querySelector('.progress-bar-container');
//     const progressBar = document.querySelector('.progress-bar');
//     const speech = document.querySelector('.p1');

//     // Hide the checkmark and success message initially
//     checkmark.style.display = 'none';

//     // Show loading circle and speech text initially
//     loadingCircle.style.display = 'block';
//     speech.style.display = 'block';

//     // After 8 seconds, hide loading circle, show the checkmark and next button
//     setTimeout(() => {
//         loadingCircle.style.display = 'none';
//         speech.style.display = 'none';
//         checkmark.style.display = 'block';
//         nextButton.style.display = 'block';
//     }, 8000);

//     // Start progress bar on button click
//     nextButton.addEventListener('click', () => {
//         checkmark.style.display = 'none';
//         nextButton.style.display = 'none';
//         progressBarContainer.style.display = 'block';
//     });
// });


// startCorrrect.addEventListener('click', () => {
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search);
//     const fileName = params.get('fileName');

//     // إزالة امتداد .pdf
//     const fileNameWithoutExtension = fileName.replace('.pdf', '');

//     console.log(fileNameWithoutExtension);

//     // بدء شريط التقدم
//     let width = 0;
//     const progressBar = document.querySelector('.progress-bar');
//     const interval = setInterval(() => {
//         if (width < 90) {
//             width++; // شريط التقدم يصل حتى 90%
//             progressBar.style.width = width + '%';
//             progressBar.innerHTML = width + '%';
//         }
//     }, 100); // السرعة قابلة للتعديل

//     fetch('http://localhost:3000/Doctor/waitedUpload', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ fileNameWithoutExtension: fileNameWithoutExtension }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//         console.log(data);
//             if (data === "Completed processing all pages successfully.") {
//                 clearInterval(interval); // إيقاف شريط التقدم
//                 progressBar.style.width = '100%'; // اكتمال 100%
//                 progressBar.innerHTML = '100%';
//                 // console.log("Processing completed.");
//                 const url = new URL(window.location.href);
//                 const params = new URLSearchParams(url.search);
//                 const idDoctor = params.get('id')
//                 const AnswerBubbleSheet = params.get('fileName')
//                 setTimeout(() => {
//                     let url = new URL("http://localhost:3000/Doctor/successCorrectModelAnswer");
    
//                     url.searchParams.set('id', idDoctor);
//                     url.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);
    
//                     window.location = url
//                 })
//             }
//         })
//         .catch((e) => {
//             console.log(e);
//             clearInterval(interval); // إيقاف شريط التقدم في حال وجود خطأ
//         });
// });

document.addEventListener("DOMContentLoaded", function () {
    const loadingCircle = document.querySelector('.loading-circle');
    const checkmark = document.querySelector('.checkmarks');
    const nextButton = document.querySelector('.next-button');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const speech = document.querySelector('.p1');

    function createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.width = (Math.random() * 6 + 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // إخفاء العناصر الأولية
    checkmark.style.display = 'none';
    progressBarContainer.style.display = 'none';
    nextButton.style.display = 'none';

    // عرض الـ loading
    loadingCircle.style.display = 'block';
    speech.style.display = 'block';

    // بعد 3 ثواني - عرض success وزرار البدء
    setTimeout(() => {
        loadingCircle.style.display = 'none';
        checkmark.style.display = 'block';
        nextButton.style.display = 'inline-block';
        speech.style.display = 'none';
    }, 3000);
});

// عند الضغط على زرار بدء التصحيح
const startCorrrect = document.querySelector("#button1");

startCorrrect.addEventListener('click', () => {
    const checkmark = document.querySelector('.checkmarks');
    const nextButton = document.querySelector('.next-button');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');

    checkmark.style.display = 'none';
    nextButton.style.display = 'none';
    progressBarContainer.style.display = 'block';

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const fileName = params.get('fileName');

    const fileNameWithoutExtension = fileName.replace('.pdf', '');
    console.log(fileNameWithoutExtension);

    // بدء شريط التقدم
    let width = 0;
    const interval = setInterval(() => {
        if (width < 90) {
            width++;
            progressBar.style.width = width + '%';
            progressBar.innerHTML = width + '%';
        }
    }, 100);

    fetch('http://localhost:3000/Doctor/waitedUpload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileNameWithoutExtension: fileNameWithoutExtension }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data === "Completed processing all pages successfully.") {
                clearInterval(interval);
                progressBar.style.width = '100%';
                progressBar.innerHTML = '100%';

                const idDoctor = params.get('id');
                const AnswerBubbleSheet = params.get('fileName');
                setTimeout(() => {
                    let url = new URL("http://localhost:3000/Doctor/successCorrectModelAnswer");
                    url.searchParams.set('id', idDoctor);
                    url.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);
                    window.location = url;
                }, 500); // تأخير بسيط للتأثير
            }
        })
        .catch((e) => {
            console.log(e);
            clearInterval(interval);
        });
});
