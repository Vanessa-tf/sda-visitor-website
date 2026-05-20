# SDA Church Visitor Welcome System

A web form for Seventh-day Adventist churches to capture visitor details during services. Visitors scan a QR code, submit their info, and instantly receive a WhatsApp message with church contacts (head elder, deacon, address, service times).

**Live Demo:** [https://sda-visitor-website.vercel.app/](https://sda-visitor-website.vercel.app/)

## Features

- 📱 Responsive design (mobile/desktop)
- 📩 Automated WhatsApp replies via Evolution API
- 🗄️ Visitor data storage with **Supabase** (PostgreSQL)

## Tech Stack

- **Frontend:** HTML5, CSS, JavaScript
- **Backend:** Node.js
- **Database:** Supabase (PostgreSQL)
- **WhatsApp API:** Evolution API
- **Hosting:** Vercel

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

## Database Setup (Supabase)

1.  Create a free account at [supabase.com](https://supabase.com).
2.  Create a new project.
3.  In the SQL Editor, run the following command to create the `visitors` table:
    ```sql
    CREATE TABLE visitors (
        id BIGSERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        email TEXT,
        heard_from TEXT,
        prayer_request TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

Submit the form with your own WhatsApp number – you should receive the welcome message in seconds.


## Test
Visit the live site: [https://sda-visitor-website.vercel.app/](https://sda-visitor-website.vercel.app/)

Created for local SDA church ministry. 🙏
