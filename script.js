const SUPABASE_URL = "ТВОЙ_URL"; 
const SUPABASE_KEY = "ТВОЙ_KEY"; 

const USER_ID = localStorage.getItem("user_id") || crypto.randomUUID();
localStorage.setItem("user_id", USER_ID);

async function fetchData() {
    try {
        console.log("Запрос данных с сервера для:", USER_ID);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/gomyak_data?user_id=eq.${USER_ID}`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("Ответ сервера (fetchData):", data);
        return data.length ? data[0].gomyaks : 0;
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return 0;
    }
}

async function saveData(count) {
    try {
        console.log("Отправка данных:", { user_id: USER_ID, gomyaks: count });

        const response = await fetch(`${SUPABASE_URL}/rest/v1/gomyak_data`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            },
            body: JSON.stringify({ user_id: USER_ID, gomyaks: count })
        });

        const result = await response.json();
        console.log("Ответ сервера (saveData):", result);
    } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
    }
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
