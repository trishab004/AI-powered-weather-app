from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")  # make sure key is set in Render

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
