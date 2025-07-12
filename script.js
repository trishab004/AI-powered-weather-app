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
  const apiKey = "df2dd78c3b60918acb820f0093f4e139";
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
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

chatBtn.onclick = () => chatContainer.classList.remove("hidden");
closeChat.onclick = () => chatContainer.classList.add("hidden");

sendBtn.onclick = async () => {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage("You", msg);
  userInput.value = "";

  // Typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("typing");
  typingDiv.innerText = "TrishaBot is typing...";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("https://your-render-backend-url.com/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Based on the current temperature ${currentTemp}°C, ${msg}`
      })
    });

    const data = await response.json();
    chatMessages.removeChild(typingDiv);
    addMessage("TrishaBot", data.reply || "I’m not sure what to say 🤷‍♀️");
  } catch (err) {
    chatMessages.removeChild(typingDiv);
    addMessage("TrishaBot", "Something went wrong 😢");
  }
};

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msgDiv.style.margin = "0.5rem 0";
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
