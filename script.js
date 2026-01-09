// Orodha ya Maudhui (Picha na Maandishi)
const maudhui = [
    { picha: "https://picsum.photos/400/700?random=1", jina: "Maisha ya Mars 2050 #space" },
    { picha: "https://picsum.photos/400/700?random=2", jina: "Teknolojia Mpya ya Timnasa" },
    { picha: "https://picsum.photos/400/700?random=3", jina: "Jinsi ya kutumia Teleportation" },
    { picha: "https://picsum.photos/400/700?random=4", jina: "Funny Robots in 2050 😂" },
    { picha: "https://picsum.photos/400/700?random=5", jina: "Muziki wa Baadaye #2050" },
    { picha: "https://picsum.photos/400/700?random=6", jina: "Safari ya kwenda Mwezin" }
];

const grid = document.getElementById('mainGrid');

// Function ya kutengeneza kadi mara ya kwanza
function tengenezaKadi() {
    grid.innerHTML = ''; // Safisha kwanza
    for (let i = 0; i < 4; i++) {
        const item = maudhui[Math.floor(Math.random() * maudhui.length)];
        grid.innerHTML += `
            <div class="short-card">
                <img src="${item.picha}" class="thumbnail">
                <div class="overlay">
                    <p class="title">${item.jina}</p>
                </div>
            </div>
        `;
    }
}

// Function ya ku-update picha na maandishi
function fanyaUpdate() {
    const kadiZote = document.querySelectorAll('.short-card');
    
    kadiZote.forEach((kadi) => {
        const img = kadi.querySelector('.thumbnail');
        const title = kadi.querySelector('.title');
        const randomData = maudhui[Math.floor(Math.random() * maudhui.length)];

        // Fade out effect
        img.style.opacity = "0";
        
        setTimeout(() => {
            img.src = randomData.picha + "&t=" + new Date().getTime(); // "t" inahakikisha picha inabadilika kweli
            title.innerText = randomData.jina;
            img.style.opacity = "1";
        }, 800);
    });
}

// Anza
tengenezaKadi();
setInterval(fanyaUpdate, 5000); // Kila sekunde 5 inapata update
