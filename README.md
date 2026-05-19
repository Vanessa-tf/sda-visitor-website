# SDA Church Visitor Welcome System

A web form for Seventh-day Adventist churches to capture visitor details during services. Visitors scan a QR code, submit their info, and instantly receive a WhatsApp message with church contacts (head elder, deacon, address, service times).

## Features

- 📱 Responsive design (mobile/desktop)
- 🎨 SDA Denim Blue branding + optional background image
- 📩 Automated WhatsApp replies via Evolution API
- ☁️ Deployed on Vercel (serverless function)

## Quick Setup

1. **Clone & push to GitHub**
2. **Deploy on Vercel** (connect your repo)
3. **Set environment variables** in Vercel:
   - `EVOLUTION_API_URL`
   - `EVOLUTION_API_KEY`
   - `EVOLUTION_INSTANCE_NAME`
4. **Update church details** in `api/send-whatsapp.js`
5. **Add your SDA logo** (`sda-logo.png` in root folder)
6. **Generate a QR code** for your Vercel URL and display in church

## Files

- `index.html` – form UI
- `style.css` – SDA styling
- `script.js` – frontend submission
- `api/send-whatsapp.js` – WhatsApp sender (Vercel function)

## Test

Submit the form with your own WhatsApp number – you should receive the welcome message in seconds.

---

Created for local SDA church ministry. 🙏
