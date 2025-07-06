
const but = document.querySelector(".Button")
but.addEventListener("click", () => {
    // console.log("ahmed")
    const degree = document.querySelector("#inp1").value
    const Namepdf = document.querySelector("#inp2").value
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id');     
    const AnswerBubbleSheet = params.get('AnswerBubbleSheet');
    const AnswerBubbleSheetJson=AnswerBubbleSheet.replace(".pdf",".json")
    const BubbleSheetStudent = params.get('BubbleSheetStudent');
    const BubbleSheetStudentJson=BubbleSheetStudent.replace(".pdf",".json")
    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/ResultStudent");
        url.searchParams.set('id', idDoctor);                              
        url.searchParams.set('AnswerBubbleSheet', AnswerBubbleSheetJson);
        url.searchParams.set('BubbleSheetStudent', BubbleSheetStudentJson);
        url.searchParams.set('degree', degree);
        url.searchParams.set('Namepdf', Namepdf);
        window.location = url
    },1000)

})       