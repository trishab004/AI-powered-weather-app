from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.route('/gemini', methods=['POST'])
def gemini_reply():
    data = request.json
    prompt = data.get("prompt", "")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    payload = { 
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    headers = {"Content-Type": "application/json"}
    r = requests.post(url, headers=headers, json=payload)

    if r.status_code == 200:
        result = r.json()
        reply = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"reply": reply})
    else:
        return jsonify({"reply": "API call failed"}), 500

if __name__ == '__main__':
    app.run()
