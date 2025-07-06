
    
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const pdfName = params.get('pdfName')
const idDoctor = params.get('id')
const modelName = params.get('modelName')

fetch('http://localhost:3000/Doctor/getPdf', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        pdfName, modelName
    })
})
    .then((response) => {
        if (response.ok && response.headers.get('Content-Type') === 'application/zip') {
            return response.blob(); // تحويل الاستجابة إلى blob
        }
        throw new Error('الملف ليس بصيغة ZIP');
    })
    .then((data) => {
        // تحميل الملف
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = `${pdfName}.zip`; // تحديد اسم الملف
        link.click();
    })
    .catch((error) => {
        console.error(error);
    });
