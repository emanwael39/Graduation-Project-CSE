



const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idDoctor = params.get('id');
const AnswerBubbleSheet = params.get('AnswerBubbleSheet');
const BubbleSheetStudent = params.get('BubbleSheetStudent');
const degree = params.get("degree");
const actuallyDegree = parseInt(degree, 10);
const Namepdf = params.get("Namepdf");

fetch('http://localhost:3000/Doctor/ResultStudent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        AnswerBubbleSheet,
        BubbleSheetStudent,
        actuallyDegree,
        Namepdf
    }),
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data)

        const tableData = Array.isArray(data) ? data : data.data;

        if (!Array.isArray(tableData)) {
            throw new Error("Invalid data format: Expected an array");
        }

        const rowsPerPage = 10;
        let currentPage = 1;

        const totalGradesSum = tableData.reduce((sum, row) => sum + (row.TotalDegree || 0), 0);
        const averageGrade = totalGradesSum / tableData.length;
        const totalPages = Math.ceil(tableData.length / rowsPerPage);

        function renderTable(page) {
            
            const tbody = document.querySelector('#resultsTable tbody');
            tbody.innerHTML = '';
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = tableData.slice(start, end);

            pageData.forEach((row) => {
                const tr = document.createElement('tr');
                
                // تصنيف الصفوف حسب الدرجة
                if (row.TotalDegree > averageGrade) {
                    tr.className = 'high-grade';
                } else if (row.TotalDegree >= averageGrade - 10) {
                    tr.className = 'medium-grade';
                } else {
                    tr.className = 'low-grade';
                }

                // عرض البيانات داخل الصف
                tr.innerHTML = `
                    <td class="bold">${row.sittingNumber || 'N/A'}</td>
                    <td class="bold">${row.model || 'N/A'}</td>
                    <td class="bold">${row.correctAnswersCount || 'N/A'}</td>
                    <td class="bold">${row.TotalDegree || 'N/A'}</td>
                    <td class="bold">${degree}</td> <!-- استخدام degree هنا -->
                    <td class="bold">${row.Page || 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById('pageInfo').innerText = `Page ${page} of ${totalPages}`;
            document.getElementById('prevBtn').disabled = page === 1;
            document.getElementById('nextBtn').disabled = page === totalPages;
        }

        function nextPage() {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(currentPage);
            }
        }

        function prevPage() {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
            }
        }

        // إضافة الأحداث للأزرار باستخدام JavaScript
        document.getElementById('prevBtn').addEventListener('click', prevPage);
        document.getElementById('nextBtn').addEventListener('click', nextPage);

        // العرض الأولي للبيانات
        renderTable(currentPage);
 
         
        fetch('http://localhost:3000/Doctor/ResultStudent', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                AnswerBubbleSheet,
                BubbleSheetStudent,
                actuallyDegree,
                Namepdf
            }),
        })
            .then(response => response.blob()) // تحويل الاستجابة إلى ملف
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bubble_Sheet_${Namepdf}.xlsx`; // تحميل ملف Excel
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch((e) => {
                console.error("Error:", e.message);
            });   
           
    })
    .catch((e) => {
        console.error("Error:", e.message);
    });
