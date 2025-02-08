let loadingText;
let loadingInterval;

// Show loading screen function
export function showLoadingScreen() {
    if (loadingText) return; // If loading screen exists don't make another one

    loadingText = document.createElement("div");
    loadingText.style.position = "absolute";
    loadingText.style.top = "50%";
    loadingText.style.left = "50%";
    loadingText.style.transform = "translate(-50%, -50%)";
    loadingText.style.fontSize = "24px";
    loadingText.style.color = "white";
    loadingText.style.background = "rgba(0, 0, 0, 0.8)";
    loadingText.style.padding = "20px";
    loadingText.style.borderRadius = "10px";
    loadingText.innerText = "Loading";
    document.body.appendChild(loadingText);

    // Dot animation
    let dotCount = 0;
    loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // 0, 1, 2, 3 (reset)
        loadingText.innerText = "Loading" + ".".repeat(dotCount);
    }, 500);
}

// Hide loading screen function
export function hideLoadingScreen() {
    if (loadingText) {
        clearInterval(loadingInterval);
        document.body.removeChild(loadingText);
        loadingText = null;
    }
}

export function onLoadModelError() {

    if (loadingText) {
        clearInterval(loadingInterval);
            loadingText.innerText = "Error: cannot load models"
    }
}