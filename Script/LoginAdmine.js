
const sendButton = document.querySelector(".But")
 
function showAlert(message, type) {
    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top text-center`; 
    alertDiv.role = 'alert';
    alertDiv.style.zIndex = 1050; // Ensure the alert is above other content
    alertDiv.style.height = '60px'; // Set the fixed height
    alertDiv.style.width = '100%'; // Full width of the viewport
    alertDiv.style.maxWidth = '600px'; // Optional: max width for larger screens
    alertDiv.style.display = 'flex'; // Use flexbox for alignment
    alertDiv.style.alignItems = 'center'; // Center content vertically
    alertDiv.style.justifyContent = 'space-between'; // Space the message and button
    alertDiv.style.margin = '0 auto'; // Center horizontally
    alertDiv.style.padding = '0 15px'; // Add horizontal padding

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.fontSize = '20px'; // Set font size
    messageDiv.style.fontFamily = 'Arial, sans-serif'; // Set font style
    messageDiv.style.flexGrow = '1'; // Allow message div to grow

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');

    alertDiv.appendChild(messageDiv);
    alertDiv.appendChild(closeButton);

    // Append the alert to the body (so it appears on top of all content)
    document.body.appendChild(alertDiv);

    // Optionally, remove the alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}




sendButton.addEventListener('click', (event) => {
    const inputId = document.querySelector(".inputId").value
    const inputPassword = document.querySelector(".inputPassword").value
    event.preventDefault();
    if (inputId == "" || inputPassword == "") {
        showAlert("please Compelte The Form", 'danger')
    }else {
        console.log(inputPassword, inputId)
        fetch('http://localhost:3000/loginAdmine307f5f6608c68dc1c04e400f59b4ae765fbafc52419104f9e5', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputId: inputId, inputPassword: inputPassword })
        }).then(response => response.json())
        .then((data)=>{
            console.log(data)
            if(data=="There is wrong in ID OR Password"){
                showAlert("There is wrong in ID OR Password Try Again" ,'danger')
            }else if(data=="The Process of Login Success"){
                showAlert("Successfily Login " ,'success')
                setTimeout(() => { 
                   
                   let url = new URL("http://localhost:3000/AdmineWorking78c7dceee96b4f8eb68d7419f32fb6b430bcd09508a23ed28d935ccd37");    
                   window.location = url
   
               },2000)
            }
        }).catch((e)=>{
            console.log(e)
            showAlert('There is error in your connection' ,'danger')
        })     
    }
   


})
