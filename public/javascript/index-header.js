document.addEventListener('DOMContentLoaded', () => {
  alert()

  const searchInput = document.getElementById('searchInput');
  const filterTabs = document.getElementById('filterTabs');
  const blogCardsContainer = document.getElementById('blogCardsContainer');
  const allCards = Array.from(blogCardsContainer.querySelectorAll('.blog.hbs-card'));
  const paginator = document.getElementById('paginator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageNumbersContainer = document.getElementById('pageNumbers');

  let activeCategory = 'all';
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 6;
  let filteredCards = [];
  let totalPages = 0;

  // Main function to filter, search, and paginate the cards
  function renderCards() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const cardsToShow = filteredCards.slice(start, end);

    allCards.forEach(card => card.classList.add('hidden'));
    cardsToShow.forEach(card => card.classList.remove('hidden'));

    updatePaginator();
  }

  // Function to update the paginator buttons
  function updatePaginator() {
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.classList.add('pagination-btn', 'px-4', 'py-2', 'rounded-lg', 'border', 'border-gray-300', 'shadow-sm', 'text-sm', 'transition', 'duration-300', 'ease-in-out', 'hover:bg-gray-100');
      if (i === currentPage) {
        pageBtn.classList.add('active');
        pageBtn.classList.remove('text-gray-600', 'bg-white');
      } else {
        pageBtn.classList.remove('active');
        pageBtn.classList.add('text-gray-600', 'bg-white');
      }
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderCards();
      });
      pageNumbersContainer.appendChild(pageBtn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // Function to re-filter and re-search all cards
  function filterAndSearch() {
    const query = searchQuery.toLowerCase();
    filteredCards = allCards.filter(card => {
      const cardCategory = card.dataset.category;
      const cardTitle = card.querySelector('h2').textContent.toLowerCase();
      const cardDescription = card.querySelector('p').textContent.toLowerCase();

      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const searchMatch = cardTitle.includes(query) || cardDescription.includes(query);

      return categoryMatch && searchMatch;
    });

    totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    currentPage = 1; // Reset to first page on filter/search change
    renderCards();
  }

  // Event listener for filter tabs
  filterTabs.addEventListener('click', (event) => {
    const target = event.target.closest('.filter-tab');
    if (target) {
      // Update active tab state
      filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      target.classList.add('active');

      activeCategory = target.dataset.category;
      filterAndSearch();
    }
  });

  // Event listener for search input
  searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value.trim();
    filterAndSearch();
  });

  // Event listeners for pagination buttons
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
    }
  });

  // Initial rendering on page load
  filterAndSearch();
});
