const SUPABASE_URL = "https://zqutjbazmvggbuvkegie.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdXRqYmF6bXZnZ2J1dmtlZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDg3MTgsImV4cCI6MjA1OTI4NDcxOH0.Nl2r3k-q8ZqGoPZFukwqECb9uyXCBKMrho-YgcpOLME";
const USER_ID = localStorage.getItem("user_id") || crypto.randomUUID();
localStorage.setItem("user_id", USER_ID);

async function fetchData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/gomyak_data?user_id=eq.${USER_ID}`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    return data.length ? data[0].gomyaks : 0;
}

async function saveData(count) {
    await fetch(`${SUPABASE_URL}/rest/v1/gomyak_data`, {
        method: "upsert",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: USER_ID, gomyaks: count })
    });
}

async function initGame() {
    if (!isMobile()) {
        document.body.innerHTML = "<h2>Игра доступна только на мобильных устройствах. Откройте её на телефоне!</h2>";
        return;
    }

    let count = await fetchData();
    const counterElement = document.getElementById("counter");
    const tapButton = document.getElementById("tap-button");

    counterElement.textContent = count;

    tapButton.addEventListener("click", async () => {
        count++;
        counterElement.textContent = count;
        await saveData(count);
    });
}

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

initGame();
