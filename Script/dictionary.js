// Academic Book Discovery Platform - Main JavaScript

// Global state
let currentBooks = [];
let currentPage = 1;
let totalResults = 0;
let currentQuery = '';
let isLoading = false;
let selectedBook = null;

// Configuration
const RESULTS_PER_PAGE = 20;
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b';

// Filters state
let filters = {
    source: 'all',
    language: 'all',
    yearRange: [1400, new Date().getFullYear()],
    format: 'all',
    sortBy: 'relevance'
};

// Local storage keys
const STORAGE_KEYS = {
    SEARCH_HISTORY: 'academic-search-history',
    SAVED_BOOKS: 'academic-saved-books',
    THEME: 'academic-theme',
    FILTERS: 'academic-filters'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadStoredData();
    setupEventListeners();
    setupTheme();
    setupFilters();
    setupAdminShortcut();
    updateSavedCount();
}

// Load data from localStorage
function loadStoredData() {
    // Load filters
    const storedFilters = localStorage.getItem(STORAGE_KEYS.FILTERS);
    if (storedFilters) {
        filters = { ...filters, ...JSON.parse(storedFilters) };
    }
    
    // Update filter UI
    updateFilterUI();
}

// Save data to localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Get data from localStorage
function getFromStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search form
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    
    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchHistory);
    clearSearchBtn.addEventListener('click', clearSearch);
    
    // Filter sidebar
    setupFilterListeners();
    
    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    
    mobileFilterToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', closeSidebarMobile);
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Admin button
    const adminBtn = document.getElementById('admin-btn');
    adminBtn.addEventListener('click', openAdminDashboard);
    
    // Modal close buttons
    const closeModalBtn = document.getElementById('close-modal');
    const closeAdminModalBtn = document.getElementById('close-admin-modal');
    
    closeModalBtn.addEventListener('click', closeBookModal);
    closeAdminModalBtn.addEventListener('click', closeAdminModal);
    
    // Modal overlay clicks
    document.addEventListener('click', handleModalOverlayClick);
    
    // Search history
    const clearHistoryBtn = document.getElementById('clear-history');
    clearHistoryBtn.addEventListener('click', clearSearchHistory);
    
    // Pagination
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    
    // Retry button
    const retryBtn = document.getElementById('retry-btn');
    retryBtn.addEventListener('click', () => performSearch(currentQuery, currentPage));
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Citation functionality
    setupCitationListeners();
    
    // Click outside to close search history
    document.addEventListener('click', handleOutsideClick);
}
  
// Setup filter event listeners
function setupFilterListeners() {
    // Filter headers (collapsible)
    const filterHeaders = document.querySelectorAll('.filter-header');
    filterHeaders.forEach(header => {
        header.addEventListener('click', toggleFilterSection);
    });
    
    // Source filter
    const sourceRadios = document.querySelectorAll('input[name="source"]');
    sourceRadios.forEach(radio => {
        radio.addEventListener('change', updateSourceFilter);
    });
    
    // Language filter
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', updateLanguageFilter);
    
    // Year range filters
    const yearFromInput = document.getElementById('year-from');
    const yearToInput = document.getElementById('year-to');
    
    yearFromInput.addEventListener('change', updateYearFilter);
    yearToInput.addEventListener('change', updateYearFilter);
    
    // Format filter
    const formatRadios = document.querySelectorAll('input[name="format"]');
    formatRadios.forEach(radio => {
        radio.addEventListener('change', updateFormatFilter);
    });
    
    // Sort filter
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', updateSortFilter);
    
    // Reset filters
    const resetFiltersBtn = document.getElementById('reset-filters');
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Setup citation listeners
function setupCitationListeners() {
    const citationFormatSelect = document.getElementById('citation-format-select');
    const copyCitationBtn = document.getElementById('copy-citation');
    const downloadCitationBtn = document.getElementById('download-citation');
    
    citationFormatSelect.addEventListener('change', updateCitation);
    copyCitationBtn.addEventListener('click', copyCitation);
    downloadCitationBtn.addEventListener('click', downloadCitation);
}

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        performSearch(query, 1);
    }
}

// Handle search input changes
function handleSearchInput(event) {
    const value = event.target.value;
    const clearBtn = document.getElementById('clear-search');
    
    if (value) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
}

// Clear search input
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
}

// Perform search
async function performSearch(query, page = 1) {
    if (isLoading) return;
    
    currentQuery = query;
    currentPage = page;
    isLoading = true;
    
    showLoadingState();
    hideWelcomeSection();
    showResultsSection();
    
    try {
        const offset = (page - 1) * RESULTS_PER_PAGE;
        const response = await searchBooks(query, offset, RESULTS_PER_PAGE, filters);
        
        currentBooks = response.docs || [];
        totalResults = response.numFound || response.num_found || 0;
        
        displayResults();
        updatePagination();
        
        // Add to search history
        if (page === 1) {
            addToSearchHistory(query, totalResults);
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showErrorState(error.message || 'An error occurred while searching.');
    } finally {
        isLoading = false;
        hideLoadingState();
    }
}

// Search books using Open Library API
async function searchBooks(query, offset = 0, limit = 20, filters = {}) {
    let url = `${OPEN_LIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}`;
    url += `&offset=${offset}&limit=${limit}`;
    
    if (filters.language && filters.language !== 'all') {
        url += `&language=${filters.language}`;
    }
    
    if (filters.yearRange) {
        const [startYear, endYear] = filters.yearRange;
        if (startYear > 1400) {
            url += `&first_publish_year=[${startYear} TO ${endYear}]`;
        }
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort results if specified
    if (filters.sortBy && filters.sortBy !== 'relevance') {
        data.docs = sortBooks(data.docs, filters.sortBy);
    }
    
    return data;
}

// Sort books based on criteria
function sortBooks(books, sortBy) {
    const sorted = [...books];
    
    switch (sortBy) {
        case 'title':
            return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        case 'year':
            return sorted.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
        case 'rating':
            return sorted.sort((a, b) => (b.ratings_average || 0) - (a.ratings_average || 0));
        default:
            return sorted;
    }
}

// Display search results
function displayResults() {
    const resultsGrid = document.getElementById('results-grid');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    resultsCount.textContent = `${totalResults.toLocaleString()} books found`;
    
    if (currentBooks.length === 0) {
        resultsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    resultsGrid.style.display = 'flex';
    
    // Clear existing results
    resultsGrid.innerHTML = '';
    
    // Create book cards
    currentBooks.forEach((book, index) => {
        const bookCard = createBookCardElement(book, index);
        resultsGrid.appendChild(bookCard);
    });
}

// Create book card element
function createBookCardElement(book, index) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.dataset.bookKey = book.key;
    bookCard.dataset.index = index;
    
    const coverUrl = getBookCoverUrl(book.cover_i);
    const authors = book.author_name?.join(', ') || 'Unknown Author';
    const year = book.first_publish_year;
    const rating = book.ratings_average;
    const hasEbook = (book.ebook_count_i || 0) > 0;
    const isSaved = isBookSaved(book);
    
    bookCard.innerHTML = `
        <div class="book-card-content">
            <div class="book-cover-container">
                <img src="${coverUrl}" alt="Cover of ${escapeHtml(book.title)}" class="book-cover" 
                     onerror="this.src='/assets/book-placeholder.svg'">
                ${hasEbook ? '<div class="ebook-badge">eBook</div>' : ''}
            </div>
            <div class="book-info">
                <div class="book-header">
                    <h3 class="book-title">${escapeHtml(book.title)}</h3>
                    <button class="save-btn ${isSaved ? 'saved' : ''}" data-action="save">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <p class="book-author">by ${escapeHtml(authors)}</p>
                <div class="book-meta">
                    ${year ? `
                        <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>${year}</span>
                        </div>
                    ` : ''}
                    ${rating ? `
                        <div class="meta-item">
                            <div class="rating-stars">
                                ${createStarRating(rating)}
                            </div>
                            <span>${rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                    ${book.edition_count && book.edition_count > 1 ? `
                        <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                            </svg>
                            <span>${book.edition_count} editions</span>
                        </div>
                    ` : ''}
                </div>
                ${book.subject && book.subject.length > 0 ? `
                    <div class="subjects">
                        ${book.subject.slice(0, 3).map(subject => 
                            `<span class="subject-tag">${escapeHtml(subject)}</span>`
                        ).join('')}
                        ${book.subject.length > 3 ? 
                            `<span class="subject-tag">+${book.subject.length - 3} more</span>` : ''
                        }
                    </div>
                ` : ''}
                <div class="book-actions">
                    <div class="book-actions-content">
                        <div class="source-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"/>
                                <circle cx="12" cy="1" r="1"/>
                                <circle cx="12" cy="23" r="1"/>
                                <circle cx="20" cy="12" r="1"/>
                                <circle cx="4" cy="12" r="1"/>
                            </svg>
                            <span>Open Library</span>
                        </div>
                        <div class="view-details">
                            <span>View Details</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15,3 21,3 21,9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const saveBtn = bookCard.querySelector('.save-btn');
    
    // Book card click (open modal)
    bookCard.addEventListener('click', (e) => {
        if (!e.target.closest('.save-btn')) {
            openBookModal(book);
        }
    });
    
    // Save button click
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSaveBook(book, saveBtn);
    });
    
    return bookCard;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Create star rating HTML
function createStarRating(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push('<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>');
        } else {
            stars.push('<svg class="star empty" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>');
        }
    }
    
    return stars.join('');
}

// Get book cover URL
function getBookCoverUrl(coverId, size = 'M') {
    if (!coverId) {
        return '/assets/book-placeholder.svg';
    }

    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`;
}

// Show/hide UI states
function showLoadingState() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('results-grid').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('loading-state').style.display = 'none';
}

function showErrorState(message) {
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('error-message').textContent = message;
    document.getElementById('results-grid').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

function showResultsSection() {
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('features-section').style.display = 'none';
}

function hideWelcomeSection() {
    document.getElementById('welcome-section').style.display = 'none';
}

// Pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const paginationText = document.getElementById('pagination-text');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update pagination text
    const start = (currentPage - 1) * RESULTS_PER_PAGE + 1;
    const end = Math.min(currentPage * RESULTS_PER_PAGE, totalResults);
    paginationText.textContent = `Showing ${start} to ${end} of ${totalResults.toLocaleString()} results`;
    
    // Update prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    
    // Update page numbers
    pageNumbers.innerHTML = createPageNumbers(currentPage, totalPages);
    
    // Add event listeners to page numbers
    const pageNumberBtns = pageNumbers.querySelectorAll('.page-number');
    pageNumberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            changePage(page);
        });
    });
}

function createPageNumbers(currentPage, totalPages) {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(`
            <button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `);
    }
    
    return pages.join('');
}

function changePage(page) {
    if (page !== currentPage && page >= 1) {
        performSearch(currentQuery, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Search history
function addToSearchHistory(query, resultsCount) {
    const history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
    
    // Remove existing entry for this query
    const filteredHistory = history.filter(item => item.query !== query);
    
    // Add new entry at the beginning
    const newEntry = {
        query,
        timestamp: new Date().toISOString(),
        resultsCount
    };
    
    filteredHistory.unshift(newEntry);
    
    // Keep only the last 20 searches
    const updatedHistory = filteredHistory.slice(0, 20);
    
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
}

function showSearchHistory() {
    const history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
    const searchHistory = document.getElementById('search-history');
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
        searchHistory.style.display = 'none';
        return;
    }
    
    historyList.innerHTML = history.slice(0, 5).map(item => `
        <button class="history-item" data-query="${escapeHtml(item.query)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
            </svg>
            <div class="history-item-content">
                <p class="history-item-query">${escapeHtml(item.query)}</p>
                <p class="history-item-meta">${item.resultsCount} results • ${new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
        </button>
    `).join('');
    
    searchHistory.style.display = 'block';
    
    // Add event listeners
    const historyItems = historyList.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            document.getElementById('search-input').value = query;
            performSearch(query, 1);
            searchHistory.style.display = 'none';
        });
    });
}

function clearSearchHistory() {
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
    document.getElementById('search-history').style.display = 'none';
}

function handleOutsideClick(event) {
    const searchHistory = document.getElementById('search-history');
    const searchInput = document.getElementById('search-input');
    
    if (!searchHistory.contains(event.target) && !searchInput.contains(event.target)) {
        searchHistory.style.display = 'none';
    }
}

// Saved books functionality
function toggleSaveBook(book, buttonElement) {
    const savedBooks = getFromStorage(STORAGE_KEYS.SAVED_BOOKS, []);
    const isCurrentlySaved = savedBooks.some(saved => saved.key === book.key);
    
    if (isCurrentlySaved) {
        // Remove from saved books
        const updatedBooks = savedBooks.filter(saved => saved.key !== book.key);
        saveToStorage(STORAGE_KEYS.SAVED_BOOKS, updatedBooks);
        buttonElement.classList.remove('saved');
    } else {
        // Add to saved books
        const savedBook = {
            ...book,
            savedAt: new Date().toISOString()
        };
        savedBooks.unshift(savedBook);
        saveToStorage(STORAGE_KEYS.SAVED_BOOKS, savedBooks);
        buttonElement.classList.add('saved');
    }
    
    updateSavedCount();
}

function isBookSaved(book) {
    const savedBooks = getFromStorage(STORAGE_KEYS.SAVED_BOOKS, []);
    return savedBooks.some(saved => saved.key === book.key);
}

function updateSavedCount() {
    const savedBooks = getFromStorage(STORAGE_KEYS.SAVED_BOOKS, []);
    const savedCount = document.getElementById('saved-count');
    const savedCountText = document.getElementById('saved-count-text');
    
    if (savedBooks.length > 0) {
        savedCountText.textContent = `${savedBooks.length} saved`;
        savedCount.style.display = 'flex';
    } else {
        savedCount.style.display = 'none';
    }
}

// Filter functionality
function toggleFilterSection(event) {
    const header = event.currentTarget;
    const section = header.dataset.section;
    const content = document.querySelector(`[data-content="${section}"]`);
    const chevron = header.querySelector('.chevron');
    
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    header.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
        content.style.maxHeight = '0';
        content.style.marginTop = '0';
        chevron.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.marginTop = 'var(--spacing-3)';
        chevron.style.transform = 'rotate(180deg)';
    }
}

function updateSourceFilter(event) {
    filters.source = event.target.value;
    saveFilters();
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function updateLanguageFilter(event) {
    filters.language = event.target.value;
    saveFilters();
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function updateYearFilter() {
    const yearFrom = parseInt(document.getElementById('year-from').value) || 1400;
    const yearTo = parseInt(document.getElementById('year-to').value) || new Date().getFullYear();
    
    filters.yearRange = [yearFrom, yearTo];
    
    // Update display
    document.getElementById('year-range-text').textContent = `${yearFrom} - ${yearTo}`;
    
    saveFilters();
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function updateFormatFilter(event) {
    filters.format = event.target.value;
    saveFilters();
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function updateSortFilter(event) {
    filters.sortBy = event.target.value;
    saveFilters();
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function resetFilters() {
    filters = {
        source: 'all',
        language: 'all',
        yearRange: [1400, new Date().getFullYear()],
        format: 'all',
        sortBy: 'relevance'
    };
    
    updateFilterUI();
    saveFilters();
    
    if (currentQuery) {
        performSearch(currentQuery, 1);
    }
}

function updateFilterUI() {
    // Source
    document.querySelector(`input[name="source"][value="${filters.source}"]`).checked = true;
    
    // Language
    document.getElementById('language-select').value = filters.language;
    
    // Year range
    document.getElementById('year-from').value = filters.yearRange[0];
    document.getElementById('year-to').value = filters.yearRange[1];
    document.getElementById('year-range-text').textContent = `${filters.yearRange[0]} - ${filters.yearRange[1]}`;
    
    // Format
    document.querySelector(`input[name="format"][value="${filters.format}"]`).checked = true;
    
    // Sort
    document.getElementById('sort-select').value = filters.sortBy;
}

function saveFilters() {
    saveToStorage(STORAGE_KEYS.FILTERS, filters);
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('filter-sidebar');
    sidebar.classList.toggle('open');
}

function closeSidebarMobile() {
    const sidebar = document.getElementById('filter-sidebar');
    sidebar.classList.remove('open');
}

// Theme functionality
function setupTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
}

// Book modal functionality
async function openBookModal(book) {
    selectedBook = book;
    const modal = document.getElementById('book-modal');
    
    // Update modal content
    updateBookModalContent(book);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Load additional book details
    try {
        const details = await getBookDetails(book.key);
        updateBookModalWithDetails(details);
    } catch (error) {
        console.error('Error loading book details:', error);
    }
    
    // Update citation
    updateCitation();
}

function updateBookModalContent(book) {
    const coverUrl = getBookCoverUrl(book.cover_i, 'L');
    const authors = book.author_name?.join(', ') || 'Unknown Author';
    const year = book.first_publish_year;
    const publisher = book.publisher?.[0];
    const languages = book.language?.join(', ');
    const rating = book.ratings_average;
    const ratingsCount = book.ratings_count;
    
    // Update cover
    document.getElementById('modal-book-cover').src = coverUrl;
    
    // Update title and author
    document.getElementById('modal-book-title').textContent = book.title;
    document.getElementById('modal-book-author').textContent = `by ${authors}`;
    
    // Update subjects
    const subjectsContainer = document.getElementById('modal-subjects');
    if (book.subject && book.subject.length > 0) {
        subjectsContainer.innerHTML = book.subject.slice(0, 10).map(subject => 
            `<span class="subject-tag">${escapeHtml(subject)}</span>`
        ).join('');
    } else {
        subjectsContainer.innerHTML = '';
    }
    
    // Update metadata
    updateMetaItem('modal-year', year, `Published: ${year}`);
    updateMetaItem('modal-publisher', publisher, `Publisher: ${publisher}`);
    updateMetaItem('modal-language', languages, `Languages: ${languages}`);
    updateMetaItem('modal-editions', book.edition_count > 1, `${book.edition_count} editions`);
    
    // Update rating
    const ratingContainer = document.getElementById('modal-rating');
    if (rating) {
        ratingContainer.innerHTML = `
            <div class="rating-stars">
                ${createStarRating(rating)}
            </div>
            <span>${rating.toFixed(1)} ${ratingsCount ? `(${ratingsCount} reviews)` : ''}</span>
        `;
        ratingContainer.style.display = 'flex';
    } else {
        ratingContainer.style.display = 'none';
    }
    
    // Update Open Library link
    document.getElementById('modal-open-library-link').href = `https://openlibrary.org${book.key}`;
    
    // Update save button
    const saveBtn = document.getElementById('save-book-btn');
    const isSaved = isBookSaved(book);
    saveBtn.classList.toggle('saved', isSaved);
    
    saveBtn.onclick = () => {
        toggleSaveBook(book, saveBtn);
    };
}

function updateMetaItem(id, condition, text) {
    const element = document.getElementById(id);
    if (condition) {
        element.querySelector('span').textContent = text;
        element.style.display = 'flex';
    } else {
        element.style.display = 'none';
    }
}

async function getBookDetails(key) {
    const response = await fetch(`${OPEN_LIBRARY_BASE_URL}${key}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function updateBookModalWithDetails(details) {
    const descriptionContainer = document.getElementById('modal-book-description');
    const loadingContainer = document.getElementById('modal-description-loading');
    
    loadingContainer.style.display = 'none';
    
    let description = '';
    if (details.description) {
        if (typeof details.description === 'string') {
            description = details.description;
        } else if (details.description.value) {
            description = details.description.value;
        }
    }
    
    if (description) {
        descriptionContainer.textContent = description;
    } else {
        descriptionContainer.textContent = 'No description available for this book.';
    }
}

function closeBookModal() {
    const modal = document.getElementById('book-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    selectedBook = null;
}

// Citation functionality
function updateCitation() {
    if (!selectedBook) return;
    
    const format = document.getElementById('citation-format-select').value;
    const citation = generateCitation(selectedBook, format);
    document.getElementById('citation-text').textContent = citation;
}

function generateCitation(book, format) {
    const title = book.title || 'Unknown Title';
    const authors = book.author_name?.join(', ') || 'Unknown Author';
    const year = book.first_publish_year || 'n.d.';
    const publisher = book.publisher?.[0] || 'Open Library';
    
    switch (format) {
        case 'apa':
            return `${authors} (${year}). ${title}. ${publisher}. Retrieved from Open Library.`;
        case 'mla':
            return `${authors}. "${title}." ${publisher}, ${year}. Open Library, openlibrary.org.`;
        case 'chicago':
            return `${authors}. "${title}." ${publisher}, ${year}. https://openlibrary.org.`;
        default:
            return `${authors}. ${title}. ${publisher}, ${year}.`;
    }
}

async function copyCitation() {
    const citation = document.getElementById('citation-text').textContent;
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
    
    try {
        await navigator.clipboard.writeText(citation);
        
        // Show success feedback
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
        
        setTimeout(() => {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy citation:', error);
    }
}

function downloadCitation() {
    const citation = document.getElementById('citation-text').textContent;
    const filename = `${selectedBook.title?.replace(/[^a-z0-9]/gi, '_')}_citation.txt`;
    
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Admin dashboard functionality
function setupAdminShortcut() {
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'A') {
            event.preventDefault();
            openAdminDashboard();
        }
    });
}

function openAdminDashboard() {
    const modal = document.getElementById('admin-modal');
    updateAdminDashboard();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function updateAdminDashboard() {
    const searchHistory = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
    const savedBooks = getFromStorage(STORAGE_KEYS.SAVED_BOOKS, []);
    
    // Update stats
    document.getElementById('total-searches').textContent = searchHistory.length;
    document.getElementById('total-saved').textContent = savedBooks.length;
    document.getElementById('week-searches').textContent = getSearchesThisWeek(searchHistory);
    document.getElementById('month-searches').textContent = getSearchesThisMonth(searchHistory);
    
    // Update popular queries
    updatePopularQueries(searchHistory);
    
    // Update recent saved books
    updateRecentSavedBooks(savedBooks);
    
    // Update last updated time
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
}

function getSearchesThisWeek(history) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return history.filter(item => new Date(item.timestamp) > weekAgo).length;
}

function getSearchesThisMonth(history) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return history.filter(item => new Date(item.timestamp) > monthAgo).length;
}

function updatePopularQueries(history) {
    const queryCount = history.reduce((acc, item) => {
        acc[item.query] = (acc[item.query] || 0) + 1;
        return acc;
    }, {});
    
    const popularQueries = Object.entries(queryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    
    const container = document.getElementById('popular-queries');
    
    if (popularQueries.length === 0) {
        container.innerHTML = '<p class="no-data">No search data available yet</p>';
        return;
    }
    
    container.innerHTML = popularQueries.map(([query, count], index) => `
        <div class="query-item">
            <div class="query-info">
                <div class="query-rank">${index + 1}</div>
                <span class="query-text">${escapeHtml(query)}</span>
            </div>
            <span class="query-count">${count} searches</span>
        </div>
    `).join('');
}

function updateRecentSavedBooks(savedBooks) {
    const container = document.getElementById('recent-saved');
    
    if (savedBooks.length === 0) {
        container.innerHTML = '<p class="no-data">No saved books yet</p>';
        return;
    }
    
    const recentBooks = savedBooks
        .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
        .slice(0, 5);
    
    container.innerHTML = recentBooks.map(book => `
        <div class="saved-book-item">
            <div class="saved-book-cover"></div>
            <div class="saved-book-info">
                <p class="saved-book-title">${escapeHtml(book.title)}</p>
                <p class="saved-book-author">${escapeHtml(book.author_name?.join(', ') || 'Unknown Author')}</p>
                <p class="saved-book-date">Saved ${new Date(book.savedAt).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

// Modal overlay click handling
function handleModalOverlayClick(event) {
    if (event.target.classList.contains('modal-overlay')) {
        const bookModal = document.getElementById('book-modal');
        const adminModal = document.getElementById('admin-modal');
        
        if (bookModal.style.display === 'flex') {
            closeBookModal();
        }
        if (adminModal.style.display === 'flex') {
            closeAdminModal();
        }
    }
}

// Initialize filter sections as expanded by default
function setupFilters() {
    const filterHeaders = document.querySelectorAll('.filter-header');
    filterHeaders.forEach(header => {
        header.setAttribute('aria-expanded', 'true');
        const chevron = header.querySelector('.chevron');
        chevron.style.transform = 'rotate(180deg)';
    });
}