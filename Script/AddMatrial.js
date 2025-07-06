

// document.getElementById('addButton').addEventListener('click', function() {
//     const materialInput = document.getElementById('materialInput');
//     const departmentSelect = document.getElementById('departmentSelect');
//     const materialList = document.getElementById('materialList');
//     const materialText = materialInput.value.trim();
//     const department = departmentSelect.value;

//     if (materialText !== '') {
//         fetch('http://localhost:3000/Admine/Doctor/AddMatrial', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ materialText, department })
//         })
//         .then(response => response.json())
//         .then((data) => {
//             console.log(data);
//             if (data.insertedId) {
//                 const listItem = document.createElement('li');
//                 listItem.className = 'flex justify-between items-center p-3 bg-gray-200 rounded-2xl hover:bg-gray-300';
//                 listItem.setAttribute('data-id', data.insertedId); // حفظ ID المادة

//                 listItem.innerHTML = `
//                     <span>${materialText} <span class="text-sm text-gray-500">(${department})</span></span>
//                     <button class="deleteButton bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
//                         <i class="fas fa-trash"></i>
//                     </button>
//                 `;
//                 materialList.appendChild(listItem);
//                 materialInput.value = '';

//                 listItem.querySelector('.deleteButton').addEventListener('click', function() {
//                     const materialId = listItem.getAttribute('data-id');
//                     fetch(`http://localhost:3000/Admine/Doctor/AddMatrial/${materialId}`, {
//                         method: 'DELETE',
//                     })
//                     .then(response => response.json())
//                     .then((data) => {
//                         console.log(data);
//                         if (data.success) {
//                             materialList.removeChild(listItem);
//                         }
//                     });
//                 });
//             }
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    fetchMaterials(); // تحميل المواد من السيرفر عند فتح الصفحة
});

document.getElementById('addButton').addEventListener('click', function () {
    const materialInput = document.getElementById('materialInput');
    const departmentSelect = document.getElementById('departmentSelect');
    const materialText = materialInput.value.trim();
    const department = departmentSelect.value;

    if (materialText !== '') {
        fetch('http://localhost:3000/Admine/Doctor/AddMatrial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materialText, department })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.insertedId) {
                addMaterialToList({ _id: data.insertedId, materialText, department });
                materialInput.value = ''; // تفريغ الحقل بعد الإضافة
            }
        });
    }
});

// **دالة لجلب المواد من السيرفر وعرضها في القائمة**
function fetchMaterials() {
    fetch('http://localhost:3000/Admine/Doctor/AddMatrial',{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            const materialList = document.getElementById('materialList');
            materialList.innerHTML = ''; // تفريغ القائمة قبل إعادة تحميل البيانات
            data.forEach(material => addMaterialToList(material));
        })
        .catch(error => console.error('Error fetching materials:', error));
}

// **دالة لإضافة مادة إلى القائمة**
function addMaterialToList(material) {
    const materialList = document.getElementById('materialList');
    const listItem = document.createElement('li');
    listItem.className = 'flex justify-between items-center p-3 bg-gray-200 rounded-2xl hover:bg-gray-300';
    listItem.setAttribute('data-id', material._id);

    listItem.innerHTML = `
        <span>${material.materialText} <span class="text-sm text-gray-500">(${material.department})</span></span>
        <button class="deleteButton bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            <i class="fas fa-trash"></i>
        </button>
    `;

    materialList.appendChild(listItem);

    // **إضافة حدث الحذف لكل عنصر**
    listItem.querySelector('.deleteButton').addEventListener('click', function () {
        deleteMaterial(material._id, listItem);
    });
}

// **دالة لحذف المادة من القائمة والسيرفر**
function deleteMaterial(materialId, listItem) {
    fetch(`http://localhost:3000/Admine/Doctor/AddMatrial/${materialId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then((data) => {
        if (data.success) {
            listItem.remove();
        }
    })
    .catch(error => console.error('Error deleting material:', error));
}
