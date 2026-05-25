document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;


    // Apply Poppins font to the game UI
    
    document.body.style.fontFamily = "Poppins, sans-serif";


    // Game state variables
    let snake = [
        { x: 200, y: 200 },
        { x: 200, y: 220 },
        { x: 200, y: 240 }
    ];
    let direction = { x: 0, y: -20 };
    let chicken = { x: 100, y: 100 };
    let obstacles = [];
    let score = 0;
    let level = 1;
    let lives = 3;
    let speed = 200;
    let chickenEaten = 0;
    let gameInterval;
    let isPaused = false;
    let isGameOver = false;
    
    // Add new prey types with different movement patterns and values
    let prey = [];
    const preyTypes = {
        CHICKEN: { value: 10, speed: 0, movePattern: "stationary", color: "#FF6347" },
        BUNNY: { value: 20, speed: 400, movePattern: "hop", color: "#DDDDDD" },
        DUCK: { value: 15, speed: 300, movePattern: "waddle", color: "#FFCC00" },
        FROG: { value: 30, speed: 600, movePattern: "jump", color: "#66CC66" },
        MOUSE: { value: 25, speed: 250, movePattern: "scurry", color: "#999999" }
    };
    
    

    function drawSnake() {
        ctx.lineWidth = 18;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
    
        for (let i = snake.length - 1; i >= 0; i--) {
            let segment = snake[i];
            let radius = 10;
            
            // Gradient effect for soft glowing body
            let gradient = ctx.createRadialGradient(
                segment.x + radius, segment.y + radius, 5,    
                segment.x + radius, segment.y + radius, 12
            );
            gradient.addColorStop(0, "#ffffff"); // Soft pink center
            gradient.addColorStop(1, "#9966ff "); // Slightly darker pink
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(segment.x + 10, segment.y + 10, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
          // Draw unicorn head
          let head = snake[0];
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(head.x + 10, head.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
  
          // Unicorn horn
          ctx.fillStyle = "gold";
          ctx.beginPath();
          ctx.moveTo(head.x + 10, head.y - 5);
          ctx.lineTo(head.x + 7, head.y - 15);
          ctx.lineTo(head.x + 13, head.y - 15);
          ctx.closePath();
          ctx.fill();
        
        // Eyes
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(head.x + 6, head.y + 6, 3, 0, Math.PI * 2);
        ctx.arc(head.x + 14, head.y + 6, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (cute smile)
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(head.x + 10, head.y + 12, 3, 0, Math.PI);
        ctx.stroke();
    }
    
    // Draw prey based on their type
    function drawPrey() {
        prey.forEach(animal => {
            switch(animal.type) {
                case "CHICKEN":
                    drawChicken(animal);
                    break;
                case "BUNNY":
                    drawBunny(animal);
                    break;
                case "DUCK":
                    drawDuck(animal);
                    break;
                case "FROG":
                    drawFrog(animal);
                    break;
                case "MOUSE":
                    drawMouse(animal);
                    break;
            }
        });
    }

    // Enhanced Chicken Drawing
    function drawChicken(animal) {
        // Chicken body
        ctx.fillStyle = "#FF6347"; // Tomato red color
        ctx.beginPath();
        ctx.ellipse(animal.x + 10, animal.y + 10, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chicken head
        ctx.fillStyle = "#FF4500"; // Darker red for head
        ctx.beginPath();
        ctx.arc(animal.x + 22, animal.y + 7, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Chicken beak
        ctx.fillStyle = "#FFD700"; // Gold color for beak
        ctx.beginPath();
        ctx.moveTo(animal.x + 28, animal.y + 7);
        ctx.lineTo(animal.x + 34, animal.y + 5);
        ctx.lineTo(animal.x + 34, animal.y + 9);
        ctx.closePath();
        ctx.fill();
        
        // Chicken legs
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(animal.x + 7, animal.y + 19, 3, 5);
        ctx.fillRect(animal.x + 13, animal.y + 19, 3, 5);
    }
    
    // Draw Bunny
    function drawBunny(animal) {
        // Bunny body
        ctx.fillStyle = "#DDDDDD"; // Light gray
        ctx.beginPath();
        ctx.ellipse(animal.x + 10, animal.y + 14, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bunny head
        ctx.beginPath();
        ctx.arc(animal.x + 10, animal.y + 6, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Bunny ears
        ctx.fillStyle = "#CCCCCC"; // Slightly darker gray for ears
        ctx.beginPath();
        ctx.ellipse(animal.x + 6, animal.y - 3, 2, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(animal.x + 14, animal.y - 3, 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bunny eyes
        ctx.fillStyle = "#FF0000"; // Red eyes
        ctx.beginPath();
        ctx.arc(animal.x + 7, animal.y + 4, 1.5, 0, Math.PI * 2);
        ctx.arc(animal.x + 13, animal.y + 4, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Bunny tail
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(animal.x + 2, animal.y + 14, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw Duck
    function drawDuck(animal) {
        // Duck body
        ctx.fillStyle = "#FFCC00"; // Yellow
        ctx.beginPath();
        ctx.ellipse(animal.x + 10, animal.y + 12, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Duck head
        ctx.beginPath();
        ctx.arc(animal.x + 20, animal.y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Duck bill
        ctx.fillStyle = "#FF9900"; // Orange
        ctx.beginPath();
        ctx.moveTo(animal.x + 24, animal.y + 8);
        ctx.lineTo(animal.x + 30, animal.y + 6);
        ctx.lineTo(animal.x + 30, animal.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Duck eye
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(animal.x + 22, animal.y + 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Duck feet
        ctx.fillStyle = "#FF9900";
        ctx.beginPath();
        ctx.moveTo(animal.x + 5, animal.y + 20);
        ctx.lineTo(animal.x + 10, animal.y + 24);
        ctx.lineTo(animal.x + 15, animal.y + 20);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw Frog
    function drawFrog(animal) {
        // Frog body
        ctx.fillStyle = "#66CC66"; // Green
        ctx.beginPath();
        ctx.arc(animal.x + 10, animal.y + 10, 9, 0, Math.PI * 2);
        ctx.fill();
        
        // Frog eyes
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(animal.x + 6, animal.y + 5, 4, 0, Math.PI * 2);
        ctx.arc(animal.x + 14, animal.y + 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Frog pupils
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(animal.x + 6, animal.y + 5, 2, 0, Math.PI * 2);
        ctx.arc(animal.x + 14, animal.y + 5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Frog mouth
        ctx.beginPath();
        ctx.moveTo(animal.x + 5, animal.y + 12);
        ctx.lineTo(animal.x + 15, animal.y + 12);
        ctx.stroke();
    }
    
    // Draw Mouse
    function drawMouse(animal) {
        // Mouse body
        ctx.fillStyle = "#999999"; // Gray
        ctx.beginPath();
        ctx.ellipse(animal.x + 10, animal.y + 10, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouse head
        ctx.beginPath();
        ctx.arc(animal.x + 18, animal.y + 8, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouse ears
        ctx.beginPath();
        ctx.arc(animal.x + 16, animal.y + 4, 3, 0, Math.PI * 2);
        ctx.arc(animal.x + 20, animal.y + 4, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouse eyes
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(animal.x + 20, animal.y + 7, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouse tail
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(animal.x + 3, animal.y + 10);
        ctx.lineTo(animal.x - 5, animal.y + 12);
        ctx.stroke();
    }

    // Generate obstacles based on current level
    function generateObstacles() {
        obstacles = [];
        for (let i = 0; i < level * 3; i++) {
            let obstacle;
            do {
                obstacle = {
                    x: Math.floor(Math.random() * 20) * 20,
                    y: Math.floor(Math.random() * 20) * 20
                };
            } while (
                // Ensure obstacles don't overlap with snake or chicken
                snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
                (obstacle.x === chicken.x && obstacle.y === chicken.y)
            );
            obstacles.push(obstacle);
        }
    }

    // Draw obstacles with varying designs based on level
    function drawObstacles() {
        obstacles.forEach((obstacle, index) => {
            // Different obstacle designs for different levels
            if (level <= 3) {
                ctx.fillStyle = "#8B4513"; // Brown rocks
                ctx.fillRect(obstacle.x, obstacle.y, 20, 20);
            } else if (level <= 6) {
                // Tree stumps
                ctx.fillStyle = "#654321";
                ctx.beginPath();
                ctx.ellipse(obstacle.x + 10, obstacle.y + 10, 8, 6, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Sharp thorns
                ctx.fillStyle = "#228B22";
                ctx.beginPath();
                ctx.moveTo(obstacle.x + 10, obstacle.y);
                ctx.lineTo(obstacle.x + 20, obstacle.y + 20);
                ctx.lineTo(obstacle.x, obstacle.y + 20);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    function moveSnake() {
        let gridSize = 20; // Ensure movement is in steps of 20px
        let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        
        // Check if the head is about to teleport
        let teleported = false;
        let teleportOffset = { x: 0, y: 0 };
        
        // Calculate teleport information
        if (head.x < 0) {
            teleported = true;
            teleportOffset.x = canvas.width;
            head.x = canvas.width - gridSize;
        } else if (head.x >= canvas.width) {
            teleported = true;
            teleportOffset.x = -canvas.width;
            head.x = 0;
        }
        
        if (head.y < 0) {
            teleported = true;
            teleportOffset.y = canvas.height;
            head.y = canvas.height - gridSize;
        } else if (head.y >= canvas.height) {
            teleported = true;
            teleportOffset.y = -canvas.height;
            head.y = 0;
        }
        
        // Insert new head position
        snake.unshift(head);
        
        // Check if the snake eats any prey
        let preyEaten = false;
        for (let i = prey.length - 1; i >= 0; i--) {
            if (head.x === prey[i].x && head.y === prey[i].y) {
                score += prey[i].value;
                preyEaten = true;
                prey.splice(i, 1);
                
                // Add more prey if needed
                if (prey.length < level + 1) {
                    spawnPrey();
                }
                
                // Level up after eating 5 prey
                chickenEaten++;
                if (chickenEaten % 5 === 0) {
                    levelUp();
                }
                break;
            }
        }
        
        if (!preyEaten) {
            snake.pop(); // Remove the tail only if not eating
        }
        
        // If the snake teleported, adjust all body segments
        if (teleported) {
            // Create a new snake array with adjusted positions
            let newSnake = [head];
            let shouldTeleport = true;
            
            // Start from the second segment (index 1)
            for (let i = 1; i < snake.length; i++) {
                let segment = { ...snake[i] };
                
                // Only teleport consecutive segments that are on the opposite side
                if (shouldTeleport) {
                    // Check if this segment needs teleporting (it's on the opposite side from the head)
                    let distanceX = Math.abs(segment.x - head.x);
                    let distanceY = Math.abs(segment.y - head.y);
                    
                    if ((teleportOffset.x !== 0 && distanceX > canvas.width/2) || 
                        (teleportOffset.y !== 0 && distanceY > canvas.height/2)) {
                        segment.x += teleportOffset.x;
                        segment.y += teleportOffset.y;
                    } else {
                        shouldTeleport = false;
                    }
                }
                
                newSnake.push(segment);
            }
            
            // Replace the snake array with our adjusted version
            snake = newSnake;
        }
    }
    
    function movePrey() {
        prey.forEach(animal => {
            // Skip movement if it's a stationary prey
            if (animal.movePattern === "stationary") return;
            
            // Move based on movement pattern
            if (animal.moveCounter <= 0) {
                // Time to make a new move
                let moveOptions = [];
                let gridSize = 20;
                
                // Check possible directions
                if (animal.y - gridSize >= 0) moveOptions.push({ x: 0, y: -gridSize }); // up
                if (animal.y + gridSize < canvas.height) moveOptions.push({ x: 0, y: gridSize }); // down
                if (animal.x - gridSize >= 0) moveOptions.push({ x: -gridSize, y: 0 }); // left
                if (animal.x + gridSize < canvas.width) moveOptions.push({ x: gridSize, y: 0 }); // right
                
                // Remove directions that would hit obstacles or snake
                moveOptions = moveOptions.filter(move => {
                    let newX = animal.x + move.x;
                    let newY = animal.y + move.y;
                    
                    // Check if this would hit an obstacle
                    if (obstacles.some(obstacle => obstacle.x === newX && obstacle.y === newY)) {
                        return false;
                    }
                    
                    // Check if this would hit the snake
                    if (snake.some(segment => segment.x === newX && segment.y === newY)) {
                        return false;
                    }
                    
                    return true;
                });
                
                // Different movement patterns
                switch (animal.movePattern) {
                    case "hop":
                        // Bunnies prefer horizontal movement
                        moveOptions = moveOptions.filter(move => move.x !== 0 || moveOptions.length <= 2);
                        animal.moveCounter = Math.floor(Math.random() * 3) + 2; // Stay in place for 2-4 moves
                        break;
                    case "waddle":
                        // Ducks move more predictably
                        if (animal.lastMove && moveOptions.includes(animal.lastMove)) {
                            // 70% chance to continue in same direction
                            if (Math.random() < 0.7) {
                                moveOptions = [animal.lastMove];
                            }
                        }
                        animal.moveCounter = 1;
                        break;
                    case "jump":
                        // Frogs make larger, less frequent moves
                        animal.moveCounter = Math.floor(Math.random() * 5) + 5; // Stay in place for 5-9 moves
                        break;
                    case "scurry":
                        // Mice move frequently and erratically
                        animal.moveCounter = Math.floor(Math.random() * 2) + 1; // Stay in place for 1-2 moves
                        break;
                }
                
                // If there are valid moves, choose one
                if (moveOptions.length > 0) {
                    let move = moveOptions[Math.floor(Math.random() * moveOptions.length)];
                    animal.x += move.x;
                    animal.y += move.y;
                    animal.lastMove = move;
                }
            } else {
                animal.moveCounter--;
            }
        });
    }

    function spawnPrey() {
        // Choose a random prey type based on level (higher levels have more variety)
        let preyKeys = Object.keys(preyTypes);
        let availableTypes = preyKeys.slice(0, Math.min(level, preyKeys.length));
        let chosenType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        let newPrey = {
            x: 0,
            y: 0,
            type: chosenType,
            value: preyTypes[chosenType].value,
            movePattern: preyTypes[chosenType].movePattern,
            moveCounter: Math.floor(Math.random() * 3) + 1,
            lastMove: null
        };
        
        // Find a valid position
        let validPosition = false;
        let attempts = 0;
        while (!validPosition && attempts < 50) {
            newPrey.x = Math.floor(Math.random() * 20) * 20;
            newPrey.y = Math.floor(Math.random() * 20) * 20;
            
            // Check if position overlaps with snake, obstacles or other prey
            let overlapsSnake = snake.some(segment => segment.x === newPrey.x && segment.y === newPrey.y);
            let overlapsObstacles = obstacles.some(obstacle => obstacle.x === newPrey.x && obstacle.y === newPrey.y);
            let overlapsOtherPrey = prey.some(p => p.x === newPrey.x && p.y === newPrey.y);
            
            if (!overlapsSnake && !overlapsObstacles && !overlapsOtherPrey) {
                validPosition = true;
            }
            
            attempts++;
        }
        
        if (validPosition) {
            prey.push(newPrey);
        }
    }

    function levelUp() {
        level++;
        speed = Math.max(100, speed - 10); // Increase speed
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
        generateObstacles();
        
        // Add more prey for higher levels
        while (prey.length < level + 1) {
            spawnPrey();
        }
    }

    function checkCollision() {
        let head = snake[0];
        
        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                resetGame();
                return;
            }
        }
        
        // Obstacle collision
        if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
            resetGame();
        }
    }
    
    function resetGame() {
        lives--;
        if (lives === 0) {
            isGameOver = true;
            
            // Clear the game over element first
            const gameOverElement = document.getElementById("game-over");
            gameOverElement.innerHTML = '';
            
            // Add "GAME OVER" text and OK button
            const gameOverText = document.createElement("div");
            gameOverText.textContent = "GAME OVER";
            gameOverText.style.marginBottom = "10px";
            
            const okButton = document.createElement("button");
            okButton.textContent = "OK";
            okButton.style.padding = "10px 30px";
            okButton.style.fontSize = "20px";
            okButton.addEventListener("click", () => {
                score = 0;
                level = 1;
                lives = 3;
                chickenEaten = 0;
                speed = 200;
                isGameOver = false;
                gameOverElement.classList.remove("show");
                resetGameState();
            });
            
            
            // Create a container for vertical stacking
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
            
            container.appendChild(gameOverText);
            container.appendChild(okButton);
            gameOverElement.appendChild(container);
            
            // Show the game over message
            gameOverElement.classList.add("show");
            
            // Remove the automatic reset
            // (The timeout is removed - player must click OK)
        } else {
            resetGameState();
        }
    }
    
    function resetGameState() {
        snake = [
            { x: 200, y: 200 },
            { x: 200, y: 220 },
            { x: 200, y: 240 }
        ];
        direction = { x: 0, y: -20 };
        generateObstacles();
        
        // Reset prey
        prey = [];
        for (let i = 0; i < level + 1; i++) {
            spawnPrey();
        }
    }

    function gameLoop() {
        if (isPaused || isGameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        movePrey(); // Move all prey animals
        checkCollision();
        drawObstacles();
        drawSnake();
        drawPrey(); // Draw all prey animals
        
        // Update UI
        document.getElementById("score").innerText = `Score: ${score}`;
        document.getElementById("lives").innerText = `Lives: ${lives}`;
        document.getElementById("level").innerText = `Level: ${level}`;
    }

    // Setup prey movement timers
    function setupPreyMovement() {
        // Each prey type has its own movement timer
        Object.keys(preyTypes).forEach(type => {
            if (preyTypes[type].speed > 0) {
                setInterval(() => {
                    if (!isPaused && !isGameOver) {
                        movePrey();
                    }
                }, preyTypes[type].speed);
            }
        });
    }

    // Keyboard controls
    document.addEventListener("keydown", event => {
        // Pause game with P key
        if (event.key === "p" || event.key === "P") {
            togglePause();
            return;
        }

        if (isPaused || isGameOver) return;

        if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -20 };
        if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 20 };
        if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -20, y: 0 };
        if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 20, y: 0 };
    });

    // Pause functionality
    function togglePause() {
        if (isGameOver) return;
        
        isPaused = !isPaused;
        const pauseButton = document.getElementById("pause");
        
        if (isPaused) {
            pauseButton.textContent = "Resume";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        } else {
            pauseButton.textContent = "Pause";
        }
    }

    // Restart and Continue buttons
    document.getElementById("restart").addEventListener("click", () => {
        score = 0;
        level = 1;
        lives = 3;
        chickenEaten = 0;
        speed = 200;
        isPaused = false;
        isGameOver = false;
        document.getElementById("game-over").classList.remove("show");
        resetGameState();
    });

    document.getElementById("continue").addEventListener("click", () => {
        if (lives > 0 && !isGameOver) {
            resetGameState();
        }
    });

    // Pause button
    document.getElementById("pause").addEventListener("click", togglePause);

    // Touch controls for mobile
    document.getElementById("up").addEventListener("click", () => {
        if (!isPaused && !isGameOver && direction.y === 0) direction = { x: 0, y: -20 };
    });

    document.getElementById("down").addEventListener("click", () => {
        if (!isPaused && !isGameOver && direction.y === 0) direction = { x: 0, y: 20 };
    });

    document.getElementById("left").addEventListener("click", () => {
        if (!isPaused && !isGameOver && direction.x === 0) direction = { x: -20, y: 0 };
    });

    document.getElementById("right").addEventListener("click", () => {
        if (!isPaused && !isGameOver && direction.x === 0) direction = { x: 20, y: 0 };
    });

    // Initial setup
    generateObstacles();
    
    // Spawn initial prey
    for (let i = 0; i < level + 1; i++) {
        spawnPrey();
    }
    
    setupPreyMovement();
    gameInterval = setInterval(gameLoop, speed);
});