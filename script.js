let count = 0;

async function searchApp() {
    const appName = document.getElementById('appInput').value;
    const resultArea = document.getElementById('resultArea');
    const loading = document.getElementById('loading');

    if (!appName) return;

    // Show loading
    resultArea.innerHTML = "";
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.maher-zubair.tech/download/apk?id=${encodeURIComponent(appName)}`);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.status === 200) {
            const app = data.result;
            // Update Admin Stats
            count++;
            document.getElementById('searchCount').innerText = count;
            document.getElementById('lastApp').innerText = app.name;

            resultArea.innerHTML = `
                <div class="result-card">
                    <img src="${app.icon}" class="app-icon" alt="icon">
                    <h1 style="margin: 15px 0 5px 0;">${app.name}</h1>
                    <p style="color: var(--play-green); font-weight: 500;">${app.developer}</p>
                    <p style="color: var(--text-sub);">Size: ${app.size} • Verified Safe</p>
                    <a href="${app.downloadLink}" class="download-btn">Install</a>
                    <p style="margin-top: 20px; font-size: 14px; color: var(--text-sub);">
                        This app is compatible with your device.
                    </p>
                </div>
            `;
        } else {
            resultArea.innerHTML = "<p>App not found. Please check the spelling.</p>";
        }
    } catch (error) {
        loading.classList.add('hidden');
        resultArea.innerHTML = "<p>Connection error. Try again later.</p>";
    }
}

// Admin Panel Functions
function showAdmin() { document.getElementById('adminPanel').classList.remove('hidden'); }
function closeAdmin() { document.getElementById('adminPanel').classList.add('hidden'); }
