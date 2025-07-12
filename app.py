'''
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")  # make sure key is set in Render

@app.route('/chat', methods=['POST'])
def chat_reply():
    data = request.get_json()
    user_message = data.get("message", "")
    print("📩 Prompt received:", user_message)

    # Very simple logic: generate a demo reply based on the message
    if "what to wear" in user_message.lower():
        temp_text = "It's hot today! Wear something light like cotton and drink plenty of water. 😎☀️"
    elif "rain" in user_message.lower():
        temp_text = "Looks like it might rain! Carry an umbrella and wear waterproof shoes. ☔"
    else:
        temp_text = "I'm just a demo bot right now, but I'm happy to help you based on the weather! 🌦️"

    return jsonify({"reply": temp_text})

@app.route('/')
def home():
    return "🌤️ Trisha's Weather App Gemini Backend is Running!"

@app.route('/gemini', methods=['POST'])
def gemini_reply():
    data = request.get_json()
    prompt = data.get("prompt", "")

    print("📩 Prompt received:", prompt)

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }
    payload = {
        "contents": [
            {
                "parts": [
                    { "text": prompt }
                ]
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)
    print("📡 Gemini API status:", response.status_code)
    print("🔁 Response raw:", response.text)

    if response.status_code == 200:
        result = response.json()
        reply = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({ "reply": reply })
    else:
        print("❌ Gemini API call failed!")
        return jsonify({ "reply": "Gemini API call failed. Check logs." }), 500

if __name__ == '__main__':
    app.run()
'''


from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "🌤️ Trisha's Weather App Backend Running (Demo Mode)"

@app.route('/chat', methods=['POST'])
def chat_reply():
    data = request.get_json()
    user_message = data.get("message", "")
    print("📩 Prompt received:", user_message.lower())

    # Basic logic to demo friendly responses
    response_text = ""

    if "what to wear" in user_message.lower() or "wear" in user_message.lower():
        if "cold" in user_message or "15" in user_message or "10" in user_message:
            response_text = "Brrr, it's chilly! 🧥 You should wear something warm like a hoodie or jacket."
        elif "hot" in user_message or "30" in user_message or "35" in user_message:
            response_text = "It's hot today! 😎 Wear something light like cotton and drink plenty of water."
        elif "rain" in user_message.lower():
            response_text = "Rainy weather ahead! ☔ Carry an umbrella and wear waterproof shoes."
        else:
            response_text = "Nice day outside! 👕 Wear comfy clothes that suit your vibe."

    elif "hi" in user_message.lower() or "hello" in user_message.lower():
        response_text = "Hey there! 😊 I’m TrishaBot. I can help you decide what to wear based on the weather!"

    elif "how are you" in user_message.lower():
        response_text = "I’m sunny and bright as always ☀️! How can I help you today?"

    else:
        response_text = "Hmm... I’m just a demo bot now, but I’ll be smarter soon! 🧠 Try asking what to wear."

    return jsonify({"reply": response_text})

if __name__ == '__main__':
    app.run()
