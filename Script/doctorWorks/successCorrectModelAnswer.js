const button =document.querySelector("#btn");
button.addEventListener('click',()=>{
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id')
    const AnswerBubbleSheet = params.get('AnswerBubbleSheet')
    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/uploadBubbelSheets");

        url.searchParams.set('id', idDoctor);
        url.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheet);

        window.location = url
    })
})