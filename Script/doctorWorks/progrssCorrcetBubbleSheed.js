
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idDoctor = params.get('id');
const AnswerBubbleSheet = params.get('AnswerBubbleSheet');
const BubbleSheetStudent = params.get('BubbleSheetStudent');
const pagesNumber = params.get('pagesNumber');
const BubbleSheetStudentBaseName = BubbleSheetStudent.replace('.pdf', '');
const startButton = document.getElementById('start-button');
const loadingCircle = document.getElementById('loading-circle');
const checkmark = document.getElementById('checkmark');
const statusContainer = document.getElementById('status-container');


startButton.addEventListener('click', () => {
    // إخفاء الزر
    startButton.style.display = 'none';
    const sectionToRemove = document.getElementById('remove');
    if (sectionToRemove) {
        sectionToRemove.remove(); // حذف العنصر نهائيًا
    }

    // عرض حاوية الحالة
    statusContainer.style.display = 'block';

    // بدء عملية الفيتش
    fetch('http://localhost:3000/Doctor/progrssCorrcetBubbleSheed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ BubbleSheetStudentBaseName: BubbleSheetStudentBaseName, pagesNumber: pagesNumber }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data === "Completed processing all pages successfully.") {
                // حذف العنصر بالكامل
             

                // إيقاف الدوران وإخفاء الدائرة
                loadingCircle.style.animation = 'none';
                loadingCircle.style.display = 'none';

                // إظهار علامة الصح
                checkmark.style.display = 'block';

                // إعادة التوجيه بعد وقت
                setTimeout(() => {
                    let url = new URL("http://localhost:3000/Doctor/setDegree");
                    url.searchParams.set('id', idDoctor);
                    url.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);
                    url.searchParams.set('BubbleSheetStudent', BubbleSheetStudent);
                    window.location = url;
                }, 1000);
            }
        })
        .catch((e) => {
            console.error(e);
        });
});




