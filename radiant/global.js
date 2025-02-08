// Loading screen animation
document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const numRows = Math.ceil(window.innerHeight / (window.innerWidth * 0.05));
    const numCols = Math.ceil(window.innerWidth / (window.innerWidth * 0.05));

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.style.left = `${col * 5}vw`;
            square.style.top = `${row * 5}vw`;

            let delay = (col + row) * 100; /* Controls the diagonal wave timing */
            square.style.animationDelay = `${delay}ms`;

            loadingScreen.appendChild(square);
        }
    }

    // Remove the loading screen once all squares are faded out
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        setTimeout(() => {
            loadingScreen.style.display = "none"; /* Fully removes overlay */
        }, 500);
    }, (numRows + numCols) * 100 + 1000); /* Ensures full wave effect completes */
});
