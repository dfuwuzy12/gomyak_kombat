const supabaseUrl = "https://zqutjbazmvggbuvkegie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdXRqYmF6bXZnZ2J1dmtlZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDg3MTgsImV4cCI6MjA1OTI4NDcxOH0.Nl2r3k-q8ZqGoPZFukwqECb9uyXCBKMrho-YgcpOLME";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let user_id = null;
let gomyaks = 0;

async function getUser() {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Ошибка получения пользователя:", error.message);
    } else if (user) {
        user_id = user.id;
        loadUserData();
    }
}

async function loadUserData() {
    if (!user_id) return;

    const { data, error } = await supabase
        .from("gomyak_data")
        .select("gomyaks")
        .eq("user_id", user_id)
        .single();

    if (error) {
        console.error("Ошибка загрузки данных:", error.message);
    } else if (data) {
        gomyaks = data.gomyaks;
        updateCounter();
    }
}

function updateCounter() {
    document.getElementById("counter").innerText = gomyaks;
}

async function saveData() {
    if (!user_id) return;

    const { data, error } = await supabase
        .from("gomyak_data")
        .upsert([{ user_id, gomyaks }]);

    if (error) {
        console.error("Ошибка сохранения данных:", error.message);
    }
}

document.getElementById("tapButton").addEventListener("click", async () => {
    gomyaks++;
    updateCounter();
    await saveData();
});

getUser();
