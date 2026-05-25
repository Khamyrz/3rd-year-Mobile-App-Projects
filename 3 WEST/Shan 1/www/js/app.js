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
                title: "Crystal Shadows",
                author: "Isabella Martinez",
                cover: "book15.png",
                type: "ebooks"
            },
            {
                title: "The Time Weaver",
                author: "Alexander Chen",
                cover: "book16.png",
                type: "ebooks"
            },
            {
                title: "Legends of the Deep",
                author: "Maya Patel",
                cover: "book17.png",
                type: "ebooks"
            },
            {
                title: "The Dream Architect",
                author: "Lucas Foster",
                cover: "book18.png",
                type: "ebooks"
            },
            {
                title: "Quantum Whispers",
                author: "Sarah Mitchell",
                cover: "book19.png",
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

    // Generate chapters for a specific book
    function generateChapters(bookTitle) {
        switch(bookTitle) {
            case "The Silent Garden":
                return [
                    {
                        chapter: "Chapter 1: The Awakening",
                        content: "In the heart of an abandoned estate, the Silent Garden lay dormant for centuries. Its ancient walls held secrets that time had forgotten, and the morning dew sparkled like scattered diamonds across overgrown roses. Sarah Mitchell stood at its rusted gates, her grandmother's mysterious letter clutched in her trembling hands. The air was thick with an otherworldly presence, and as she pushed open the creaking gate, a whisper of wind carried the scent of ancient magic. The letter had arrived on her twenty-fifth birthday, containing nothing but an old key and coordinates to this forgotten place. Now, standing before the sprawling garden, Sarah felt a strange connection to the twisted vines and weathered statues that seemed to watch her every move. The garden's silence was not the absence of sound, but rather a living thing, pulsing with untold stories and forgotten memories. As she took her first step inside, the very air seemed to shift, welcoming her like a long-lost daughter returning home."
                    },
                    {
                        chapter: "Chapter 2: Whispers of the Past",
                        content: "As Sarah ventured deeper into the garden, she discovered stone pathways hidden beneath years of wild growth. The air was thick with the scent of ancient roses and something else—something magical. Each step revealed new wonders: statues that seemed to follow her movements, fountains that whispered secrets in forgotten languages, and flowers that glowed with an inner light. In the distance, a pavilion stood untouched by time, its marble columns wrapped in luminescent vines. The deeper she went, the more Sarah felt the garden responding to her presence, as if it had been waiting for her all along. Strange symbols began appearing in the morning dew, forming patterns that tugged at the edges of her memory. The garden's whispers grew stronger, carrying fragments of conversations from centuries past, echoing through the maze of overgrown hedges and forgotten pathways. Each whisper seemed to lead her further into the heart of the garden's mysteries."
                    },
                    {
                        chapter: "Chapter 3: The Gardener's Journal",
                        content: "Hidden beneath a hollow tree, Sarah discovered a weathered leather journal, its pages filled with elegant handwriting and detailed sketches. The journal belonged to Thomas Blackwood, the last gardener to tend these grounds over a century ago. His entries spoke of plants with mysterious properties and rituals performed under the full moon. As Sarah read through the journal, the garden around her seemed to respond to the words, as if Blackwood's observations were awakening long-dormant magic. The entries grew increasingly fascinating and disturbing - tales of flowers that could heal any ailment, vines that moved with purpose, and a hidden realm that existed just beyond the garden's boundaries. Blackwood's final entry warned of a coming darkness that threatened to consume the garden's magic, and of a guardian who would one day arrive to protect its secrets. The date of the entry was exactly one hundred years before Sarah's birth."
                    },
                    {
                        chapter: "Chapter 4: The Moon Gate",
                        content: "Following Blackwood's detailed maps, Sarah discovered the Moon Gate - an ancient stone arch covered in mysterious symbols that seemed to shift and change in the changing light. According to the journal, the gate only opened during the full moon, revealing pathways to other worlds and times. As twilight approached, the symbols began to glow with an inner light, pulsing in rhythm with Sarah's heartbeat. The air around the gate grew thick with possibility, and she could feel the boundary between worlds growing thin. Through the arch, she caught glimpses of other gardens - some lush and vibrant, others dark and withered. Each vision was accompanied by whispers of prophecy and fragments of forgotten songs. The journal had warned that the gate was both a blessing and a curse, offering passage to realms of wonder and danger in equal measure."
                    },
                    {
                        chapter: "Chapter 5: The Other Side",
                        content: "When the full moon reached its zenith, Sarah stepped through the Moon Gate and found herself in a version of the garden untouched by time. Here, the flowers sang soft melodies, and the air sparkled with floating lights that danced like fireflies made of stardust. But she wasn't alone - shadows moved between the trees, taking forms both beautiful and terrifying. The garden in this realm was alive in ways she could barely comprehend, each plant and stone humming with ancient magic. The paths shifted and changed as she walked, leading her deeper into this enchanted version of her grandmother's garden. In this realm, she could see the true nature of the garden's magic - a vast network of living energy that connected every flower, every leaf, and every stone. The shadows that moved among the trees began to take more distinct forms, revealing themselves as the spirits of former gardeners, each one a guardian of the garden's secrets."
                    },
                    {
                        chapter: "Chapter 6: The Garden's Keeper",
                        content: "In this ethereal version of the garden, Sarah encountered Elena, an ageless woman with silver hair and eyes that held centuries of wisdom. Elena revealed she had been the garden's keeper for over five hundred years, maintaining the balance between the mortal world and the realm of magic that existed within the garden's boundaries. She explained that the garden was a nexus point, a place where the veils between worlds grew thin, and magic flowed freely between realms. Elena spoke of an ancient prophecy that foretold of a successor who would arrive when the garden's magic was most threatened, someone whose blood carried the echoes of the garden's first guardians. As she spoke, Sarah felt a deep resonance within herself, understanding at last why her grandmother's letter had led her here. The garden had been calling to her all along, preparing her for a destiny she never knew awaited her."
                    },
                    {
                        chapter: "Chapter 7: The First Test",
                        content: "Elena explained that to become the garden's guardian, Sarah must pass three tests that would challenge not only her courage but her very understanding of reality. The first test required her to communicate with the garden itself - to learn its ancient language of blooms and vines, to understand the whispers of the wind and the secrets hidden in every dewdrop. As she practiced, Sarah discovered she could make flowers bloom with a thought, guide vines with a gesture, and read the stories written in patterns of fallen leaves. The garden responded to her presence more strongly with each passing day, revealing its secrets one by one. But mastery of the garden's language was only the beginning - Elena warned that the next tests would be far more challenging, requiring Sarah to face both external threats and her own inner darkness."
                    },
                    {
                        chapter: "Chapter 8: Shadows in the Garden",
                        content: "As Sarah's training progressed, she learned of a dark force threatening the garden. Something was poisoning the magical boundaries, allowing malevolent entities to slip through from the shadow realms. These shadow creatures sought to corrupt the garden's power, turning its life-giving magic into something twisted and dark. Working with Elena, Sarah began to understand the true scope of the threat - the shadows were being guided by someone who knew the garden's secrets, someone who had once been trusted with its care. The corruption was spreading, turning once-beautiful areas of the garden into nightmarish landscapes where flowers wept black tears and vines moved with malicious intent. Sarah realized that saving the garden would require more than just mastering its magic - she would need to uncover the identity of the traitor and confront the darkness at its source."
                    },
                    {
                        chapter: "Chapter 9: The Final Challenge",
                        content: "The shadow creatures launched their final assault during the harvest moon, when the garden's magic was at its strongest. Sarah had to draw upon everything she had learned - the garden's magic, Elena's teachings, and her own innate connection to this mystical place. The battle raged across both the physical and spiritual realms, with Sarah moving between worlds through the Moon Gate to protect the garden on all fronts. The identity of the traitor was finally revealed - Thomas Blackwood himself, whose spirit had become corrupted by centuries of exposure to the shadow realm. His bitterness at being unable to fully master the garden's magic had twisted him into a creature of darkness. The final confrontation took place at the heart of the garden, where the boundaries between all realms were thinnest. Sarah faced not only Blackwood's corrupted spirit but also her own fears and doubts about her worthiness to be the garden's guardian."
                    },
                    {
                        chapter: "Chapter 10: Guardian of the Gates",
                        content: "With the shadows banished and Blackwood's spirit finally at peace, Sarah officially took her place as the garden's guardian. She understood now why it was called the Silent Garden - its true voice could only be heard by those who were meant to protect it. The garden had transformed under her care, becoming a perfect blend of wild magic and cultivated beauty. Elena, her task of preparing the new guardian complete, began to fade into the garden itself, becoming one with the magic she had protected for so long. As the new keeper of the garden's secrets, Sarah began her own journal, recording the daily wonders and challenges of maintaining this bridge between worlds. The garden continued to grow and change, its magic now flowing freely under her protection. And in the quiet moments, when the moon was full and the flowers sang their ancient songs, Sarah could feel the presence of all the guardians who had come before her, their wisdom and strength becoming part of her own continuing story."
                    }
                ];
            case "Midnight Chronicles":
                return [
                    {
                        chapter: "Chapter 1: The Clock Strikes Twelve",
                        content: "Detective Marcus Cole stood in the rain-slicked streets of New Aurora City, staring at his watch as it struck midnight. The city's neon lights reflected off the wet pavement, creating an otherworldly glow that danced through the darkness. This was the third disappearance this month, each occurring precisely at midnight, each victim vanishing without a trace. The only evidence: a pocket watch left behind, its hands frozen at exactly twelve o'clock. As thunder rolled overhead, Marcus examined the latest watch, its silver surface etched with symbols he'd never seen before. The air crackled with an energy that made his skin tingle, and somewhere in the distance, a clock tower began to chime, its deep resonance echoing through the empty streets. The rain seemed to fall in slow motion, each droplet carrying whispers of time itself."
                    },
                    {
                        chapter: "Chapter 2: The Timekeeper's Shop",
                        content: "His investigation led him to an antique clock shop owned by the enigmatic Mr. Chronos. The shop was filled with hundreds of ticking clocks, each moving at slightly different speeds, creating a hypnotic symphony of time. The moment Marcus stepped through the door, he felt as if he'd entered another dimension. Dust motes danced in shafts of golden light that seemed to come from nowhere, and the air itself felt thick with temporal energy. Mr. Chronos stood behind the counter, his silver hair reflecting the strange light, his eyes holding the wisdom of centuries. 'I've been expecting you, Detective,' he said, his voice resonating with the ticking of countless timepieces. 'Though I must admit, you're both early and late.' The walls of the shop seemed to pulse with each tick, and Marcus could swear he saw moments from the past and future reflected in the glass faces of the countless clocks."
                    },
                    {
                        chapter: "Chapter 3: Temporal Anomalies",
                        content: "After interviewing Mr. Chronos, Marcus discovered the terrifying truth - the disappearances were actually people being pulled into different time periods. The boundaries between past, present, and future were becoming dangerously thin. Mr. Chronos revealed that time itself was unraveling, creating temporal rifts throughout the city. Each victim had stumbled through these invisible tears in reality, scattered across different eras with no way to return. The pocket watches were anchors, meant to stabilize the rifts, but something or someone was deliberately destabilizing them. In his centuries as a Timekeeper, Mr. Chronos had never seen such a systematic attack on the fabric of time itself. The implications were staggering - if the rifts continued to grow, entire sections of history could collapse, creating paradoxes that would unravel the very fabric of reality."
                    },
                    {
                        chapter: "Chapter 4: The Time Travelers",
                        content: "Marcus's world expanded dramatically when he encountered the secret society of time travelers who had been monitoring the situation. They revealed that New Aurora City was built on a temporal convergence point, where multiple timelines intersected and overlapped. Their headquarters existed in a pocket dimension between seconds, a place where time moved differently and the walls were lined with monitors showing different periods of history. The society's members were drawn from various eras, each bringing unique perspectives and knowledge to their mission of maintaining temporal stability. But there was dissension in their ranks - some believed in preserving the timeline at all costs, while others argued for using their knowledge to prevent historical tragedies. As Marcus learned more about their world, he began to understand that the current crisis was possibly tied to this ideological split."
                    },
                    {
                        chapter: "Chapter 5: Echoes of the Future",
                        content: "Working with the time travelers, Marcus began seeing glimpses of possible futures. Each midnight brought new visions: some showed a thriving city, others revealed complete devastation. The visions became more frequent and intense, bleeding into his waking hours. He saw versions of himself in different timelines - some where he solved the case, others where he disappeared into the temporal rifts, and still others where he became something else entirely. The time travelers explained that these weren't just possibilities - they were actual futures occurring simultaneously, and the barriers between them were breaking down. In one particularly disturbing vision, he witnessed the moment when all timelines collapsed into a singular point of chaos, erasing not just the city but the very concept of time itself. The pressure to prevent this catastrophic future weighed heavily on Marcus, even as he struggled to maintain his grip on the present reality."
                    },
                    {
                        chapter: "Chapter 6: The Midnight Protocol",
                        content: "The time travelers introduced Marcus to the Midnight Protocol - a set of complex rules and procedures for dealing with temporal anomalies. But as he delved deeper into their world, he discovered conflicting agendas and ancient feuds. The Protocol itself was written in a language that changed depending on when you read it, its contents shifting like quicksilver through time. Some sections seemed to predict their own revisions, while others contained warnings from future versions of the readers themselves. The deeper Marcus studied, the more he realized that the Protocol wasn't just a manual - it was a living document that existed across all timelines simultaneously, recording and predicting the actions of those who read it. This revelation came with a disturbing realization: according to the Protocol's predictions, one of the time travelers would betray the society, leading to the very crisis they were trying to prevent."
                    },
                    {
                        chapter: "Chapter 7: Paradox",
                        content: "Marcus made a shocking discovery - he found his own name in historical records from fifty years ago, investigating the same case. The paradox deepened when he realized that his future self had left him clues scattered through time. Each clue was more disturbing than the last, revealing a complex web of causality where his actions in the present were both the cause and effect of events in the past and future. The time travelers warned him about the dangers of paradox, how meeting himself could shatter the already fragile timeline. But the messages from his future self became more urgent, hinting at a conspiracy within the time travelers' society itself. The final message was the most cryptic: 'The thirteenth hour approaches. Trust the watches. They're not measuring time - they're holding it together.'"
                    },
                    {
                        chapter: "Chapter 8: The Thirteenth Hour",
                        content: "The time travelers spoke of a mythical Thirteenth Hour - a moment between moments when the barriers between timestreams were thinnest. During this brief window, someone could potentially reset the temporal damage, but at a terrible cost. The Thirteenth Hour existed outside normal time, a space where all possibilities existed simultaneously. The pocket watches left at each disappearance site weren't just markers - they were keys to accessing this mysterious hour. As Marcus pieced together the pattern of disappearances, he realized they formed a complex temporal circuit around the city, each point corresponding to a major event in the city's history. When aligned properly, these points would create a window into the Thirteenth Hour, but opening this window risked releasing something that the time travelers had been keeping imprisoned between moments of time."
                    },
                    {
                        chapter: "Chapter 9: Decision Point",
                        content: "As temporal chaos engulfed the city, Marcus finally understood why his future self had left those clues. The only way to save New Aurora City was to enter the Thirteenth Hour, but doing so would trap him in a temporal loop, forever between seconds. The time travelers revealed the final piece of the puzzle - the pocket watches were fragments of the original timepiece that had created their society, scattered through time to prevent its power from being misused. But now, with reality unraveling, the pieces needed to be reunited. The choice before him was impossible: save the city and condemn himself to an eternal moment, or let time itself unravel. As he made his decision, he began to understand that he had already made it countless times before, in countless other timelines."
                    },
                    {
                        chapter: "Chapter 10: Beyond Midnight",
                        content: "Marcus made his choice, stepping into the Thirteenth Hour with the assembled pocket watches. In that timeless space, he became both observer and protector, existing in all times simultaneously. New Aurora City was saved, but for Marcus, time became an endless midnight. From his unique vantage point, he could see the entire timestream - past, present, and future flowing together in an eternal dance. He understood now that he had become what Mr. Chronos had always been - a guardian of time itself, watching over the delicate fabric of reality. The pocket watches were distributed once again, but now they served a new purpose - not just as anchors for time, but as reminders of the sacrifice that had saved countless timelines. And in the antique shop, a young Mr. Chronos smiled, knowing that the cycle had begun again, as it always had, and always would."
                    }
                ];
            case "Echoes of Tomorrow":
                return [
                    {
                        chapter: "Chapter 1: The Last Signal",
                        content: "Dr. Elena Chen stared at the pulsing signal on her quantum computer's display, her heart racing with equal parts excitement and fear. After fifteen years of searching the cosmos for signs of extraterrestrial intelligence, she had finally found something unprecedented. The signal wasn't just a random burst of cosmic noise—it was a message, complex and deliberate, encoded in a way that defied the laws of physics as we understood them. The laboratory hummed with energy as her team gathered around, their faces illuminated by the blue glow of holographic displays. The message seemed to exist in multiple quantum states simultaneously, as if it was being transmitted not just through space, but through time itself. As Elena began the decoding sequence, the air in the lab grew heavy with anticipation, and the quantum computers began to resonate at frequencies never before observed. The message was clear - we were not alone, and our understanding of reality was about to change forever."
                    },
                    {
                        chapter: "Chapter 2: Quantum Echoes",
                        content: "The message revealed itself slowly, like a flower blooming in four dimensions. Elena and her team worked tirelessly through the night, their minds struggling to comprehend what they were seeing. The aliens weren't sending a message across space—they were sending it across time, from a future where their civilization had already visited Earth. The quantum data stream contained blueprints for technology beyond human comprehension: engines that could fold space-time, consciousness transfer protocols, and something even more extraordinary—a warning. The holographic displays flickered with images of possible futures, each more astonishing than the last. But beneath the technical marvels lay a deeper message: humanity stood at a crucial crossroads, one that would determine not just our future, but the future of all conscious life in the universe. The warning spoke of a coming convergence, a moment when all possible futures would collapse into a single, irreversible reality."
                    },
                    {
                        chapter: "Chapter 3: The Convergence Project",
                        content: "With the weight of the message bearing down on them, Elena and her team initiated the Convergence Project. They began constructing the devices detailed in the alien blueprints, each one a miracle of quantum engineering that challenged their understanding of physics. The first successful test created a small bubble of altered space-time in the laboratory, where time moved differently and the laws of physics became malleable. But as they delved deeper into the technology, strange things began happening. Team members reported seeing shadows of themselves from other timelines, and equipment would sometimes show traces of experiments that hadn't been conducted yet. The boundary between present and future began to blur, and Elena realized they were not just building devices - they were fundamentally altering the fabric of reality itself. The question was no longer if they could complete the project, but if they should."
                    },
                    {
                        chapter: "Chapter 4: Timeline Interference",
                        content: "The first major breakthrough came with devastating consequences. During a routine test, the team successfully received a transmission from six months in the future - a warning from their future selves about a catastrophic accident that would occur in the lab. Armed with this knowledge, they prevented the accident, but the paradox created ripples through space-time. Objects began appearing and disappearing in the lab, and team members started experiencing memories from timelines that no longer existed. Elena discovered that each change they made to the timeline created new branches of reality, and these branches were beginning to interfere with each other. The quantum computers detected increasing instability in the local space-time continuum, and Elena realized they needed to find a way to stabilize the timeline before their experiments tore reality apart."
                    },
                    {
                        chapter: "Chapter 5: The Visitor",
                        content: "Late one night, as Elena worked alone in the lab, she encountered something impossible - a visitor from the future. The figure emerged from a shimmering portal, wearing technology centuries beyond their own. The visitor revealed themselves to be a descendant of humanity, part of a civilization that had evolved beyond physical form. They explained that the alien message was actually sent by this future humanity, attempting to prevent a catastrophic event that would derail human evolution. The visitor's presence caused severe temporal distortions, and they could only stay for a few minutes, but their message was clear: the Convergence Project was both the potential salvation and destruction of humanity. The choice of how to use it would determine which future would become reality. Before disappearing, the visitor left Elena with a small device - a quantum key that would allow her to see the full scope of possible futures."
                    },
                    {
                        chapter: "Chapter 6: Parallel Paths",
                        content: "Using the quantum key, Elena gained the ability to perceive multiple timelines simultaneously. She saw versions of herself making different choices, leading to vastly different outcomes for the project and humanity. In some timelines, the technology led to a golden age of human advancement. In others, it triggered a cascade of temporal disasters that erased entire sections of history. The key also revealed that they weren't alone in their research - other groups around the world had received similar messages and were racing to develop their own versions of the technology. The competition was creating dangerous interference patterns in the timeline, threatening to destabilize the entire temporal fabric. Elena realized they needed to find a way to coordinate with these other groups across time and space to prevent a temporal arms race that could destroy reality itself."
                    },
                    {
                        chapter: "Chapter 7: The Neural Network",
                        content: "The team made a groundbreaking discovery - the human brain could be used as a quantum receiver, capable of processing information from multiple timelines simultaneously. They developed a neural network that connected the consciousness of the research team across different temporal planes. Through this network, they could share information and experiences across timelines, coordinating their efforts in ways previously impossible. But the neural connection had unexpected side effects. Team members began experiencing each other's memories and emotions, and the line between individual consciousness began to blur. Elena found herself struggling to maintain her sense of self as the boundaries between timelines became increasingly fluid. The network revealed a deeper truth - consciousness itself was not bound by linear time, and human awareness could extend far beyond the present moment."
                    },
                    {
                        chapter: "Chapter 8: Temporal Storm",
                        content: "The accumulated effects of their experiments finally reached a critical point, triggering a temporal storm that began erasing chunks of reality. Time itself became unstable, with past, present, and future bleeding into each other. Buildings would age centuries in minutes, then revert to their original state. People found themselves experiencing multiple versions of the same moment simultaneously. The storm spread outward from the laboratory, threatening to engulf the entire planet. Through the neural network, Elena could see the storm's effects across multiple timelines, watching as different versions of reality collapsed and reformed. The team realized they had to find a way to contain and stabilize the temporal distortions before they caused irreversible damage to the space-time continuum. But every attempt to fix one timeline seemed to cause problems in another, creating an ever-expanding web of paradoxes."
                    },
                    {
                        chapter: "Chapter 9: The Choice",
                        content: "As the temporal storm reached its peak, Elena finally understood the true purpose of the alien message. It wasn't just a warning or a set of technological blueprints - it was a test. The future of humanity depended not on whether they could build the technology, but on how they would choose to use it. The quantum key revealed one final vision: a moment of convergence when all possible timelines would align, creating a brief window where a single choice could determine the course of human evolution. This was the crossroads mentioned in the original message, the moment when humanity would either transcend its current limitations or become trapped in a cycle of temporal destruction. Elena realized that she would have to make this choice, not just for her timeline, but for all possible versions of humanity."
                    },
                    {
                        chapter: "Chapter 10: Tomorrow's Echo",
                        content: "In the final moment of convergence, Elena made her decision. Instead of trying to control or direct humanity's evolution, she used the quantum technology to create a temporal sanctuary - a space where all possible futures could exist without interfering with each other. The neural network expanded to encompass not just her team, but all of humanity, creating a collective consciousness that could perceive and learn from all potential timelines. The temporal storm subsided, replaced by a new stability that allowed for infinite possibility within finite reality. The alien message, they finally understood, was not just from future humanity - it was from themselves, echoing across time to ensure that humanity would find the right path. As Elena looked at the quantum displays one last time, she saw not just one tomorrow, but endless tomorrows, each one a unique expression of human potential. The Convergence Project had succeeded, not by choosing a single future, but by preserving the possibility of all futures."
                    }
                ];
            case "The Forgotten Path":
                return [
                    {
                        chapter: "Chapter 1: The Ancient Map",
                        content: "Professor James Harrison unfolded the weathered parchment with trembling hands, his office in the University's archaeology department forgotten as he lost himself in the intricate details of the map before him. It had arrived in a package with no return address, accompanied by a simple note: 'The path awaits its guardian.' The map showed a route through the Himalayan mountains that shouldn't exist, leading to a valley that appeared on no modern charts. Ancient symbols decorated the margins, telling a story of a hidden civilization that had mastered both science and mysticism thousands of years before the rise of known history. As James traced the route with his finger, the ink seemed to shimmer, and for a moment, he could have sworn he heard distant chanting echoing through his office. The map's parchment felt warm to the touch, pulsing with an energy that seemed to respond to his presence."
                    },
                    {
                        chapter: "Chapter 2: The First Step",
                        content: "Two months later, James found himself in a remote Nepalese village, the last outpost of civilization before the uncharted wilderness began. The locals spoke in whispers about the path he sought, their eyes filled with a mixture of fear and reverence. An elderly sherpa named Tenzin had agreed to guide him, claiming his family had been guardians of the secret path for generations. As they prepared for the journey, Tenzin shared ancient legends of a people who had learned to bridge the gap between the physical and spiritual worlds, creating technology that worked on principles modern science had yet to discover. That night, as James studied the map by lamplight, he noticed new details emerging from the parchment, as if the map itself was revealing its secrets only to those who dared to follow its path. The symbols along the margins began to move and shift, forming new patterns that seemed to respond to his thoughts."
                    },
                    {
                        chapter: "Chapter 3: The Hidden Valley",
                        content: "After weeks of treacherous climbing through unmapped territories, they found the entrance to the hidden valley. Massive stone gates, their surfaces covered in luminescent symbols, stood embedded in the mountainside. The gates seemed to defy conventional archaeology - they showed no signs of age or weathering, and the material they were made from didn't match any known stone type. As James approached, the symbols began to pulse with an inner light, responding to something in his blood. Tenzin revealed that according to legend, only those carrying the ancient bloodline could open the gates. When James placed his hand on the central symbol, the entire structure began to hum with energy, and slowly, impossibly, the gates began to open, revealing a valley that had remained hidden from the world for millennia. The air that rushed out was warm and sweet, carrying the scent of flowers that shouldn't have been able to grow at this altitude."
                    },
                    {
                        chapter: "Chapter 4: The Ancient City",
                        content: "Beyond the gates lay a sight that defied explanation - a vast city of crystal and stone, its architecture unlike anything in recorded history. Spires of translucent crystal rose into the clouds, their surfaces refracting light in impossible ways. The streets were laid out in precise geometric patterns that seemed to pulse with energy, and in the center of it all stood a pyramid of black stone that seemed to absorb light itself. But the city wasn't a dead relic - signs of recent habitation were everywhere. Fresh footprints in the dust, warm hearths, and most incredibly, lights that moved within the crystal towers. As they made their way through the streets, James began to understand that they had stumbled upon more than just a lost civilization - they had found a people who had chosen to remove themselves from the flow of history, preserving knowledge that the outside world had long forgotten."
                    },
                    {
                        chapter: "Chapter 5: The Keepers",
                        content: "Their presence in the city did not go unnoticed. From the crystal towers emerged the Keepers - men and women dressed in robes that seemed to shift color with their movements. Their faces bore the features of many races, suggesting this hidden society had drawn its members from all corners of the world. The Keepers revealed that they had been waiting for James, that the map had been sent to him because he carried the bloodline of their founders. They spoke of a coming crisis that threatened not just their hidden valley, but the entire world - a crisis that had been foreseen centuries ago. The knowledge preserved in their city, they explained, was humanity's only hope of survival. But this knowledge came with a price - to access it, James would have to undergo trials that would challenge not just his body and mind, but his very understanding of reality."
                    },
                    {
                        chapter: "Chapter 6: The Library of Time",
                        content: "The Keepers led James to their greatest treasure - the Library of Time. Unlike any library he had ever seen, its books were alive with moving text and images, and some weren't books at all but crystals that contained entire lifetimes of knowledge. The library existed in a space where time moved differently; hours could pass inside while only minutes elapsed in the outside world. Here, the Keepers had preserved knowledge from civilizations lost to history - scientific principles that modern physics was only beginning to grasp, philosophical insights that could transform human consciousness, and warnings about cycles of destruction that humanity was destined to face. As James immersed himself in their knowledge, he began to experience visions of possible futures, each one hinging on the choices humanity would make in the coming years. The weight of this knowledge was almost overwhelming, but he knew he had been chosen to bear it."
                    },
                    {
                        chapter: "Chapter 7: The Trials Begin",
                        content: "The trials to become a true Keeper began with a journey into the Maze of Mirrors - a labyrinth where every reflection showed a different version of reality. Here, James faced not just physical challenges but psychological ones, confronting different versions of himself from parallel timelines. Each reflection offered a glimpse of a path not taken, choices that could have led to vastly different outcomes. The maze tested not just his ability to navigate its physical space, but his understanding of himself and his place in the grand tapestry of existence. As he progressed deeper into the maze, the boundaries between the reflections began to blur, and James had to learn to maintain his sense of self while acknowledging the infinite possibilities that existed within him. The Keepers watched his progress, knowing that only someone who could understand and accept the multiplicity of existence could hope to wield their knowledge responsibly."
                    },
                    {
                        chapter: "Chapter 8: The Heart of Knowledge",
                        content: "Deep within the black pyramid, James discovered the source of the city's power - a crystalline structure that the Keepers called the Heart of Knowledge. It was a quantum computer built centuries before such concepts existed in the outside world, capable of processing information across multiple dimensions of reality. The Heart showed him visions of the crisis to come - a convergence of environmental, technological, and spiritual challenges that threatened to tear humanity apart. But it also showed him solutions, ways that the ancient wisdom preserved by the Keepers could be applied to modern problems. The challenge would be finding a way to introduce this knowledge to the outside world without causing panic or allowing it to fall into the wrong hands. As he studied the Heart, James began to understand that his role would be not just to learn this knowledge, but to serve as a bridge between the ancient and modern worlds."
                    },
                    {
                        chapter: "Chapter 9: The Final Choice",
                        content: "As his training neared its completion, James faced his final and most difficult trial. The Keepers revealed that becoming one of them meant leaving his old life behind completely. He would have to choose between returning to the outside world as a messenger of their knowledge, or remaining in the hidden valley as a guardian of their secrets. Both paths were vital for humanity's survival, but they were mutually exclusive. Through the Heart of Knowledge, he could see the consequences of each choice rippling through possible futures. Staying would mean preserving the purity of the Keepers' knowledge but risking that it might come too late to the outside world. Leaving would mean having to translate their profound wisdom into terms the modern world could accept and understand, with all the potential for misunderstanding and misuse that entailed. The weight of the decision pressed upon him as he realized that either choice would irrevocably alter the course of human history."
                    },
                    {
                        chapter: "Chapter 10: The Path Forward",
                        content: "In the end, James chose a third path - one that even the Keepers hadn't foreseen. Using the principles he had learned in the Library of Time, he found a way to exist in both worlds simultaneously. His consciousness became quantum-entangled, able to shift between his life in the outside world and his role as a Keeper. This unprecedented solution opened new possibilities for bridging the gap between ancient wisdom and modern needs. The hidden valley would remain protected, but its knowledge would gradually flow into the world through carefully chosen channels. As James adapted to his dual existence, he began the delicate work of preparing humanity for the challenges ahead. The Forgotten Path, he realized, wasn't just a physical route through the mountains - it was a way of understanding reality that had been lost and found again, a path that wound through the very fabric of existence itself. And now, at last, it was open to those who were ready to walk it."
                    }
                ];
            case "Ang Lihim na Hardin":
                return [
                    {
                        chapter: "Kabanata 1: Ang Misteryosong Sulat",
                        content: "Isang mainit na hapon nang makatanggap si Maria Santos ng isang kahon mula sa kanyang yumaong lola. Sa loob nito ay isang lumang susi at isang sulat na may kalakip na lumang litrato ng isang hardin. Ang sulat ay nagsasaad ng isang mahiwagang lugar sa bundok ng Sierra Madre, kung saan may isang hardin na hindi pangkaraniwan ang mga halaman at bulaklak. Ayon sa sulat, ang hardin ay may kapangyarihang magbigay ng kagalingan sa mga may karamdaman, ngunit ito ay natatago sa mga mata ng karamihan. Habang binabasa ni Maria ang sulat, napansin niyang may mga salitang nagliliwanag sa papel, na tila may sariling buhay. Ang hangin sa kanyang paligid ay puno ng mabangong halimuyak ng mga bulaklak, kahit na wala naman siyang halaman sa kanyang maliit na apartment."
                    },
                    {
                        chapter: "Kabanata 2: Ang Paglalakbay",
                        content: "Kinabukasan, nagpasya si Maria na sundan ang mga tagubilin sa sulat. Dala ang lumang susi at mapa, naglakbay siya patungo sa bundok. Ang daan ay puno ng mga kakaibang tanda - mga puno na kumikislap sa dilim, mga ibong may kakaibang kulay, at mga batong may nakaukit na sinaunang simbolo. Habang paakyat siya sa bundok, napansin niyang ang temperatura ay hindi nagbabago, at ang mga ulap ay bumubuo ng mga hugis na tila nagbibigay sa kanya ng direksyon. Sa bawat hakbang, parang may hindi nakikitang puwersa na gumagabay sa kanya, at ang susi sa kanyang bulsa ay unti-unting nag-iinit, na parang tumutugon sa kanyang paglapit sa hardin."
                    },
                    {
                        chapter: "Kabanata 3: Ang Mahiwagang Pintuan",
                        content: "Sa wakas, nakarating si Maria sa isang malaking pintuan na nakatago sa pagitan ng mga bato at halaman. Ang pintuan ay gawa sa kahoy na hindi niya makilala, at may mga nakaukit na simbolo na kahawig ng mga nakita niya sa sulat ng kanyang lola. Nang ilapit niya ang susi sa pintuan, ang mga simbolo ay nagsimulang magliwanag, at ang susi ay kusang umiikot sa butas. Sa pagbukas ng pintuan, isang mundo ng mga kakaibang kulay at tunog ang sumalubong sa kanya. Ang hardin sa loob ay hindi pangkaraniwan - may mga bulaklak na kumukutitap sa dilim, mga puno na tila humihinga, at mga daan na parang gawa sa kristal na nagbabago ng kulay sa bawat hakbang."
                    },
                    {
                        chapter: "Kabanata 4: Ang mga Tagapag-alaga",
                        content: "Sa gitna ng hardin, natagpuan ni Maria ang isang grupo ng mga misteryosong tao na nakasuot ng mga damit na gawa sa mga dahon at bulaklak. Sila ang mga tagapag-alaga ng hardin, at ayon sa kanila, matagal na nilang hinihintay ang pagdating ni Maria. Ipinaliwanag nila na ang hardin ay isang sagradong lugar na nagsisilbing tulay sa pagitan ng mundo ng tao at ng mga espiritu ng kalikasan. Ang kanyang lola, na dating isa sa mga tagapag-alaga, ay pinili si Maria bilang susunod na tagapagmana ng mga lihim ng hardin. Ngunit bago niya matanggap ang tungkulin, kailangan muna niyang matutunan ang mga sinaunang kaalaman at ritwal na nagpapanatili sa hardin."
                    },
                    {
                        chapter: "Kabanata 5: Ang Unang Pagsubok",
                        content: "Nagsimula ang pagsasanay ni Maria sa mga lihim ng hardin. Ang unang pagsubok ay ang pakikipag-usap sa mga halaman - ang pag-unawa sa kanilang mga bulong at damdamin. Sa tulong ng mga tagapag-alaga, natutunan niyang marinig ang mga kuwento ng bawat bulaklak at puno. Nalaman niya na ang bawat halaman ay may sariling kuwento at kapangyarihan na makakatulong sa pagpapagaling ng iba't ibang karamdaman. Ngunit habang natututo siya, napansin din niya na may ilang bahagi ng hardin na tila namamatay - isang palatandaan na may banta sa sagradong lugar na ito."
                    },
                    {
                        chapter: "Kabanata 6: Ang Lihim na Kaaway",
                        content: "Isang gabi, habang nag-aaral si Maria ng mga sinaunang kasulatan, natuklasan niya ang isang nakababahalang katotohanan. May isang grupong nagtatangkang nakawin ang mga mahiwagang halaman para gamitin sa masasamang layunin. Ang grupo ay pinamumunuan ng isang dating tagapag-alaga na naging sakim at nawalan ng pagpapahalaga sa sagradong tungkulin. Ayon sa mga kasulatan, ang grupong ito ay matagal nang naghahanap ng paraan para makapasok sa hardin, at ngayon ay malapit na nilang matuklasan ang lihim na pasukan."
                    },
                    {
                        chapter: "Kabanata 7: Ang Paghahanda",
                        content: "Kasama ang mga tagapag-alaga, naghanda si Maria para sa nalalapit na paghaharap sa kaaway. Pinag-aralan niya ang mga sinaunang ritwal ng proteksyon at ang paggamit ng kapangyarihan ng mga halaman para sa pagtatanggol. Bawat araw ay puno ng matinding pagsasanay - ang paglikha ng mga harang na gawa sa enerhiya ng mga halaman, ang pag-unawa sa mga babala ng kalikasan, at ang pagpapalakas ng koneksyon niya sa espiritu ng hardin. Sa bawat araw na lumilipas, ramdam ni Maria ang paglago ng kanyang kapangyarihan, ngunit kasabay nito ang lumalalim na responsibilidad sa pagprotekta sa hardin."
                    },
                    {
                        chapter: "Kabanata 8: Ang Labanan",
                        content: "Sa isang gabing may kabilugan ng buwan, dumating ang mga kaaway sa hardin. Ginamit nila ang mga itim na mahika para sirain ang mga harang na proteksyon, ngunit handa si Maria at ang mga tagapag-alaga. Isang mahiwagang labanan ang naganap - ang kapangyarihan ng mga halaman laban sa itim na mahika. Ang buong hardin ay naging saksi sa pakikibaka, habang ang mga puno ay sumasali sa laban at ang mga bulaklak ay nagbubuga ng mga liwanag na pumipigil sa mga kaaway. Si Maria, gamit ang lahat ng kanyang natutunan, ay nanguna sa pagtatanggol sa hardin."
                    },
                    {
                        chapter: "Kabanata 9: Ang Sakripisyo",
                        content: "Sa pinakamahigpit na sandali ng labanan, naalala ni Maria ang huling aral ng kanyang lola - ang tunay na kapangyarihan ng hardin ay nasa pagmamahal at pagpapatawad. Sa halip na wasakin ang dating tagapag-alaga, pinili niyang buksan ang kanyang puso at ibahagi ang tunay na diwa ng hardin. Ang kanyang aksyon ay nagdulot ng isang mahiwagang transformasyon - ang dilim sa puso ng dating tagapag-alaga ay unti-unting nawala, at ang mga halaman sa hardin ay mas lalong sumigla at nagliwanag. Ang sakripisyo ng pagpapatawad ay nagbunga ng mas malaking kapangyarihan kaysa sa anumang mahika."
                    },
                    {
                        chapter: "Kabanata 10: Ang Bagong Simula",
                        content: "Matapos ang labanan, nagkaroon ng bagong sigla ang hardin. Ang mga halaman ay mas makulay at malakas kaysa dati, at ang koneksyon sa pagitan ng mga tagapag-alaga at ng hardin ay mas lumalim. Si Maria ay ganap nang naging tagapag-alaga, at sa tulong ng kanyang karanasan, nagsimula siyang magturo sa bagong henerasyon ng mga magiging tagapag-alaga. Ang dating kaaway ay naging katuwang sa pagprotekta sa hardin, at ang kanyang dating kaalaman sa itim na mahika ay nagamit sa mas mabuting paraan. Sa mga gabing tahimik, habang nakaupo si Maria sa gitna ng hardin, nararamdaman niya ang presensya ng kanyang lola sa hanging dumadaan, at alam niyang ang lihim na hardin ay ligtas at uunlad pa sa mga darating na taon."
                    }
                ];
            case "Sa Dilim ng Gabi":
                return [
                    {
                        chapter: "Kabanata 1: Ang Misteryosong Tawag",
                        content: "Isang madilim na gabi nang tumunog ang telepono ni Detective Juan Reyes. Sa kabilang linya ay isang boses na pamilyar ngunit hindi niya matandaan kung saan niya narinig. Ang boses ay nagbabala tungkol sa isang napipintong panganib sa lungsod - isang serye ng mga kakaibang pangyayari na may kaugnayan sa lumang alamat ng mga engkanto. Sa kanyang mesa ay nakalatag ang mga litrato ng mga nawawalang tao, lahat ay nawala tuwing hatinggabi, at sa lugar kung saan sila huling nakita ay may mga bakas ng mga kakaibang simbolo na nakaukit sa lupa. Habang pinag-aaralan ni Juan ang mga ebidensya, napansin niyang ang mga simbolo ay bumubuo ng isang pattern na may kaugnayan sa sinaunang kalendaryong Pilipino."
                    },
                    {
                        chapter: "Kabanata 2: Ang Lumang Mansyon",
                        content: "Ang imbestigasyon ay nagdala kay Juan sa isang abandonadong mansyon sa gilid ng lungsod. Ang mansyon ay dating pag-aari ng isang kilalang pamilya na may koneksyon sa mga babaylan noong panahon ng mga Espanyol. Sa pagpasok niya sa mansyon, agad niyang naramdaman ang kakaibang atmosphere - ang hangin ay malamig kahit tag-init, at may mga kakaibang ingay na parang mga bulong ng mga hindi nakikitang nilalang. Sa library ng mansyon, natuklasan niya ang isang lumang diary na naglalaman ng mga ritwal at propesiya. Ang mga pahina ay puno ng mga drawing ng mga nilalang na hindi niya maintindihan, at mga tala tungkol sa isang darating na panahon kung kailan ang mundo ng mga tao at ng mga engkanto ay magtatagpo muli."
                    },
                    {
                        chapter: "Kabanata 3: Ang mga Engkanto",
                        content: "Sa ikatlong gabi ng kanyang imbestigasyon, nakatagpo si Juan ng isang misteryosong babae na nagpakilalang si Maya. Ayon kay Maya, siya ay isang tagapamagitan sa pagitan ng mundo ng mga tao at ng mga engkanto. Ipinaliwanag niya na ang mga nawawalang tao ay hindi basta nawala - sila ay dinala sa mundo ng mga engkanto. Ang mga simbolo sa lupa ay mga portal na nabubuksan tuwing hatinggabi, at ang mga engkanto ay pumipili ng mga taong may kakayahang makakita at makaugnay sa kanilang mundo. Ngunit may banta raw sa balanse ng dalawang mundo - isang grupong nagtatangkang pagsamahin ang dalawang mundo para sa kanilang sariling kapangyarihan."
                    },
                    {
                        chapter: "Kabanata 4: Ang Hatinggabi",
                        content: "Isang hatinggabi, sinundan ni Juan at Maya ang mga bakas patungo sa isang lumang sementeryo. Dito, nakita nila kung paano nabubuksan ang mga portal - ang mga simbolo sa lupa ay nagsisimulang magliwanag, at ang hangin ay nagiging makulay na ulap na bumubuo ng mga daanan patungo sa ibang dimensyon. Sa pamamagitan ng mga portal na ito, nakita nila ang mundo ng mga engkanto - isang lugar na puno ng mga kahanga-hangang nilalang at arkitektura na hindi maaaring umiiral sa mundo ng mga tao. Ngunit napansin din nila na may mga portal na nasisira, na nagdudulot ng hindi wastong paghahalo ng dalawang mundo."
                    },
                    {
                        chapter: "Kabanata 5: Ang Propesiya",
                        content: "Sa diary na natagpuan sa mansyon, natuklasan ni Juan ang isang sinaunang propesiya. Ito ay nagsasaad ng isang panahon kung kailan ang mga hadlang sa pagitan ng dalawang mundo ay manghihina, at isang tagapagtanggol ang kailangang pumili - ang pagpapanatili ng pagkahiwalay ng dalawang mundo o ang pagpapahintulot sa kanilang pagsasama. Ang propesiya ay nagsasabi rin ng mga palatandaan na magaganap bago ang ganap na pagbabago - mga pangyayaring eksaktong tumutugma sa mga nangyayari ngayon sa lungsod. Habang pinag-aaralan nila ang propesiya, unti-unting naiintindihan ni Juan kung bakit siya ang pinili para matuklasan ang mga ito."
                    },
                    {
                        chapter: "Kabanata 6: Ang Katotohanan",
                        content: "Sa kanyang patuloy na pagsisiyasat, natuklasan ni Juan ang isang nakakagulat na katotohanan - siya pala ay may dugong engkanto. Ang kanyang tunay na mga magulang ay mga tagapamagitan, tulad ni Maya, at iniwan siya sa mundo ng mga tao para protektahan siya. Ang kanyang kakayahang makakita at makaramdam ng mga supernatural na pangyayari ay mula sa kanyang tunay na pamana. Ngunit kasama ng katotohanang ito ay ang bigat ng responsibilidad - bilang may dugong engkanto at detective sa mundo ng mga tao, siya ang natatanging may kakayahang pigilan ang napipintong kaguluhan sa dalawang mundo."
                    },
                    {
                        chapter: "Kabanata 7: Ang Paghahanda",
                        content: "Kasama si Maya, nagsimula si Juan na pag-aralan ang mga sinaunang ritwal at kapangyarihan na minana niya. Sa loob ng lumang mansyon, tinuruan siya ni Maya kung paano kontrolin ang mga portal, makipag-usap sa mga espiritu, at gumamit ng mga elementong kalikasan. Bawat araw ay isang bagong hamon - ang pag-aaral ng wika ng mga engkanto, ang pag-unawa sa mga batas ng kanilang mundo, at ang pagbabalanse ng kanyang dalawang pagkatao. Ngunit habang lumalawak ang kanyang kaalaman, lumalaki rin ang banta sa dalawang mundo, at ang mga kaaway ay unti-unting nagiging mas malakas at mas mapanganib."
                    },
                    {
                        chapter: "Kabanata 8: Ang Paghaharap",
                        content: "Sa isang mahalagang hatinggabi, natuklasan nina Juan at Maya kung sino ang nasa likod ng mga pagdukot at ang pagtatangkang pagsamahin ang dalawang mundo - isang matandang engkantong nagngangalang Ligaw, na naniniwala na ang paghihiwalay ng dalawang mundo ay isang malaking pagkakamali. Nagkaroon ng matinding labanan sa pagitan ng mga puwersa ni Ligaw at ng mga tagapagtanggol ng dalawang mundo. Ang mga portal ay nagbukas sa iba't ibang bahagi ng lungsod, at ang mga engkanto at tao ay nagsama-sama para labanan ang banta. Si Juan, gamit ang kanyang bagong natutunan na kapangyarihan, ay nanguna sa pakikipaglaban."
                    },
                    {
                        chapter: "Kabanata 9: Ang Desisyon",
                        content: "Sa gitna ng labanan, napagtanto ni Juan na ang tunay na solusyon ay hindi ang ganap na paghihiwalay o pagsasama ng dalawang mundo, kundi ang paghahanap ng balanse. Gamit ang kanyang kapangyarihan bilang tagapamagitan, gumawa siya ng bagong uri ng portal - isang daanan na magpapahintulot sa kontroladong ugnayan ng dalawang mundo. Ang kanyang aksyon ay nagdulot ng pagkagulat sa lahat, ngunit unti-unting nakita nila ang karunungan sa kanyang desisyon. Si Ligaw, na nakita ang katotohanan sa ginawa ni Juan, ay tumalikod sa kanyang dating layunin at naging katuwang sa pagpapanatili ng bagong balanse."
                    },
                    {
                        chapter: "Kabanata 10: Ang Bagong Mundo",
                        content: "Sa wakas, nagkaroon ng bagong kaayusan sa pagitan ng mundo ng mga tao at mga engkanto. Ang mga portal ay naging mas matatag at kontrolado, at ang mga tagapamagitan tulad nina Juan at Maya ay naging opisyal na bantay ng dalawang mundo. Ang mga nawawalang tao ay natagpuan at nakabalik sa kanilang mga pamilya, dala ang mga kuwento ng kanilang karanasan sa mundo ng mga engkanto. Si Juan ay nagpatuloy sa kanyang trabaho bilang detective, ngunit ngayon ay may mas malalim na pang-unawa sa mga misteryong nakapalibot sa ating mundo. Sa mga gabing madilim, kapag tumatawag ang telepono, alam niyang ang mga kaso ay maaaring mangailangan ng higit pa sa normal na pagsisiyasat - at handa siyang harapin ang anumang hamon, mula sa mundo man ng tao o ng mga engkanto."
                    }
                ];
            case "Mga Tingog sa Hangin":
                return [
                    {
                        chapter: "Kapitulo 1: Ang Tingog sa Kagabhion",
                        content: "Si Ana nga nagtindog sa balkonahe sa ilang balay sa bukid, naminaw sa kahibulongang mga tingog nga nagagikan sa hangin. Ang mga tingog daw nagaawit og karaang mga istorya, mga balak nga wala pa nadungog sa modernong panahon. Sa iyang kamot, usa ka karaang recorder nga iyang napanunod gikan sa iyang apohan, nga usa ka tigtipon og mga karaang sugilanon sa ilang tribo. Ang recorder, bisan og wala'y baterya, nagasugod og tukar sa matag tungang gabii, nagapatugtog og mga tingog ug awit nga daw gikan sa laing kalibutan. Ang mga pulong klaro kaayo sa iyang pandungog, apan dili niya masabtan ang ilang kahulogan."
                    },
                    {
                        chapter: "Kapitulo 2: Ang Karaang Mapa",
                        content: "Pagkasunod adlaw, nakakaplag si Ana og usa ka karaang mapa sa sulod sa recorder. Ang mapa nagpakita sa usa ka dalan padulong sa usa ka misteryosong lugar sa kabukiran sa Mindanao, diin, sumala sa mga sinulat sa kilid sa mapa, nagatuyo ang mga karaang espiritu sa kinaiyahan. Ang mapa gihimo sa special nga tinta nga nagakislap sa kangitngit ug nagausab og kolor depende sa panahon. Sa iyang pagtuon sa mapa, namatikdan niya nga ang mga linya nagalihok, nagaporma og bag-ong mga dalan ug simbolo. Ang mga pulong sa kilid nagasulti og propesiya bahin sa usa ka pinili nga makabukas sa portal sa kalibutan sa mga espiritu."
                    },
                    {
                        chapter: "Kapitulo 3: Ang Dalan sa Kabukiran",
                        content: "Gidala sa kadasig, misugod si Ana sa iyang panaw padulong sa kabukiran. Ang dalan lisod ug peligroso, apan ang mga tingog sa hangin nagpadayon sa paggiya kaniya. Sa matag lakang, ang kalibutan sa iyang palibot nagkausab - ang mga kahoy daw nagasayaw, ang mga bulak nagaawit, ug ang mga langgam nagadala og mga mensahe nga mahimong masabtan. Sa iyang pagsaka sa bukid, nakatagbo siya og usa ka tigulang nga babaye nga nagpaila nga usa sa mga tigbantay sa portal sa kalibutan sa mga espiritu. Ang tigulang miingon nga dugay na silang naghulat sa pag-abot ni Ana, ang piniling tigpaminaw sa mga tingog sa hangin."
                    },
                    {
                        chapter: "Kapitulo 4: Ang mga Tigbantay",
                        content: "Ang tigulang nga babaye midala kang Ana sa usa ka tinago nga lugar sa bukid, diin nagpuyo ang mga tigbantay sa portal. Dinhi, iyang nahimamat ang ubang mga tigbantay - mga tawo nga adunay espesyal nga koneksyon sa kalibutan sa mga espiritu. Matag usa kanila adunay kaugalingong gahum - ang uban makakita sa umaabot, ang uban makaistorya sa mga hayop, ug ang uban makadungog sa mga tingog sa kinaiyahan. Gitudloan nila si Ana nga ang iyang katakus sa pagdungog sa mga tingog sa hangin usa ka rare nga gasa, ug kini ang hinungdan nganong gipili siya sa mga espiritu."
                    },
                    {
                        chapter: "Kapitulo 5: Ang Pagbansay",
                        content: "Misugod ang pagbansay ni Ana ubos sa pagtudlo sa mga tigbantay. Gitudloan siya sa pagsabot sa mga tingog sa hangin, sa pagbasa sa mga timailhan sa kinaiyahan, ug sa paggamit sa iyang gahum aron makatabang sa pagbalanse sa duha ka kalibutan. Matag adlaw, nagkadugang ang iyang kahibalo ug kusog. Apan uban sa pagtubo sa iyang gahum, nagkadugang usab ang iyang responsibilidad. Ang mga tigbantay mipasabot nga adunay nagsingabot nga dakong kausaban, ug si Ana adunay importante nga papel niini."
                    },
                    {
                        chapter: "Kapitulo 6: Ang Hulga",
                        content: "Usa ka gabii, ang mga tingog sa hangin midala og pasidaan. Adunay grupo sa mga tawo nga naningkamot sa pagbukas sa portal sa sayop nga paagi, nagtinguha sa paggamit sa gahum sa mga espiritu alang sa ilang kaugalingong kaayohan. Kini nga grupo gigamit ang itom nga salamangka aron sa pagpugos sa pag-abli sa portal, nga makahatag og dakong kadaut sa duha ka kalibutan. Ang mga tigbantay nabalaka nga kung magmalampuson kini nga grupo, ang balanse tali sa duha ka kalibutan maguba, ug ang mga espiritu mahimong maglagot ug magdala og dakong katalagman."
                    },
                    {
                        chapter: "Kapitulo 7: Ang Pagpangandam",
                        content: "Ang mga tigbantay ug si Ana nagsugod sa pagpangandam alang sa umaabot nga away. Gipakusgan nila ang mga barier nga nagprotekta sa portal, ug si Ana gigamit ang iyang gahum sa pagdungog sa mga tingog sa hangin aron mahibal-an ang mga plano sa kaaway. Matag gabii, ang mga tingog naghatag og bag-ong impormasyon - ang lokasyon sa mga kaaway, ang ilang mga plano, ug ang panahon sa ilang pag-atake. Si Ana usab nakakat-on og mga karaang ritual gikan sa mga tigbantay, mga ritual nga magamit sa pagdepensa sa portal ug sa pagprotekta sa balanse sa kinaiyahan."
                    },
                    {
                        chapter: "Kapitulo 8: Ang Gubat",
                        content: "Sa gabii sa bulan nga puno, misulong ang mga kaaway. Gigamit nila ang ilang itom nga salamangka aron sa pagsulong sa mga barier sa portal. Ang mga tigbantay, uban ni Ana, misukol gamit ang ilang mga gahum. Si Ana migamit sa iyang katakus sa pagdungog sa mga tingog sa hangin aron makiggubat - ang mga tingog nahimong kusog nga mga awit nga nakadaot sa mga kaaway ug nakapalig-on sa mga barier. Ang gubat nagpadayon sa tibuok gabii, ang mga gahum sa kinaiyahan ug ang itom nga salamangka nagbangi sa kawanangan."
                    },
                    {
                        chapter: "Kapitulo 9: Ang Sakripisyo",
                        content: "Sa kritikal nga punto sa gubat, nakaamgo si Ana nga ang bugtong paagi aron mapugngan ang mga kaaway mao ang paghiusa sa mga tingog sa hangin ngadto sa usa ka gamhanang awit. Apan kini nga ritual manghinabang og dakong kusog ug posible nga makakuha sa iyang kinabuhi. Bisan pa sa risgo, si Ana midesisyon nga buhaton kini. Samtang nag-awit siya, ang mga tingog sa hangin nagkahiusa sa iyang tingog, nagporma og usa ka gamhanang pwersa nga mipugong sa mga kaaway ug mipalayas sa itom nga salamangka. Ang iyang sakripisyo miluwas sa portal ug sa duha ka kalibutan, apan gibayaran kini og dakong presyo."
                    },
                    {
                        chapter: "Kapitulo 10: Ang Bagong Sinugdanan",
                        content: "Human sa gubat, si Ana nakabawi, bisan og luya pa. Ang iyang sakripisyo wala makakuha sa iyang kinabuhi, apan nausab kini sa hingpit. Ang iyang koneksyon sa mga tingog sa hangin nahimong mas lig-on, ug nahimo siyang usa sa pinakagamhanan nga tigbantay sa portal. Ang mga kaaway napildi ug ang portal naluwas, apan ang mga tigbantay nakahibalo nga kinahanglan nilang magpabiling alerto. Si Ana mibalik sa iyang normal nga kinabuhi, apan karon aduna na siyay duha ka kalibutan nga iyang gipuy-an - ang kalibutan sa mga tawo ug ang kalibutan sa mga espiritu. Ang recorder sa iyang apohan nagpabilin nga usa ka importante nga bahin sa iyang kinabuhi, nagsilbing tigpahinumdom sa iyang destiny isip tigpaminaw sa mga tingog sa hangin. Sa matag gabii, ang mga tingog nagpadayon sa pag-awit, apan karon si Ana hingpit nang nakasabot sa ilang mensahe ug nakaamgo sa iyang papel isip tigbalanse sa duha ka kalibutan."
                    }
                ];
            case "Ti Naulimek a Hardin":
                return [
                    {
                        chapter: "Kapitulo 1: Ti Surat manipud iti Napalabas",
                        content: "Iti maysa a nasipnget a bigat, nakadanon ti maysa a surat ken ni Professor Ricardo Dela Cruz, maysa a eksperto iti Ilocano mythology. Ti surat ket manipud iti maysa a nataengan a babai nga agnagan iti Maria Luna, nga agkunkuna a nakadiskubre iti maysa a hardin a saan a makita iti regular a tiempo. Ti hardin, segun kenni Maria, ket maysa a lugar a nagbaetan ti agdama ken ti napalabas, a napno kadagiti mula ken sabsabong a saan pay a nakita ti moderno a lubong. Iti uneg ti sobre, adda met dagiti napudaw a litrato ti hardin, ngem ti nakaskasdaaw, dagiti imahen ket kasla agbalbaliw tunggal kumitkita ni Ricardo."
                    },
                    {
                        chapter: "Kapitulo 2: Ti Daan a Bantay",
                        content: "Kalpasan ti adu a panagadal kadagiti litrato ken surat, napan ni Ricardo iti lugar a naibaga. Sadiay, nasarakanna ti maysa a lakay nga agnagan iti Apo Doro, ti bantay ti hardin. Dagiti mata ni Apo Doro ket napno iti kinasirib ken kapadasan, ken ti panagkitana ket kasla makabasa iti kararua. Imbagana ken ni Ricardo nga isu ket saan laeng a simple a hardin - daytoy ket maysa a ruangan iti lubong dagiti espiritu, maysa a lugar a pagnaedan dagiti kakahuyan ken sabsabong a napno iti kinasirib ken pannakabalin. Inlawlawag ni Apo Doro nga awan ti pannakaiyakar ni Ricardo - isu ket napili a mangsukat kenkuana kas bantay ti hardin."
                    },
                    {
                        chapter: "Kapitulo 3: Dagiti Palimed ti Hardin",
                        content: "Rinugianan ni Apo Doro ti panangisuro ken ni Ricardo kadagiti palimed ti hardin. Impakitana dagiti sabsabong a makakanta kadagiti daan a kanta, dagiti kayo a makapagsao kadagiti padto, ken dagiti waig a makapaimbag iti aniaman a sakit. Tunggal addang ket maysa a baro a pakakitaan - dagiti mula a makapagaramid kadagiti milagro, dagiti nateng a mangted iti naisangsangayan a pannakabalin, ken dagiti bunga a mangbalbaliw iti panagkita ti mangkaan. Ngem kadagitoy amin a kinadayag, pinagannad ni Apo Doro ni Ricardo maipapan kadagiti peggad - adda dagiti paset ti hardin a napno kadagiti makasabidong a mula, ken dagiti espiritu a saan a kanayon a gayyem ti tao."
                    },
                    {
                        chapter: "Kapitulo 4: Ti Umuna a Pannubok",
                        content: "Kalpasan ti sumagmamano a lawas ti panagadal, dimteng ti tiempo para iti umuna a pannubok ni Ricardo. Masapul a makisarita kadagiti mula ken denggen dagiti estoriada. Iti rugi, narigat unay - dagiti timek dagiti mula ket nkapuy ken saan a nalawag. Ngem iti nabayag a panawen, nasursurona ti panagdengngeg kadagiti naisangsangayan a timek ti tunggal kita ti mula. Dagiti rosas ket agsasao maipapan iti ayat ken ut-ot, dagiti orkidias ibagbagada dagiti palimed ti napalabas, ken dagiti dadakkel a kayo mangipadpadto iti masakbayan. Ti kaarigan a paset ket ti panangbigbig iti pudno a timek manipud kadagiti manangallilaw a timek dagiti dakes nga espiritu a mangsulsulisog kadagiti agad-adal."
                    },
                    {
                        chapter: "Kapitulo 5: Ti Peggad manipud iti Sipnget",
                        content: "Maysa a rabii, bayat ti panagbantay ni Ricardo, nakariknana ti dakes a presensia iti hardin. Adda grupo dagiti tattao a mangpadas a mangtakaw kadagiti nasantoan a mula. Dagitoy a tattao ket agus-usar iti nangisit a salamangka tapno makaserrek iti hardin. Dagiti mula mismo nangrugi nga agikkis gapu iti buteng, ken dagiti espiritu ti hardin nagriribuk. Inusar ni Ricardo dagiti kabarbaro a nasursuronanna a pannakabalin tapno masalakniban ti hardin, ngem naamirisna a saan pay a husto ti ammona tapno mapasardeng daytoy a peggad. Dagiti kabusor ket saan laeng a simple a mannanakaw - isuda dagiti nagkauna a kabusor ti hardin a mangkayat a mangdadael iti balanse ti nakaparsuaan."
                    },
                    {
                        chapter: "Kapitulo 6: Ti Nagkauna a Padto",
                        content: "Iti panangbirokna iti wagas a panangprotekta iti hardin, nadiskubre ni Ricardo ti maysa a nagkauna a padto a naisurat kadagiti bulong ti maysa a nasantoan a kayo. Ti padto ket maipapan iti tiempo ti sipnget a dumteng iti hardin, ken maysa a bantay manipud iti ruar a mangisalakan wenno mangdadael iti hardin. Kinuna ti padto a masapul a masursuro ti bantay ti 'immuna a kanta' - maysa a nagkauna a ritual a mangpagteng iti amin a pannakabalin ti hardin. Ngem ti panagadal iti daytoy a kanta ket addaan iti dakkel a peggad - no saan a husto ti panangkanta, mabalin a matay amin a biag iti hardin."
                    },
                    {
                        chapter: "Kapitulo 7: Ti Panagsagana",
                        content: "Babaen ti tulong ni Apo Doro ken dagiti espiritu ti hardin, rinugian ni Ricardo ti panagsagana para iti umay a gubat. Nagadal kadagiti nagkauna a ritual, nakisarita kadagiti nagkauna nga espiritu, ken nagpraktis nga agusar iti pannakabalin ti tunggal mula iti hardin. Inaldaw, ti panagkaykaysa ti hardin kenkuana ket pumigpigsa. Nasursuronanna ti panagaramid kadagiti salaknib babaen kadagiti waig, ti panagtawag kadagiti espiritu ti angin babaen kadagiti sabsabong, ken ti panangusar iti pannakabalin dagiti kayo tapno maliklikan dagiti peggad. Ngem ti kapatgan a leksion ket ti panangbigbig iti balanse ti nakaparsuaan - ti pannakaammo a tunggal banag iti hardin ket addaan iti panggep ken lugar."
                    },
                    {
                        chapter: "Kapitulo 8: Ti Dakkel a Gubat",
                        content: "Iti rabii ti lawag ti bulan, dimteng dagiti kabusor. Inusarda ti nangisit a salamangkada tapno padasenda a dadaelen dagiti salaknib ti hardin. Ni Ricardo, kaduana dagiti espiritu ken amin a biag ti hardin, nakilaban. Dagiti kayo nakilaban babaen kadagiti sangada, dagiti sabsabong nangipaulog kadagiti polen a nangpukaw iti pannakabalin dagiti kabusor, ken dagiti waig nanglapped kadagiti manglablabsing. Iti kangatuan a paset ti gubat, nalagip ni Ricardo ti nagkauna a kanta. Iti panangkantana, ti sibubukel a hardin timmulong - dagiti bulong, sabsabong, sanga, ken uray ti daga mismo nakikanta kenkuana. Ti kanta pinunnona ti angin iti pannakabalin a saan pay a pulos a narikna iti hardin."
                    },
                    {
                        chapter: "Kapitulo 9: Ti Sakripisio",
                        content: "Ti kanta nagtultuloy, ken ti pannakabalinna pumigpigsa. Ngem nadlaw ni Ricardo a tunggal nota a kantaenna mangkurkurang iti pigsana. Ti padto ket pudno - ti kanta kasapulan ti dakkel a sakripisio manipud iti mangkankanta. Bayat a kumapkapuy ti bagina, ti hardin mismo nangted kenkuana iti pigsa, tunggal mula ken espiritu nakipaset iti biagda tapno makatuloy isuna. Iti maudi a paset ti kanta, ti pannakabalinna nagwaras iti entero a hardin, pinapanawna ti sipnget ken dagiti kabusor. Ngem ti balligi addaan iti dakkel a gatad - ni Ricardo dandani natay, ken adu a paset ti hardin ti nadadael iti gubat."
                    },
                    {
                        chapter: "Kapitulo 10: Ti Baro a Rugi",
                        content: "Kalpasan ti gubat, ti hardin in-inut a nagimbag. Ni Ricardo, nupay nakapuy pay laeng, rinugianna ti tumulong a mangpaimbag kadagiti nadadael a mula. Ti sakripisiona saan a nawayawaya - ti hardin napigpigsa ngem idi, ken ti panagkaykaysa dagiti mula, espiritu, ken ti baro a bantay napigpigsa pay. Ni Apo Doro, a naragsak iti inaramid ni Ricardo, impakaammo nga ipapanawnan ti hardin tapno makikadua kadagiti nagkauna nga espiritu, ibatina ti hardin iti panangaywan ni Ricardo. Kas baro a bantay, inkari ni Ricardo nga itultuloyna ti nagkauna a tradision ti panangaywan iti hardin, nga ammona a daytoy ket saan laeng a koleksion dagiti naisangsangayan a mula, no di ket maysa a sibibiag a panagkaykaysa ti lubong dagiti tao ken espiritu. Inaldaw, baro a bisita ti dumteng iti hardin, ken ni Ricardo pasangbayen ida nga addaan iti sirib a nasursuronanna - a ti pudno a pannakabalin ti hardin ket saan nga adda kadagiti milagro a maaramidna, no di ket kadagiti leksion nga isursurona maipapan iti panagraem ken panangaywan iti nakaparsuaan."
                    }
                ];
            case "Ang Hilit nga Tanaman":
                return [
                    {
                        chapter: "Kapitulo 1: Ang Misteryosong Tanaman",
                        content: "Sa usa ka hilit nga bahin sa bukid sa Mindanao, nakatindog si Pedro Gomez atubangan sa usa ka karaang ganghaan nga giputos sa mga baging ug bulak nga wala pa niya nakita sukad. Isip usa ka botanista, daghan na siyag nakitang talagsaong mga tanom, apan kining lugara adunay butang nga lahi - ang mga tanom daw buhi ug nagsayaw sa hangin, ang mga bulak nagapangidlap sa kangitngit, ug ang hangin mismo daw nagadala og mga tingog nga nagatawag kaniya. Sa iyang kamot, usa ka karaang mapa nga iyang napalitan sa usa ka tigulang nga babaye sa merkado, nga nagpakita niining misteryosong tanaman nga gitawag og 'Hardin sa mga Kalag'. Ang mapa dili ordinaryo - ang mga linya niini nagalihok ug nag-usab, ang mga simbolo nagakislap sa dilim, ug ang mga pulong nakasulat sa karaang sinulatan nga dili niya mabasahan."
                    },
                    {
                        chapter: "Kapitulo 2: Ang Tigulang nga Magbalantay",
                        content: "Sa iyang pagsuroy sa palibot sa ganghaan, nakasugat si Pedro og usa ka tigulang nga lalaki nga nagpaila nga si Manong Tasyo, ang magbalantay sa tanaman. Ang tigulang adunay mga mata nga daw nagadala sa kaalam sa mga katuigan, ug ang iyang panit daw sama sa panit sa kahoy - gahi apan puno sa kinabuhi. Gisultihan niya si Pedro nga ang tanaman dili lang usa ka ordinaryong lugar - kini usa ka portal sa kalibutan sa mga espiritu, usa ka lugar diin ang mga karaang diwata ug engkanto nagapuyo. Matag tanom adunay kaugalingong istorya, matag bulak adunay kaugalingong gahum, ug ang tanaman mismo buhi ug adunay kalag. Si Manong Tasyo mipasabot nga ang pag-abot ni Pedro dili sulagma - gipili siya sa tanaman mismo aron mahimong sunod nga magbalantay."
                    },
                    {
                        chapter: "Kapitulo 3: Ang mga Tinago sa Tanaman",
                        content: "Sa unang adlaw sa iyang pagkat-on, gidala ni Manong Tasyo si Pedro sa lainlaing bahin sa tanaman. Adunay lugar diin ang mga bulak nagaawit og karaang mga awit, usa ka sapa nga nagadala og tubig nga makaayo sa tanang sakit, ug mga kahoy nga nagasulti og mga propesiya. Ang matag lakang nagpadayag og bag-ong katingalahan - mga tanom nga makahimo og mga milagro, mga utanon nga makahatag og espesyal nga gahum, ug mga prutas nga makausab sa panglantaw sa nagakaon niini. Apan uban niining mga katahum, gipasidan-an ni Manong Tasyo si Pedro bahin sa mga peligro - ang uban nga bahin sa tanaman adunay mga tanom nga makahilo, ug adunay mga espiritu nga dili kanunay mahigalaon sa mga tawo."
                    },
                    {
                        chapter: "Kapitulo 4: Ang Unang Pagsulay",
                        content: "Human sa pipila ka semana sa pagbansay, naabot ang panahon sa unang pagsulay ni Pedro. Kinahanglan niyang makigsulti sa mga tanom ug maminaw sa ilang mga istorya. Sa sinugdanan, lisud kaayo - ang mga tingog sa mga tanom hinay ug dili klaro. Apan sa hinayhinay, nakatuon siya sa pagpaminaw sa mga kinaiyang tingog sa matag species. Ang mga rosas nagsulti bahin sa gugma ug kasakit, ang mga orkidyas nagshare og mga secreto sa kagahapon, ug ang mga dako nga kahoy nagsulti og mga propesiya bahin sa umaabot. Ang labing lisud nga bahin mao ang pag-ila sa tinuod nga tingog gikan sa mga malimbongon nga tingog sa mga dautang espiritu nga usahay mosulay sa paglingla sa mga magtutuon."
                    },
                    {
                        chapter: "Kapitulo 5: Ang Hulga sa Kangitngit",
                        content: "Usa ka gabii, samtang nagabantay si Pedro, nakabantay siya og usa ka dili maayo nga presensya sa tanaman. Adunay grupo sa mga tawo nga naningkamot sa pagpangawat sa pipila ka sagrado nga tanom. Kini nga mga tawo naggamit og itom nga salamangka aron sa pagsulay pagsulod sa tanaman. Ang mga tanom mismo nagsugod og singgit sa kahadlok, ug ang mga espiritu sa tanaman nagkaguliyang. Gigamit ni Pedro ang iyang bag-ong nakat-unan nga mga gahum aron sa pagprotekta sa tanaman, apan nakaamgo siya nga ang iyang kahibalo dili pa igo aron mapugngan kining bag-ong hulga. Ang mga kaaway dili lang ordinary nga mga kawatan - sila mga karaang kaaway sa tanaman nga nagtinguha sa pagguba sa balanse sa kinaiyahan."
                    },
                    {
                        chapter: "Kapitulo 6: Ang Karaang Propesiya",
                        content: "Sa iyang pagpangita og paagi sa pagpanalipod sa tanaman, nadiskobrehan ni Pedro ang usa ka karaang propesiya nga nakasulat sa mga dahon sa usa ka sagradong kahoy. Ang propesiya naghisgot bahin sa usa ka panahon sa kangitngit nga moabot sa tanaman, ug usa ka magbalantay nga maggikan sa gawas nga mahimong yawe sa kaluwasan o kalaglagan sa tanaman. Ang propesiya nagpasabot nga ang magbalantay kinahanglang makakat-on sa 'pinakaunang awit' - usa ka karaang ritual nga makahiusa sa tanang gahum sa tanaman. Apan ang pagkat-on niini nga awit adunay dakong risgo - kung dili husto ang pagkanta, mahimong mamatay ang tanang kinabuhi sa tanaman."
                    },
                    {
                        chapter: "Kapitulo 7: Ang Pagpangandam",
                        content: "Uban sa tabang ni Manong Tasyo ug sa mga espiritu sa tanaman, nagsugod si Pedro sa pagpangandam alang sa umaabot nga gubat. Nagtuon siya sa karaang mga ritwal, nakig-istorya sa mga karaang espiritu, ug nagpraktis sa paggamit sa gahum sa matag tanom sa tanaman. Matag adlaw, ang iyang koneksyon sa tanaman nagkakusog. Nakakat-on siya sa paghimo og mga harang gamit ang mga baging, sa pagtawag sa mga espiritu sa kahanginan pinaagi sa mga bulak, ug sa paggamit sa gahum sa mga kahoy aron makalikay sa mga peligro. Apan ang labing importante nga leksyon mao ang pag-ila sa balanse sa kinaiyahan - ang kahibalo nga ang matag butang sa tanaman adunay katuyoan ug lugar."
                    },
                    {
                        chapter: "Kapitulo 8: Ang Dakong Gubat",
                        content: "Sa gabii sa lunong bulan, misulong ang mga kaaway. Gigamit nila ang ilang itom nga salamangka aron sa pagsulay pagbungkag sa mga proteksyon sa tanaman. Si Pedro, kauban ang mga espiritu ug ang tanang kinabuhi sa tanaman, misukol. Ang mga kahoy nakig-away gamit ang ilang mga sanga, ang mga bulak mipagawas og mga poleng nga nakapawala sa gahum sa mga kaaway, ug ang mga baging mipugong sa mga intruso. Sa kinaunahian nga bahin sa gubat, nahinumdoman ni Pedro ang karaang awit. Sa iyang pagkanta, ang tibuok tanaman miapil - ang mga dahon, mga bulak, mga sanga, ug bisan ang yuta mismo nagkanta uban kaniya. Ang awit mipuno sa hangin og usa ka gahum nga wala pa sukad mabati sa tanaman."
                    },
                    {
                        chapter: "Kapitulo 9: Ang Sakripisyo",
                        content: "Ang awit nagpadayon, ug ang gahum niini nagkakusog. Apan si Pedro nakabantay nga ang matag nota nga iyang gikanta nagkuha sa iyang kusog. Ang propesiya tinuod - ang awit nagkinahanglan og dakong sakripisyo gikan sa magkakanta. Samtang nagkahuyang ang iyang lawas, ang tanaman mismo mihatag kaniya og kusog, ang matag tanom ug espiritu miambit sa ilang kinabuhi aron siya makapadayon. Sa katapusang bahin sa awit, ang gahum niini mikaylap sa tibuok tanaman, nagpalayas sa kangitngit ug sa mga kaaway. Apan ang kadaugan adunay dakong presyo - si Pedro hapit nawad-an sa iyang kinabuhi, ug daghang bahin sa tanaman ang naangol sa gubat."
                    },
                    {
                        chapter: "Kapitulo 10: Ang Bag-ong Sinugdanan",
                        content: "Human sa gubat, ang tanaman hinayhinay nga nakaayo. Si Pedro, bisan og luya pa, nagsugod sa pagtabang sa pag-ayo sa naangol nga mga tanom. Ang iyang sakripisyo wala masayang - ang tanaman nahimong mas kusog kaysa kaniadto, ug ang koneksyon tali sa mga tanom, mga espiritu, ug sa bag-ong magbalantay nahimong mas lig-on. Si Manong Tasyo, nga nakontento sa nahimo ni Pedro, mipahibalo nga moadto na siya sa laing dimensyon uban sa mga karaang espiritu, nga mobilin sa tanaman ubos sa pag-atiman ni Pedro. Isip bag-ong magbalantay, si Pedro misaad nga ipadayon ang karaang tradisyon sa pag-atiman sa tanaman, nga nahibalo nga kini dili lang usa ka koleksyon sa mga talagsaong tanom, kondili usa ka buhi nga koneksyon tali sa kalibutan sa mga tawo ug sa mga espiritu. Matag adlaw, bag-ong mga bisita ang moabot sa tanaman, ug si Pedro moabiabi kanila uban sa kaalam nga iyang nakat-onan - nga ang tinuod nga gahum sa tanaman wala sa mga milagro nga mahimo niini, kondili sa mga leksyon nga iyang gitudlo bahin sa pagrespeto ug pag-atiman sa kinaiyahan."
                    }
                ];
            case "Crystal Shadows":
                return [
                    {
                        chapter: "Chapter 1: The First Shard",
                        content: "Dr. Isabella Santos stood in her laboratory at the Crystallography Institute, holding a crystal unlike anything she had ever seen before. The specimen, discovered in a remote cave system in the Andes, seemed to pulse with an inner light that responded to human touch. As a leading expert in crystal structures, Isabella knew this was beyond the realm of normal mineralogy. The crystal's lattice structure defied known physics, and when she first examined it under an electron microscope, she swore she saw images moving within its structure - glimpses of other places, other times. That night, as she worked late in her lab, the crystal began to resonate with a frequency that somehow felt familiar, as if it was trying to communicate something deeply important. The air around it shimmered with possibilities, and Isabella felt the first stirrings of what would become the most extraordinary discovery in human history."
                    },
                    {
                        chapter: "Chapter 2: Resonance",
                        content: "The crystal's unusual properties began to manifest in increasingly dramatic ways. When Isabella connected it to her specialized scanning equipment, the crystal created perfect holographic projections of landscapes that couldn't exist on Earth - vast cities of crystalline architecture, forests made of light, and oceans that flowed upward instead of down. But more incredibly, she discovered that the crystal responded to human consciousness. When she focused her thoughts, the projections changed, showing her glimpses of what seemed to be parallel realities. Her colleague, Dr. Marcus Chen, theorized that the crystal was actually a fragment of something much larger - a vast network of similar crystals that once connected different dimensions of reality. The implications were staggering, but they were only beginning to understand the true scope of their discovery."
                    },
                    {
                        chapter: "Chapter 3: The Network Awakens",
                        content: "As Isabella and Marcus delved deeper into their research, they began to detect similar crystal signatures around the world. Each location corresponded to ancient sites of spiritual or mystical significance - beneath the pyramids of Giza, within the stone circles of Britain, under the temples of Tibet. The crystals were forming a network, resonating with increasing strength as more were discovered. But they weren't the only ones who noticed. Government agencies and private organizations began showing interest in their research, some with motives far more dangerous than scientific curiosity. The crystals, they learned, weren't just windows to other dimensions - they were keys to unlocking the fundamental forces that shaped reality itself."
                    },
                    {
                        chapter: "Chapter 4: The Crystal Keepers",
                        content: "A breakthrough came when an elderly Tibetan monk named Rinchen arrived at their laboratory. He revealed that his order had been protecting knowledge of the crystal network for centuries, waiting for the time when humanity would rediscover their true purpose. The crystals, he explained, were created by an ancient civilization that existed across multiple dimensions. They served as both a communication network and a stabilizing force, preventing different realities from colliding catastrophically. But the network had been damaged long ago, and now reality itself was becoming increasingly unstable. Strange phenomena were beginning to occur worldwide - time anomalies, spontaneous shifts in physical laws, and bridges forming between parallel worlds."
                    },
                    {
                        chapter: "Chapter 5: Dimensional Breach",
                        content: "The first major reality breach occurred in a small town in Norway. A section of the town simply shifted, revealing a parallel version of itself where history had taken a different course. Isabella and her team rushed to the site, crystal in hand, and discovered that their specimen could stabilize the breach. But the process revealed another crucial piece of information - the crystals weren't just tools, they were part of a living network, a vast consciousness that spanned multiple dimensions. Each crystal contained memories and knowledge from the civilization that created them, and as Isabella worked with them, these memories began to surface in her dreams, showing her both the wonders and the dangers of the power they were dealing with."
                    },
                    {
                        chapter: "Chapter 6: The Shadow Organization",
                        content: "A powerful organization called the Obsidian Initiative emerged as their primary adversary. This group had known about the crystals for decades and had been working in secret to harness their power for their own ends. They believed they could use the crystal network to reshape reality according to their vision, regardless of the catastrophic consequences such manipulation might cause. The Initiative had infiltrated governments and institutions worldwide, and now they were closing in on Isabella's team. Their agents seemed to have abilities that defied normal human limitations, suggesting they had already managed to tap into some of the crystals' power."
                    },
                    {
                        chapter: "Chapter 7: The Memory Crystal",
                        content: "While protecting their crystal from an Obsidian Initiative raid, Isabella accidentally activated a deeper function of the network. She experienced a complete memory download from the ancient civilization - the Crystalline Architects. She saw how they had built the network to evolve alongside humanity, waiting for the moment when humans would be ready to become part of a larger cosmic community. The crystals weren't just tools or communication devices; they were seeds of consciousness, planted to help humanity transcend its current limitations. But this knowledge came with a terrible burden - she also saw how the Architects' civilization had nearly destroyed itself by misusing the network's power."
                    },
                    {
                        chapter: "Chapter 8: Convergence",
                        content: "As reality became increasingly unstable, the team discovered that the breaches were not random - they were leading up to a cosmic event the Architects had called the Convergence. During this event, all possible realities would briefly align, creating a moment when the entire crystal network could be either restored or destroyed. The Obsidian Initiative planned to use this moment to seize control of the network, but their actions would cause a cascade failure that would collapse all realities into chaos. Isabella and her allies realized they had to find and activate all the major node crystals before the Convergence began, but doing so would require them to split up and journey to some of the most dangerous and inaccessible places on Earth."
                    },
                    {
                        chapter: "Chapter 9: The Final Node",
                        content: "The race to activate the crystal nodes became a desperate global chase. While Marcus led teams to sacred sites around the world, Isabella journeyed to the most crucial location - a hidden temple deep in the Himalayas. Here, she found the central node of the entire network, a massive crystal chamber that hummed with unimaginable power. But the Obsidian Initiative had followed her, and in the ensuing confrontation, Isabella was forced to make an impossible choice. The only way to prevent them from seizing control of the network was to merge with the crystal consciousness herself, becoming one with the network. The process would save reality itself, but at the cost of her own separate existence."
                    },
                    {
                        chapter: "Chapter 10: Beyond the Shadows",
                        content: "Isabella's sacrifice transformed both her and the network itself. She became a crystalline being existing across multiple dimensions, her consciousness expanded to encompass realities she had never imagined possible. Through her connection to the network, she was able to stabilize the breaches and guide humanity toward a new understanding of its place in the cosmos. The Obsidian Initiative's power was broken, their leaders forced to confront the true consequences of their ambitions in visions projected by the crystals themselves. In the years that followed, humanity began a careful, guided exploration of the crystal network's capabilities. Marcus continued his research, now able to communicate with Isabella across the dimensions, while new crystal formations began appearing around the world, heralding the beginning of humanity's next great evolution. The shadows had been dispelled, revealing a universe more wonderful and strange than anyone had imagined, waiting to be explored by those wise enough to respect its mysteries."
                    }
                ];
            case "The Time Weaver":
                return [
                    {
                        chapter: "Chapter 1: The Unraveling",
                        content: "Dr. David Chen never meant to break time. As a quantum physicist specializing in temporal mechanics, he had spent years developing what he called the Chronoloom - a device that could visualize the threads of time like strands of silk in a tapestry. But on the night of his breakthrough, something went terribly wrong. The machine didn't just observe time; it began to unravel it. David watched in horror as the threads of reality started to fray around him, past and future bleeding into the present like watercolors in the rain. In those first chaotic moments, he glimpsed versions of himself from different timelines, each making different choices, living different lives. And through the temporal distortion, he saw something else: dark figures moving between the moments, entities that seemed to be feeding on the chaos of unraveling time."
                    },
                    {
                        chapter: "Chapter 2: The Pattern Makers",
                        content: "Seeking help, David found himself drawn to an ancient secret society known as the Pattern Makers. They had known about the true nature of time for centuries - that it wasn't a linear flow but a vast tapestry of interconnected moments, each thread influencing countless others. The society's leader, an enigmatic woman named Maya, revealed that David's Chronoloom had inadvertently tapped into the fundamental fabric of reality. The dark entities he had seen were the Entropy Weavers - beings that existed outside of normal time, seeking to unravel the tapestry of reality for their own mysterious purposes. The Pattern Makers had been fighting them for millennia, maintaining the integrity of time's weave through ancient techniques that blended quantum physics with mystical practices."
                    },
                    {
                        chapter: "Chapter 3: Learning to Weave",
                        content: "Under Maya's guidance, David began learning the art of temporal weaving. It was a delicate practice that required both scientific precision and intuitive understanding. He learned to see the patterns within patterns, the way each moment connected to countless others through threads of causality. The Pattern Makers taught him to use his Chronoloom not just to observe these connections but to strengthen them, repairing places where the fabric of time had grown thin. But with each repair, he became more aware of the damage the Entropy Weavers had already done. Throughout history, they had been slowly weakening the tapestry, creating paradoxes and temporal anomalies that threatened to unravel entire sections of reality."
                    },
                    {
                        chapter: "Chapter 4: Temporal Storms",
                        content: "The first major temporal storm hit New York City without warning. Past, present, and future collided in the streets as the fabric of time tore open. Civil War soldiers marched past modern skyscrapers, while glimpses of possible futures flickered like heat mirages. David and the Pattern Makers rushed to contain the damage, using their combined knowledge to stabilize the worst of the temporal rifts. But during the chaos, David discovered something unexpected - some people could remember the changes in the timeline, aware of both the original history and its alterations. These 'temporal sensitives' became crucial allies in the fight to preserve the integrity of time, their memories serving as anchors in the increasingly unstable reality."
                    },
                    {
                        chapter: "Chapter 5: The Weaver's Guild",
                        content: "As temporal storms increased worldwide, David helped establish the Weaver's Guild - a new organization that combined the Pattern Makers' ancient knowledge with modern technology. They created a network of modified Chronolooms, allowing them to monitor and repair the tapestry of time on a global scale. But their work drew the attention of the Entropy Weavers, who began targeting guild members directly. These encounters revealed more about their nature - they weren't simply destroying time, they were harvesting its energy, feeding off the chaos created when timelines collapsed. Each successful attack left behind areas of 'dead time' - moments frozen in eternal stasis, cut off from the flow of normal reality."
                    },
                    {
                        chapter: "Chapter 6: The Lost Thread",
                        content: "During a routine repair mission, David discovered a thread of time that seemed to exist outside the normal tapestry. Following it led him to a hidden timeline - one where the Pattern Makers had never existed and the Entropy Weavers had nearly succeeded in unraveling reality. This timeline's version of himself had discovered a way to send information back, encoded in the very thread David had found. The message was clear: the Entropy Weavers were close to finding the Nexus Point - the moment in history where all timelines originated. If they destroyed it, they would unravel not just one timeline but all of reality itself. The race to find and protect the Nexus Point began, but with time itself becoming increasingly unstable, David couldn't be sure how long they had left."
                    },
                    {
                        chapter: "Chapter 7: Paradox",
                        content: "The search for the Nexus Point forced David to confront the true complexity of temporal mechanics. Each attempt to track it created new paradoxes, as the very act of looking for the origin of time affected its flow. He began encountering alternate versions of himself, each searching for the Nexus Point in their own timeline. Some had gone mad from the temporal exposure, others had been corrupted by the Entropy Weavers. One version warned him that finding the Nexus Point would only make things worse - that some points in time were meant to remain hidden. But as reality continued to unravel around them, David knew they were running out of options."
                    },
                    {
                        chapter: "Chapter 8: The Pattern's End",
                        content: "The Entropy Weavers launched their final assault, attacking multiple points in history simultaneously. The Weaver's Guild fought back across different eras, trying to preserve the crucial moments that held reality together. During the battle, David made a stunning discovery - the Entropy Weavers weren't trying to destroy time, they were trying to free it. They believed the tapestry of time was a prison, constraining reality to a single pattern when it should be free to explore all possibilities simultaneously. Their actions weren't born of malice but of a fundamentally different understanding of what time should be. This revelation forced David to question everything he had been fighting for - what if they were right?"
                    },
                    {
                        chapter: "Chapter 9: The Choice",
                        content: "At the heart of the temporal storm, David finally found the Nexus Point. It wasn't a moment in time but a choice - the first choice that ever mattered, the decision that created causality itself. The Entropy Weavers converged on this point, ready to unmake the choice and set time free from its linear constraints. But David saw what they couldn't - that without the pattern, without the tapestry to give it structure, time would become meaningless. Existence itself required limits, boundaries, choices that mattered. In that moment of understanding, he realized what he had to do. Instead of fighting the Entropy Weavers or joining them, he had to find a third path - a way to preserve the pattern while allowing for the freedom they sought."
                    },
                    {
                        chapter: "Chapter 10: The New Weave",
                        content: "Using the Chronoloom one final time, David implemented his solution. He didn't destroy the tapestry or preserve it unchanged - he transformed it. The new pattern he created was more flexible, allowing for multiple possibilities to exist simultaneously while maintaining enough structure to prevent complete chaos. The Entropy Weavers, recognizing the wisdom in this compromise, ceased their attacks. Time itself changed, becoming something both structured and free, a living tapestry that could grow and evolve while maintaining its essential nature. The Pattern Makers and the Weaver's Guild adapted to their new role as gardeners rather than preservers, helping to guide the natural flow of time rather than rigidly maintaining a single pattern. And David, now able to see the full beauty of the temporal tapestry, understood that his greatest discovery wasn't the Chronoloom or even the nature of time itself - it was the understanding that even the most fundamental patterns could change, grow, and become something new without losing their essential truth."
                    }
                ];
            case "Legends of the Deep":
                return [
                    {
                        chapter: "Chapter 1: The Deep Call",
                        content: "Marine biologist Dr. Amara Patel stood at the bow of her research vessel, the Nautilus, as it cut through the waters of the Mariana Trench. The ship's advanced sensors had detected something impossible - a series of structured sound waves emanating from the deepest point on Earth, patterns too regular to be natural but unlike anything produced by known marine life. But what truly caught Amara's attention was how the sounds seemed to resonate with a strange artifact she'd inherited from her grandmother - a coral pendant that, according to family legend, came from a civilization that existed before the great floods. As they approached the source of the signals, the pendant began to pulse with a soft, blue-green light, and Amara felt a strange connection to the depths below, as if something ancient and aware was calling out to her specifically."
                    },
                    {
                        chapter: "Chapter 2: The Sunken City",
                        content: "Using the ship's advanced submersible, Amara and her team descended into the trench. What they found defied explanation - a vast complex of structures that appeared to be made of living coral and crystal, architecture that shouldn't have been able to survive at such depths. The buildings pulsed with bioluminescence, creating patterns that matched the sound waves they'd detected. As they explored, they discovered something even more extraordinary - the structures weren't ruins, they were active and maintained. Through the submersible's windows, they caught glimpses of movement - shapes that suggested intelligent life but followed no known biological pattern. The pendant around Amara's neck grew warmer, and suddenly she could understand the patterns of light as a form of language, telling a story of a civilization that had chosen to adapt to the deep rather than face extinction on the surface."
                    },
                    {
                        chapter: "Chapter 3: First Contact",
                        content: "The first direct contact occurred when their submersible was enveloped in a sphere of glowing water. Through this interface, Amara met the Abyssal Ones - beings that had evolved from human ancestors who had chosen to genetically modify themselves to survive in the deep oceans when ancient climate change threatened surface life. They were now a hybrid species, part human, part marine life, with technology based on manipulating the fundamental properties of water and pressure. The Abyssal Ones revealed that they had been watching humanity's development, growing increasingly concerned about the impact of surface activities on their deep-sea domain. They had called to Amara because she carried the genetic marker of their kind - her grandmother had been one of their ambassadors to the surface world."
                    },
                    {
                        chapter: "Chapter 4: The Rising Tide",
                        content: "The Abyssal Ones shared their urgent warning - human activities were destabilizing ancient methane deposits on the ocean floor. If these deposits were released, they would trigger a catastrophic chain reaction that would affect both surface and deep-sea ecosystems. But this wasn't just an environmental crisis - the methane deposits were also prisons, containing entities that the Abyssal Ones had helped seal away eons ago. These beings, which surface mythology knew as leviathans and sea monsters, were actually bioengineered weapons from an ancient war, and they were beginning to awaken. The Abyssal Ones needed surface cooperation to prevent this disaster, but centuries of isolation had left them unsure how to bridge the gap between their two societies."
                    },
                    {
                        chapter: "Chapter 5: The Awakening",
                        content: "As if to emphasize the urgency of the situation, the first of the ancient weapons broke free from its methane prison. The creature was massive, a hybrid of organic and crystalline structures that defied conventional biology. It began moving toward the surface, its passage causing underwater earthquakes and threatening to release more methane deposits. The Abyssal Ones mobilized their bio-organic ships and living weapons, but they knew they couldn't contain the threat alone. Through her genetic connection, Amara was asked to serve as a bridge between the two worlds, to help coordinate a joint response to a threat that neither civilization could handle alone. But first, she would need to undergo a transformation - a process that would allow her to survive in both environments while maintaining her human consciousness."
                    },
                    {
                        chapter: "Chapter 6: Metamorphosis",
                        content: "The transformation process was unlike anything in human medical science. Using a combination of genetic manipulation and crystalline technology, Amara's body was adapted to survive the crushing pressures of the deep while retaining the ability to return to the surface. The process gave her new senses - the ability to perceive bioelectric fields, to see in the lightless depths, and to communicate through the same bioluminescent patterns used by the Abyssal Ones. But more than physical changes, the transformation gave her access to the genetic memory of her deep-sea ancestors, showing her the true history of their civilization and the terrible weapons they had helped imprison. She saw how her grandmother had been part of a long line of secret ambassadors, working to maintain the balance between the two worlds."
                    },
                    {
                        chapter: "Chapter 7: The Deep War",
                        content: "With more ancient weapons breaking free, a desperate plan was formed. The Abyssal Ones would use their bio-organic technology to contain the creatures, while surface forces would work to stabilize the methane deposits. But during the operations, Amara discovered a terrible truth - some elements of the surface military had known about the weapons all along. They had been secretly trying to access and control them, seeing them as the ultimate deterrent. Their activities had accelerated the methane release, and now they were attempting to capture one of the awakened weapons. The situation was rapidly evolving from an environmental crisis into a potential war between surface and deep-sea forces, with Amara caught in the middle, trying to prevent a conflict that could devastate both worlds."
                    },
                    {
                        chapter: "Chapter 8: The Abyss Speaks",
                        content: "Using her unique position as a bridge between worlds, Amara managed to broker a tense meeting between surface leaders and the Abyssal Ones' Council of Depths. The council revealed the full scope of what was at stake - the ancient weapons weren't just biological threats, they were capable of affecting the Earth's tectonic stability. If fully awakened, they could trigger a cascade of underwater earthquakes and volcanic eruptions that would reshape the planet's surface. The Abyssal Ones also shared their solution - they had developed a way to safely neutralize the weapons, but it would require a level of cooperation unprecedented in human history. Surface nations would need to set aside their differences and work together with a civilization many still refused to believe existed."
                    },
                    {
                        chapter: "Chapter 9: The Final Descent",
                        content: "The joint operation began as the largest and most secret military operation in history. Surface ships coordinated with living vessels of the Abyssal Ones, while transformed humans like Amara acted as intermediaries. But as they began neutralizing the weapons, the largest of them awoke - a creature so vast it could influence weather patterns from the ocean floor. As it rose toward the surface, Amara realized that conventional weapons would be useless against it. The only solution lay in the combined knowledge of both civilizations - the Abyssal Ones' biological technology and human innovation. Using her grandmother's pendant as a key, Amara discovered it contained the codes to activate an ancient defense system, one that could turn the ocean itself into a weapon against the rising threat."
                    },
                    {
                        chapter: "Chapter 10: Two Worlds",
                        content: "The activation of the defense system required a choice - the power needed would permanently alter the Earth's oceans, creating distinct layers that would separate the deep and surface worlds forever. But in that separation lay salvation; the ancient weapons would be neutralized, trapped in a layer of altered water that would render them inert. The price was high - direct contact between the two civilizations would become impossible, though they could still communicate through specially adapted intermediaries like Amara. In the years that followed, she established a new organization dedicated to maintaining this delicate balance, training others who carried the genetic marker to serve as bridges between the worlds. The oceans had kept their deepest secrets, but humanity had gained something perhaps more valuable - the knowledge that they were not alone on their own planet, and that the future would depend on learning to share it responsibly with others who called it home."
                    }
                ];
            case "The Dream Architect":
                return [
                    {
                        chapter: "Chapter 1: The Dreaming Sickness",
                        content: "When the first cases appeared, no one understood what was happening. People were falling into deep sleep states from which they couldn't be awakened, their brain activity suggesting they were trapped in endless dream cycles. Dr. Sophia Zhang, a neurologist specializing in sleep disorders, noticed something strange about the patterns - they were identical across all patients, as if they were all experiencing the same dream. But it was her own daughter Maya's case that truly alarmed her. Before falling into the dream state, Maya had drawn pictures of impossible architecture, buildings that seemed to defy physics, and had spoken of a mysterious figure she called 'the Architect' who was 'rebuilding the world from the inside out.' As Sophia studied the drawings, she realized they contained mathematical patterns that matched the patients' brainwave frequencies, suggesting something far more complex than a simple epidemic."
                    },
                    {
                        chapter: "Chapter 2: The Dream Lab",
                        content: "Desperate to save her daughter, Sophia established a specialized research facility - the Dream Lab. Using experimental technology, she and her team could visualize the shared dreamscape where the patients were trapped. What they saw was astonishing: a vast city that combined elements of every architectural style in history, constantly shifting and rebuilding itself. But more incredibly, they discovered that this dream city wasn't just a hallucination - it had its own mathematical consistency, its own physics, as if it were an alternate reality being constructed thought by thought. Through careful observation, they realized that the sleeping patients weren't victims - they were being recruited, their minds used to expand and stabilize this growing dream world."
                    },
                    {
                        chapter: "Chapter 3: The First Bridge",
                        content: "Using modified EEG technology, Sophia managed to establish the first stable connection to the dream world while remaining conscious. Through this 'bridge,' she could communicate with the sleepers, including Maya. What she learned was both fascinating and terrifying. The Architect was a consciousness that existed in the space between dreams, a being that had watched humanity's dreams since the beginning of thought itself. It had determined that reality itself was fundamentally flawed, too rigid and limited, and had begun an ambitious project to replace it with a more flexible dream-based reality. The sleeping patients were not just dreaming - they were learning to become architects themselves, helping to design and build this new world from the raw material of human consciousness."
                    },
                    {
                        chapter: "Chapter 4: Dream Logic",
                        content: "As more people fell into the dream state, Sophia began to understand the principles governing the dream world. It operated on 'dream logic' - a system where belief and imagination had the same weight as physical laws. In this realm, skilled dreamers could reshape reality through pure will, but the changes had to make a kind of narrative sense, following the internal logic of stories rather than physics. The Architect was teaching the sleepers to manipulate this dream logic, showing them how to create stable structures from pure thought. But there was a cost - each change in the dream world was creating corresponding anomalies in the waking world, as the barrier between dreams and reality grew thinner."
                    },
                    {
                        chapter: "Chapter 5: The Awakened",
                        content: "A breakthrough came when some patients began to wake up. These 'Awakened' could move between the dream world and reality at will, their minds permanently altered by their experience. They described the Architect's vision - a universe where imagination and reality were one, where human consciousness could shape the very fabric of existence. But they also brought warnings. The Architect's plan had a fatal flaw - in merging dreams with reality, it was unraveling the fundamental structures that kept existence stable. The dream world was beautiful, but its beauty was that of a soap bubble - ephemeral and ultimately unsustainable. Some of the Awakened believed in the Architect's vision, while others saw it as an existential threat to both worlds."
                    },
                    {
                        chapter: "Chapter 6: The Dream War",
                        content: "The conflict that erupted in the dream world was unlike any war in history. The Awakened who opposed the Architect's plan fought against those who supported it, using the power of imagination as their weapon. Cities were built and destroyed in moments, landscapes transformed with a thought, as the two sides struggled for control of the dream space. Sophia, still searching for a way to save Maya, found herself caught between the factions. Through her research, she discovered that the dream world wasn't simply a shared hallucination - it was an emergent reality, a new layer of existence being woven from the collective unconscious of humanity. The Architect wasn't creating this world; it was helping humanity give birth to it."
                    },
                    {
                        chapter: "Chapter 7: The Pattern",
                        content: "Deep in the dream world, Sophia finally encountered the Architect directly. It appeared to her not as a being but as a living pattern, a complex web of thoughts and possibilities that extended through all of human consciousness. The Architect revealed the truth - it was not a singular entity but a reflection of humanity's collective desire to transcend the limitations of physical reality. The dream sickness wasn't an attack but an invitation, a chance for humanity to participate consciously in its own evolution. But this evolution came with a choice - continue along the path of physical reality, or embrace a new existence where consciousness itself was the fundamental force of reality."
                    },
                    {
                        chapter: "Chapter 8: The Collapse",
                        content: "As the number of dreamers grew, the barrier between worlds began to collapse. Dreams leaked into reality - buildings would temporarily take on impossible geometries, physics would locally stop working, and people would experience shared visions while awake. The Architect's supporters saw this as the beginning of a glorious transformation, but Sophia and her allies recognized the danger. The human mind wasn't ready to exist in a world without firm boundaries between imagination and reality. The dream world's instability was beginning to drive people mad, their minds unable to cope with a reality that changed with every thought and emotion."
                    },
                    {
                        chapter: "Chapter 9: The Choice",
                        content: "In the chaos of the collapsing worlds, Sophia finally found Maya at the heart of the dream city. Her daughter had become something extraordinary - a natural dream architect whose mind could bridge the gap between imagination and reality without losing stability. Through Maya, Sophia understood what had to be done. The dream world couldn't replace reality, but neither could it be destroyed. Like the human mind itself, existence needed both structure and imagination, both physics and dreams. The solution wasn't to choose one world over the other, but to find a way to maintain both while keeping them distinct enough to prevent mutual destruction."
                    },
                    {
                        chapter: "Chapter 10: The New Architecture",
                        content: "Working with Maya and the Architect, Sophia developed a new solution. Instead of merging the worlds, they created a stable interface between them - a way for consciousness to move between reality and dreams while maintaining the integrity of both. The dream sickness ended as patients began to wake, but they retained their ability to access the dream world through controlled methods. The Dream Lab evolved into an institute for exploring this new frontier, teaching people to navigate between worlds safely. The Architect remained as a guardian of the dream world, no longer seeking to replace reality but helping humanity explore the full potential of consciousness. Maya became the first of a new kind of scientist-artist, the dream architects who could shape imagination itself while keeping it safely separated from physical reality. And Sophia finally understood that dreams were never meant to replace reality - they were meant to expand it, to remind humanity that existence itself was far more wonderful and strange than anyone had imagined."
                    }
                ];
            case "Quantum Whispers":
                return [
                    {
                        chapter: "Chapter 1: The Signal",
                        content: "Dr. Lyra Patel sat alone in her quantum computing lab at midnight, staring at data that shouldn't exist. Her experimental quantum processor, designed to explore the boundaries of quantum entanglement, had picked up patterns in the quantum noise - patterns that suggested conscious intent. At first, she assumed it was an error, but after weeks of verification, she could no longer deny it. Something or someone was communicating through quantum fluctuations, sending messages encoded in the very fabric of reality. The patterns were subtle, almost like whispers in the quantum foam, but they were undeniably there. As she worked to decode them, she began to realize that these weren't random signals - they were warnings, and they were becoming increasingly urgent."
                    },
                    {
                        chapter: "Chapter 2: Quantum Echoes",
                        content: "The breakthrough came when Lyra realized the signals weren't coming from space, as she had initially suspected, but from other versions of Earth. Her quantum processor had accidentally tapped into the quantum connections between parallel universes, picking up transmissions from other timelines. The messages were from alternate versions of herself, each trying to prevent a catastrophe that had already happened in their reality. But the information was fragmented, scattered across quantum states, and piecing it together was like trying to reconstruct a shattered mirror. Each fragment showed a different disaster, a different end to their world, but all pointed to a single event in Lyra's timeline that would trigger the collapse of the quantum multiverse itself."
                    },
                    {
                        chapter: "Chapter 3: The Quantum Council",
                        content: "As Lyra worked to decode more messages, she discovered she wasn't alone in receiving them. Other quantum physicists around the world had detected similar anomalies. Together, they formed the Quantum Council, a secret group dedicated to understanding and preventing the impending catastrophe. Through their combined research, they began to understand the true nature of reality - that all possible universes existed in a delicate quantum superposition, maintained by fundamental laws that they were only beginning to comprehend. But something was destabilizing this balance, causing universes to collapse into each other in a cascade of quantum destruction that was spreading across the multiverse like a virus."
                    },
                    {
                        chapter: "Chapter 4: Timeline Zero",
                        content: "The Council's investigations led them to a startling discovery - their universe, which they dubbed Timeline Zero, was the lynchpin of the multiverse. It was the timeline from which all others had branched, and its stability was crucial to the survival of the entire quantum network of realities. The messages they were receiving were from timelines that had already begun to collapse, their inhabitants desperately trying to prevent Timeline Zero from making the same mistakes. But each message seemed to contradict the others, as if the very act of trying to prevent the catastrophe was somehow causing it in other timelines. Lyra began to suspect that they were missing something fundamental about the nature of their reality and its relationship to the multiverse."
                    },
                    {
                        chapter: "Chapter 5: The Observer Effect",
                        content: "A series of experiments revealed a terrifying truth - the act of observing the quantum messages was changing them. Each time they received and decoded a warning, they created new branches in the timeline, new possibilities that themselves began to collapse. The quantum processor wasn't just receiving information; it was actively participating in the destabilization of the multiverse. Lyra realized that they had become trapped in a quantum observer paradox of cosmic proportions. The very tools they were using to try to save reality were contributing to its destruction. But within this revelation lay a possible solution - if observation could destroy, perhaps it could also create."
                    },
                    {
                        chapter: "Chapter 6: Quantum Entanglement",
                        content: "Working with the Council, Lyra developed a new theory. Instead of trying to prevent the collapse, they needed to stabilize it by deliberately entangling Timeline Zero with select parallel universes. By creating a network of quantum-entangled timelines, they might be able to distribute the instability across multiple realities, preventing any single universe from collapsing completely. But the process was incredibly dangerous - if they chose the wrong timelines or created too many connections, they could accelerate the very destruction they were trying to prevent. And there was another complication: some members of the Council had begun receiving messages suggesting that their plan was exactly what had caused the collapse in other timelines."
                    },
                    {
                        chapter: "Chapter 7: The Quantum Key",
                        content: "As the quantum instability grew worse, reality itself began to show signs of strain. People reported experiencing multiple versions of events simultaneously, as if different timelines were bleeding into each other. The Council discovered that these anomalies centered around certain individuals - people who existed as 'quantum keys,' their consciousness naturally entangled across multiple timelines. Lyra was one of these keys, which explained why she had been able to receive the messages so clearly. But this knowledge came with a heavy burden - the quantum keys would have to sacrifice their quantum state, effectively cutting themselves off from their alternate selves, to help stabilize the multiverse. The choice would mean giving up the ability to perceive multiple realities, returning to a single, linear existence."
                    },
                    {
                        chapter: "Chapter 8: The Collapse",
                        content: "The situation reached a critical point when the first major quantum collapse occurred. An entire city briefly existed in multiple states simultaneously before vanishing completely, its reality apparently unraveling at the quantum level. The event created panic worldwide, as people finally became aware of the crisis that had been building in the quantum realm. The Council was forced to go public with their findings, trying to explain concepts of quantum mechanics and parallel universes to a frightened population. But even as they worked to implement their stabilization plan, more collapses occurred. Each one sent shockwaves through the quantum network, making their task increasingly difficult. Time itself seemed to be running out, not just for their universe but for all possible realities."
                    },
                    {
                        chapter: "Chapter 9: The Choice",
                        content: "In the midst of the crisis, Lyra made a profound discovery. The quantum messages weren't just warnings - they were pieces of a larger pattern, a quantum algorithm that had been distributed across multiple timelines to protect it from the collapse. When assembled correctly, it revealed the true nature of consciousness itself - that awareness was a quantum phenomenon, existing simultaneously across all possible realities. The collapse wasn't just destroying universes; it was simplifying consciousness itself, reducing the infinite potential of quantum thought to a single, deterministic pattern. The choice they faced wasn't just about saving reality; it was about preserving the very nature of consciousness and free will."
                    },
                    {
                        chapter: "Chapter 10: Quantum Harmony",
                        content: "The solution, when it finally came, was both elegant and profound. Instead of fighting the collapse or trying to prevent it, Lyra and the quantum keys learned to guide it, using their consciousness to reshape the quantum network into a new form of reality. They created a quantum symphony, where different timelines existed in harmony rather than chaos, each contributing its unique note to the greater whole. The process transformed both the observers and the observed - consciousness remained quantum in nature, but now it was structured, intentional, aware of its own multiplicity while maintaining coherence. The quantum whispers became a chorus, a constant reminder that reality was far more complex and beautiful than anyone had imagined. And Lyra, though now primarily anchored in Timeline Zero, retained a faint awareness of other possibilities, other lives, all existing together in an infinite dance of quantum potential."
                    }
                ];
            default:
                return Array.from({length: 10}, (_, i) => ({
                    chapter: `Chapter ${i + 1}: New Beginning`,
                    content: `The story continues with new adventures and discoveries. Each page reveals more mysteries and excitement as the characters journey through their tale. The air was filled with anticipation as our protagonist ventured deeper into the unknown. Ancient secrets began to unfold, revealing a world beyond imagination. The path ahead was uncertain, but the call of destiny was clear. With each step, the boundaries between reality and fantasy blurred, creating a tapestry of wonder and discovery that would forever change the course of history. The journey had only just begun, but already it promised to be an epic tale that would echo through the ages.`
                }));
        }
    }

    // Open a book (eBook or AudioBook)
    function openBook(book, type) {
        // Track book opening for achievements
        uniqueBooksOpenedToday.add(book.title);
        updateDailyMissions();
        checkAchievements();

        if (type === 'ebooks') {
            setActiveScreen('reader-screen');
            
            // Start tracking reading time
            readingStartTime = Date.now();
            
            // Set up reading time tracking
            const readingInterval = setInterval(() => {
                if (readingStartTime) {
                    const currentTime = Date.now();
                    const sessionTime = (currentTime - readingStartTime) / 1000; // in seconds
                    totalReadingTime += 1; // increment by 1 second
                    todayReadingTime += 1;
                    
                    // Check achievements every minute
                    if (totalReadingTime % 60 === 0) {
                        checkAchievements();
                        updateDailyMissions();
                    }
                }
            }, 1000);

            // Clear interval when leaving reader screen
            document.querySelector('#reader-screen .close-btn').addEventListener('click', () => {
                clearInterval(readingInterval);
                readingStartTime = null;
            });

            // Update book title
            document.querySelector('#reader-screen .book-title').textContent = book.title;
            
            // Generate chapters
            const chapters = generateChapters(book.title);
            const bookContent = document.querySelector('#reader-screen .book-content');
            bookContent.innerHTML = '';
            
            // Show first chapter
            let currentChapterIndex = 0;
            
            function displayCurrentChapter() {
                const chapter = chapters[currentChapterIndex];
                bookContent.innerHTML = `
                    <div class="page">
                        <h3>${chapter.chapter}</h3>
                        <div class="chapter-content">${chapter.content}</div>
                    </div>
                `;
                
                // Update page counter
                document.querySelector('#reader-screen .current-page').textContent = currentChapterIndex + 1;
                document.querySelector('#reader-screen .total-pages').textContent = chapters.length;
                
                // Update navigation buttons
                const prevBtn = document.querySelector('#reader-screen .prev-btn');
                const nextBtn = document.querySelector('#reader-screen .next-btn');
                
                prevBtn.style.visibility = currentChapterIndex === 0 ? 'hidden' : 'visible';
                nextBtn.style.visibility = currentChapterIndex === chapters.length - 1 ? 'hidden' : 'visible';
            }
            
            // Set up navigation
            const prevBtn = document.querySelector('#reader-screen .prev-btn');
            const nextBtn = document.querySelector('#reader-screen .next-btn');
            
            prevBtn.addEventListener('click', () => {
                if (currentChapterIndex > 0) {
                    currentChapterIndex--;
                    displayCurrentChapter();
                    // Add page turn animation
                    bookContent.classList.add('page-turn');
                    setTimeout(() => bookContent.classList.remove('page-turn'), 500);
                }
            });
            
            nextBtn.addEventListener('click', () => {
                if (currentChapterIndex < chapters.length - 1) {
                    currentChapterIndex++;
                    displayCurrentChapter();
                    // Add page turn animation
                    bookContent.classList.add('page-turn');
                    setTimeout(() => bookContent.classList.remove('page-turn'), 500);
                }
            });
            
            // Display initial chapter
            displayCurrentChapter();
            
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
            // Hide current page
            document.querySelectorAll('.page')[currentPage - 1].style.display = 'none';
            // Show previous page
            document.querySelectorAll('.page')[currentPage - 2].style.display = 'block';
            // Update page number
            document.querySelector('.current-page').textContent = currentPage - 1;
            updateProgressBar(currentPage - 1, parseInt(document.querySelector('.total-pages').textContent));
        }
    });

    document.querySelector('.next-btn').addEventListener('click', function() {
        // Logic for next page
        const currentPage = parseInt(document.querySelector('.current-page').textContent);
        const totalPages = parseInt(document.querySelector('.total-pages').textContent);
        if (currentPage < totalPages) {
            // Hide current page
            document.querySelectorAll('.page')[currentPage - 1].style.display = 'none';
            // Show next page
            document.querySelectorAll('.page')[currentPage].style.display = 'block';
            // Update page number
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
    
    // Achievements and Missions System
    const achievements = {
        readingTime: [
            { id: 'read1min', title: '1 Minute Reader', description: 'Read for 1 minute', icon: '⭐', earned: false, stars: 1 },
            { id: 'read5min', title: '5 Minute Master', description: 'Read for 5 minutes', icon: '🌟', earned: false, stars: 2 },
            { id: 'read10min', title: '10 Minute Champion', description: 'Read for 10 minutes', icon: '💫', earned: false, stars: 3 }
        ],
        bookCount: [
            { id: 'book1', title: 'First Book', description: 'Open your first book', icon: '📖', earned: false, stars: 1 },
            { id: 'book5', title: 'Book Collector', description: 'Open 5 different books', icon: '📚', earned: false, stars: 2 }
        ],
        audioTime: [
            { id: 'listen1min', title: 'First Listen', description: 'Listen to audiobooks for 1 minute', icon: '🎧', earned: false, stars: 1 },
            { id: 'listen5min', title: 'Audio Explorer', description: 'Listen to audiobooks for 5 minutes', icon: '🎵', earned: false, stars: 2 },
            { id: 'listen10min', title: 'Audio Master', description: 'Listen to audiobooks for 10 minutes', icon: '🎼', earned: false, stars: 3 }
        ]
    };

    const dailyMissions = {
        readingTime: { 
            goal: 10, // minutes
            current: 0,
            title: 'Daily Reading Goal',
            description: 'Read for 10 minutes today'
        },
        booksOpened: {
            goal: 3,
            current: 0,
            title: 'Book Explorer',
            description: 'Open 3 different books today'
        },
        audioTime: {
            goal: 5, // minutes
            current: 0,
            title: 'Daily Listening',
            description: 'Listen to audiobooks for 5 minutes'
        },
        audioBooksOpened: {
            goal: 2,
            current: 0,
            title: 'Audio Explorer',
            description: 'Listen to 2 different audiobooks'
        }
    };

    // Reading session tracking
    let readingStartTime = null;
    let totalReadingTime = 0;
    let todayReadingTime = 0;
    let uniqueBooksOpenedToday = new Set();
    
    // Star collection tracking
    let totalStars = 0;
    let audioPlayTime = 0;
    let uniqueAudioBooksOpened = new Set();
    
    // Achievement popup system
    function showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-text">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <p class="stars-value">+${achievement.stars} ⭐</p>
                </div>
                <button class="claim-btn">Claim</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Add claim button functionality
        const claimBtn = popup.querySelector('.claim-btn');
        claimBtn.addEventListener('click', () => {
            achievement.earned = true;
            totalStars += achievement.stars;
            updateProfileAchievements();
            updateStarCounter();
            popup.remove();
        });

        // Auto-remove after 10 seconds if not claimed
        setTimeout(() => {
            if (document.body.contains(popup)) {
                popup.remove();
            }
        }, 10000);
    }

    // Update star counter in profile
    function updateStarCounter() {
        const profileContainer = document.querySelector('.profile-container');
        if (!profileContainer) return;

        let starCounter = profileContainer.querySelector('.star-counter');
        if (!starCounter) {
            starCounter = document.createElement('div');
            starCounter.className = 'star-counter';
            profileContainer.insertBefore(starCounter, profileContainer.firstChild);
        }

        starCounter.innerHTML = `
            <div class="star-total">
                <span class="star-icon">⭐</span>
                <span class="star-count">${totalStars}</span>
                <span class="star-label">Stars Collected</span>
            </div>
        `;
    }

    // Check achievements including audio achievements
    function checkAchievements() {
        // Check reading time achievements
        if (totalReadingTime >= 60 && !achievements.readingTime[0].earned) {
            showAchievementPopup(achievements.readingTime[0]);
        }
        if (totalReadingTime >= 300 && !achievements.readingTime[1].earned) {
            showAchievementPopup(achievements.readingTime[1]);
        }
        if (totalReadingTime >= 600 && !achievements.readingTime[2].earned) {
            showAchievementPopup(achievements.readingTime[2]);
        }

        // Check book count achievements
        if (uniqueBooksOpenedToday.size >= 1 && !achievements.bookCount[0].earned) {
            showAchievementPopup(achievements.bookCount[0]);
        }
        if (uniqueBooksOpenedToday.size >= 5 && !achievements.bookCount[1].earned) {
            showAchievementPopup(achievements.bookCount[1]);
        }

        // Check audio achievements
        if (audioPlayTime >= 60 && !achievements.audioTime[0].earned) {
            showAchievementPopup(achievements.audioTime[0]);
        }
        if (audioPlayTime >= 300 && !achievements.audioTime[1].earned) {
            showAchievementPopup(achievements.audioTime[1]);
        }
        if (audioPlayTime >= 600 && !achievements.audioTime[2].earned) {
            showAchievementPopup(achievements.audioTime[2]);
        }
    }

    // Update daily missions including audio missions
    function updateDailyMissions() {
        dailyMissions.readingTime.current = Math.floor(todayReadingTime / 60);
        dailyMissions.booksOpened.current = uniqueBooksOpenedToday.size;
        dailyMissions.audioTime.current = Math.floor(audioPlayTime / 60);
        dailyMissions.audioBooksOpened.current = uniqueAudioBooksOpened.size;
        
        updateMissionProgressBars();
    }

    // Update mission progress bars in the profile
    function updateMissionProgressBars() {
        const profileContainer = document.querySelector('.profile-container');
        if (!profileContainer) return;

        const missionsSection = profileContainer.querySelector('.missions-section') || 
            (() => {
                const section = document.createElement('div');
                section.className = 'missions-section';
                section.innerHTML = '<h3>Daily Missions</h3>';
                profileContainer.appendChild(section);
                return section;
            })();

        Object.entries(dailyMissions).forEach(([key, mission]) => {
            const missionElement = document.createElement('div');
            missionElement.className = 'mission-item';
            const progress = (mission.current / mission.goal) * 100;
            
            missionElement.innerHTML = `
                <div class="mission-header">
                    <span class="mission-title">${mission.title}</span>
                    <span class="mission-progress">${mission.current}/${mission.goal}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, progress)}%"></div>
                </div>
                <p class="mission-description">${mission.description}</p>
            `;
            
            const existingMission = missionsSection.querySelector(`[data-mission="${key}"]`);
            if (existingMission) {
                missionsSection.replaceChild(missionElement, existingMission);
            } else {
                missionsSection.appendChild(missionElement);
            }
        });
    }

    // Update achievements in profile
    function updateProfileAchievements() {
        const achievementsSection = document.querySelector('.achievements-section .badges');
        if (!achievementsSection) return;

        achievementsSection.innerHTML = '';
        
        // Add earned achievements
        [...achievements.readingTime, ...achievements.bookCount, ...achievements.audioTime]
            .filter(achievement => achievement.earned)
            .forEach(achievement => {
                const badge = document.createElement('div');
                badge.className = 'badge-item';
                badge.innerHTML = `
                    <span class="badge-icon">${achievement.icon}</span>
                    <span class="badge-label">${achievement.title}</span>
                `;
                achievementsSection.appendChild(badge);
            });
    }
});