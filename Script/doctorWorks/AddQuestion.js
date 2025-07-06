

// document.querySelector('#check').addEventListener('click', function () {
//     const questionText = document.getElementById('question').value;
//     const answer1 = document.getElementById('answer1').value;
//     const answer2 = document.getElementById('answer2').value;
//     const answer3 = document.getElementById('answer3').value;
//     const answer4 = document.getElementById('answer4').value;
//     const correctAnswer = document.getElementById('correct-answer').value;

//     if (questionText && answer1 && answer2 && answer3 && answer4) {
//         // Check if the correct answer is one of the options
//         if (![answer1, answer2, answer3, answer4].includes(correctAnswer)) {
//             document.getElementById('alert').style.display = 'block';
//         } else {
//             document.getElementById('alert').style.display = 'none';

//             fetch('http://localhost:3000/Doctor/AddQuestion', {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     questionText, answer1, answer2, answer3, answer4, correctAnswer
//                 })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log(data)
//                     // Display the message in the answer field
//                     document.querySelector('#checkAnswer').value = data.selectedAnswer + "&&" + " The index correct answer is :" + data.selectedAnswerIndex;

//                     // Change field color based on response color
//                     const checkAnswerField = document.querySelector('#checkAnswer');
//                     if (data.color === 'green') {
//                         checkAnswerField.style.backgroundColor = 'lightgreen'; // Correct answer
//                     } else if (data.color === 'red') {
//                         checkAnswerField.style.backgroundColor = 'lightcoral'; // Incorrect answer
//                     } else {
//                         checkAnswerField.style.backgroundColor = ''; // No color
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('An error occurred while adding the question.');
//                 });
//         }
//     } else {
//         alert('Please fill in all fields and upload an image.');
//     }
// });
// document.querySelector('#finish').addEventListener('click', function () {
//     console.log("ahmeed")
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search);
//     const pdfName = document.getElementById('pdf-name').value;
//     const idDoctor = params.get('id')
//     const modelName = params.get('modelName')
//     console.log(pdfName)
//     setTimeout(() => {
//         let url = new URL("http://localhost:3000/Doctor/getPdf");
//         url.searchParams.set('id', idDoctor);
//         url.searchParams.set('modelName', modelName);
//         url.searchParams.set('pdfName', pdfName);
//         window.location = url
//     })
// })
document.addEventListener('DOMContentLoaded', function () {
    // حدث click لزر Next
    let questionCount = 1;
    document.querySelector('#next-btn').addEventListener('click', function () {
        const questionText = document.getElementById('question').value;
        const answer1 = document.getElementById('answer1').value;
        const answer2 = document.getElementById('answer2').value;
        const answer3 = document.getElementById('answer3').value;
        const answer4 = document.getElementById('answer4').value;
        const correctAnswer = document.getElementById('correct-answer').value;
        const image = document.querySelector("#image"); // Get the image file from the input
    
        // Check if all fields are filled
        if (questionText && answer1 && answer2 && answer3 && answer4) {
            // Check if there are any duplicate answers
            const answers = [answer1, answer2, answer3, answer4];
            const uniqueAnswers = new Set(answers);
            if (uniqueAnswers.size !== answers.length) {
                // If there are duplicates, show a custom alert
                const alertMessage = document.createElement('div');
                alertMessage.classList.add('alert');
                alertMessage.style.color = 'red';
                alertMessage.style.marginTop = '10px';
                alertMessage.innerText = 'Answers must be unique.';
                document.querySelector('.form-container').appendChild(alertMessage);  // Add the alert to the form
                return;  // Exit the function early
            }
    
            // Check if the correct answer is one of the options
            if (![answer1, answer2, answer3, answer4].includes(correctAnswer)) {
                // If correct answer is not one of the options, show a custom alert in HTML
                const alertMessage = document.createElement('div');
                alertMessage.classList.add('alert');
                alertMessage.style.color = 'red';
                alertMessage.style.marginTop = '10px';
                alertMessage.innerText = 'The correct answer must be one of the options.';
                document.querySelector('.form-container').appendChild(alertMessage);  // Add the alert to the form
            } else {
                // Hide any previous alerts if the form is correct
                const existingAlert = document.querySelector('.alert');
                if (existingAlert) {
                    existingAlert.remove();
                }
    
                // Prepare FormData to send to the server
                const formData = new FormData();
                formData.append('question', questionText);
                formData.append('answer1', answer1);
                formData.append('answer2', answer2);
                formData.append('answer3', answer3);
                formData.append('answer4', answer4);
                formData.append('correctAnswer', correctAnswer);
                formData.append('image', image.files[0]); // Append the image file
    
                // Send the data via fetch to the server
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                const modelName = params.get('modelName');
                formData.append('modelName', modelName);
    
                fetch('http://localhost:3000/Doctor/AddQuestion', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while adding the question.');
                    });
    
                // Increase the question count and update the question-info
                questionCount++;
                document.getElementById('question-info').innerText = 'Question ' + questionCount;
    
                // Clear the input fields after submitting
                document.getElementById('question').value = '';
                document.getElementById('answer1').value = '';
                document.getElementById('answer2').value = '';
                document.getElementById('answer3').value = '';
                document.getElementById('answer4').value = '';
                document.getElementById('correct-answer').value = '';
                document.querySelector('#image').value = ''; // Reset image input
                document.querySelector('.file-name').textContent = '';
            }
        } else {
            alert('Please fill in all fields and upload an image.');
        }
    });
    

    document.querySelector('#check').addEventListener('click', function () {
        const questionText = document.getElementById('question').value;
        const answer1 = document.getElementById('answer1').value;
        const answer2 = document.getElementById('answer2').value;
        const answer3 = document.getElementById('answer3').value;
        const answer4 = document.getElementById('answer4').value;
        const correctAnswer = document.getElementById('correct-answer').value;

        if (questionText && answer1 && answer2 && answer3 && answer4) {
            // Check if the correct answer is one of the options
            if (![answer1, answer2, answer3, answer4].includes(correctAnswer)) {
                const alertMessage = document.createElement('div');
                alertMessage.classList.add('alert');
                alertMessage.style.color = 'red';
                alertMessage.style.marginTop = '10px';
                alertMessage.innerText = 'The correct answer must be one of the options.';
                document.querySelector('.form-container').appendChild(alertMessage);  // Add the alert to the form
            } else {
                // Hide any previous alerts if the form is correct
                const existingAlert = document.querySelector('.alert');
                if (existingAlert) {
                    existingAlert.remove();
                }

                fetch('http://localhost:3000/Doctor/AddQuestion', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        questionText, answer1, answer2, answer3, answer4, correctAnswer
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        // Display the message in the answer field
                        document.querySelector('#checkAnswer').value = data.selectedAnswer + "  &&  " + " The index correct answer is :" + data.selectedAnswerIndex;

                        // Change field color based on response color
                        const checkAnswerField = document.querySelector('#checkAnswer');
                        if (data.color === 'green') {
                            checkAnswerField.style.backgroundColor = 'lightgreen'; // Correct answer
                        } else if (data.color === 'red') {
                            checkAnswerField.style.backgroundColor = 'lightcoral'; // Incorrect answer
                        } else {
                            checkAnswerField.style.backgroundColor = ''; // No color
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while adding the question.');
                    });
            }
        } else {
            alert('Please fill in all fields and upload an image.');
        }
    });

    // حدث click لزر Finish
    document.querySelector('#finish').addEventListener('click', function () {
        console.log("ahmeed")
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const pdfName = document.getElementById('pdf-name').value;
        const idDoctor = params.get('id');
        const modelName = params.get('modelName');
        console.log(pdfName);
        setTimeout(() => {
            let url = new URL("http://localhost:3000/Doctor/getPdf");
            url.searchParams.set('id', idDoctor);
            url.searchParams.set('modelName', modelName);
            url.searchParams.set('pdfName', pdfName);
            window.location = url;
        })
    });
});
