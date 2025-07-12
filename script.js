// WEATHER FETCH
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
  const temp = data.main.temp;
  const city = data.name;
  const desc = data.weather[0].description;
  const emoji = getWeatherEmoji(desc);

  weatherCard.innerHTML = `
    <h2>${emoji} ${Math.round(temp)}°C - ${desc}</h2>
    <p>📍 ${city}</p>
  `;
}

function fetchWeather(lat, lon) {
  const apiKey = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=YOUR_API_KEY";
  fetch(apiKey)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => {
      weatherCard.innerHTML = "<h2>Failed to fetch weather 😞</h2>";
    });
}

navigator.geolocation.getCurrentPosition(
  position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(lat, lon);
  },
  () => {
    weatherCard.innerHTML = "<h2>Location access denied 😞</h2>";
  }
);

// CHATBOT LOGIC
const chatBtn = document.getElementById("chatBtn");
const chatContainer = document.getElementById("chatContainer");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

chatBtn.onclick = () => chatContainer.classList.remove("hidden");
closeChat.onclick = () => chatContainer.classList.add("hidden");

sendBtn.onclick = () => {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage("You", msg);
  userInput.value = "";
  
  setTimeout(() => {
    addMessage("TrishaBot", "This is a dummy AI reply 🤖✨");
  }, 800);
};

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msgDiv.style.margin = "0.5rem 0";
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
