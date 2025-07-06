const creastePdfPage = document.querySelector(".button1")
const modelQuestion = document.querySelector(".button2")
const correctBubbleSheeet = document.querySelector(".button3")
creastePdfPage.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id')


    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/CreateBubbleSheet");

        url.searchParams.set('id', idDoctor);
        window.location = url
    })
})


modelQuestion.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id')


    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/StartingNewModel");

        url.searchParams.set('id', idDoctor);
        window.location = url
    })
})






correctBubbleSheeet.addEventListener('click', () => {
 console.log("ahmed")
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id')
    // دالة لتوليد 8 حروف عشوائية
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // الحروف المسموح بها
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    // الحصول على قيمة auth من الـ URL
    

    // توليد السلسلة العشوائية
    const randomString = generateRandomString(8); // توليد 8 حروف عشوائية




    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/AnswerSheet");

        url.searchParams.set('id', idDoctor);
     // توليد 8 حرعشوائوف 
        url.searchParams.set('auth',randomString)
        window.location = url
    })
})