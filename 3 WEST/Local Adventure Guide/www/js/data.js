// Mock data for the Local Adventure Guide app
const mockData = {
    adventures: [
        {
            id: '1',
            title: 'Hidden Waterfall Hike',
            category: 'Hiking',
            description: 'A secluded waterfall trail surrounded by lush forest, perfect for a half-day adventure.',
            fullDescription: 'This hidden gem is a local secret tucked away from the usual tourist paths. The 2.5-mile trail winds through dense forest before revealing a stunning 40-foot waterfall cascading into a crystal-clear pool. The moderate hike takes about 1-2 hours each way with several scenic viewpoints along the route. Bring a swimsuit in summer months as the pool at the base of the falls is perfect for a refreshing dip. Early mornings and weekdays are best to avoid crowds.',
            image: 'img/waterfall.jpg',
            rating: 4.7,
            reviewCount: 132,
            address: 'Cascade Trail, Woodland Park',
            location: {
                latitude: 47.6205,
                longitude: -122.3493
            },
            reviews: [
                {
                    name: 'Sarah J.',
                    date: 'Mar 12, 2025',
                    rating: 5,
                    text: 'Absolutely breathtaking! The waterfall was more impressive than I expected and the trail was well-maintained. Definitely a hidden gem!'
                },
                {
                    name: 'Mike T.',
                    date: 'Feb 28, 2025',
                    rating: 4,
                    text: 'Great hike with rewarding views. Trail gets a bit muddy after rain so wear proper boots. Worth the effort!'
                },
                {
                    name: 'Leila R.',
                    date: 'Jan 15, 2025',
                    rating: 5,
                    text: 'Perfect winter hike! The waterfall was partially frozen which made for incredible photos. Not too crowded this time of year.'
                }
            ]
        },
        {
            id: '2',
            title: 'Submarine Sandwich Museum',
            category: 'Quirky',
            description: 'The world\'s only museum dedicated to the history and art of submarine sandwiches.',
            fullDescription: 'This quirky one-of-a-kind museum celebrates the humble submarine sandwich in all its glory. Opened by local sandwich enthusiast Frank Burdette in 2018, the museum features exhibits on the evolution of the submarine sandwich, regional variations, and interactive displays where visitors can learn about sandwich architecture and construction techniques. Don\'t miss the "Hall of Fame" showcasing record-breaking sandwiches and the historical timeline dating back to Italian immigrants in New Orleans. The gift shop offers sandwich-themed merchandise, and yes, there\'s a small café serving - you guessed it - exceptional submarine sandwiches.',
            image: 'img/sandwich-museum.jpg',
            rating: 4.2,
            reviewCount: 87,
            address: '1224 Breadline Ave, Sandwich District',
            location: {
                latitude: 47.6105,
                longitude: -122.3421
            },
            reviews: [
                {
                    name: 'Doug H.',
                    date: 'Mar 30, 2025',
                    rating: 5,
                    text: 'Who knew sandwiches had such a fascinating history? This place is weird in the best possible way. The sandwich at the café was top-notch too!'
                },
                {
                    name: 'Amy P.',
                    date: 'Mar 22, 2025',
                    rating: 3,
                    text: 'Interesting concept but small museum. Can see everything in about 30 minutes. Good for sandwich enthusiasts I guess?'
                }
            ]
        },
        {
            id: '3',
            title: 'Sky High Treetop Bar',
            category: 'Food',
            description: 'Enjoy craft cocktails and small plates 30 feet above the ground in a converted treehouse.',
            fullDescription: 'Sky High takes dining to new heights - literally. This unique establishment is built around three massive oak trees with various platforms and connecting bridges creating a treehouse village for adults. The main bar area sits 30 feet above ground level, offering spectacular views of the surrounding forest and city skyline in the distance. Specializing in botanical-inspired cocktails and local farm-to-table small plates, the menu changes seasonally to showcase the freshest ingredients. Access is via a spiral staircase or an elevator disguised as a tree trunk. Reservations are strongly recommended, especially for sunset hours when the lighting and atmosphere are at their most magical.',
            image: 'img/treehouse-bar.jpg',
            rating: 4.8,
            reviewCount: 215,
            address: '17 Canopy Road, East Woodland',
            location: {
                latitude: 47.6159,
                longitude: -122.3449
            },
            reviews: [
                {
                    name: 'James W.',
                    date: 'Apr 1, 2025',
                    rating: 5,
                    text: 'Most unique bar I\'ve ever been to! The elderflower gin fizz was incredible and the views at sunset were unbeatable. Worth every penny.'
                },
                {
                    name: 'Tara M.',
                    date: 'Mar 25, 2025',
                    rating: 4,
                    text: 'Atmosphere is amazing but it gets chilly at night even with their heaters. Bring a jacket! Food portions are small but delicious.'
                },
                {
                    name: 'Derek P.',
                    date: 'Mar 18, 2025',
                    rating: 5,
                    text: 'Proposed to my girlfriend here and the staff went above and beyond to make it special. Can\'t recommend highly enough!'
                }
            ]
        },
        {
            id: '4',
            title: 'Underground Art Tunnels',
            category: 'Quirky',
            description: 'A network of old utility tunnels converted into an underground art gallery and performance space.',
            fullDescription: 'Hidden beneath the city streets lies a secret world of art and creativity. These former utility tunnels dating back to the 1940s have been transformed by a collective of local artists into an immersive underground gallery stretching nearly half a mile. The tunnels feature ever-changing murals, light installations, sculpture gardens, and small performance spaces where you might encounter anything from poetry readings to experimental electronic music. The entrance is inconspicuously located behind a vintage vending machine in the back of the Moonbeam Coffee Shop. No photography is allowed to preserve the mysterious atmosphere and respect artists\' work. Open Thursday through Sunday evenings only.',
            image: 'img/art-tunnels.jpg',
            rating: 4.6,
            reviewCount: 164,
            address: 'Below Moonbeam Coffee, 423 Underhill Street',
            location: {
                latitude: 47.6180,
                longitude: -122.3350
            },
            reviews: [
                {
                    name: 'Zoe K.',
                    date: 'Mar 29, 2025',
                    rating: 5,
                    text: 'Mind-blowing experience! I felt like I discovered a secret dimension. The light installation at the end was absolutely magical.'
                },
                {
                    name: 'Brandon T.',
                    date: 'Mar 14, 2025',
                    rating: 4,
                    text: 'Very cool concept and execution. Can get a bit claustrophobic in some sections if you\'re tall. The saxophone player in the echo chamber was incredible.'
                }
            ]
        },
        {
            id: '5',
            title: 'Coastal Tide Pools Trail',
            category: 'Outdoor',
            description: 'A gentle coastline trail with access to diverse tide pools teeming with marine life.',
            fullDescription: 'This accessible 1.2-mile coastal trail offers some of the best tide pooling opportunities in the region. During low tide, visitors can explore a remarkable variety of marine ecosystems containing starfish, sea anemones, hermit crabs, small octopi, and countless other fascinating creatures. Informational signs along the path provide details about the marine life and conservation efforts. The trail itself offers stunning ocean views and several benches for relaxation and wildlife spotting. Check tide charts before visiting as the tide pools are only accessible during low tide periods. Volunteer naturalists offer guided explorations on weekend mornings during summer months.',
            image: 'img/tide-pools.jpg',
            rating: 4.9,
            reviewCount: 247,
            address: 'Marine View Park, Coastal Highway',
            location: {
                latitude: 47.5956,
                longitude: -122.3152
            },
            reviews: [
                {
                    name: 'Linda G.',
                    date: 'Apr 2, 2025',
                    rating: 5,
                    text: 'Perfect family activity! My kids were fascinated by all the sea creatures. We saw a tiny octopus which was the highlight of our trip!'
                },
                {
                    name: 'Robert J.',
                    date: 'Mar 26, 2025',
                    rating: 5,
                    text: 'Spectacular natural experience. Go during a negative tide if possible for the best viewing. The volunteer guide was extremely knowledgeable.'
                },
                {
                    name: 'Mia N.',
                    date: 'Mar 19, 2025',
                    rating: 4,
                    text: 'Beautiful area but gets crowded on weekends. Weekday mornings are much more peaceful. Bring water shoes as the rocks can be slippery.'
                }
            ]
        },
        {
            id: '6',
            title: 'The Secret Bookshelf Café',
            category: 'Food',
            description: 'Enter through a rotating bookshelf to discover a hidden literary café serving themed foods and drinks.',
            fullDescription: 'Literary lovers rejoice at this ingeniously concealed café accessed through a rotating bookshelf in what appears to be a normal bookstore. Once inside, visitors discover a charming space decorated with literary memorabilia, comfortable reading nooks, and tables made from repurposed library card catalogs. The menu features dishes and drinks inspired by famous novels, from "The Great Gatsby" champagne cocktails to "Lord of the Rings" second breakfast platters. All baked goods are made in-house, with the "Plot Twist" pastries changing daily. The café hosts weekly book clubs, author readings, and literary trivia nights. The entrance bookshelf rotates every 30 seconds, so timing your entry is part of the fun.',
            image: 'img/bookshelf-cafe.jpg',
            rating: 4.5,
            reviewCount: 178,
            address: '922 Chapter Lane, Literary District',
            location: {
                latitude: 47.6112,
                longitude: -122.3370
            },
            reviews: [
                {
                    name: 'Thomas R.',
                    date: 'Mar 31, 2025',
                    rating: 5,
                    text: 'Absolute heaven for book lovers! The Sherlock. of cafes, one might say. A place where mysteries unfold between the pages, and the aroma of freshly brewed coffee mingles with the scent of aged paper.'
                }
            ]
        },
        {
            id: '1',
            title: 'Hidden Waterfall Hike',
            category: 'Hiking',
            description: 'A secluded waterfall trail surrounded by lush forest, perfect for a half-day adventure.',
            fullDescription: 'This hidden gem is a local secret tucked away from the usual tourist paths. The 2.5-mile trail winds through dense forest before revealing a stunning 40-foot waterfall cascading into a crystal-clear pool. The moderate hike takes about 1-2 hours each way with several scenic viewpoints along the route. Bring a swimsuit in summer months as the pool at the base of the falls is perfect for a refreshing dip. Early mornings and weekdays are best to avoid crowds.',
            image: 'img/waterfall.jpg',
            rating: 4.7,
            reviewCount: 132,
            address: 'Cascade Trail, Woodland Park',
            location: {
                latitude: 47.6205,
                longitude: -122.3493
            },
            reviews: [
                {
                    name: 'Sarah J.',
                    date: 'Mar 12, 2025',
                    rating: 5,
                    text: 'Absolutely breathtaking! The waterfall was more impressive than I expected and the trail was well-maintained. Definitely a hidden gem!'
                },
                {
                    name: 'Mike T.',
                    date: 'Feb 28, 2025',
                    rating: 4,
                    text: 'Great hike with rewarding views. Trail gets a bit muddy after rain so wear proper boots. Worth the effort!'
                },
                {
                    name: 'Leila R.',
                    date: 'Jan 15, 2025',
                    rating: 5,
                    text: 'Perfect winter hike! The waterfall was partially frozen which made for incredible photos. Not too crowded this time of year.'
                }
            ]
        },
        {
            id: '2',
            title: 'Submarine Sandwich Museum',
            category: 'Quirky',
            description: 'The world\'s only museum dedicated to the history and art of submarine sandwiches.',
            fullDescription: 'This quirky one-of-a-kind museum celebrates the humble submarine sandwich in all its glory. Opened by local sandwich enthusiast Frank Burdette in 2018, the museum features exhibits on the evolution of the submarine sandwich, regional variations, and interactive displays where visitors can learn about sandwich architecture and construction techniques. Don\'t miss the "Hall of Fame" showcasing record-breaking sandwiches and the historical timeline dating back to Italian immigrants in New Orleans. The gift shop offers sandwich-themed merchandise, and yes, there\'s a small café serving - you guessed it - exceptional submarine sandwiches.',
            image: 'img/sandwich-museum.jpg',
            rating: 4.2,
            reviewCount: 87,
            address: '1224 Breadline Ave, Sandwich District',
            location: {
                latitude: 47.6105,
                longitude: -122.3421
            },
            reviews: [
                {
                    name: 'Doug H.',
                    date: 'Mar 30, 2025',
                    rating: 5,
                    text: 'Who knew sandwiches had such a fascinating history? This place is weird in the best possible way. The sandwich at the café was top-notch too!'
                },
                {
                    name: 'Amy P.',
                    date: 'Mar 22, 2025',
                    rating: 3,
                    text: 'Interesting concept but small museum. Can see everything in about 30 minutes. Good for sandwich enthusiasts I guess?'
                }
            ]
        },
        {
            id: '3',
            title: 'Sky High Treetop Bar',
            category: 'Food',
            description: 'Enjoy craft cocktails and small plates 30 feet above the ground in a converted treehouse.',
            fullDescription: 'Sky High takes dining to new heights - literally. This unique establishment is built around three massive oak trees with various platforms and connecting bridges creating a treehouse village for adults. The main bar area sits 30 feet above ground level, offering spectacular views of the surrounding forest and city skyline in the distance. Specializing in botanical-inspired cocktails and local farm-to-table small plates, the menu changes seasonally to showcase the freshest ingredients. Access is via a spiral staircase or an elevator disguised as a tree trunk. Reservations are strongly recommended, especially for sunset hours when the lighting and atmosphere are at their most magical.',
            image: 'img/treehouse-bar.jpg',
            rating: 4.8,
            reviewCount: 215,
            address: '17 Canopy Road, East Woodland',
            location: {
                latitude: 47.6159,
                longitude: -122.3449
            },
            reviews: [
                {
                    name: 'James W.',
                    date: 'Apr 1, 2025',
                    rating: 5,
                    text: 'Most unique bar I\'ve ever been to! The elderflower gin fizz was incredible and the views at sunset were unbeatable. Worth every penny.'
                },
                {
                    name: 'Tara M.',
                    date: 'Mar 25, 2025',
                    rating: 4,
                    text: 'Atmosphere is amazing but it gets chilly at night even with their heaters. Bring a jacket! Food portions are small but delicious.'
                },
                {
                    name: 'Derek P.',
                    date: 'Mar 18, 2025',
                    rating: 5,
                    text: 'Proposed to my girlfriend here and the staff went above and beyond to make it special. Can\'t recommend highly enough!'
                }
            ]
        },
        {
            id: '4',
            title: 'Underground Art Tunnels',
            category: 'Quirky',
            description: 'A network of old utility tunnels converted into an underground art gallery and performance space.',
            fullDescription: 'Hidden beneath the city streets lies a secret world of art and creativity. These former utility tunnels dating back to the 1940s have been transformed by a collective of local artists into an immersive underground gallery stretching nearly half a mile. The tunnels feature ever-changing murals, light installations, sculpture gardens, and small performance spaces where you might encounter anything from poetry readings to experimental electronic music. The entrance is inconspicuously located behind a vintage vending machine in the back of the Moonbeam Coffee Shop. No photography is allowed to preserve the mysterious atmosphere and respect artists\' work. Open Thursday through Sunday evenings only.',
            image: 'img/art-tunnels.jpg',
            rating: 4.6,
            reviewCount: 164,
            address: 'Below Moonbeam Coffee, 423 Underhill Street',
            location: {
                latitude: 47.6180,
                longitude: -122.3350
            },
            reviews: [
                {
                    name: 'Zoe K.',
                    date: 'Mar 29, 2025',
                    rating: 5,
                    text: 'Mind-blowing experience! I felt like I discovered a secret dimension. The light installation at the end was absolutely magical.'
                },
                {
                    name: 'Brandon T.',
                    date: 'Mar 14, 2025',
                    rating: 4,
                    text: 'Very cool concept and execution. Can get a bit claustrophobic in some sections if you\'re tall. The saxophone player in the echo chamber was incredible.'
                }
            ]
        },
        {
            id: '5',
            title: 'Coastal Tide Pools Trail',
            category: 'Outdoor',
            description: 'A gentle coastline trail with access to diverse tide pools teeming with marine life.',
            fullDescription: 'This accessible 1.2-mile coastal trail offers some of the best tide pooling opportunities in the region. During low tide, visitors can explore a remarkable variety of marine ecosystems containing starfish, sea anemones, hermit crabs, small octopi, and countless other fascinating creatures. Informational signs along the path provide details about the marine life and conservation efforts. The trail itself offers stunning ocean views and several benches for relaxation and wildlife spotting. Check tide charts before visiting as the tide pools are only accessible during low tide periods. Volunteer naturalists offer guided explorations on weekend mornings during summer months.',
            image: 'img/tide-pools.jpg',
            rating: 4.9,
            reviewCount: 247,
            address: 'Marine View Park, Coastal Highway',
            location: {
                latitude: 47.5956,
                longitude: -122.3152
            },
            reviews: [
                {
                    name: 'Linda G.',
                    date: 'Apr 2, 2025',
                    rating: 5,
                    text: 'Perfect family activity! My kids were fascinated by all the sea creatures. We saw a tiny octopus which was the highlight of our trip!'
                },
                {
                    name: 'Robert J.',
                    date: 'Mar 26, 2025',
                    rating: 5,
                    text: 'Spectacular natural experience. Go during a negative tide if possible for the best viewing. The volunteer guide was extremely knowledgeable.'
                },
                {
                    name: 'Mia N.',
                    date: 'Mar 19, 2025',
                    rating: 4,
                    text: 'Beautiful area but gets crowded on weekends. Weekday mornings are much more peaceful. Bring water shoes as the rocks can be slippery.'
                }
            ]
        },
        {
            id: '6',
            title: 'The Secret Bookshelf Café',
            category: 'Food',
            description: 'Enter through a rotating bookshelf to discover a hidden literary café serving themed foods and drinks.',
            fullDescription: 'Literary lovers rejoice at this ingeniously concealed café accessed through a rotating bookshelf in what appears to be a normal bookstore. Once inside, visitors discover a charming space decorated with literary memorabilia, comfortable reading nooks, and tables made from repurposed library card catalogs. The menu features dishes and drinks inspired by famous novels, from "The Great Gatsby" champagne cocktails to "Lord of the Rings" second breakfast platters. All baked goods are made in-house, with the "Plot Twist" pastries changing daily. The café hosts weekly book clubs, author readings, and literary trivia nights. The entrance bookshelf rotates every 30 seconds, so timing your entry is part of the fun.',
            image: 'img/bookshelf-cafe.jpg',
            rating: 4.5,
            reviewCount: 178,
            address: '922 Chapter Lane, Literary District',
            location: {
                latitude: 47.6112,
                longitude: -122.3370
            },
            reviews: [
                {
                    name: 'Thomas R.',
                    date: 'Mar 31, 2025',
                    rating: 5,
                    text: 'Absolute heaven for book lovers! The Sherlock Holmes tea service was delightful and I spent hours reading in the cozy window nook.'
                },
                {
                    name: 'Priya M.',
                    date: 'Mar 20, 2025',
                    rating: 4,
                    text: 'Such a creative concept! The entrance is fun but can get congested when busy. Their "Moby Dish" seafood platter was excellent.'
                },
                {
                    name: 'Oliver K.',
                    date: 'Mar 5, 2025',
                    rating: 5,
                    text: 'I attended their Tuesday night poetry slam and was blown away by the talented community. Great atmosphere and the literary cocktails are clever and delicious.'
                }
            ]
        },
        {
            id: '7',
            title: 'Midnight Kayak Bioluminescence Tour',
            category: 'Outdoor',
            description: 'Paddle through waters glowing with natural bioluminescent organisms under the night sky.',
            fullDescription: 'Experience the magic of bioluminescence on this unique nighttime kayaking adventure. As your paddle breaks the water\'s surface, thousands of tiny marine organisms emit a blue-green glow, creating an otherworldly experience often compared to paddling through starlight. This guided 2-hour tour begins 30 minutes after sunset when conditions are darkest. No previous kayaking experience is necessary as expert guides provide full instruction and accompany all groups. The phenomenon is most vivid during summer months and on moonless nights. All equipment including glow-in-the-dark paddles and waterproof phone cases for photography are provided. Advance reservations required as tours frequently sell out.',
            image: 'img/bioluminescence-kayak.jpg',
            rating: 4.9,
            reviewCount: 156,
            address: 'Moonlight Bay Launch, 789 Harbor Drive',
            location: {
                latitude: 47.5876,
                longitude: -122.3220
            },
            reviews: [
                {
                    name: 'Hannah J.',
                    date: 'Apr 1, 2025',
                    rating: 5,
                    text: 'Absolutely magical experience! It truly feels like you\'re paddling through fairy dust. Our guide Kelly was knowledgeable and made everyone feel safe and comfortable.'
                },
                {
                    name: 'David L.',
                    date: 'Mar 22, 2025',
                    rating: 5,
                    text: 'One of the most amazing natural phenomena I\'ve ever witnessed. The photos don\'t do it justice - you have to experience it firsthand. Worth every penny!'
                },
                {
                    name: 'Elena R.',
                    date: 'Mar 10, 2025',
                    rating: 4,
                    text: 'Fantastic tour! Be aware that the brightness of the bioluminescence varies night to night based on conditions. Ours was good but not as bright as some of the photos. Still an unforgettable experience.'
                }
            ]
        },
        {
            id: '8',
            title: 'Vertical Wind Tunnel Skydiving',
            category: 'Adventure',
            description: 'Experience the thrill of skydiving indoors in a state-of-the-art vertical wind tunnel.',
            fullDescription: 'Get the adrenaline rush of skydiving without jumping from a plane at this cutting-edge indoor skydiving facility. The massive vertical wind tunnel generates winds up to 160 mph, creating enough lift to simulate genuine free-fall conditions in a safe, controlled environment. First-time flyers receive comprehensive training and are accompanied by certified instructors who help with body positioning and basic maneuvers. More experienced flyers can practice advanced techniques and aerial stunts. Each flight session lasts approximately 1-2 minutes, equivalent to the free-fall portion of multiple skydives. All necessary gear is provided, including flight suit, helmet, goggles, and earplugs. High-definition videos and photos of your flight are available for purchase.',
            image: 'img/wind-tunnel.jpg',
            rating: 4.7,
            reviewCount: 203,
            address: '450 Updraft Avenue, Innovation District',
            location: {
                latitude: 47.6230,
                longitude: -122.3360
            },
            reviews: [
                {
                    name: 'Marcus T.',
                    date: 'Apr 2, 2025',
                    rating: 5,
                    text: 'Incredible experience! As someone afraid of heights, this was the perfect way to experience "skydiving" without the terrifying plane jump. The instructors were amazing.'
                },
                {
                    name: 'Sophia C.',
                    date: 'Mar 27, 2025',
                    rating: 4,
                    text: 'So much fun! More physically demanding than I expected - my arms are sore today! The 2 minutes goes by very quickly, so I recommend booking a package with multiple flights.'
                },
                {
                    name: 'Jamal W.',
                    date: 'Mar 15, 2025',
                    rating: 5,
                    text: 'Took my teenage kids and they haven\'t stopped talking about it! Our instructor Tony was patient and made sure everyone was comfortable before taking us to higher heights. Worth every penny!'
                }
            ]
        },
        {
            id: '9',
            title: 'Miniature City Museum',
            category: 'Quirky',
            description: 'Explore an incredibly detailed 1:87 scale model of the city complete with working mini-infrastructure.',
            fullDescription: 'This extraordinary museum houses a meticulously crafted miniature version of the entire city at 1:87 scale (HO scale), covering over 2,500 square feet. Developed over 35 years by local model-making enthusiasts, the display features thousands of buildings, vehicles, and tiny citizens. The mini-city includes working street lights, an operational day/night cycle, moving trains, and even flowing water features. Hidden throughout are dozens of intricate scenes depicting local legends and inside jokes that long-time residents will appreciate. Interactive buttons allow visitors to activate various features, from a miniature carnival with moving rides to emergency vehicles responding to a tiny fire. A digital scavenger hunt helps visitors spot the many Easter eggs hidden throughout the display. Special behind-the-scenes tours with the model makers are available monthly by reservation.',
            image: 'img/miniature-city.jpg',
            rating: 4.8,
            reviewCount: 192,
            address: '117 Little Avenue, Downtown',
            location: {
                latitude: 47.6075,
                longitude: -122.3388
            },
            reviews: [
                {
                    name: 'Victor M.',
                    date: 'Mar 30, 2025',
                    rating: 5,
                    text: 'Absolutely mind-blowing attention to detail! I found my actual house and workplace in the model. The tiny crime scene complete with miniature police tape and detectives had me laughing out loud.'
                },
                {
                    name: 'Grace L.',
                    date: 'Mar 23, 2025',
                    rating: 5,
                    text: 'Brought my architecture students here and they were mesmerized. The level of craftsmanship is astounding. We especially loved the historical progression showing how the city has changed over decades.'
                },
                {
                    name: 'Noah P.',
                    date: 'Mar 12, 2025',
                    rating: 4,
                    text: 'Very cool place! My kids were entertained by the interactive elements. Some areas are roped off a bit too far back to see the smallest details, but overall a fantastic experience.'
                }
            ]
        },
        {
            id: '10',
            title: 'Secret Speakeasy Jazz Club',
            category: 'Nightlife',
            description: 'A hidden 1920s-style jazz club accessed through a vintage phone booth in an alley ice cream shop.',
            fullDescription: 'Step back in time at this authentic speakeasy hidden behind an operational ice cream parlor. To enter, guests must locate the vintage telephone booth in the back corner of "Just Scoops" ice cream shop and dial a specific combination on the rotary phone. The back of the booth then slides open to reveal a dimly lit, luxurious jazz club straight out of the prohibition era. The venue features red velvet booths, a polished mahogany bar, and nightly live jazz performances from both established artists and rising stars. Classic cocktails with creative twists are their specialty, with many incorporating house-made infusions and unexpected ingredients. There\'s never a cover charge, but a strict dress code is enforced (smart casual at minimum) and reservations are highly recommended, especially for weekend evenings. The correct entry code changes weekly and is subtly hinted at on their cryptic Instagram account.',
            image: 'img/speakeasy.jpg',
            rating: 4.9,
            reviewCount: 225,
            address: 'Behind Just Scoops, 884 Melody Lane',
            location: {
                latitude: 47.6145,
                longitude: -122.3410
            },
            reviews: [
                {
                    name: 'Rebecca N.',
                    date: 'Apr 2, 2025',
                    rating: 5,
                    text: 'The most atmospheric bar in the city! The hunt to find the entry code is part of the fun. Once inside, the Smoky Old Fashioned and live sax quartet made for a perfect date night.'
                },
                {
                    name: 'Julian R.',
                    date: 'Mar 28, 2025',
                    rating: 5,
                    text: 'Incredible hidden gem. We almost gave up finding it but so glad we persisted. The pianist on Thursdays is world-class and the crowd is sophisticated without being pretentious.'
                },
                {
                    name: 'Vanessa T.',
                    date: 'Mar 16, 2025',
                    rating: 4,
                    text: 'Fantastic cocktails and ambiance. Only giving 4 stars because it gets very crowded and the limited seating means you might be standing all night if you don\'t have reservations.'
                }
            ]
        }
    ],
    categories: [
        {
            id: 'Hiking',
            name: 'Hiking & Trails',
            icon: 'hiking'
        },
        {
            id: 'Quirky',
            name: 'Quirky & Unusual',
            icon: 'magic'
        },
        {
            id: 'Food',
            name: 'Food & Drink',
            icon: 'restaurant'
        },
        {
            id: 'Outdoor',
            name: 'Outdoor Activities',
            icon: 'terrain'
        },
        {
            id: 'Adventure',
            name: 'Adventure & Thrills',
            icon: 'paragliding'
        },
        {
            id: 'Nightlife',
            name: 'Nightlife & Entertainment',
            icon: 'nightlife'
        }
    ],
    featuredCollections: [
        {
            id: 'rainy-day',
            title: 'Perfect for Rainy Days',
            adventures: ['2', '4', '6', '9']
        },
        {
            id: 'locals-favorites',
            title: 'Local Favorites',
            adventures: ['1', '3', '10']
        },
        {
            id: 'outdoor-wonders',
            title: 'Outdoor Wonders',
            adventures: ['1', '5', '7']
        },
        {
            id: 'unique-experiences',
            title: 'Truly Unique Experiences',
            adventures: ['4', '7', '8', '10']
        }
    ],
    userPreferences: {
        favoriteAdventures: ['3', '7', '10'],
        recentlyViewed: ['5', '8', '2', '4'],
        savedForLater: ['1', '6', '9']
    },
    appSettings: {
        defaultRadius: 15, // miles
        notificationsEnabled: true,
        darkModeEnabled: false,
        language: 'en',
        useLocationServices: true
    }
};

export default mockData;