const videoData = [
    { url: "https://v1.exhibit.st/sample-1.mp4", title: "Future City 2050 #Timnasa" },
    { url: "https://v1.exhibit.st/sample-2.mp4", title: "Robot Dance #Funny" },
    { url: "https://v1.exhibit.st/sample-3.mp4", title: "New Galaxy Discovery 🚀" },
    { url: "https://v1.exhibit.st/sample-4.mp4", title: "AI Life is Real #2050" }
];

const container = document.getElementById('videoContainer');

function loadVideos() {
    container.innerHTML = '';
    videoData.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <video src="${video.url}" autoplay muted loop playsinline></video>
            <div class="side-buttons">
                <span>🤍</span>
                <span>💬</span>
                <span>🔄</span>
            </div>
            <div class="video-info">
                <p>${video.title}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Hii inabadilisha video kila baada ya muda (Simulated Update)
setInterval(() => {
    console.log("Updating content...");
    // Hapa unaweza kuweka kodi ya kuvuta video mpya
}, 10000);

window.onload = loadVideos;
