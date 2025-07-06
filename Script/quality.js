


// // Global constants and variables
// const PAGE_SIZE = 4; // Number of items per page
// const DEBOUNCE_DELAY = 300; // Milliseconds to wait before search triggers

// // API URLs
// const API_ENDPOINTS = {
//     professors: 'http://localhost:3000/namesdoctor',
//     subjects: {
//         'CSE': 'http://localhost:3000/matrials',
//         'ESC': 'http://localhost:3000/matrials',
//         'Power': 'http://localhost:3000/matrials'
//     }
// };

// // Department code mapping
// const DEPARTMENT_CODES = {
//     'هندسة الحاسبات': 'CSE',
//     'هندسة الاتصالات': 'ESC', 
//     'هندسة القوى الكهربية': 'Power'
// };

// // Data storage
// let professorsData = [];
// let subjectsData = [];
// let tableData = [];
// let filteredData = [];

// // UI state
// let currentDepartment = "هندسة الاتصالات"; // Default department
// let currentPage = 1;
// let totalPages = 1;
// let sortConfig = { column: null, direction: 'asc' };
// let searchQuery = '';
// let statusFilter = 'all';
// let currentEditingConfig = {
//     rowId: null,
//     cell: null,
//     modalId: null
// };

// // Theme state
// let darkMode = false;

// // Initialize the application when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize theme
//     initializeTheme();
    
//     // Set up initial event listeners
//     setupEventListeners();
    
//     // Set current date
//     setCurrentDate();
    
//     // Show loading indicator
//     toggleLoadingIndicator(true);
    
//     // Load initial data
//     Promise.all([
//         fetchProfessorsData(),
//         fetchDepartmentSubjects(DEPARTMENT_CODES[currentDepartment])
//     ])
//     .then(([professors, subjects]) => {
//         professorsData = professors;
//         subjectsData = subjects;
        
//         console.log('Professors data loaded successfully');
//         console.log('Initial subjects data loaded');
        
//         // Initialize the table with placeholder data
//         initializeTable();
        
//         // Hide loading indicator
//         toggleLoadingIndicator(false);
//     })
//     .catch(error => {
//         console.error('Error loading initial data:', error);
//         // Hide loading indicator
//         toggleLoadingIndicator(false);
//         // Show error message
//         showNotification('حدث خطأ أثناء تحميل البيانات', 'error');
//     });
// });

// // Set up event listeners
// function setupEventListeners() {
//     // Theme toggle
//     const darkModeToggle = document.getElementById('darkModeToggle');
//     if (darkModeToggle) {
//         darkModeToggle.addEventListener('change', toggleDarkMode);
//         // Set initial state
//         darkModeToggle.checked = darkMode;
//     }
    
//     // Department selection change
//     const departmentSelect = document.getElementById('departmentSelect');
//     if (departmentSelect) {
//         departmentSelect.addEventListener('change', function() {
//             const selectedDepartment = this.value;
//             handleDepartmentChange(selectedDepartment);
//         });
//     }
    
//     // Year selection change
//     const yearSelect = document.getElementById('yearSelect');
//     if (yearSelect) {
//         yearSelect.addEventListener('change', function() {
//             // Update year badge
//             const yearBadge = document.querySelector('.year-badge');
//             if (yearBadge) {
//                 yearBadge.textContent = this.value;
//             }
//         });
//     }
    
//     // Semester selection change
//     const semesterSelect = document.getElementById('semesterSelect');
//     if (semesterSelect) {
//         semesterSelect.addEventListener('change', function() {
//             // Update document title
//             const documentTitle = document.querySelector('.document-title');
//             if (documentTitle) {
//                 documentTitle.textContent = 'خطة وضح الامتحان والتصحيح - ' + this.value;
//             }
//         });
//     }
    
//     // Search input with debounce
//     const searchInput = document.getElementById('searchInput');
//     if (searchInput) {
//         searchInput.addEventListener('input', debounce(function() {
//             searchQuery = this.value.trim().toLowerCase();
//             currentPage = 1; // Reset to first page when searching
//             applyFiltersAndRenderTable();
//         }, DEBOUNCE_DELAY));
//     }
    
//     // Status filter
//     const statusFilter = document.getElementById('statusFilter');
//     if (statusFilter) {
//         statusFilter.addEventListener('change', function() {
//             statusFilter = this.value;
//             currentPage = 1; // Reset to first page when filtering
//             applyFiltersAndRenderTable();
//         });
//     }
    
//     // Table header sorting
//     document.querySelectorAll('.main-table th.sortable').forEach(th => {
//         th.addEventListener('click', function() {
//             const column = this.getAttribute('data-sort');
//             if (sortConfig.column === column) {
//                 // Toggle direction if clicking the same column
//                 sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
//             } else {
//                 // New column, default to ascending
//                 sortConfig.column = column;
//                 sortConfig.direction = 'asc';
//             }
            
//             // Update sorting icons
//             updateSortingIcons();
            
//             // Apply sorting and render
//             applyFiltersAndRenderTable();
//         });
//     });
    
//     // Pagination controls
//     const prevPageBtn = document.getElementById('prevPage');
//     const nextPageBtn = document.getElementById('nextPage');
    
//     if (prevPageBtn) {
//         prevPageBtn.addEventListener('click', function() {
//             if (currentPage > 1) {
//                 currentPage--;
//                 renderTablePage();
//                 updatePaginationUI();
//             }
//         });
//     }
    
//     if (nextPageBtn) {
//         nextPageBtn.addEventListener('click', function() {
//             if (currentPage < totalPages) {
//                 currentPage++;
//                 renderTablePage();
//                 updatePaginationUI();
//             }
//         });
//     }
    
//     // Add new row button
//     const addRowBtn = document.getElementById('addRowBtn');
//     if (addRowBtn) {
//         addRowBtn.addEventListener('click', addNewRow);
//     }
    
//     // Refresh data button
//     const refreshBtn = document.getElementById('refreshBtn');
//     if (refreshBtn) {
//         refreshBtn.addEventListener('click', refreshData);
//     }
    
//     // Print button
//     const printBtn = document.getElementById('printBtn');
//     if (printBtn) {
//         printBtn.addEventListener('click', printTable);
//     }
    
//     // Download PDF button
//     const downloadPdfBtn = document.getElementById('downloadPdfBtn');
//     if (downloadPdfBtn) {
//         downloadPdfBtn.addEventListener('click', downloadAsPDF);
//     }
    
//     // Modal close buttons
//     document.querySelectorAll('.close-button').forEach(button => {
//         button.addEventListener('click', closeModal);
//     });
    
//     // Professor selection modal
//     const addProfessorBtn = document.getElementById('addProfessorBtn');
//     if (addProfessorBtn) {
//         addProfessorBtn.addEventListener('click', addSelectedProfessor);
//     }
    
//     const saveProfessorsBtn = document.getElementById('saveProfessorsBtn');
//     if (saveProfessorsBtn) {
//         saveProfessorsBtn.addEventListener('click', saveProfessors);
//     }
    
//     // Subject selection modal
//     const saveSubjectBtn = document.getElementById('saveSubjectBtn');
//     if (saveSubjectBtn) {
//         saveSubjectBtn.addEventListener('click', saveSubject);
//     }
    
//     // Level selection modal
//     const saveLevelBtn = document.getElementById('saveLevelBtn');
//     if (saveLevelBtn) {
//         saveLevelBtn.addEventListener('click', saveLevel);
//     }
    
//     // Status selection modal
//     const saveStatusBtn = document.getElementById('saveStatusBtn');
//     if (saveStatusBtn) {
//         saveStatusBtn.addEventListener('click', saveStatus);
//     }
    
//     // Delete confirmation modal
//     const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
//     if (cancelDeleteBtn) {
//         cancelDeleteBtn.addEventListener('click', closeModal);
//     }
    
//     const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
//     if (confirmDeleteBtn) {
//         confirmDeleteBtn.addEventListener('click', confirmDeleteRow);
//     }
    
//     // Modal search inputs
//     setupModalSearchInputs();
// }

// // Set up search inputs in modals
// function setupModalSearchInputs() {
//     // Professor search
//     const professorSearchInput = document.getElementById('professorSearchInput');
//     if (professorSearchInput) {
//         professorSearchInput.addEventListener('input', debounce(function() {
//             const searchValue = this.value.trim().toLowerCase();
//             filterSelectOptions('professorSelect', searchValue);
//         }, DEBOUNCE_DELAY));
//     }
    
//     // Subject search
//     const subjectSearchInput = document.getElementById('subjectSearchInput');
//     if (subjectSearchInput) {
//         subjectSearchInput.addEventListener('input', debounce(function() {
//             const searchValue = this.value.trim().toLowerCase();
//             filterSelectOptions('subjectSelect', searchValue);
//         }, DEBOUNCE_DELAY));
//     }
// }

// // Filter select options based on search input
// function filterSelectOptions(selectId, searchValue) {
//     const select = document.getElementById(selectId);
//     if (!select) return;
    
//     const options = select.options;
    
//     for (let i = 0; i < options.length; i++) {
//         const optionText = options[i].text.toLowerCase();
//         const optionValue = options[i].value.toLowerCase();
        
//         // Skip the first disabled option
//         if (i === 0 && options[i].disabled) continue;
        
//         // Check if option text or value contains the search value
//         if (optionText.includes(searchValue) || optionValue.includes(searchValue)) {
//             options[i].style.display = '';
//         } else {
//             options[i].style.display = 'none';
//         }
//     }
// }

// // Initialize theme settings
// function initializeTheme() {
//     // Check for stored preference
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme === 'dark') {
//         darkMode = true;
//         document.documentElement.setAttribute('data-theme', 'dark');
//     } else {
//         darkMode = false;
//         document.documentElement.setAttribute('data-theme', 'light');
//     }
// }

// // Toggle dark/light mode
// function toggleDarkMode() {
//     darkMode = !darkMode;
    
//     if (darkMode) {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         localStorage.setItem('theme', 'dark');
//     } else {
//         document.documentElement.setAttribute('data-theme', 'light');
//         localStorage.setItem('theme', 'light');
//     }
    
//     // Add animation class
//     document.body.classList.add('theme-transition');
    
//     // Remove animation class after transition completes
//     setTimeout(() => {
//         document.body.classList.remove('theme-transition');
//     }, 500);
// }

// // Set current date in the header
// function setCurrentDate() {
//     const currentDateElement = document.getElementById('currentDate');
//     if (currentDateElement) {
//         const now = new Date();
//         const day = String(now.getDate()).padStart(2, '0');
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const year = now.getFullYear();
        
//         currentDateElement.textContent = `${day}/${month}/${year}`;
//     }
// }

// // Toggle loading indicator
// function toggleLoadingIndicator(show) {
//     const loadingIndicator = document.getElementById('tableLoading');
//     if (loadingIndicator) {
//         loadingIndicator.style.display = show ? 'flex' : 'none';
//     }
// }

// // Show notification (success, error, etc.)
// function showNotification(message, type = 'success') {
//     const successModal = document.getElementById('successModal');
//     const successMessage = document.getElementById('successMessage');
    
//     if (successModal && successMessage) {
//         successMessage.textContent = message;
        
//         // Add appropriate styling based on notification type
//         if (type === 'error') {
//             successMessage.style.color = 'var(--accent-color)';
//             document.querySelector('.success-icon i').className = 'fas fa-exclamation-circle';
//             document.querySelector('.success-icon').style.color = 'var(--accent-color)';
//         } else {
//             successMessage.style.color = '';
//             document.querySelector('.success-icon i').className = 'fas fa-check-circle';
//             document.querySelector('.success-icon').style.color = '';
//         }
        
//         successModal.style.display = 'block';
        
//         // Auto-hide notification after 2 seconds
//         setTimeout(() => {
//             successModal.style.display = 'none';
//         }, 2000);
//     }
// }

// // Handle department change
// function handleDepartmentChange(selectedDepartment) {
//     // Update current department
//     currentDepartment = selectedDepartment;
    
//     // Update the department display in the header
//     const departmentTitleDisplay = document.getElementById('departmentTitleDisplay');
//     if (departmentTitleDisplay) {
//         departmentTitleDisplay.textContent = selectedDepartment;
//     }
    
//     // Get department code
//     const departmentCode = DEPARTMENT_CODES[selectedDepartment];
    
//     if (departmentCode) {
//         // Show loading indicator
//         toggleLoadingIndicator(true);
        
//         // Fetch subjects for this department
//         fetchDepartmentSubjects(departmentCode)
//             .then(data => {
//                 subjectsData = data;
//                 console.log(`Subjects loaded for ${departmentCode}`);
                
//                 // Reinitialize the table with the new department data
//                 initializeTable();
                
//                 // Hide loading indicator
//                 toggleLoadingIndicator(false);
                
//                 // Show success notification
//                 showNotification(`تم تحميل بيانات ${selectedDepartment} بنجاح`);
//             })
//             .catch(error => {
//                 console.error(`Error loading subjects for ${departmentCode}:`, error);
                
//                 // Hide loading indicator
//                 toggleLoadingIndicator(false);
                
//                 // Show error notification
//                 showNotification(`حدث خطأ أثناء تحميل بيانات ${selectedDepartment}`, 'error');
//             });
//     }
// }

// // Fetch professors data from API
// async function fetchProfessorsData() {
//     try {
//         const response = await fetch(API_ENDPOINTS.professors);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         return data || [];
//     } catch (error) {
//         console.error('Error fetching professors data:', error);
//         throw error;
//     }
// }

// // Fetch subjects data for a specific department
// async function fetchDepartmentSubjects(departmentCode) {
//     try {
//         const apiUrl = API_ENDPOINTS.subjects[departmentCode];
        
//         if (!apiUrl) {
//             throw new Error(`No API URL found for department code: ${departmentCode}`);
//         }
        
//         const response = await fetch(apiUrl);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         return data || [];
//     } catch (error) {
//         console.error(`Error fetching subjects for ${departmentCode}:`, error);
//         throw error;
//     }
// }

// // Initialize table with sample data
// function initializeTable() {
//     // Generate initial table data
//     generateTableData();
    
//     // Apply filters and render table
//     applyFiltersAndRenderTable();
// }

// // Generate initial table data
// function generateTableData() {
//     tableData = [];
    
//     // Add sample rows
//     for (let i = 0; i < 20; i++) {
//         const randomStatus = Math.random() > 0.5 ? 'open' : 'closed';
//         const rowId = `row-${Date.now()}-${i}`;
        
//         tableData.push({
//             id: i + 1,
//             rowId: rowId,
//             level: getRandomLevel(),
//             subject: getRandomSubject(),
//             examiners: getRandomProfessors(2),
//             correction: getRandomProfessors(3),
//             responsible: getRandomProfessors(1),
//             status: randomStatus
//         });
//     }
// }

// // Get random academic level
// function getRandomLevel() {
//     const levels = ['إعدادي', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة'];
//     return levels[Math.floor(Math.random() * levels.length)];
// }

// // Get random subject from loaded subjects
// function getRandomSubject() {
//     if (!subjectsData || subjectsData.length === 0) {
//         return 'المادة غير متوفرة';
//     }
    
//     const randomSubject = subjectsData[Math.floor(Math.random() * subjectsData.length)];
//     const subjectName = randomSubject.materialText || randomSubject.name || 'مادة غير معروفة';
    
//     // Translate name to Arabic if needed
//     return translateSubjectToArabic(subjectName);
// }

// // Get random professors
// function getRandomProfessors(count) {
//     if (!professorsData || professorsData.length === 0) {
//         return [];
//     }
    
//     const result = [];
//     const availableProfessors = [...professorsData];
    
//     for (let i = 0; i < count && availableProfessors.length > 0; i++) {
//         const randomIndex = Math.floor(Math.random() * availableProfessors.length);
//         const professor = availableProfessors.splice(randomIndex, 1)[0];
        
//         if (professor) {
//             const professorName = professor.nameDoctor || '';
            
//             // Add title to professor name
//             const arabicName = addDoctorTitleToName(professorName);
//             result.push(arabicName);
//         }
//     }
    
//     return result;
// }

// // Apply filters, sorting, and render table
// function applyFiltersAndRenderTable() {
//     // Apply search filter
//     filteredData = tableData.filter(row => {
//         if (!searchQuery) return true;
        
//         // Search in all text fields
//         return (
//             row.level.toLowerCase().includes(searchQuery) ||
//             row.subject.toLowerCase().includes(searchQuery) ||
//             row.examiners.some(prof => prof.toLowerCase().includes(searchQuery)) ||
//             row.correction.some(prof => prof.toLowerCase().includes(searchQuery)) ||
//             row.responsible.some(prof => prof.toLowerCase().includes(searchQuery))
//         );
//     });
    
//     // Apply status filter
//     if (statusFilter !== 'all') {
//         filteredData = filteredData.filter(row => row.status === statusFilter);
//     }
    
//     // Apply sorting
//     if (sortConfig.column) {
//         filteredData.sort((a, b) => {
//             if (sortConfig.column === 'id') {
//                 return sortConfig.direction === 'asc' 
//                     ? a.id - b.id
//                     : b.id - a.id;
//             } else {
//                 const aValue = a[sortConfig.column];
//                 const bValue = b[sortConfig.column];
                
//                 // Handle array values (like professors)
//                 if (Array.isArray(aValue) && Array.isArray(bValue)) {
//                     const aString = aValue.join(', ');
//                     const bString = bValue.join(', ');
                    
//                     return sortConfig.direction === 'asc'
//                         ? aString.localeCompare(bString, 'ar')
//                         : bString.localeCompare(aString, 'ar');
//                 }
                
//                 // Handle string values
//                 return sortConfig.direction === 'asc'
//                     ? String(aValue).localeCompare(String(bValue), 'ar')
//                     : String(bValue).localeCompare(String(aValue), 'ar');
//             }
//         });
//     }
    
//     // Update total pages
//     totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
//     if (totalPages === 0) totalPages = 1;
    
//     // Make sure current page is in valid range
//     if (currentPage > totalPages) {
//         currentPage = totalPages;
//     } else if (currentPage < 1) {
//         currentPage = 1;
//     }
    
//     // Render current page
//     renderTablePage();
    
//     // Update pagination UI
//     updatePaginationUI();
// }

// // Render current page of table data
// // function renderTablePage() {
// //     const tableBody = document.getElementById('mainTableBody');
// //     if (!tableBody) return;
    
// //     // Clear existing content
// //     tableBody.innerHTML = '';
    
// //     // Calculate slice for current page
// //     const startIndex = (currentPage - 1) * PAGE_SIZE;
// //     const endIndex = Math.min(startIndex + PAGE_SIZE, filteredData.length);
// //     const currentPageData = filteredData.slice(startIndex, endIndex);
    
// //     if (currentPageData.length === 0) {
// //         // No data to display
// //         const emptyRow = document.createElement('tr');
// //         emptyRow.innerHTML = `
// //             <td colspan="7" class="text-center">لا توجد بيانات للعرض</td>
// //         `;
// //         tableBody.appendChild(emptyRow);
// //         return;
// //     }
    
// //     // Render rows
// //     currentPageData.forEach(row => {
// //         const tr = document.createElement('tr');
// //         tr.id = row.rowId;
// //         tr.setAttribute('data-status', row.status);
        
// //         // Add hover animation class
// //         tr.classList.add('table-row-animate');
        
// //         // Create row HTML
// //         tr.innerHTML = `
// //             <td>${row.id}</td>
            
// //             <td class="editable-cell" data-edit-type="level" onclick="openLevelModal('${row.rowId}')">
// //                 ${row.level}
// //             </td>
            
// //             <td class="editable-cell" data-edit-type="subject" onclick="openSubjectModal('${row.rowId}')">
// //                 ${row.subject}
// //             </td>
            
// //             <td class="editable-cell" data-edit-type="examiners" onclick="openProfessorModal('${row.rowId}', 'examiners')">
// //                 <ul class="examiners-list">
// //                     ${row.examiners.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
// //                 </ul>
// //             </td>
            
// //             <td class="editable-cell" data-edit-type="correction" onclick="openProfessorModal('${row.rowId}', 'correction')">
// //                 <ul class="correction-list">
// //                     ${row.correction.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
// //                 </ul>
// //             </td>
            
// //             <td class="editable-cell" data-edit-type="responsible" onclick="openProfessorModal('${row.rowId}', 'responsible')">
// //                 <ul class="responsible-list">
// //                     ${row.responsible.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأستاذ المسؤول</li>'}
// //                 </ul>
// //             </td>
            
           
// //         `;
        
// //         tableBody.appendChild(tr);
// //     });
// // }
// // Render current page of table data
// function renderTablePage() {
//     const tableBody = document.getElementById('mainTableBody');
//     if (!tableBody) return;
    
//     // Clear existing content
//     tableBody.innerHTML = '';
    
//     // Calculate slice for current page
//     const startIndex = (currentPage - 1) * PAGE_SIZE;
//     const endIndex = Math.min(startIndex + PAGE_SIZE, filteredData.length);
//     const currentPageData = filteredData.slice(startIndex, endIndex);
    
//     if (currentPageData.length === 0) {
//         // No data to display
//         const emptyRow = document.createElement('tr');
//         emptyRow.innerHTML = `
//             <td colspan="8" class="text-center">لا توجد بيانات للعرض</td>
//         `;
//         tableBody.appendChild(emptyRow);
//         return;
//     }
    
//     // Render rows
//     currentPageData.forEach(row => {
//         const tr = document.createElement('tr');
//         tr.id = row.rowId;
//         tr.setAttribute('data-status', row.status);
        
//         // Add hover animation class
//         tr.classList.add('table-row-animate');
        
//         // Create row HTML with delete button
//         tr.innerHTML = `
//             <td>${row.id}</td>
            
//             <td class="editable-cell" data-edit-type="level" onclick="openLevelModal('${row.rowId}')">
//                 ${row.level}
//             </td>
            
//             <td class="editable-cell" data-edit-type="subject" onclick="openSubjectModal('${row.rowId}')">
//                 ${row.subject}
//             </td>
            
//             <td class="editable-cell" data-edit-type="examiners" onclick="openProfessorModal('${row.rowId}', 'examiners')">
//                 <ul class="examiners-list">
//                     ${row.examiners.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
//                 </ul>
//             </td>
            
//             <td class="editable-cell" data-edit-type="correction" onclick="openProfessorModal('${row.rowId}', 'correction')">
//                 <ul class="correction-list">
//                     ${row.correction.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
//                 </ul>
//             </td>
            
//             <td class="editable-cell" data-edit-type="responsible" onclick="openProfessorModal('${row.rowId}', 'responsible')">
//                 <ul class="responsible-list">
//                     ${row.responsible.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأستاذ المسؤول</li>'}
//                 </ul>
//             </td>
            
//             <td class="actions-cell">
//                 <button class="delete-btn" onclick="confirmDelete('${row.rowId}', event)">
//                     <i class="fas fa-trash"></i>
//                 </button>
//             </td>
//         `;
        
//         tableBody.appendChild(tr);
//     });
// }

// // Update pagination UI elements
// function updatePaginationUI() {
//     const currentPageElement = document.getElementById('currentPage');
//     const totalPagesElement = document.getElementById('totalPages');
//     const prevPageBtn = document.getElementById('prevPage');
//     const nextPageBtn = document.getElementById('nextPage');
    
//     if (currentPageElement) {
//         currentPageElement.textContent = currentPage;
//     }
    
//     if (totalPagesElement) {
//         totalPagesElement.textContent = totalPages;
//     }
    
//     if (prevPageBtn) {
//         prevPageBtn.disabled = currentPage <= 1;
//     }
    
//     if (nextPageBtn) {
//         nextPageBtn.disabled = currentPage >= totalPages;
//     }
// }

// // Update sorting icons in table headers
// function updateSortingIcons() {
//     document.querySelectorAll('.main-table th.sortable').forEach(th => {
//         const column = th.getAttribute('data-sort');
//         const iconElement = th.querySelector('i');
        
//         if (iconElement) {
//             if (sortConfig.column === column) {
//                 iconElement.className = sortConfig.direction === 'asc' 
//                     ? 'fas fa-sort-up' 
//                     : 'fas fa-sort-down';
//             } else {
//                 iconElement.className = 'fas fa-sort';
//             }
//         }
//     });
// }

// // Add a new row to the table
// function addNewRow() {
//     const rowId = `row-${Date.now()}-${tableData.length + 1}`;
    
//     // Create new row data
//     const newRow = {
//         id: tableData.length + 1,
//         rowId: rowId,
//         level: 'اختر الفرقة',
//         subject: 'اختر المادة',
//         examiners: [],
//         correction: [],
//         responsible: [],
//         status: 'open'
//     };
    
//     // Add to table data
//     tableData.push(newRow);
    
//     // Re-render table
//     applyFiltersAndRenderTable();
    
//     // Scroll to the bottom of the table to show the new row
//     const tableContainer = document.querySelector('.table-responsive');
//     if (tableContainer) {
//         tableContainer.scrollTop = tableContainer.scrollHeight;
//     }
    
//     // Show success notification
//     showNotification('تم إضافة صف جديد بنجاح');
// }

// // Refresh data
// function refreshData() {
//     // Show loading indicator
//     toggleLoadingIndicator(true);
    
//     // Fetch fresh data
//     Promise.all([
//         fetchProfessorsData(),
//         fetchDepartmentSubjects(DEPARTMENT_CODES[currentDepartment])
//     ])
//     .then(([professors, subjects]) => {
//         professorsData = professors;
//         subjectsData = subjects;
        
//         console.log('Data refreshed successfully');
        
//         // Generate new table data
//         generateTableData();
        
//         // Apply filters and render table
//         applyFiltersAndRenderTable();
        
//         // Hide loading indicator
//         toggleLoadingIndicator(false);
        
//         // Show success notification
//         showNotification('تم تحديث البيانات بنجاح');
//     })
//     .catch(error => {
//         console.error('Error refreshing data:', error);
        
//         // Hide loading indicator
//         toggleLoadingIndicator(false);
        
//         // Show error notification
//         showNotification('حدث خطأ أثناء تحديث البيانات', 'error');
//     });
// }

// // Print the table
// // function printTable() {
// //     window.print();
// // }




// function printTable() {
//     const currentSemester = document.getElementById('semesterSelect').value;
//     const printContainer = document.createElement('div');
//     printContainer.id = 'print-container';
//     printContainer.style.fontFamily = "'Arial', sans-serif";
//     printContainer.style.direction = 'rtl';
//     printContainer.style.padding = '20px';

//     // رأس المستند
//     const printHeader = document.createElement('div');
//     printHeader.style.textAlign = 'center';
//     printHeader.style.marginBottom = '20px';
//     printHeader.style.borderBottom = '2px solid #3498db';
//     printHeader.style.paddingBottom = '10px';
    
//     printHeader.innerHTML = `
//         <h2 style="margin: 0; color: #2c3e50;">جامعة الزقازيق</h2>
//         <h3 style="margin: 5px 0; color: #34495e;">كلية الهندسة - ${currentDepartment}</h3>
        
//         <p style="margin: 5px 0; font-size: 16px;">${currentSemester}</p>
//         <p style="margin: 5px 0; font-size: 16px;">خطة وضح الامتحان والتصحيح</p>
//         <p style="margin: 5px 0; font-size: 14px;">
//             ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}
//         </p>
//     `;
//     printContainer.appendChild(printHeader);

//     // الجدول
//     const printTable = document.createElement('table');
//     printTable.style.width = '100%';
//     printTable.style.borderCollapse = 'collapse';
//     printTable.style.marginTop = '20px';

//     printTable.innerHTML = `
//         <thead>
//             <tr style="background-color: #3498db; color: white;">
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">#</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الفرقة</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المادة</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء الامتحان</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء التصحيح</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المسؤول</th>
//             </tr>
//         </thead>
//     `;

//     const printTableBody = document.createElement('tbody');

//     tableData.forEach((row, index) => {
//         const tr = document.createElement('tr');
//         tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';

//         const formatList = (arr) =>
//             Array.isArray(arr)
//                 ? arr.map(prof => `<li>${prof}</li>`).join('')
//                 : `<li>${arr || ''}</li>`;

//         tr.innerHTML = `
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row.level}</td>
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row.subject}</td>
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${formatList(row.examiners)}
//                 </ul>
//             </td>
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${formatList(row.correction)}
//                 </ul>
//             </td>
//             <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${formatList(row.responsible)}
//                 </ul>
//             </td>
//         `;

//         printTableBody.appendChild(tr);
//     });

//     printTable.appendChild(printTableBody);
//     printContainer.appendChild(printTable);

//     // التذييل
//     const printFooter = document.createElement('div');
//     printFooter.id = 'print-footer';
//     printFooter.style.marginTop = '40px';
//     printFooter.style.textAlign = 'center';
//     printFooter.style.fontSize = '12px';
//     printFooter.style.color = '#666';
//     printFooter.style.borderTop = '1px solid #eee';
//     printFooter.style.paddingTop = '10px';
//     printFooter.style.position = 'fixed';
//     printFooter.style.bottom = '0';
//     printFooter.style.left = '0';
//     printFooter.style.right = '0';
//     printFooter.style.background = 'white';

//     printFooter.innerHTML = `
//         <div style="position: absolute; left: 10px; bottom: 5px; text-align: left;">
//             <strong>ORM SCANNER</strong>
//         </div>
//         <div>
//             <p>جامعة الزقازيق - كلية الهندسة</p>
//             <p>تم إنشاء المستند في: ${new Date().toLocaleString('ar-EG')}</p>
//         </div>
//     `;
//     printContainer.appendChild(printFooter);

//     document.body.appendChild(printContainer);

//     // أنماط الطباعة
//     const printStyles = `
//         <style id="print-style">
//             @media print {
//                 body * {
//                     visibility: hidden;
//                 }
//                 #print-container, #print-container * {
//                     visibility: visible;
//                 }
//                 #print-container {
//                     position: absolute;
//                     left: 0;
//                     top: 0;
//                     width: 100%;
//                     padding: 20px;
//                     box-sizing: border-box;
//                 }
//                 table {
//                     page-break-inside: auto;
//                 }
//                 tr {
//                     page-break-inside: avoid;
//                     page-break-after: auto;
//                 }
//                 #print-footer {
//                     position: fixed;
//                     bottom: 0;
//                     left: 0;
//                     right: 0;
//                     background: white;
//                     padding: 10px 20px;
//                     border-top: 1px solid #eee;
//                 }
//                 @page {
//                     margin-bottom: 70px;
//                 }
//             }
//         </style>
//     `;
//     document.head.insertAdjacentHTML('beforeend', printStyles);

//     // تنفيذ الطباعة
//     window.print();

//     // التنظيف
//     setTimeout(() => {
//         document.body.removeChild(printContainer);
//         const style = document.getElementById('print-style');
//         if (style) style.remove();
//     }, 1000);
// }




// // Download table as PDF
// function downloadAsPDF() {
//     // In a real implementation, this would use a library like jsPDF
//     // For now, just show a success notification
//     showNotification('تم تحميل الملف بنجاح');
// }

// // Confirm delete row action
// function confirmDelete(rowId, event) {
//     // Prevent event bubbling to parent elements
//     if (event) {
//         event.stopPropagation();
//     }
    
//     // Store row ID for confirmation
//     currentEditingConfig = {
//         rowId: rowId,
//         cell: null,
//         modalId: 'deleteModal'
//     };
    
//     // Show confirmation modal
//     document.getElementById('deleteModal').style.display = 'block';
// }

// // Process row deletion after confirmation
// function confirmDeleteRow() {
//     const rowId = currentEditingConfig.rowId;
    
//     // Find row index in the data array
//     const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    
//     if (rowIndex !== -1) {
//         // Remove row from data
//         tableData.splice(rowIndex, 1);
        
//         // Update row IDs
//         tableData.forEach((row, index) => {
//             row.id = index + 1;
//         });
        
//         // Re-render table
//         applyFiltersAndRenderTable();
        
//         // Close modal
//         closeModal();
        
//         // Show success notification
//         showNotification('تم حذف الصف بنجاح');
//     }
// }

// // Open level selection modal
// function openLevelModal(rowId) {
//     currentEditingConfig = {
//         rowId: rowId,
//         cell: 'level',
//         modalId: 'levelModal'
//     };
    
//     document.getElementById('levelModal').style.display = 'block';
// }

// // Open subject selection modal
// function openSubjectModal(rowId) {
//     currentEditingConfig = {
//         rowId: rowId,
//         cell: 'subject',
//         modalId: 'subjectModal'
//     };
    
//     // Populate subject dropdown
//     populateSubjectDropdown();
    
//     document.getElementById('subjectModal').style.display = 'block';
// }

// // Open professor selection modal
// function openProfessorModal(rowId, cellType) {
//     currentEditingConfig = {
//         rowId: rowId,
//         cell: cellType,
//         modalId: 'professorModal'
//     };
    
//     // Populate professor dropdown
//     populateProfessorDropdown();
    
//     // Clear previously selected professors
//     document.getElementById('selectedProfessors').innerHTML = '';
    
//     // Get current professors for this cell
//     const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    
//     if (rowIndex !== -1) {
//         const professors = tableData[rowIndex][cellType] || [];
        
//         // Add current professors to selection
//         const selectedProfessorsContainer = document.getElementById('selectedProfessors');
        
//         professors.forEach(professorName => {
//             const professorTag = document.createElement('span');
//             professorTag.className = 'professor-tag';
//             professorTag.dataset.value = professorName;
//             professorTag.innerHTML = `
//                 <span class="remove-professor" onclick="removeProfessor(this)">×</span>
//                 ${professorName}
//             `;
            
//             selectedProfessorsContainer.appendChild(professorTag);
//         });
//     }
    
//     document.getElementById('professorModal').style.display = 'block';
// }

// // Open status selection modal
// function openStatusModal(rowId) {
//     currentEditingConfig = {
//         rowId: rowId,
//         cell: 'status',
//         modalId: 'statusModal'
//     };
    
//     // Get current status
//     const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    
//     if (rowIndex !== -1) {
//         const currentStatus = tableData[rowIndex].status;
//         const statusSelect = document.getElementById('statusSelect');
        
//         // Set current value in dropdown
//         if (statusSelect) {
//             for (let i = 0; i < statusSelect.options.length; i++) {
//                 if (statusSelect.options[i].value === currentStatus) {
//                     statusSelect.selectedIndex = i;
//                     break;
//                 }
//             }
//         }
//     }
    
//     document.getElementById('statusModal').style.display = 'block';
// }

// // Close any open modal
// function closeModal() {
//     document.querySelectorAll('.modal').forEach(modal => {
//         modal.style.display = 'none';
//     });
// }

// // Populate subject dropdown in the modal
// function populateSubjectDropdown() {
//     const subjectSelect = document.getElementById('subjectSelect');
//     if (!subjectSelect) return;
    
//     // Clear current options
//     subjectSelect.innerHTML = '<option selected disabled>اختر المادة</option>';
    
//     // Make sure we have subjects data
//     if (!subjectsData || !Array.isArray(subjectsData) || subjectsData.length === 0) {
//         console.error('No subjects data available');
//         return;
//     }
    
//     // Add options for each subject
//     subjectsData.forEach(subject => {
//         const option = document.createElement('option');
//         const subjectName = subject.materialText || subject.name || '';
//         option.value = subjectName;
        
//         // Translate name to Arabic if needed
//         const arabicName = translateSubjectToArabic(subjectName);
//         option.textContent = arabicName;
        
//         subjectSelect.appendChild(option);
//     });
// }

// // Populate professor dropdown in the modal
// function populateProfessorDropdown() {
//     const professorSelect = document.getElementById('professorSelect');
//     if (!professorSelect) return;
    
//     // Clear current options
//     professorSelect.innerHTML = '<option selected disabled>اختر أستاذ</option>';
    
//     // Make sure we have professors data
//     if (!professorsData || !Array.isArray(professorsData) || professorsData.length === 0) {
//         console.error('No professors data available');
//         return;
//     }
    
//     // Get department code for current department
//     const departmentCode = DEPARTMENT_CODES[currentDepartment];
    
//     // Filter professors by department
//     const departmentProfessors = departmentCode 
//         ? professorsData.filter(prof => prof.departmentDoctor === departmentCode || !prof.departmentDoctor)
//         : professorsData;
    
//     // Add options for each professor
//     departmentProfessors.forEach(professor => {
//         const option = document.createElement('option');
//         const professorName = professor.nameDoctor || '';
//         option.value = professorName;
        
//         // Add title to professor name
//         const arabicName = addDoctorTitleToName(professorName);
//         option.textContent = arabicName;
        
//         professorSelect.appendChild(option);
//     });
// }

// // Add selected professor to the list
// function addSelectedProfessor() {
//     const professorSelect = document.getElementById('professorSelect');
//     const selectedProfessors = document.getElementById('selectedProfessors');
    
//     // Check if a professor is selected
//     if (professorSelect.selectedIndex === 0) {
//         return;
//     }
    
//     const professorName = professorSelect.options[professorSelect.selectedIndex].text;
//     const professorValue = professorSelect.value;
    
//     // Check if this professor is already selected
//     const existingTags = selectedProfessors.querySelectorAll('.professor-tag');
//     for (let i = 0; i < existingTags.length; i++) {
//         if (existingTags[i].dataset.value === professorValue) {
//             // Professor already selected, shake the tag to indicate
//             existingTags[i].classList.add('shake-animation');
//             setTimeout(() => {
//                 existingTags[i].classList.remove('shake-animation');
//             }, 500);
//             return;
//         }
//     }
    
//     // Create a new professor tag
//     const professorTag = document.createElement('span');
//     professorTag.className = 'professor-tag';
//     professorTag.dataset.value = professorValue;
//     professorTag.innerHTML = `
//         <span class="remove-professor" onclick="removeProfessor(this)">×</span>
//         ${professorName}
//     `;
    
//     selectedProfessors.appendChild(professorTag);
    
//     // Reset dropdown selection
//     professorSelect.selectedIndex = 0;
// }

// // Remove a professor from the selection
// function removeProfessor(element) {
//     const tag = element.parentElement;
    
//     // Add fade-out animation
//     tag.classList.add('fade-out');
    
//     // Remove after animation completes
//     setTimeout(() => {
//         tag.remove();
//     }, 300);
// }

// // Save selected professors
// function saveProfessors() {
//     const selectedProfessors = document.getElementById('selectedProfessors');
//     const professorTags = selectedProfessors.querySelectorAll('.professor-tag');
    
//     // Get the professors' names
//     const professors = Array.from(professorTags).map(tag => {
//         // Remove the "×" character from the text content
//         return tag.textContent.trim().substring(1).trim();
//     });
    
//     // Find the row being edited
//     const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
//     if (rowIndex !== -1) {
//         // Update the data
//         tableData[rowIndex][currentEditingConfig.cell] = professors;
        
//         // Re-render the table
//         applyFiltersAndRenderTable();
        
//         // Close the modal
//         closeModal();
        
//         // Show success notification
//         showNotification('تم حفظ الأساتذة بنجاح');
//     }
// }

// // Save selected level
// function saveLevel() {
//     const levelSelect = document.getElementById('levelSelect');
    
//     // Make sure a level is selected
//     if (levelSelect.selectedIndex === 0) {
//         alert('الرجاء اختيار الفرقة الدراسية');
//         return;
//     }
    
//     const levelText = levelSelect.options[levelSelect.selectedIndex].text;
    
//     // Find the row being edited
//     const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
//     if (rowIndex !== -1) {
//         // Update the data
//         tableData[rowIndex].level = levelText;
        
//         // Re-render the table
//         applyFiltersAndRenderTable();
        
//         // Reset dropdown selection
//         levelSelect.selectedIndex = 0;
        
//         // Close the modal
//         closeModal();
        
//         // Show success notification
//         showNotification('تم حفظ الفرقة الدراسية بنجاح');
//     }
// }

// // Save selected subject
// function saveSubject() {
//     const subjectSelect = document.getElementById('subjectSelect');
    
//     // Make sure a subject is selected
//     if (subjectSelect.selectedIndex === 0) {
//         alert('الرجاء اختيار المادة الدراسية');
//         return;
//     }
    
//     const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    
//     // Find the row being edited
//     const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
//     if (rowIndex !== -1) {
//         // Update the data
//         tableData[rowIndex].subject = subjectText;
        
//         // Re-render the table
//         applyFiltersAndRenderTable();
        
//         // Reset dropdown selection
//         subjectSelect.selectedIndex = 0;
        
//         // Close the modal
//         closeModal();
        
//         // Show success notification
//         showNotification('تم حفظ المادة الدراسية بنجاح');
//     }
// }

// // Save selected status
// function saveStatus() {
//     const statusSelect = document.getElementById('statusSelect');
    
//     // Make sure a status is selected
//     if (statusSelect.selectedIndex === 0) {
//         alert('الرجاء اختيار الحالة');
//         return;
//     }
    
//     const statusValue = statusSelect.value;
    
//     // Find the row being edited
//     const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
//     if (rowIndex !== -1) {
//         // Update the data
//         tableData[rowIndex].status = statusValue;
        
//         // Re-render the table
//         applyFiltersAndRenderTable();
        
//         // Reset dropdown selection
//         statusSelect.selectedIndex = 0;
        
//         // Close the modal
//         closeModal();
        
//         // Show success notification
//         showNotification('تم تغيير الحالة بنجاح');
//     }
// }

// // Translate subject name to Arabic
// function translateSubjectToArabic(englishName) {
//     // Dictionary of common technical terms and their Arabic translations
//     const translations = {
//         'python': 'لغة البرمجة بايثون',
//         'electronics': 'الإلكترونيات',
//         'programming': 'البرمجة',
//         'circuits': 'الدوائر الكهربية',
//         'signals': 'الإشارات والنظم',
//         'systems': 'النظم',
//         'transmission': 'نقل البيانات',
//         'communications': 'الاتصالات',
//         'control': 'نظم التحكم',
//         'computer': 'الحاسوب',
//         'network': 'الشبكات',
//         'engineering': 'هندسة',
//         'data': 'البيانات',
//         'machine': 'الآلات',
//         'artificial': 'الاصطناعي',
//         'intelligence': 'الذكاء',
//         'digital': 'رقمية',
//         'analog': 'تماثلية',
//         'electric': 'كهربية',
//         'power': 'القوى الكهربية',
//         'algorithms': 'الخوارزميات',
//         'structure': 'البنية',
//         'design': 'تصميم'
//     };
    
//     // If the name exists in our direct translations, return it
//     if (translations[englishName.toLowerCase()]) {
//         return translations[englishName.toLowerCase()];
//     }
    
//     // Otherwise, try to translate individual words
//     let arabicName = englishName;
//     Object.keys(translations).forEach(englishWord => {
//         if (englishName.toLowerCase().includes(englishWord.toLowerCase())) {
//             arabicName = arabicName.replace(
//                 new RegExp(englishWord, 'gi'),
//                 translations[englishWord.toLowerCase()]
//             );
//         }
//     });
    
//     return arabicName;
// }

// // Add doctor title to professor name
// function addDoctorTitleToName(name) {
//     // Check if name already has a title
//     if (name.startsWith('Dr.') || name.startsWith('د.') || name.startsWith('أ.د.')) {
//         return name;
//     }
    
//     // Add title based on seniority (randomly assigned for demo)
//     const isSeniorProfessor = Math.random() > 0.7;
//     return isSeniorProfessor ? `أ.د. ${name}` : `د. ${name}`;
// }

// // Utility function: Debounce
// function debounce(func, wait) {
//     let timeout;
//     return function(...args) {
//         const context = this;
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(context, args), wait);
//     };
// }

// // Download table as PDF with enhanced formatting
// async function downloadAsPDF() {
//     const currentSemester = document.getElementById('semesterSelect').value;
//     const currentDepartment = document.getElementById('departmentSelect')?.value || 'القسم';
//     const currentYear = document.getElementById('yearInput')?.value || 'السنة';

//     toggleLoadingIndicator(true);

//     const pdfContainer = document.createElement('div');
//     pdfContainer.id = 'pdf-export-container';
//     pdfContainer.style.position = 'absolute';
//     pdfContainer.style.left = '-9999px';
//     pdfContainer.style.width = '210mm';
//     pdfContainer.style.padding = '20px';
//     pdfContainer.style.fontFamily = "'Arial', 'Helvetica Neue', sans-serif";
//     pdfContainer.style.direction = 'rtl';
//     pdfContainer.style.boxSizing = 'border-box';

//     // Header with gradient background
//     const headerSection = document.createElement('div');
//     headerSection.style.background = 'linear-gradient(90deg, #2980b9, #6dd5fa)';
//     headerSection.style.color = 'white';
//     headerSection.style.padding = '20px';
//     headerSection.style.borderRadius = '8px';
//     headerSection.style.textAlign = 'center';
//     headerSection.innerHTML = `
//     <h2 style="margin: 0;">جامعة الزقازيق</h2>
//     <h3 style="margin: 5px 0;">كلية الهندسة - قسم ${currentDepartment}</h3>
//     <p style="margin: 5px 0; font-size: 14px;">خطة وضح الامتحان والتصحيح</p>
//     <p style="margin: 5px 0; font-size: 13px;">${currentSemester} - العام الجامعي ${currentYear}</p>
//     <div style="font-size: 12px;">
//         ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}
//     </div>
// `;

//     pdfContainer.appendChild(headerSection);

//     // Table
//     const pdfTable = document.createElement('table');
//     pdfTable.style.width = '100%';
//     pdfTable.style.borderCollapse = 'collapse';
//     pdfTable.style.marginTop = '20px';
//     pdfTable.innerHTML = `
//         <thead>
//             <tr style="background-color: #3498db; color: white;">
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">#</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الفرقة</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المادة</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء الامتحان</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء التصحيح</th>
//                 <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المسؤول</th>
//             </tr>
//         </thead>
//     `;

//     const pdfTableBody = document.createElement('tbody');

//     tableData.forEach((row, index) => {
//         const tr = document.createElement('tr');
//         tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#ecf6fd';

//         tr.innerHTML = `
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${index + 1}</td>
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${row.level}</td>
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${row.subject}</td>
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${row.examiners.map(prof => `<li>${prof}</li>`).join('')}
//                 </ul>
//             </td>
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${row.correction.map(prof => `<li>${prof}</li>`).join('')}
//                 </ul>
//             </td>
//             <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
//                 <ul style="margin: 0; padding-right: 15px; list-style: none;">
//                     ${row.responsible.map(prof => `<li>${prof}</li>`).join('')}
//                 </ul>
//             </td>
//         `;
//         pdfTableBody.appendChild(tr);
//     });

//     pdfTable.appendChild(pdfTableBody);
//     pdfContainer.appendChild(pdfTable);

//     // Signatures section
//     const signatureSection = document.createElement('div');
//     signatureSection.style.marginTop = '40px';
//     signatureSection.style.display = 'flex';
//     signatureSection.style.justifyContent = 'space-between';
//     signatureSection.style.flexWrap = 'wrap';
//     signatureSection.style.gap = '20px';
//     signatureSection.innerHTML = `
//         <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
//             <h3>أ.د. رئيس القسم العلمي</h3>
//             <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
//         </div>
//         <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
//             <h3>المنسق الأكاديمي</h3>
//             <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
//         </div>
//         <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
//             <h3>وكيل الكلية لشؤون التعليم والطلاب</h3>
//             <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
//         </div>
//         <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
//             <h3>يعتمد، عميد الكلية</h3>
//             <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
//         </div>
//     `;
//     pdfContainer.appendChild(signatureSection);

//     // Footer
//     const footer = document.createElement('div');
//     footer.style.marginTop = '30px';
//     footer.style.textAlign = 'center';
//     footer.style.fontSize = '10px';
//     footer.style.color = '#666';
//     footer.textContent = 'جامعة الزقازيق - كلية الهندسة';
//     pdfContainer.appendChild(footer);

//     document.body.appendChild(pdfContainer);

//     try {
//         if (!window.html2canvas || !window.jspdf) {
//             await Promise.all([
//                 loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
//                 loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
//             ]);
//         }

//         const { jsPDF } = window.jspdf;
//         const canvas = await html2canvas(pdfContainer, {
//             scale: 3, // Higher resolution
//             useCORS: true,
//             scrollX: 0,
//             scrollY: 0
//         });

//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF({
//             orientation: 'portrait',
//             unit: 'mm',
//             format: 'a4'
//         });

//         const imgWidth = 210;
//         const pageHeight = 297;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;
//         let position = 0;

//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         while (heightLeft >= 0) {
//             position = heightLeft - imgHeight;
//             pdf.addPage();
//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//         }

//         const filename = `Exam_Plan_${currentDepartment.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
//         pdf.save(filename);

//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         showNotification('حدث خطأ أثناء إنشاء ملف PDF', 'error');
//     } finally {
//         document.body.removeChild(pdfContainer);
//         toggleLoadingIndicator(false);
//     }

//     function loadScript(src) {
//         return new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.src = src;
//             script.onload = resolve;
//             script.onerror = reject;
//             document.body.appendChild(script);
//         });
//     }
// }



// // Make functions available globally for inline event handlers
// window.openLevelModal = openLevelModal;
// window.openSubjectModal = openSubjectModal;
// window.openProfessorModal = openProfessorModal;
// window.openStatusModal = openStatusModal;
// window.removeProfessor = removeProfessor;
// window.confirmDelete = confirmDelete;




























// Global constants and variables
const PAGE_SIZE = 5; // عرض 5 صفوف فقط في كل صفحة
const DEBOUNCE_DELAY = 300;

// API URLs
const API_ENDPOINTS = {
    professors: 'http://localhost:3000/namesdoctor',
    subjects: {
        'CSE': 'http://localhost:3000/matrials?department=CSE',
        'ESC': 'http://localhost:3000/matrials?department=ESC', 
        'Power': 'http://localhost:3000/matrials?department=Power'
    }
};

// Department code mapping
const DEPARTMENT_CODES = {
    'هندسة الحاسبات': 'CSE',
    'هندسة الاتصالات': 'ESC', 
    'هندسة القوى الكهربية': 'Power'
};

// Data storage
let professorsData = [];
let subjectsData = [];
let tableData = [];
let filteredData = [];

// UI state
let currentDepartment = "هندسة الاتصالات";
let currentPage = 1;
let totalPages = 1;
let sortConfig = { column: null, direction: 'asc' };
let searchQuery = '';
let statusFilter = 'all';
let currentEditingConfig = {
    rowId: null,
    cell: null,
    modalId: null
};

// Theme state
let darkMode = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    setCurrentDate();
    toggleLoadingIndicator(true);
    
    Promise.all([
        fetchProfessorsData(),
        fetchDepartmentSubjects(DEPARTMENT_CODES[currentDepartment])
    ])
    .then(([professors, subjects]) => {
        professorsData = professors;
        subjectsData = subjects;
        initializeTable();
        toggleLoadingIndicator(false);
    })
    .catch(error => {
        console.error('Error loading initial data:', error);
        toggleLoadingIndicator(false);
        showNotification('حدث خطأ أثناء تحميل البيانات', 'error');
    });
});

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
        darkModeToggle.checked = darkMode;
    }
    
    // Department selection change
    const departmentSelect = document.getElementById('departmentSelect');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', function() {
            const selectedDepartment = this.value;
            handleDepartmentChange(selectedDepartment);
        });
    }
    
    // Year selection change
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const yearBadge = document.querySelector('.year-badge');
            if (yearBadge) {
                yearBadge.textContent = this.value;
            }
        });
    }
    
    // Semester selection change
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            const documentTitle = document.querySelector('.document-title');
            if (documentTitle) {
                documentTitle.textContent = 'خطة وضع الامتحان والتصحيح - ' + this.value;
            }
        });
    }
    
    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchQuery = this.value.trim().toLowerCase();
            currentPage = 1;
            applyFiltersAndRenderTable();
        }, DEBOUNCE_DELAY));
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            statusFilter = this.value;
            currentPage = 1;
            applyFiltersAndRenderTable();
        });
    }
    
    // Table header sorting
    document.querySelectorAll('.main-table th.sortable').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            if (sortConfig.column === column) {
                sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.column = column;
                sortConfig.direction = 'asc';
            }
            updateSortingIcons();
            applyFiltersAndRenderTable();
        });
    });
    
    // Pagination controls
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderTablePage();
                updatePaginationUI();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderTablePage();
                updatePaginationUI();
            }
        });
    }
    
    // Add new row button
    const addRowBtn = document.getElementById('addRowBtn');
    if (addRowBtn) {
        addRowBtn.addEventListener('click', addNewRow);
    }
    
    // Refresh data button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printTable);
    }
    
    // Download PDF button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', downloadAsPDF);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Professor selection modal
    const addProfessorBtn = document.getElementById('addProfessorBtn');
    if (addProfessorBtn) {
        addProfessorBtn.addEventListener('click', addSelectedProfessor);
    }
    
    const saveProfessorsBtn = document.getElementById('saveProfessorsBtn');
    if (saveProfessorsBtn) {
        saveProfessorsBtn.addEventListener('click', saveProfessors);
    }
    
    // Subject selection modal
    const saveSubjectBtn = document.getElementById('saveSubjectBtn');
    if (saveSubjectBtn) {
        saveSubjectBtn.addEventListener('click', saveSubject);
    }
    
    // Level selection modal
    const saveLevelBtn = document.getElementById('saveLevelBtn');
    if (saveLevelBtn) {
        saveLevelBtn.addEventListener('click', saveLevel);
    }
    
    // Status selection modal
    const saveStatusBtn = document.getElementById('saveStatusBtn');
    if (saveStatusBtn) {
        saveStatusBtn.addEventListener('click', saveStatus);
    }
    
    // Delete confirmation modal
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeModal);
    }
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteRow);
    }
    
    // Modal search inputs
    setupModalSearchInputs();
}

// Initialize theme settings
function initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        darkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        darkMode = false;
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Toggle dark/light mode
function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
}

// Set current date in the header
function setCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        currentDateElement.textContent = `${day}/${month}/${year}`;
    }
}

// Toggle loading indicator
function toggleLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('tableLoading');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    if (successModal && successMessage) {
        successMessage.textContent = message;
        
        if (type === 'error') {
            successMessage.style.color = 'var(--accent-color)';
            document.querySelector('.success-icon i').className = 'fas fa-exclamation-circle';
            document.querySelector('.success-icon').style.color = 'var(--accent-color)';
        } else {
            successMessage.style.color = '';
            document.querySelector('.success-icon i').className = 'fas fa-check-circle';
            document.querySelector('.success-icon').style.color = '';
        }
        
        successModal.style.display = 'block';
        
        setTimeout(() => {
            successModal.style.display = 'none';
        }, 2000);
    }
}

// Handle department change
function handleDepartmentChange(selectedDepartment) {
    currentDepartment = selectedDepartment;
    
    const departmentTitleDisplay = document.getElementById('departmentTitleDisplay');
    if (departmentTitleDisplay) {
        departmentTitleDisplay.textContent = selectedDepartment;
    }
    
    const departmentCode = DEPARTMENT_CODES[selectedDepartment];
    
    if (departmentCode) {
        toggleLoadingIndicator(true);
        
        fetchDepartmentSubjects(departmentCode)
            .then(data => {
                subjectsData = data;
                initializeTable();
                toggleLoadingIndicator(false);
                showNotification(`تم تحميل بيانات ${selectedDepartment} بنجاح`);
            })
            .catch(error => {
                console.error(`Error loading subjects for ${departmentCode}:`, error);
                toggleLoadingIndicator(false);
                showNotification(`حدث خطأ أثناء تحميل بيانات ${selectedDepartment}`, 'error');
            });
    }
}

// Fetch professors data from API
async function fetchProfessorsData() {
    try {
        const response = await fetch(API_ENDPOINTS.professors);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching professors data:', error);
        throw error;
    }
}

// Fetch subjects data for a specific department
async function fetchDepartmentSubjects(departmentCode) {
    try {
        const apiUrl = API_ENDPOINTS.subjects[departmentCode];
        
        if (!apiUrl) {
            throw new Error(`No API URL found for department code: ${departmentCode}`);
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter subjects by department if the API doesn't do it
        if (departmentCode && Array.isArray(data)) {
            return data.filter(subject => 
                subject.department === departmentCode || 
                subject.departmentCode === departmentCode ||
                subject.materialCode?.startsWith(departmentCode)
            );
        }
        
        return data || [];
    } catch (error) {
        console.error(`Error fetching subjects for ${departmentCode}:`, error);
        throw error;
    }
}

// Initialize table with actual subjects data
function initializeTable() {
    tableData = [];
    
    subjectsData.forEach((subject, index) => {
        const rowId = `row-${Date.now()}-${index + 1}`;
        const subjectName = subject.materialText || subject.name || 'مادة غير معروفة';
        const arabicSubject = translateSubjectToArabic(subjectName);
        
        tableData.push({
            id: index + 1,
            rowId: rowId,
            level: getRandomLevel(),
            subject: arabicSubject,
            examiners: getRandomProfessors(2),
            correction: getRandomProfessors(3),
            responsible: getRandomProfessors(3),
            status: 'open'
        });
    });
    
    applyFiltersAndRenderTable();
}

// Add new row with proper professors lists
function addNewRow() {
    const rowId = `row-${Date.now()}-${tableData.length + 1}`;
    
    const newRow = {
        id: tableData.length + 1,
        rowId: rowId,
        level: 'اختر الفرقة',
        subject: 'اختر المادة',
        examiners: [],
        correction: [],
        responsible: [],
        status: 'open'
    };
    
    tableData.push(newRow);
    applyFiltersAndRenderTable();
    
    const tableContainer = document.querySelector('.table-responsive');
    if (tableContainer) {
        tableContainer.scrollTop = tableContainer.scrollHeight;
    }
    
    showNotification('تم إضافة صف جديد بنجاح');
}

// Apply filters, sorting, and render table
function applyFiltersAndRenderTable() {
    filteredData = tableData.filter(row => {
        if (!searchQuery) return true;
        
        return (
            row.level.toLowerCase().includes(searchQuery) ||
            row.subject.toLowerCase().includes(searchQuery) ||
            row.examiners.some(prof => prof.toLowerCase().includes(searchQuery)) ||
            row.correction.some(prof => prof.toLowerCase().includes(searchQuery)) ||
            row.responsible.some(prof => prof.toLowerCase().includes(searchQuery))
        );
    });
    
    if (statusFilter !== 'all') {
        filteredData = filteredData.filter(row => row.status === statusFilter);
    }
    
    if (sortConfig.column) {
        filteredData.sort((a, b) => {
            if (sortConfig.column === 'id') {
                return sortConfig.direction === 'asc' 
                    ? a.id - b.id
                    : b.id - a.id;
            } else {
                const aValue = a[sortConfig.column];
                const bValue = b[sortConfig.column];
                
                if (Array.isArray(aValue) && Array.isArray(bValue)) {
                    const aString = aValue.join(', ');
                    const bString = bValue.join(', ');
                    
                    return sortConfig.direction === 'asc'
                        ? aString.localeCompare(bString, 'ar')
                        : bString.localeCompare(aString, 'ar');
                }
                
                return sortConfig.direction === 'asc'
                    ? String(aValue).localeCompare(String(bValue), 'ar')
                    : String(bValue).localeCompare(String(aValue), 'ar');
            }
        });
    }
    
    totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    if (totalPages === 0) totalPages = 1;
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
    } else if (currentPage < 1) {
        currentPage = 1;
    }
    
    renderTablePage();
    updatePaginationUI();
}

// Render current page of table data
function renderTablePage() {
    const tableBody = document.getElementById('mainTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, filteredData.length);
    const currentPageData = filteredData.slice(startIndex, endIndex);
    
    if (currentPageData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" class="text-center">لا توجد بيانات للعرض</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    currentPageData.forEach(row => {
        const tr = document.createElement('tr');
        tr.id = row.rowId;
        tr.setAttribute('data-status', row.status);
        tr.classList.add('table-row-animate');
        
        tr.innerHTML = `
            <td>${row.id}</td>
            <td class="editable-cell" data-edit-type="level" onclick="openLevelModal('${row.rowId}')">
                ${row.level}
            </td>
            <td class="editable-cell" data-edit-type="subject" onclick="openSubjectModal('${row.rowId}')">
                ${row.subject}
            </td>
            <td class="editable-cell" data-edit-type="examiners" onclick="openProfessorModal('${row.rowId}', 'examiners')">
                <ul class="professors-list">
                    ${row.examiners.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
                </ul>
            </td>
            <td class="editable-cell" data-edit-type="correction" onclick="openProfessorModal('${row.rowId}', 'correction')">
                <ul class="professors-list">
                    ${row.correction.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة</li>'}
                </ul>
            </td>
            <td class="editable-cell" data-edit-type="responsible" onclick="openProfessorModal('${row.rowId}', 'responsible')">
                <ul class="professors-list">
                    ${row.responsible.map(prof => `<li>${prof}</li>`).join('') || '<li>اختر الأساتذة المسؤولين</li>'}
                </ul>
            </td>
            <td class="actions-cell">
                <button class="delete-btn" onclick="confirmDelete('${row.rowId}', event)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Update pagination UI elements
function updatePaginationUI() {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (totalPagesElement) {
        totalPagesElement.textContent = totalPages;
    }
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages;
    }
}

// Update sorting icons in table headers
function updateSortingIcons() {
    document.querySelectorAll('.main-table th.sortable').forEach(th => {
        const column = th.getAttribute('data-sort');
        const iconElement = th.querySelector('i');
        
        if (iconElement) {
            if (sortConfig.column === column) {
                iconElement.className = sortConfig.direction === 'asc' 
                    ? 'fas fa-sort-up' 
                    : 'fas fa-sort-down';
            } else {
                iconElement.className = 'fas fa-sort';
            }
        }
    });
}

// Refresh data
function refreshData() {
    toggleLoadingIndicator(true);
    
    Promise.all([
        fetchProfessorsData(),
        fetchDepartmentSubjects(DEPARTMENT_CODES[currentDepartment])
    ])
    .then(([professors, subjects]) => {
        professorsData = professors;
        subjectsData = subjects;
        initializeTable();
        toggleLoadingIndicator(false);
        showNotification('تم تحديث البيانات بنجاح');
    })
    .catch(error => {
        console.error('Error refreshing data:', error);
        toggleLoadingIndicator(false);
        showNotification('حدث خطأ أثناء تحديث البيانات', 'error');
    });
}

// Print the table
function printTable() {
    const currentSemester = document.getElementById('semesterSelect').value;
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.fontFamily = "'Arial', sans-serif";
    printContainer.style.direction = 'rtl';
    printContainer.style.padding = '20px';

    const printHeader = document.createElement('div');
    printHeader.style.textAlign = 'center';
    printHeader.style.marginBottom = '20px';
    printHeader.style.borderBottom = '2px solid #3498db';
    printHeader.style.paddingBottom = '10px';
    
    printHeader.innerHTML = `
        <h2 style="margin: 0; color: #2c3e50;">جامعة الزقازيق</h2>
        <h3 style="margin: 5px 0; color: #34495e;">كلية الهندسة - ${currentDepartment}</h3>
        <p style="margin: 5px 0; font-size: 16px;">${currentSemester}</p>
        <p style="margin: 5px 0; font-size: 16px;">خطة وضح الامتحان والتصحيح</p>
        <p style="margin: 5px 0; font-size: 14px;">
            ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}
        </p>
    `;
    printContainer.appendChild(printHeader);

    const printTable = document.createElement('table');
    printTable.style.width = '100%';
    printTable.style.borderCollapse = 'collapse';
    printTable.style.marginTop = '20px';

    printTable.innerHTML = `
        <thead>
            <tr style="background-color: #3498db; color: white;">
                <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">#</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الفرقة</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المادة</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء الامتحان</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء التصحيح</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الأساتذة المسؤولين</th>
            </tr>
        </thead>
    `;

    const printTableBody = document.createElement('tbody');

    tableData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';

        const formatList = (arr) =>
            Array.isArray(arr)
                ? arr.map(prof => `<li>${prof}</li>`).join('')
                : `<li>${arr || ''}</li>`;

        tr.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row.level}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row.subject}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${formatList(row.examiners)}
                </ul>
            </td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${formatList(row.correction)}
                </ul>
            </td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${formatList(row.responsible)}
                </ul>
            </td>
        `;

        printTableBody.appendChild(tr);
    });

    printTable.appendChild(printTableBody);
    printContainer.appendChild(printTable);

    const printFooter = document.createElement('div');
    printFooter.id = 'print-footer';
    printFooter.style.marginTop = '40px';
    printFooter.style.textAlign = 'center';
    printFooter.style.fontSize = '12px';
    printFooter.style.color = '#666';
    printFooter.style.borderTop = '1px solid #eee';
    printFooter.style.paddingTop = '10px';
    printFooter.style.position = 'fixed';
    printFooter.style.bottom = '0';
    printFooter.style.left = '0';
    printFooter.style.right = '0';
    printFooter.style.background = 'white';

    printFooter.innerHTML = `
        <div style="position: absolute; left: 10px; bottom: 5px; text-align: left;">
            <strong>ORM SCANNER</strong>
        </div>
        <div>
            <p>جامعة الزقازيق - كلية الهندسة</p>
            <p>تم إنشاء المستند في: ${new Date().toLocaleString('ar-EG')}</p>
        </div>
    `;
    printContainer.appendChild(printFooter);

    document.body.appendChild(printContainer);

    const printStyles = `
        <style id="print-style">
            @media print {
                body * {
                    visibility: hidden;
                }
                #print-container, #print-container * {
                    visibility: visible;
                }
                #print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                }
                table {
                    page-break-inside: auto;
                }
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                #print-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 10px 20px;
                    border-top: 1px solid #eee;
                }
                @page {
                    margin-bottom: 70px;
                }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', printStyles);

    window.print();

    setTimeout(() => {
        document.body.removeChild(printContainer);
        const style = document.getElementById('print-style');
        if (style) style.remove();
    }, 1000);
}

// Download table as PDF
async function downloadAsPDF() {
    const currentSemester = document.getElementById('semesterSelect').value;
    const currentDepartment = document.getElementById('departmentSelect')?.value || 'القسم';
    const currentYear = document.getElementById('yearInput')?.value || 'السنة';

    toggleLoadingIndicator(true);

    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-container';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.width = '210mm';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.fontFamily = "'Arial', 'Helvetica Neue', sans-serif";
    pdfContainer.style.direction = 'rtl';
    pdfContainer.style.boxSizing = 'border-box';

    const headerSection = document.createElement('div');
    headerSection.style.background = 'linear-gradient(90deg, #2980b9, #6dd5fa)';
    headerSection.style.color = 'white';
    headerSection.style.padding = '20px';
    headerSection.style.borderRadius = '8px';
    headerSection.style.textAlign = 'center';
    headerSection.innerHTML = `
    <h2 style="margin: 0;">جامعة الزقازيق</h2>
    <h3 style="margin: 5px 0;">كلية الهندسة - قسم ${currentDepartment}</h3>
    <p style="margin: 5px 0; font-size: 14px;">خطة وضح الامتحان والتصحيح</p>
    <p style="margin: 5px 0; font-size: 13px;">${currentSemester} - العام الجامعي ${currentYear}</p>
    <div style="font-size: 12px;">
        ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}
    </div>
`;

    pdfContainer.appendChild(headerSection);

    const pdfTable = document.createElement('table');
    pdfTable.style.width = '100%';
    pdfTable.style.borderCollapse = 'collapse';
    pdfTable.style.marginTop = '20px';
    pdfTable.innerHTML = `
        <thead>
            <tr style="background-color: #3498db; color: white;">
                <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">#</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الفرقة</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">المادة</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء الامتحان</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">أعضاء التصحيح</th>
                <th style="border: 1px solid #ccc; padding: 10px; text-align: right;">الأساتذة المسؤولين</th>
            </tr>
        </thead>
    `;

    const pdfTableBody = document.createElement('tbody');

    tableData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#ecf6fd';

        tr.innerHTML = `
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${row.level}</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${row.subject}</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${row.examiners.map(prof => `<li>${prof}</li>`).join('')}
                </ul>
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${row.correction.map(prof => `<li>${prof}</li>`).join('')}
                </ul>
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">
                <ul style="margin: 0; padding-right: 15px; list-style: none;">
                    ${row.responsible.map(prof => `<li>${prof}</li>`).join('')}
                </ul>
            </td>
        `;
        pdfTableBody.appendChild(tr);
    });

    pdfTable.appendChild(pdfTableBody);
    pdfContainer.appendChild(pdfTable);

    const signatureSection = document.createElement('div');
    signatureSection.style.marginTop = '40px';
    signatureSection.style.display = 'flex';
    signatureSection.style.justifyContent = 'space-between';
    signatureSection.style.flexWrap = 'wrap';
    signatureSection.style.gap = '20px';
    signatureSection.innerHTML = `
        <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
            <h3>أ.د. رئيس القسم العلمي</h3>
            <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
        </div>
        <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
            <h3>المنسق الأكاديمي</h3>
            <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
        </div>
        <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
            <h3>وكيل الكلية لشؤون التعليم والطلاب</h3>
            <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
        </div>
        <div class="signature-block" style="flex: 1; min-width: 200px; text-align: center;">
            <h3>يعتمد، عميد الكلية</h3>
            <div class="signature-space" style="border-bottom: 1px solid #000; height: 40px; margin-top: 10px;"></div>
        </div>
    `;
    pdfContainer.appendChild(signatureSection);

    const footer = document.createElement('div');
    footer.style.marginTop = '30px';
    footer.style.textAlign = 'center';
    footer.style.fontSize = '10px';
    footer.style.color = '#666';
    footer.textContent = 'جامعة الزقازيق - كلية الهندسة';
    pdfContainer.appendChild(footer);

    document.body.appendChild(pdfContainer);

    try {
        if (!window.html2canvas || !window.jspdf) {
            await Promise.all([
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
            ]);
        }

        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(pdfContainer, {
            scale: 3,
            useCORS: true,
            scrollX: 0,
            scrollY: 0
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        const filename = `Exam_Plan_${currentDepartment.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('حدث خطأ أثناء إنشاء ملف PDF', 'error');
    } finally {
        document.body.removeChild(pdfContainer);
        toggleLoadingIndicator(false);
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
}

// Confirm delete row action
function confirmDelete(rowId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    currentEditingConfig = {
        rowId: rowId,
        cell: null,
        modalId: 'deleteModal'
    };
    
    document.getElementById('deleteModal').style.display = 'block';
}

// Process row deletion after confirmation
function confirmDeleteRow() {
    const rowId = currentEditingConfig.rowId;
    const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    
    if (rowIndex !== -1) {
        tableData.splice(rowIndex, 1);
        tableData.forEach((row, index) => {
            row.id = index + 1;
        });
        applyFiltersAndRenderTable();
        closeModal();
        showNotification('تم حذف الصف بنجاح');
    }
}

// Open level selection modal
function openLevelModal(rowId) {
    currentEditingConfig = {
        rowId: rowId,
        cell: 'level',
        modalId: 'levelModal'
    };
    document.getElementById('levelModal').style.display = 'block';
}

// Open subject selection modal
function openSubjectModal(rowId) {
    currentEditingConfig = {
        rowId: rowId,
        cell: 'subject',
        modalId: 'subjectModal'
    };
    populateSubjectDropdown();
    document.getElementById('subjectModal').style.display = 'block';
}

// Open professor selection modal
function openProfessorModal(rowId, cellType) {
    currentEditingConfig = {
        rowId: rowId,
        cell: cellType,
        modalId: 'professorModal'
    };
    
    // تحسين عرض النافذة المنبثقة لاختيار الأساتذة
    const modal = document.getElementById('professorModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '800px';
    
    populateProfessorDropdown();
    document.getElementById('selectedProfessors').innerHTML = '';
    
    const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    if (rowIndex !== -1) {
        const professors = tableData[rowIndex][cellType] || [];
        const selectedProfessorsContainer = document.getElementById('selectedProfessors');
        
        professors.forEach(professorName => {
            const professorTag = document.createElement('span');
            professorTag.className = 'professor-tag';
            professorTag.dataset.value = professorName;
            professorTag.innerHTML = `
                <span class="remove-professor" onclick="removeProfessor(this)">×</span>
                ${professorName}
            `;
            selectedProfessorsContainer.appendChild(professorTag);
        });
    }
    
    // تحسين البحث عن الأساتذة
    const searchInput = document.getElementById('professorSearchInput');
    searchInput.value = '';
    searchInput.focus();
    
    document.getElementById('professorModal').style.display = 'block';
}

// Open status selection modal
function openStatusModal(rowId) {
    currentEditingConfig = {
        rowId: rowId,
        cell: 'status',
        modalId: 'statusModal'
    };
    
    const rowIndex = tableData.findIndex(row => row.rowId === rowId);
    if (rowIndex !== -1) {
        const currentStatus = tableData[rowIndex].status;
        const statusSelect = document.getElementById('statusSelect');
        
        if (statusSelect) {
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].value === currentStatus) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    document.getElementById('statusModal').style.display = 'block';
}

// Close any open modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Populate subject dropdown in the modal
function populateSubjectDropdown() {
    const subjectSelect = document.getElementById('subjectSelect');
    if (!subjectSelect) return;
    
    subjectSelect.innerHTML = '<option selected disabled>اختر المادة</option>';
    
    if (!subjectsData || !Array.isArray(subjectsData) || subjectsData.length === 0) {
        console.error('No subjects data available');
        return;
    }
    
    subjectsData.forEach(subject => {
        const option = document.createElement('option');
        const subjectName = subject.materialText || subject.name || '';
        option.value = subjectName;
        const arabicName = translateSubjectToArabic(subjectName);
        option.textContent = arabicName;
        subjectSelect.appendChild(option);
    });
}

// Populate professor dropdown in the modal
function populateProfessorDropdown() {
    const professorSelect = document.getElementById('professorSelect');
    if (!professorSelect) return;
    
    professorSelect.innerHTML = '<option selected disabled>اختر أستاذ</option>';
    
    if (!professorsData || !Array.isArray(professorsData) || professorsData.length === 0) {
        console.error('No professors data available');
        return;
    }
    
    // عرض جميع الأساتذة بدون تصفية حسب القسم
    professorsData.forEach(professor => {
        const option = document.createElement('option');
        const professorName = professor.nameDoctor || '';
        option.value = professorName;
        const arabicName = addDoctorTitleToName(professorName);
        option.textContent = arabicName;
        professorSelect.appendChild(option);
    });
}

// Add selected professor to the list
function addSelectedProfessor() {
    const professorSelect = document.getElementById('professorSelect');
    const selectedProfessors = document.getElementById('selectedProfessors');
    
    if (professorSelect.selectedIndex === 0) {
        return;
    }
    
    const professorName = professorSelect.options[professorSelect.selectedIndex].text;
    const professorValue = professorSelect.value;
    
    const existingTags = selectedProfessors.querySelectorAll('.professor-tag');
    for (let i = 0; i < existingTags.length; i++) {
        if (existingTags[i].dataset.value === professorValue) {
            existingTags[i].classList.add('shake-animation');
            setTimeout(() => {
                existingTags[i].classList.remove('shake-animation');
            }, 500);
            return;
        }
    }
    
    const professorTag = document.createElement('span');
    professorTag.className = 'professor-tag';
    professorTag.dataset.value = professorValue;
    professorTag.innerHTML = `
        <span class="remove-professor" onclick="removeProfessor(this)">×</span>
        ${professorName}
    `;
    selectedProfessors.appendChild(professorTag);
    professorSelect.selectedIndex = 0;
}

// Remove a professor from the selection
function removeProfessor(element) {
    const tag = element.parentElement;
    tag.classList.add('fade-out');
    setTimeout(() => {
        tag.remove();
    }, 300);
}

// Save selected professors
function saveProfessors() {
    const selectedProfessors = document.getElementById('selectedProfessors');
    const professorTags = selectedProfessors.querySelectorAll('.professor-tag');
    
    const professors = Array.from(professorTags).map(tag => {
        return tag.textContent.trim().substring(1).trim();
    });
    
    const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    if (rowIndex !== -1) {
        tableData[rowIndex][currentEditingConfig.cell] = professors;
        applyFiltersAndRenderTable();
        closeModal();
        showNotification('تم حفظ الأساتذة بنجاح');
    }
}

// Save selected level
function saveLevel() {
    const levelSelect = document.getElementById('levelSelect');
    if (levelSelect.selectedIndex === 0) {
        alert('الرجاء اختيار الفرقة الدراسية');
        return;
    }
    
    const levelText = levelSelect.options[levelSelect.selectedIndex].text;
    const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
    if (rowIndex !== -1) {
        tableData[rowIndex].level = levelText;
        applyFiltersAndRenderTable();
        levelSelect.selectedIndex = 0;
        closeModal();
        showNotification('تم حفظ الفرقة الدراسية بنجاح');
    }
}

// Save selected subject
function saveSubject() {
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect.selectedIndex === 0) {
        alert('الرجاء اختيار المادة الدراسية');
        return;
    }
    
    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
    if (rowIndex !== -1) {
        tableData[rowIndex].subject = subjectText;
        applyFiltersAndRenderTable();
        subjectSelect.selectedIndex = 0;
        closeModal();
        showNotification('تم حفظ المادة الدراسية بنجاح');
    }
}

// Save selected status
function saveStatus() {
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect.selectedIndex === 0) {
        alert('الرجاء اختيار الحالة');
        return;
    }
    
    const statusValue = statusSelect.value;
    const rowIndex = tableData.findIndex(row => row.rowId === currentEditingConfig.rowId);
    
    if (rowIndex !== -1) {
        tableData[rowIndex].status = statusValue;
        applyFiltersAndRenderTable();
        statusSelect.selectedIndex = 0;
        closeModal();
        showNotification('تم تغيير الحالة بنجاح');
    }
}

// Translate subject name to Arabic
function translateSubjectToArabic(englishName) {
    const translations = {
        'python': 'لغة البرمجة بايثون',
        'electronics': 'الإلكترونيات',
        'programming': 'البرمجة',
        'circuits': 'الدوائر الكهربية',
        'signals': 'الإشارات والنظم',
        'systems': 'النظم',
        'transmission': 'نقل البيانات',
        'communications': 'الاتصالات',
        'control': 'نظم التحكم',
        'computer': 'الحاسوب',
        'network': 'الشبكات',
        'engineering': 'هندسة',
        'data': 'البيانات',
        'machine': 'الآلات',
        'artificial': 'الاصطناعي',
        'intelligence': 'الذكاء',
        'digital': 'رقمية',
        'analog': 'تماثلية',
        'electric': 'كهربية',
        'power': 'القوى الكهربية',
        'algorithms': 'الخوارزميات',
        'structure': 'البنية',
        'design': 'تصميم'
    };
    
    if (translations[englishName.toLowerCase()]) {
        return translations[englishName.toLowerCase()];
    }
    
    let arabicName = englishName;
    Object.keys(translations).forEach(englishWord => {
        if (englishName.toLowerCase().includes(englishWord.toLowerCase())) {
            arabicName = arabicName.replace(
                new RegExp(englishWord, 'gi'),
                translations[englishWord.toLowerCase()]
            );
        }
    });   
    
    return arabicName;
}

// Add doctor title to professor name
function addDoctorTitleToName(name) {
    if (name.startsWith('Dr.') || name.startsWith('د.') || name.startsWith('أ.د.')) {
        return name;
    }
    
    const isSeniorProfessor = Math.random() > 0.7;
    return isSeniorProfessor ? `أ.د. ${name}` : `د. ${name}`;
}

// Get random academic level
function getRandomLevel() {
    const levels = ['إعدادي', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة'];
    return levels[Math.floor(Math.random() * levels.length)];
}

// Get random professors
function getRandomProfessors(count) {
    if (!professorsData || professorsData.length === 0) return [];
    
    const result = [];
    const availableProfessors = [...professorsData];
    
    for (let i = 0; i < count && availableProfessors.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableProfessors.length);
        const professor = availableProfessors.splice(randomIndex, 1)[0];
        
        if (professor) {
            const professorName = professor.nameDoctor || '';
            const arabicName = addDoctorTitleToName(professorName);
            result.push(arabicName);
        }
    }
    
    return result;
}

// Set up search inputs in modals
function setupModalSearchInputs() {
    const professorSearchInput = document.getElementById('professorSearchInput');
    if (professorSearchInput) {
        professorSearchInput.addEventListener('input', debounce(function() {
            const searchValue = this.value.trim().toLowerCase();
            filterSelectOptions('professorSelect', searchValue);
        }, DEBOUNCE_DELAY));
    }
    
    const subjectSearchInput = document.getElementById('subjectSearchInput');
    if (subjectSearchInput) {
        subjectSearchInput.addEventListener('input', debounce(function() {
            const searchValue = this.value.trim().toLowerCase();
            filterSelectOptions('subjectSelect', searchValue);
        }, DEBOUNCE_DELAY));
    }
}

// Filter select options based on search input
function filterSelectOptions(selectId, searchValue) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const options = select.options;
    
    for (let i = 0; i < options.length; i++) {
        if (i === 0 && options[i].disabled) continue;
        
        const optionText = options[i].text.toLowerCase();
        const optionValue = options[i].value.toLowerCase();
        
        if (optionText.includes(searchValue) || optionValue.includes(searchValue)) {
            options[i].style.display = '';
        } else {
            options[i].style.display = 'none';
        }
    }
}

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Make functions available globally for inline event handlers
window.openLevelModal = openLevelModal;
window.openSubjectModal = openSubjectModal;
window.openProfessorModal = openProfessorModal;
window.openStatusModal = openStatusModal;
window.removeProfessor = removeProfessor;
window.confirmDelete = confirmDelete;
window.addNewRow = addNewRow;
window.saveProfessors = saveProfessors;