
const examPage =document.querySelector(".Exa")
const profilePage =document.querySelector(".profile")
examPage.addEventListener('click',()=>{

    const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const idDoctor = params.get('id')

          
        setTimeout(() => {
            let url = new URL("http://localhost:3000/Doctor/DoctorExam"); 
            
            url.searchParams.set('id',idDoctor);                              
            window.location = url
        })
})
profilePage.addEventListener('click',()=>{

    const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const idDoctor = params.get('id')

          
        setTimeout(() => {
            let url = new URL("http://localhost:3000/Doctor/DoctorProfile"); 
            
            url.searchParams.set('id',idDoctor);                              
            window.location = url
        })
})
document.querySelector(".Que").addEventListener('click',()=>{
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search)
    const idDoctor = params.get('id')
    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/QuestionBank"); 
        
        url.searchParams.set('id',idDoctor);                              
        window.location = url
    })


})
document.querySelector(".Dic").addEventListener('click',()=>{
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search)
    const idDoctor = params.get('id')
    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/Dictionary"); 
        
        url.searchParams.set('id',idDoctor);                              
        window.location = url
    })


})

///////////////////////////////////////////////////////////

// document.querySelector(".make-lec").addEventListener('click',()=>{
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search)
//     const idDoctor = params.get('id')
//     setTimeout(() => {
//         let url = new URL("http://localhost:3000/Doctor/makeLec"); 
        
//         url.searchParams.set('id',idDoctor);                              
//         window.location = url
//     })


// })
// document.querySelector(".make-video").addEventListener('click',()=>{
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search)
//     const idDoctor = params.get('id')
//     setTimeout(() => {
//         let url = new URL("http://localhost:3000/Doctor/makevideo"); 
        
//         url.searchParams.set('id',idDoctor);                              
//         window.location = url
//     })


// })
// document.querySelector(".evalute").addEventListener('click',()=>{
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search)
//     const idDoctor = params.get('id')
//     setTimeout(() => {
//         let url = new URL("http://localhost:3000/Doctor/evaluate"); 
        
//         url.searchParams.set('id',idDoctor);                              
//         window.location = url
//     })


// })
// // document.querySelector(".Dic").addEventListener('click',()=>{
// //     const url = new URL(window.location.href);
// //     const params = new URLSearchParams(url.search)
// //     const idDoctor = params.get('id')
// //     setTimeout(() => {
// //         let url = new URL("http://localhost:3000/Doctor/Dictionary"); 
        
// //         url.searchParams.set('id',idDoctor);                              
// //         window.location = url
// //     })


// // })
