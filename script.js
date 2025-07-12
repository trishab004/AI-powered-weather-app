let currentTemp = null; // store temperature

const weatherCard = document.getElementById("weatherCard");

function getWeatherEmoji(desc) {
  desc = desc.toLowerCase();
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("storm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  return "🌡️";
}

function displayWeather(data) {
  currentTemp = data.main.temp;
  const city = data.name;
  const desc = data.weather[0].description;
  const emoji = getWeatherEmoji(desc);

  weatherCard.innerHTML = `
    <h2>${emoji} ${Math.round(currentTemp)}°C - ${desc}</h2>
    <p>📍 ${city}</p>
  `;
}

function fetchWeather(lat, lon) {
  const apiKey = "d5efe77663327fbbf221e7ef326cd3a5";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetch(url)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => {
      weatherCard.innerHTML = "<h2>Failed to fetch weather 😞</h2>";
    });
}

navigator.geolocation.getCurrentPosition(
  position => {
    fetchWeather(position.coords.latitude, position.coords.longitude);
  },
  () => {
    weatherCard.innerHTML = "<h2>Location access denied 😞</h2>";
  }
);

// --- CHATBOT SECTION ---
const chatBtn = document.getElementById("chatBtn");
const chatContainer = document.getElementById("chatContainer");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

chatBtn.onclick = () => chatContainer.classList.remove("hidden");
closeChat.onclick = () => chatContainer.classList.add("hidden");

chatForm.onsubmit = async (e) => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;

  console.log("🟢 User message sent:", msg); // 🔍 ADD THIS
  console.log("🌡️ Current temperature:", currentTemp); // 🔍 ADD THIS

  addMessage("You", msg, "user-msg");
  userInput.value = "";

  const typingDiv = document.createElement("div");
  typingDiv.classList.add("typing");
  typingDiv.innerText = "TrishaBot is typing...";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const promptToSend = `Based on the current temperature ${currentTemp}°C, ${msg}`;
    console.log("📨 Prompt to backend:", promptToSend); // 🔍 ADD THIS

    const response = await fetch("https://ai-powered-weather-app-5i4j.onrender.com/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptToSend })
    });

    const data = await response.json();
    console.log("🟡 Response from backend:", data); // 🔍 ADD THIS

    chatMessages.removeChild(typingDiv);
    addMessage("TrishaBot", data.reply || "I’m not sure what to say 🤷‍♀️", "bot-msg");
  } catch (err) {
    console.error("❌ Error calling Gemini API:", err); // 🔍 ADD THIS
    chatMessages.removeChild(typingDiv);
    addMessage("TrishaBot", "Something went wrong 😢", "bot-msg");
  }
};





function addMessage(sender, text, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(className);
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
