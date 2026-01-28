const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('hidden');
});

// Debounce utility
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function addSearchFilter() {
  const inputValue = document.getElementById('blog.hbs-search').value.trim();

  const url = new URL(window.location.href);
  if (inputValue) {
    url.searchParams.set("search", inputValue);
  } else {
    url.searchParams.delete("search"); // remove search if empty
  }
}



// Attach debounced listener
const searchInput = document.getElementById('blog.hbs-search');
searchInput.addEventListener('input', debounce(addSearchFilter, 500));

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDescription = document.getElementById('modal-description');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Function to show the modal with a smooth transition
  function showModal() {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');
  }

  // Function to hide the modal with a smooth transition
  function hideModal() {
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('opacity-0', 'pointer-events-none');
    }, 300); // Match this timeout to the CSS transition duration
  }

  // Loop through each card and attach a click listener
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Get data from the clicked card's data attributes
      const title = card.dataset.title;
      const imageSrc = card.dataset.imageSrc;
      const description = card.dataset.description;

      // Update the modal content
      modalTitle.textContent = title;
      modalImage.src = imageSrc;
      modalDescription.textContent = description;

      showModal();
    });
  });

  // Event listeners for closing the modal
  closeModalBtn.addEventListener('click', hideModal);

  // Close modal when clicking outside of it
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Dropdown functionality
  const dropdownButton = document.getElementById('dropdown-button');
  const dropdownMenu = document.getElementById('dropdown-menu');

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }

  // You would add search and pagination functionality here
  // Search: Listen for input changes in the search box to filter results
  const searchInput = document.querySelector('input[type="text"][placeholder="Search..."]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      // Implement filtering logic for your blog.hbs cards
      // e.g., show/hide cards based on whether their title/description includes the query
    });
  }

  // Pagination: Listen for clicks on pagination links to load new content
  const paginationLinks = document.querySelectorAll('.flex.justify-center.items-center.mt-12 a');
  if (paginationLinks.length > 0) {
    paginationLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Get the page number from the link's text or data attribute
        // e.g., const page = e.target.textContent;
        // Fetch the new page's data from your server or data source
        // Update the page content and active pagination link
      });
    });
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterTabs = document.getElementById('filterTabs');
  const blogCardsContainer = document.getElementById('blogCardsContainer');
  const allCards = Array.from(blogCardsContainer.querySelectorAll('.blog.hbs-card'));
  let activeCategory = 'all';
  let searchQuery = '';

  // Main function to filter and search the cards
  function filterAndSearchCards() {
    const query = searchQuery.toLowerCase();
    allCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardTitle = card.querySelector('h2').textContent.toLowerCase();
      const cardDescription = card.querySelector('p').textContent.toLowerCase();

      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const searchMatch = cardTitle.includes(query) || cardDescription.includes(query);

      if (categoryMatch && searchMatch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Event listener for filter tabs
  filterTabs.addEventListener('click', (event) => {
    const target = event.target.closest('.filter-tab');
    if (target) {
      // Update active tab state
      filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('bg-indigo-600', 'text-white');
        tab.classList.add('bg-white', 'text-gray-800', 'border', 'border-gray-300', 'hover:bg-gray-200');
      });
      target.classList.add('active');
      target.classList.add('bg-indigo-600', 'text-white');
      target.classList.remove('bg-white', 'text-gray-800', 'border', 'border-gray-300', 'hover:bg-gray-200');

      // Set the new active category and trigger filter
      activeCategory = target.dataset.category;
      filterAndSearchCards();
    }
  });

  // Event listener for search input
  searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value.trim();
    filterAndSearchCards();
  });

  // Initial rendering on page load
  filterAndSearchCards();
});
