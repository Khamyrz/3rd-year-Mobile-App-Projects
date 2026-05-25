// Main App JavaScript

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Hide splash screen after a short delay
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        document.getElementById('splash-screen').style.transform = 'translateY(-100%)';
        document.getElementById('app-container').style.display = 'flex';
    }, 2000);

    initApp();
}

// If running in browser (for testing), also init the app when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if cordova is available
    if (typeof cordova === 'undefined') {
        setTimeout(() => {
            document.getElementById('splash-screen').style.opacity = '0';
            document.getElementById('splash-screen').style.transform = 'translateY(-100%)';
            document.getElementById('app-container').style.display = 'flex';
        }, 2000);
        initApp();
    }
});

// Book data
const books = [
    {
        id: 1,
        title: "1984",
        author: "George Orwell",
        coverColor: "#3498db",
        genre: "fiction",
        pages: 328,
        rating: 4.7,
        isFavorite: true,
        isInShelf: true,
        progress: 0,
        description: "Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake and persecutes those who dare to commit thoughtcrimes. But as he starts to think for himself, Winston can't escape the fact that Big Brother is always watching...",
        content: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him..."
    },
    {
        id: 2,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverColor: "#e74c3c",
        genre: "fiction",
        pages: 432,
        rating: 4.5,
        isFavorite: false,
        isInShelf: false,
        progress: 0,
        description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work 'her own darling child' and its vivacious heroine, Elizabeth Bennet, 'as delightful a creature as ever appeared in print.'",
        content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters..."
    },
    {
        id: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverColor: "#2ecc71",
        genre: "fiction",
        pages: 180,
        rating: 4.3,
        isFavorite: true,
        isInShelf: false,
        progress: 0,
        description: "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story is of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.",
        content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'..."
    },
    {
        id: 4,
        title: "The Midnight Library",
        author: "Matt Haig",
        coverColor: "#9b59b6",
        genre: "fiction",
        pages: 304,
        rating: 4.2,
        isFavorite: false,
        isInShelf: true,
        progress: 0,
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
        content: "Nineteen years before she decided to die, Nora Seed sat in the warmth of the small library at Hazeldene School in the town of Bedford. She sat at a low table staring at a chess board. The library was a school library, but it was also the town library too..."
    },
    {
        id: 5,
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverColor: "#f39c12",
        genre: "fiction",
        pages: 496,
        rating: 4.8,
        isFavorite: true,
        isInShelf: true,
        progress: 0,
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
        content: "What's my name? I don't remember. I'm scared. I force my eyes open. I'm in a bed. Some sort of hospital? Everything hurts. I'm wearing a hospital gown. That makes sense, right? I'm in rough shape. The gown is thin and I'm cold. A light shines from above..."
    },
    {
        id: 6,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        coverColor: "#16a085",
        genre: "fiction",
        pages: 320,
        rating: 4.1,
        isFavorite: false,
        isInShelf: false,
        progress: 0,
        description: "Klara and the Sun, the first novel by Kazuo Ishiguro since he was awarded the Nobel Prize in Literature, tells the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.",
        content: "When we were new, Rosa and I were mid-store, on the magazines table side, and could see through more than half of the window. So we were able to watch the outside – the office workers hurrying by, the taxis, the runners, the tourists, Beggar Man and his dog, the lower part of the RPO Building..."
    },
    {
        id: 7,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverColor: "#d35400",
        genre: "fiction",
        pages: 336,
        rating: 4.8,
        isFavorite: true,
        isInShelf: true,
        progress: 65,
        description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. 'To Kill A Mockingbird' became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film.",
        content: "When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body, his thumb parallel to his thigh..."
    },
    {
        id: 8,
        title: "Dune",
        author: "Frank Herbert",
        coverColor: "#27ae60",
        genre: "fiction",
        pages: 688,
        rating: 4.6,
        isFavorite: false,
        isInShelf: true,
        progress: 32,
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
        content: "In the week before their departure to Arrakis, when all the final scurrying about had reached a nearly unbearable frenzy, an old crone came to visit the mother of the boy, Paul. It was a warm night at Castle Caladan, and the ancient pile of stone that had served the Atreides family as home for twenty-six generations bore that cooled-sweat feeling it acquired before a change in the weather..."
    },
    {
        id: 9,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        coverColor: "#8e44ad",
        genre: "fiction",
        pages: 310,
        rating: 4.7,
        isFavorite: true,
        isInShelf: true,
        progress: 78,
        description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
        content: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort..."
    },
    {
        id: 10,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        coverColor: "#c0392b",
        genre: "fiction",
        pages: 336,
        rating: 4.5,
        isFavorite: false,
        isInShelf: false,
        progress: 0,
        description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
        content: "Alicia Berenson was thirty-three years old when she killed her husband. They had been married for seven years. They were both artists—Alicia was a painter, and Gabriel was a well-known fashion photographer. He had a distinctive style, shooting semi-starved, semi-naked women in strange, unflattering angles..."
    }
];

function initApp() {
    // Initialize UI event listeners
    initUIControls();
    
    // Load books into library
    loadLibrary();
    
    // Load reading shelf
    loadReadingShelf();
    
    // Load favorites
    loadFavorites();
    
    // Apply saved settings
    applySavedSettings();
}

function initUIControls() {
    // Menu controls
    document.getElementById('menu-button').addEventListener('click', function() {
        document.getElementById('side-menu').style.left = '0';
    });
    
    document.getElementById('close-menu').addEventListener('click', function() {
        document.getElementById('side-menu').style.left = '-280px';
    });
    
    // Navigation
    const menuItems = document.querySelectorAll('.menu-items li');
    const navItems = document.querySelectorAll('.nav-item');
    
    function navigateTo(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update menu and nav active states
        menuItems.forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Close side menu after navigation
        document.getElementById('side-menu').style.left = '-280px';
    }
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            navigateTo(this.getAttribute('data-page'));
        });
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navigateTo(this.getAttribute('data-page'));
        });
    });
    
    // Search functionality
    document.getElementById('search-button').addEventListener('click', function() {
        document.getElementById('search-overlay').style.display = 'flex';
        document.getElementById('search-input').focus();
    });
    
    document.getElementById('back-search').addEventListener('click', function() {
        document.getElementById('search-overlay').style.display = 'none';
    });
    
    document.getElementById('clear-search').addEventListener('click', function() {
        document.getElementById('search-input').value = '';
        document.getElementById('search-input').focus();
        document.getElementById('search-results').innerHTML = '';
    });
    
    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const results = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        
        displaySearchResults(results);
    });
    
    // Book cards
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            openBookDetails(bookId);
        });
    });
    
    // Settings
    document.getElementById('night-mode-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('nightMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('nightMode', 'false');
        }
    });
    
    document.getElementById('increase-font').addEventListener('click', function() {
        changeFontSize(1);
    });
    
    document.getElementById('decrease-font').addEventListener('click', function() {
        changeFontSize(-1);
    });
    
    document.getElementById('data-usage').addEventListener('change', function() {
        localStorage.setItem('dataUsage', this.value);
    });
    
    document.getElementById('notifications-toggle').addEventListener('change', function() {
        localStorage.setItem('notifications', this.checked ? 'true' : 'false');
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter the library
            filterLibrary(filter);
        });
    });
}

function loadLibrary() {
    const libraryGrid = document.querySelector('.library-grid');
    
    // Clear existing content
    libraryGrid.innerHTML = '';
    
    // Add all books to the library
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-id', book.id);
        bookCard.setAttribute('data-genre', book.genre);
        
        bookCard.innerHTML = `
            <div class="book-cover" style="background-color: ${book.coverColor};">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        
        // Add progress bar if book is in reading shelf
        if (book.isInShelf && book.progress > 0) {
            bookCard.innerHTML += `
                <div class="progress-bar">
                    <div class="progress" style="width: ${book.progress}%;"></div>
                </div>
                <div class="progress-text">${book.progress}%</div>
            `;
        }
        
        bookCard.addEventListener('click', () => {
            openBookDetails(book.id);
        });
        
        libraryGrid.appendChild(bookCard);
    });
}

function filterLibrary(filter) {
    const bookCards = document.querySelectorAll('.library-grid .book-card');
    
    bookCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-genre') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function loadReadingShelf() {
    const shelfList = document.querySelector('.shelf-list');
    
    // Clear existing content
    shelfList.innerHTML = '';
    
    // Add books that are in the reading shelf
    const shelfBooks = books.filter(book => book.isInShelf);
    
    if (shelfBooks.length === 0) {
        shelfList.innerHTML = '<p>Your reading list is empty. Add books from the library.</p>';
        return;
    }
    
    shelfBooks.forEach(book => {
        const shelfItem = document.createElement('div');
        shelfItem.className = 'shelf-item';
        shelfItem.setAttribute('data-id', book.id);
        
        shelfItem.innerHTML = `
            <div class="shelf-cover" style="background-color: ${book.coverColor};">
                <i class="fas fa-book"></i>
            </div>
            <div class="shelf-info">
                <div class="shelf-title">${book.title}</div>
                <div class="shelf-author">${book.author}</div>
                <div class="shelf-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${book.progress}%;"></div>
                    </div>
                    ${book.progress}%
                </div>
            </div>
        `;
        
        shelfItem.addEventListener('click', () => {
            openBookDetails(book.id);
        });
        
        shelfList.appendChild(shelfItem);
    });
}

function loadFavorites() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    
    // Clear existing content
    favoritesGrid.innerHTML = '';
    
    // Add favorite books
    const favoriteBooks = books.filter(book => book.isFavorite);
    
    if (favoriteBooks.length === 0) {
        favoritesGrid.innerHTML = '<p>You have no favorite books yet.</p>';
        return;
    }
    
    favoriteBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-id', book.id);
        
        bookCard.innerHTML = `
            <div class="book-cover" style="background-color: ${book.coverColor};">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        
        // Add progress bar if book is in reading shelf
        if (book.isInShelf && book.progress > 0) {
            bookCard.innerHTML += `
                <div class="progress-bar">
                    <div class="progress" style="width: ${book.progress}%;"></div>
                </div>
                <div class="progress-text">${book.progress}%</div>
            `;
        }
        
        bookCard.addEventListener('click', () => {
            openBookDetails(book.id);
        });
        
        favoritesGrid.appendChild(bookCard);
    });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    // Clear existing results
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No books found.</p>';
        return;
    }
    
    // Create a grid for search results
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'library-grid';
    
    results.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-id', book.id);
        
        bookCard.innerHTML = `
            <div class="book-cover" style="background-color: ${book.coverColor};">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        
        bookCard.addEventListener('click', () => {
            document.getElementById('search-overlay').style.display = 'none';
            openBookDetails(book.id);
        });
        
        resultsGrid.appendChild(bookCard);
    });
    
    searchResults.appendChild(resultsGrid);
}

function openBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    
    if (!book) return;
    
    const detailsOverlay = document.getElementById('book-details-overlay');
    const detailsContent = document.getElementById('book-details-content');
    
    detailsContent.innerHTML = `
        <div class="book-details">
            <div class="book-details-cover" style="background-color: ${book.coverColor};">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-details-title">${book.title}</div>
            <div class="book-details-author">${book.author}</div>
            <div class="book-details-buttons">
                <div class="book-details-button read-button" id="read-book">
                    ${book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                </div>
                <div class="book-details-button favorite-button" id="toggle-favorite">
                    ${book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </div>
            </div>
            <div class="book-details-info">
                <div class="info-item">
                    <div class="info-value">${book.pages}</div>
                    <div class="info-label">Pages</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${book.rating}</div>
                    <div class="info-label">Rating</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</div>
                    <div class="info-label">Genre</div>
                </div>
            </div>
            <div class="book-details-description">
                <div class="description-title">Description</div>
                <p>${book.description}</p>
            </div>
        </div>
    `;
    
    // Show the overlay
    detailsOverlay.style.display = 'block';
    
    // Back button
    detailsOverlay.querySelector('.back-button').addEventListener('click', function() {
        detailsOverlay.style.display = 'none';
    });
    
    // Read button
    document.getElementById('read-book').addEventListener('click', function() {
        openReader(book);
    });
    
    // Favorite button
    document.getElementById('toggle-favorite').addEventListener('click', function() {
        toggleFavorite(book);
        this.textContent = book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    });
}

function openReader(book) {
    const readerOverlay = document.getElementById('reader-overlay');
    const bookContent = document.getElementById('book-content');
    const readerTitle = document.querySelector('.reader-title');
    
    // Generate multiple pages of content
    const bookPages = generateBookPages(book);
    
    // Set book title
    readerTitle.textContent = book.title;
    
    // Set initial book content (first page)
    bookContent.innerHTML = `<p>${bookPages[0]}</p>`;
    
    // Set page numbers
    let currentPage = 1;
    const totalPages = Math.ceil(book.pages / 20); // Simplified pagination
    
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    // Mark as in reading shelf
    if (!book.isInShelf) {
        book.isInShelf = true;
        if (book.progress === 0) {
            book.progress = 5; // Start at 5% progress
        }
        loadReadingShelf();
    }
    
    // Show the reader
    readerOverlay.style.display = 'flex';
    
    // Back button
    document.querySelector('.back-to-details').addEventListener('click', function() {
        readerOverlay.style.display = 'none';
    });
    
    // Page navigation
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            document.getElementById('current-page').textContent = currentPage;
            
            // Show content for current page
            bookContent.style.opacity = '0';
            setTimeout(() => {
                bookContent.innerHTML = `<p>${bookPages[currentPage-1]}</p>`;
                bookContent.style.opacity = '1';
            }, 200);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            document.getElementById('current-page').textContent = currentPage;
            
            // Show content for current page
            bookContent.style.opacity = '0';
            setTimeout(() => {
                bookContent.innerHTML = `<p>${bookPages[currentPage-1]}</p>`;
                bookContent.style.opacity = '1';
            }, 200);
            
            // Update progress
            const newProgress = Math.min(Math.floor((currentPage / totalPages) * 100), 100);
            if (newProgress > book.progress) {
                book.progress = newProgress;
                loadReadingShelf();
            }
        }
    });
}

// Generate multiple pages of unique content for a book
function generateBookPages(book) {
    // Create an array to hold all pages
    const pages = [];
    
    // First page is the existing content
    pages.push(book.content);
    
    // Generate additional pages based on the book
    switch (book.title) {
        case "1984":
            pages.push("The Ministry of Truth—Minitrue, in Newspeak—was startlingly different from any other object in sight. It was an enormous pyramidal structure of glittering white concrete, soaring up, terrace after terrace, 300 metres into the air.");
            pages.push("Winston kept his back turned to the telescreen. It was safer; though, as he well knew, even a back can be revealing. A kilometre away the Ministry of Truth, his place of work, towered vast and white above the grimy landscape.");
            pages.push("'Who controls the past,' ran the Party slogan, 'controls the future: who controls the present controls the past.' And yet the past, though of its nature alterable, never had been altered. Whatever was true now was true from everlasting to everlasting.");
            pages.push("The telescreen received and transmitted simultaneously. Any sound that Winston made, above the level of a very low whisper, would be picked up by it; moreover, so long as he remained within the field of vision which the metal plaque commanded, he could be seen as well as heard.");
            break;
            
        case "Pride and Prejudice":
            pages.push("Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character.");
            pages.push("Elizabeth was obliged to go the next morning to Meryton with her father. He was going to the library himself, a book he particularly wanted to read, and she was curious to see if anything new had come in.");
            pages.push("Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley.");
            pages.push("Mr. Bingley was good-looking and gentlemanlike; he had a pleasant countenance, and easy, unaffected manners. His sisters were fine women, with an air of decided fashion.");
            pages.push("The gentlemen pronounced him to be a fine figure of a man, the ladies declared he was much handsomer than Mr. Bingley, and he was looked at with great admiration for about half the evening.");
            break;
            
        case "The Great Gatsby":
            pages.push("He had one of those rare smiles with a quality of eternal reassurance in it, that you may come across four or five times in life. It faced, or seemed to face, the whole external world for an instant and then concentrated on you with an irresistible prejudice in your favor.");
            pages.push("The truth was that Jay Gatsby of West Egg, Long Island, sprang from his Platonic conception of himself. He was a son of God—a phrase which, if it means anything, means just that—and he must be about His Father's business, the service of a vast, vulgar, and meretricious beauty.");
            pages.push("His heart beat faster and faster as Daisy's white face came up to his own. He knew that when he kissed this girl, and forever wed his unutterable visions to her perishable breath, his mind would never romp again like the mind of God.");
            pages.push("Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that's no matter—tomorrow we will run faster, stretch out our arms farther...");
            pages.push("And as I sat there brooding on the old, unknown world, I thought of Gatsby's wonder when he first picked out the green light at the end of Daisy's dock. He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it.");
            break;
            
        case "The Midnight Library":
            pages.push("Between life and death there is a library, she said. And within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices.");
            pages.push("Would you have done anything different, if you had the chance to undo your regrets? she asked herself as she sat in the silence of the library. The books were waiting. The possibilities sitting on the shelves.");
            pages.push("She realized that she hadn't tried to end her life because she was miserable, but because she was ordinary. She had wanted extraordinary things to happen, and nothingness had happened instead.");
            pages.push("Doing one thing differently is very often the same as doing everything differently. Actions can't be reversed within a lifetime, however much we try to change.");
            pages.push("The only way to learn is to live. You attend this school called universe to discover how to become you. There are an infinite number of lives but only one you, and you're the same you in each life.");
            break;
            
        case "Project Hail Mary":
            pages.push("I lie in my bunk and stare at the ceiling. Why can't I remember anything? Something must be wrong with my brain. I should be afraid, but I'm not. I'm just numb. Empty.");
            pages.push("I check the classroom. Empty. The labs are all empty. But I know how to use every piece of equipment in them. At least, I think I do. And all of them seem to be for investigating microbiology of some kind.");
            pages.push("Outside the window I see thousands of stars. No light pollution. Also, no recognizable constellations. Weird. And one of those stars moves. It's a ship. No, wait. I'm on a ship. And that other moving star is probably a planet.");
            pages.push("I think about it. I'm the only person awake on this ship, which appears to be named Hail Mary. The computer logs say the mission is to investigate Tau Ceti. Why? I don't know. And why am I the only one alive?");
            pages.push("Rocky is amazing. He's a cave-dwelling pentapod from a hellish environment. He evolved under twenty-nine times Earth's atmospheric pressure. And now he's my best friend in the universe. For better or worse, I needed him.");
            break;
            
        case "Klara and the Sun":
            pages.push("The newly arrived AF looked around cautiously as if counting the customers. Then it said to us in a low voice: 'Everyone here gets a choice. You can get a home by the harbor. Or you can get a home with a view of the fields.'");
            pages.push("The second time I saw Josie, I saw her mother also. Manager told me they were important people - high-ranking types - and I should do my best to be chosen.");
            pages.push("In the days that followed, I learned so much more about the Sun and his special relationship with humans. How he can keep our stores warm, and if he's unhappy, he can make humans ill. How he can do both good and harm, and that's why humans have to be careful around him and seek his kindness.");
            pages.push("For all my observations and experience, there remains something puzzling about humans. Josie, Manager, and the Mother exhibit behavior at times that suggests humans have no belief that different parts of a person cancel each other out, and can co-exist side by side inside a person.");
            pages.push("A few more minutes, the Sun came free from the building tops and a straight beam came down to me. I felt the warmth on my face, and memories of the store, Manager, Rex, and so many other things rushed through me.");
            break;
            
        case "To Kill a Mockingbird":
            pages.push("Maycomb was an old town, but it was a tired old town when I first knew it. In rainy weather the streets turned to red slop; grass grew on the sidewalks, the courthouse sagged in the square. Somehow, it was hotter then: a black dog suffered on a summer's day; bony mules hitched to Hoover carts flicked flies in the sweltering shade of the live oaks on the square.");
            pages.push("'Atticus, he was real nice.' 'Most people are, Scout, when you finally see them.' He turned off the reading light. 'You never really understand a person until you consider things from his point of view - until you climb into his skin and walk around in it.'");
            pages.push("Miss Caroline caught me writing and told me to tell my father to stop teaching me. 'Besides,' she said, 'we don't write in the first grade, we print. You won't learn to write until you're in the third grade.'");
            pages.push("Atticus said to Jem one day, 'I'd rather you shot at tin cans in the back yard, but I know you'll go after birds. Shoot all the bluejays you want, if you can hit 'em, but remember it's a sin to kill a mockingbird.'");
            pages.push("There was a long jagged scar that ran across his face; what teeth he had were yellow and rotten; his eyes popped, and he drooled most of the time. I had asked Miss Stephanie Crawford what happened to him, and she said he was 'the meanest man who ever lived.'");
            break;
            
        case "Dune":
            pages.push("The Reverend Mother must combine the seductive wiles of a courtesan with the untouchable majesty of a virgin goddess, holding these attributes in tension so long as the powers of her youth endure. For when youth and beauty have gone, she will find that the place-between, once occupied by tension, has become a wellspring of cunning and resourcefulness.");
            pages.push("Once men turned their thinking over to machines in the hope that this would set them free. But that only permitted other men with machines to enslave them. 'Thou shalt not make a machine in the likeness of a man's mind.'");
            pages.push("The spice extends life. The spice expands consciousness. The spice is vital to space travel. The Spacing Guild and its navigators, who the spice has mutated over 4000 years, use the orange spice gas, which gives them the ability to fold space. That is, travel to any part of the universe without moving.");
            pages.push("I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.");
            pages.push("A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows. To begin your study of the life of Muad'Dib, then, take care that you first place him in his time: born in the 57th year of the Padishah Emperor, Shaddam IV.");
            break;
            
        case "The Hobbit":
            pages.push("'Good Morning!' said Bilbo, and he meant it. The sun was shining, and the grass was very green. But Gandalf looked at him from under long bushy eyebrows that stuck out further than the brim of his shady hat.");
            pages.push("'My dear Frodo!' exclaimed Bilbo. 'You are distressing yourself needlessly. Gollum had the Ring for ages and ages, and it didn't fade him. He just got more twisted and nasty. But not faded. Not invisible.'");
            pages.push("Far over the misty mountains cold, To dungeons deep and caverns old, We must away, ere break of day, To find our long-forgotten gold. The pines were roaring on the height, The winds were moaning in the night, The fire was red, it flaming spread, The trees like torches blazed with light.");
            pages.push("'It is a fair morning, little master,' he said, halting and looking down at the hobbit with a glint in his eyes. 'Rare is the chance on the road to Mirkwood of meeting with Dwarves and Mr. Baggins, both in one day!'");
            pages.push("'Never laugh at live dragons, Bilbo you fool!' he said to himself, and it became a favorite saying of his later, and passed into a proverb. 'You aren't nearly through this adventure yet,' he added, and that was pretty true as well.");
            break;
            
        case "The Silent Patient":
            pages.push("Her refusal to speak, or to explain in any way what happened, had a powerful effect on the minds of the public. Journalists and reporters spun the story in various directions, according to their agendas, elevating and transforming the heroine—or villain—of their story, each creating Alicia Berenson in their own image.");
            pages.push("I suspected some failure of empathy in myself. I feared I was like Theo—the mercy of a psychological inability to sustain emotional contact with others. I felt safer viewing and experiencing other people at a remove. Perhaps that was what made me good at my job.");
            pages.push("Sometimes it seemed as if the world were ending. But it wasn't. It just felt that way. No matter how hard it rains, the sun always eventually comes out. I tried to remember that.");
            pages.push("My father often said, if you want to receive, you have to give. It's no good closing your curtains and staring into darkness. Let the light in. Raise your spirits. Help yourself by helping others. Get involved in life. Fight against the powers that threatened to drain our energy and joy.");
            pages.push("'Every patient needs a different approach. Never forget the power differential, what I said about being subjugated and infantilized—these are all the deficits of institutional treatment. Our aim in individual therapy is to redress the balance. Restore their dignity.'");
            break;
            
        default:
            // For any other book, generate generic content
            pages.push("Page 2 of the book. The story continues...");
            pages.push("Page 3 of the book. More events unfold in the narrative.");
            pages.push("Page 4 of the book. The characters face new challenges.");
            pages.push("Page 5 of the book. The plot thickens as new details emerge.");
            pages.push("Page 6 of the book. A turning point in the storyline approaches.");
    }
    
    // Generate remaining pages up to totalPages if needed
    const totalPages = Math.ceil(book.pages / 20);
    while (pages.length < totalPages) {
        pages.push(`Page ${pages.length + 1} of "${book.title}". As you continue reading, the story develops further...`);
    }
    
    return pages;
}

function toggleFavorite(book) {
    book.isFavorite = !book.isFavorite;
    loadFavorites();
}

function applySavedSettings() {
    // Apply night mode
    if (localStorage.getItem('nightMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('night-mode-toggle').checked = true;
    }
    
    // Set data usage
    const dataUsage = localStorage.getItem('dataUsage');
    if (dataUsage) {
        document.getElementById('data-usage').value = dataUsage;
    }
    
    // Set notifications
    if (localStorage.getItem('notifications') === 'false') {
        document.getElementById('notifications-toggle').checked = false;
    }
    
    // Set font size
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.documentElement.style.fontSize = fontSize + 'px';
    }
}

function changeFontSize(step) {
    const currentSize = localStorage.getItem('fontSize') || 16;
    const newSize = Math.max(12, Math.min(24, parseInt(currentSize) + step));
    
    document.documentElement.style.fontSize = newSize + 'px';
    localStorage.setItem('fontSize', newSize);
}