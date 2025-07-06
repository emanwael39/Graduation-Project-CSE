const btn =document.querySelector(".button")
btn.addEventListener("click", () => {
    
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idDoctor = params.get('id')
    


    setTimeout(() => {
        let url = new URL("http://localhost:3000/Doctor/informationModel");
        const randomNumber = Math.floor(Math.random() * 1e10).toString().padStart(10, '0');
        url.searchParams.set('id', idDoctor);
        url.searchParams.set('modelName', randomNumber);
        window.location = url
    })
  });