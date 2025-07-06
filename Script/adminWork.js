function showAlert(message, type) {
    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`; // Add 'text-center' for centering text
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050; // Ensure the alert is above other content
    alertDiv.style.margin = '0 auto'; // Center horizontally
    alertDiv.innerHTML = `
      <div class="container">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    // Append the alert to the body (so it appears on top of all content)
    document.body.appendChild(alertDiv);

    // Optionally, remove the alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 2000);
}


fetch('http://localhost:3000/AdmineWorking78c7dceee96b4f8eb68d7419f32fb6b430bcd09508a23ed28d935ccd37', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    
}).then(response => response.json())
.then((data)=>{
   if(data=='Welcome Admin Take your time'){
    showAlert(data ,'info')
   }else{
    showAlert('please login first' ,'warning')
    setTimeout(() => {
                   
        let url = new URL("http://localhost:3000/loginAdmine307f5f6608c68dc1c04e400f59b4ae765fbafc52419104f9e5");    
        window.location = url

    })
   }
   
}).catch((e)=>{
    showAlert('please login first' ,'danger')
    setTimeout(() => {
                   
        let url = new URL("http://localhost:3000/loginAdmine307f5f6608c68dc1c04e400f59b4ae765fbafc52419104f9e5");    
        window.location = url

    })
})     

