import {
    auth,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
  } from "./firebase.js";
  
  // Button & UI references
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userNameDisplay = document.getElementById("user-name");
  
  // Login
  loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Logged in as:", user.displayName);
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
      });
  });
  
  // Logout
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Logout failed:", error.message);
      });
  });
  
  // Update UI on login state change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      userNameDisplay.textContent = `Welcome, ${user.displayName}!`;
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      userNameDisplay.textContent = "";
    }
  });
  
  
  // ================== Game Code Below ====================
  
  // Setup canvas
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let fruits = [];
  let score = 0;
  
  // Score UI
  const scoreDisplay = document.getElementById("score");
  
  // Load fruit image
  const fruitImg = new Image();
  fruitImg.src = "assets/fruits/apple.png"; // Make sure this path is correct!
  
  // Fruit constructor
  function Fruit(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  
  // Draw fruit
  Fruit.prototype.draw = function () {
    ctx.drawImage(fruitImg, this.x, this.y, 50, 50);
  };
  
  // Update fruit position
  Fruit.prototype.update = function () {
    this.y += this.speed;
    this.draw();
  };
  
  // Spawn new fruit
  function spawnFruit() {
    const x = Math.random() * (canvas.width - 50);
    const speed = 3 + Math.random() * 2;
    fruits.push(new Fruit(x, 0, speed));
  }
  
  setInterval(spawnFruit, 1000); // every 1 second
  
  // Detect cut (click to cut)
  canvas.addEventListener("click", (e) => {
    for (let i = fruits.length - 1; i >= 0; i--) {
      const fruit = fruits[i];
      if (
        e.offsetX >= fruit.x &&
        e.offsetX <= fruit.x + 50 &&
        e.offsetY >= fruit.y &&
        e.offsetY <= fruit.y + 50
      ) {
        fruits.splice(i, 1); // cut the fruit
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        break;
      }
    }
  });
  
  // Game loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruits.forEach(fruit => fruit.update());
    requestAnimationFrame(animate);
  }
  animate();
  