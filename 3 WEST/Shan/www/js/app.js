document.addEventListener('DOMContentLoaded', function() {
    // Show splash screen for 2 seconds then fade to main content
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            setTimeout(() => {
                document.getElementById('main-content').style.opacity = '1';
            }, 50);
        }, 500);
    }, 2000);

    // Audio player initialization
    const audioPlayer = new Audio();
    let audioSource = '';
    const audioFolderPath = 'audio/';  // Default path to the audio folder

    // Sample book data
    const books = {
        English: [
            {
                title: "The Silent Garden",
                author: "Eleanor Wright",
                cover: "book1.png",
                type: "ebooks"
            },
            {
                title: "Midnight Chronicles",
                author: "James Holloway",
                cover: "book2.png",
                type: "ebooks"
            },
            {
                title: "Echoes of Tomorrow",
                author: "Sophia Chen",
                cover: "book3.png",
                type: "ebooks"
            },
            {
                title: "The Forgotten Path",
                author: "Marcus Johnson",
                cover: "book4.png",
                type: "ebooks"
            },
            {
                title: "Whispers in the Wind",
                author: "Amelia Parker",
                cover: "book5.png",
                type: "audiobooks",
                audioFile: "english_whispers_in_the_wind.mp3",
                audioId: "eng_whispers_001"
            },
            {
                title: "Beyond the Horizon",
                author: "Robert Lee",
                cover: "book6.png",
                type: "audiobooks",
                audioFile: "english_beyond_the_horizon.mp3",
                audioId: "eng_horizon_001"
            },
            {
                title: "The Art of Silence",
                author: "Diana Foster",
                cover: "book7.png",
                type: "audiobooks",
                audioFile: "english_art_of_silence.mp3",
                audioId: "eng_silence_001"
            }
        ],
        Tagalog: [
            {
                title: "Ang Lihim na Hardin",
                author: "Maria Santos",
                cover: "book8.png",
                type: "ebooks"
            },
            {
                title: "Sa Dilim ng Gabi",
                author: "Juan Reyes",
                cover: "book9.png",
                type: "ebooks"
            },
            {
                title: "Mga Bulong ng Hangin",
                author: "Elena Cruz",
                cover: "book10.png",
                type: "audiobooks",
                audioFile: "tagalog_mga_bulong_ng_hangin.mp3",
                audioId: "tag_bulong_001"
            }
        ],
        Bisaya: [
            {
                title: "Ang Hilit nga Tanaman",
                author: "Pedro Gomez",
                cover: "book11.png",
                type: "ebooks"
            },
            {
                title: "Mga Tingog sa Hangin",
                author: "Ana Flores",
                cover: "book12.png",
                type: "audiobooks",
                audioFile: "bisaya_mga_tingog_sa_hangin.mp3",
                audioId: "bis_tingog_001"
            }
        ],
        Ilocano: [
            {
                title: "Ti Naulimek a Hardin",
                author: "Ricardo Pascual",
                cover: "book13.png",
                type: "ebooks"
            },
            {
                title: "Agsasao ti Angin",
                author: "Lucia Domingo",
                cover: "book14.png",
                type: "audiobooks",
                audioFile: "ilocano_agsasao_ti_angin.mp3",
                audioId: "ilo_angin_001"
            }
        ]
    };

    // Navigation handling
    const screens = {
        'main-content': document.getElementById('main-content'),
        'library-screen': document.getElementById('library-screen'),
        'challenge-screen': document.getElementById('challenge-screen'),
        'profile-screen': document.getElementById('profile-screen'),
        'reader-screen': document.getElementById('reader-screen'),
        'audio-screen': document.getElementById('audio-screen')
    };
    
    // Add back button to profile screen if it doesn't exist
    if (document.getElementById('profile-screen') && !document.querySelector('#profile-screen .back-btn')) {
        const profileHeader = document.querySelector('#profile-screen .screen-header') || 
                             document.querySelector('#profile-screen');
        
        if (profileHeader) {
            const backButton = document.createElement('button');
            backButton.className = 'back-btn';
            backButton.innerHTML = '&larr;'; // Left arrow
            backButton.style.position = 'absolute';
            backButton.style.left = '15px';
            backButton.style.top = '15px';
            backButton.style.background = 'none';
            backButton.style.border = 'none';
            backButton.style.fontSize = '24px';
            backButton.style.cursor = 'pointer';
            backButton.style.zIndex = '100';
            
            profileHeader.style.position = 'relative';
            profileHeader.insertBefore(backButton, profileHeader.firstChild);
            
            // Add event listener to the button
            backButton.addEventListener('click', function() {
                goBack();
            });
        }
    }

    // Navigation history stack
    const navigationHistory = ['main-content'];

    // Set active screen
    function setActiveScreen(screenId, addToHistory = true) {
        // If leaving the audio screen, pause the audio
        if (document.getElementById('audio-screen').classList.contains('active') && screenId !== 'audio-screen') {
            audioPlayer.pause();
            document.querySelector('.play-pause-btn').textContent = '⏯';
            isPlaying = false;
        }
        
        // Add current screen to history if this is not a back operation
        if (addToHistory && screenId !== navigationHistory[navigationHistory.length - 1]) {
            navigationHistory.push(screenId);
        }
        
        Object.keys(screens).forEach(id => {
            if (id === screenId) {
                screens[id].classList.add('active');
                screens[id].style.display = 'block';
            } else {
                screens[id].classList.remove('active');
                screens[id].style.display = 'none';
            }
        });
        
        console.log('Navigation History:', navigationHistory);
    }

    // Go back to previous screen
    function goBack() {
        // Remove current screen from history
        if (navigationHistory.length > 1) {
            navigationHistory.pop();
            // Get the previous screen
            const previousScreen = navigationHistory[navigationHistory.length - 1];
            // Set it as active without adding to history
            setActiveScreen(previousScreen, false);
        }
    }

    // Initialize with main content active
    setActiveScreen('main-content');

    // Handle main option selection (eBooks or AudioBooks)
    window.selectOption = function(option) {
        setActiveScreen('library-screen');
        
        // Set active tab based on selection
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === option) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Load books for the selected option and default language (English)
        loadBooks('English', option);
    };

    // Handle language filter button clicks
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const language = this.dataset.lang;
            const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
            
            // Update active state for language buttons
            document.querySelectorAll('.language-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load books for selected language and content type
            loadBooks(language, activeTab);
        });
    });

    // Handle content tab clicks (eBooks or AudioBooks)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            const activeLanguage = document.querySelector('.language-btn.active').dataset.lang;
            
            // Update active state for tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load books for selected language and content type
            loadBooks(activeLanguage, tab);
        });
    });

    // Load books based on language and type
    function loadBooks(language, type) {
        const bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';
        
        const filteredBooks = books[language].filter(book => book.type === type);
        
        if (filteredBooks.length === 0) {
            bookList.innerHTML = '<div class="no-books">No books available in this category.</div>';
            return;
        }
        
        filteredBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-cover" style="background-image: url('${book.cover}')"></div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
            `;
            
            bookItem.addEventListener('click', function() {
                openBook(book, type);
            });
            
            bookList.appendChild(bookItem);
        });
    }

    // Check if audio file exists
    function checkAudioFileExists(filePath) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.onloadeddata = () => resolve(true);
            audio.onerror = () => resolve(false);
            audio.src = filePath;
        });
    }

    // Open a book (eBook or AudioBook)
    function openBook(book, type) {
        if (type === 'ebooks') {
            document.querySelector('#reader-screen .book-title').textContent = book.title;
            // Here you would load the actual book content
            document.querySelector('.book-content').innerHTML = `
                <div class="page">
                    <h3>Chapter 1</h3>
                    <p>The story begins on a misty morning in the countryside, where the first rays of sunlight were just beginning to break through the clouds. ${book.title} was not just another tale; it was a journey through the unexpected.</p>
                    <p>As the protagonist stepped forward into the unknown, the world around seemed to shift and change, revealing secrets long forgotten by time.</p>
                </div>
            `;
            setActiveScreen('reader-screen');
        } else if (type === 'audiobooks') {
            document.querySelector('#audio-screen .book-title').textContent = book.title;
            document.querySelector('.book-cover-large').style.backgroundImage = `url('${book.cover}')`;
            
            // Reset audio player state
            isPlaying = false;
            document.querySelector('.play-pause-btn').textContent = '⏯';
            
            // Update status display
            const statusDisplay = document.querySelector('.audio-status');
            if (!statusDisplay) {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'audio-status';
                statusDiv.style.marginTop = '10px';
                statusDiv.style.textAlign = 'center';
                document.querySelector('#audio-screen .audio-controls').appendChild(statusDiv);
            }
            
            // Get audio file information - use the specific audioFile property or generate from audioId
            const audioFileName = book.audioFile || `${book.audioId}.mp3`;
            
            // Try app's audio folder path first
            const appFilePath = audioFolderPath + audioFileName;
            
            // Display status message
            document.querySelector('.audio-status').textContent = 'Loading audio...';
            document.querySelector('.audio-status').style.color = 'blue';
            
            // Check if audio exists in the app folder
            checkAudioFileExists(appFilePath)
                .then(exists => {
                    if (exists) {
                        // Audio file exists in app folder
                        audioSource = appFilePath;
                        audioPlayer.src = appFilePath;
                        audioPlayer.load();
                        
                        document.querySelector('.audio-status').textContent = 'Audio loaded successfully';
                        document.querySelector('.audio-status').style.color = 'green';
                        
                        // Set up audio metadata once loaded
                        setupAudioEvents();
                    } else {
                        // Try alternative formats
                        tryAlternativeFormats(book);
                    }
                });
            
            setActiveScreen('audio-screen');
        }
    }
    
    // Function to try different audio formats
    function tryAlternativeFormats(book) {
        const alternativeFormats = ['mp3', 'wav', 'ogg', 'm4a'];
        const baseFileName = book.audioId || book.title.toLowerCase().replace(/ /g, '_');
        
        // Try various formats in the app folder
        const pathsToTry = alternativeFormats.map(format => ({
            path: `${audioFolderPath}${baseFileName}.${format}`,
            format: format
        }));
        
        // Use Promise.all to check all formats in parallel
        Promise.all(pathsToTry.map(item => {
            return checkAudioFileExists(item.path)
                .then(exists => ({ 
                    exists, 
                    path: item.path,
                    format: item.format 
                }));
        })).then(results => {
            // Find the first format that exists
            const foundFile = results.find(result => result.exists);
            
            if (foundFile) {
                audioSource = foundFile.path;
                audioPlayer.src = foundFile.path;
                audioPlayer.load();
                
                document.querySelector('.audio-status').textContent = 
                    `Audio loaded (${foundFile.format})`;
                document.querySelector('.audio-status').style.color = 'green';
                
                // Set up audio metadata once loaded
                setupAudioEvents();
            } else {
                // No audio file found
                document.querySelector('.audio-status').textContent = 
                    'Audio file not found. Please download content first.';
                document.querySelector('.audio-status').style.color = 'red';
                
                document.querySelector('.current-time').textContent = '0:00';
                document.querySelector('.total-time').textContent = '0:00';
                document.querySelector('.audio-progress-bar').value = 0;
                
                // Add file upload option
                addFileUploadOption();
            }
        });
    }
    
    // Set up audio player events
    function setupAudioEvents() {
        // Set up audio metadata once loaded
        audioPlayer.addEventListener('loadedmetadata', function() {
            document.querySelector('.current-time').textContent = formatTime(0);
            document.querySelector('.total-time').textContent = formatTime(audioPlayer.duration);
            document.querySelector('.audio-progress-bar').value = 0;
            document.querySelector('.audio-progress-bar').max = audioPlayer.duration;
        });
        
        // Set up time update event
        audioPlayer.addEventListener('timeupdate', function() {
            document.querySelector('.current-time').textContent = formatTime(audioPlayer.currentTime);
            document.querySelector('.audio-progress-bar').value = audioPlayer.currentTime;
        });
        
        // Set up ended event
        audioPlayer.addEventListener('ended', function() {
            document.querySelector('.play-pause-btn').textContent = '⏯';
            isPlaying = false;
        });
    }

    // Format time in MM:SS format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Handle back buttons
    document.querySelectorAll('.back-btn, .close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            goBack();
        });
    });

    // Add back button functionality to device back button (for mobile)
    window.addEventListener('popstate', function(e) {
        // Prevent default behavior
        e.preventDefault();
        // Use our custom back logic
        goBack();
    });

    // Navigation bar functionality
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const screen = this.dataset.screen;
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');
            
            // Map nav items to screens
            const screenMap = {
                'home': 'main-content',
                'library': 'library-screen',
                'profile': 'profile-screen'
            };
            
            setActiveScreen(screenMap[screen]);
        });
    });

    // Reader controls
    document.querySelector('.prev-btn').addEventListener('click', function() {
        // Logic for previous page
        const currentPage = parseInt(document.querySelector('.current-page').textContent);
        if (currentPage > 1) {
            document.querySelector('.current-page').textContent = currentPage - 1;
            updateProgressBar(currentPage - 1, parseInt(document.querySelector('.total-pages').textContent));
        }
    });

    document.querySelector('.next-btn').addEventListener('click', function() {
        // Logic for next page
        const currentPage = parseInt(document.querySelector('.current-page').textContent);
        const totalPages = parseInt(document.querySelector('.total-pages').textContent);
        if (currentPage < totalPages) {
            document.querySelector('.current-page').textContent = currentPage + 1;
            updateProgressBar(currentPage + 1, totalPages);
        }
    });

    // Audio player controls
    let isPlaying = false;
    document.querySelector('.play-pause-btn').addEventListener('click', function() {
        if (audioSource) {
            isPlaying = !isPlaying;
            this.textContent = isPlaying ? '⏸' : '⏯';
            
            if (isPlaying) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
    });

    document.querySelector('.rewind-btn').addEventListener('click', function() {
        if (audioSource) {
            // Rewind 10 seconds
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
        }
    });

    document.querySelector('.forward-btn').addEventListener('click', function() {
        if (audioSource) {
            // Forward 10 seconds
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
        }
    });

    document.querySelector('.speed-select').addEventListener('change', function() {
        if (audioSource) {
            // Change playback speed
            audioPlayer.playbackRate = parseFloat(this.value);
        }
    });

    // Audio progress bar
    if (document.querySelector('.audio-progress-bar')) {
        document.querySelector('.audio-progress-bar').addEventListener('input', function() {
            if (audioSource) {
                audioPlayer.currentTime = this.value;
            }
        });
    }

    // Update progress bar for ebook reader
    function updateProgressBar(current, total) {
        const percentage = (current / total) * 100;
        document.querySelector('#reader-screen .progress-fill').style.width = `${percentage}%`;
    }

    // Language selection modal
    document.querySelector('.language-selected').addEventListener('click', function() {
        document.getElementById('language-modal').style.display = 'flex';
    });

    document.querySelector('.confirm-lang-btn').addEventListener('click', function() {
        const selectedLang = document.querySelector('.lang-option.selected');
        if (selectedLang) {
            document.querySelector('.language-selected').textContent = selectedLang.textContent;
        }
        document.getElementById('language-modal').style.display = 'none';
    });

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Add file upload option for missing audio files
    function addFileUploadOption() {
        // Check if upload button already exists
        if (document.querySelector('.upload-btn')) {
            return;
        }
        
        const uploadButton = document.createElement('button');
        uploadButton.textContent = 'Upload Audio File';
        uploadButton.className = 'upload-btn';
        uploadButton.style.marginTop = '10px';
        
        // Add to audio screen
        const audioControls = document.querySelector('#audio-screen .audio-controls');
        if (audioControls) {
            audioControls.appendChild(uploadButton);
        }
        
        // Upload button handler
        uploadButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/*';  // Accept all audio formats
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    
                    // Create object URL for the file
                    const objectURL = URL.createObjectURL(file);
                    
                    // Update audio player
                    audioSource = objectURL;
                    audioPlayer.src = objectURL;
                    audioPlayer.load();
                    
                    // Update status
                    document.querySelector('.audio-status').textContent = `Loaded: ${file.name}`;
                    document.querySelector('.audio-status').style.color = 'green';
                    
                    // Set up audio events
                    setupAudioEvents();
                    
                    // Clean up URL when done
                    audioPlayer.addEventListener('ended', function() {
                        URL.revokeObjectURL(objectURL);
                    }, { once: true });
                }
            });
            
            fileInput.click();
        });
        
        // Add download button for mobile app context
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Audio Content';
        downloadButton.className = 'download-btn';
        downloadButton.style.marginTop = '10px';
        downloadButton.style.marginLeft = '10px';
        
        // In a real mobile app, this would connect to your content server
        downloadButton.addEventListener('click', function() {
            document.querySelector('.audio-status').textContent = 'Downloading content...';
            document.querySelector('.audio-status').style.color = 'blue';
            
            // Simulate download (in a real app, this would be an actual download)
            setTimeout(() => {
                document.querySelector('.audio-status').textContent = 'Download complete! Try playing again.';
                document.querySelector('.audio-status').style.color = 'green';
            }, 2000);
        });
        
        if (audioControls) {
            // Create a button container for better layout
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '10px';
            
            buttonContainer.appendChild(uploadButton);
            buttonContainer.appendChild(downloadButton);
            audioControls.appendChild(buttonContainer);
        }
    }
    
});