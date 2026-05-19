export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullName, whatsapp, email, heardFrom, prayerRequest } = req.body;

    // Validate required fields
    if (!fullName || !whatsapp) {
        return res.status(400).json({ error: 'Missing name or WhatsApp number' });
    }

    // --- Church contact details (CUSTOMIZE THESE) ---
    const churchName = "SDA Central Church";
    const headElder = "Elder John Doe";
    const headElderPhone = "+1234567890";
    const deacon = "Deacon James Smith";
    const deaconPhone = "+1234567891";
    const churchAddress = "123 Main Street, City";
    const serviceTimes = "Sabbath School: 9:30 AM | Divine Service: 11:00 AM";
    // -------------------------------------------------

    const welcomeMessage = 
`🙏 *WELCOME TO ${churchName}* 🙏

Dear ${fullName},

We are thrilled that you visited us today! Here is everything you need to stay connected:

🏛️ *Church Address*: ${churchAddress}
🕊️ *Service Times*: ${serviceTimes}

📞 *Church Leaders*:
• Head Elder: ${headElder} – ${headElderPhone}
• Deacon: ${deacon} – ${deaconPhone}

📱 *WhatsApp Group*: [Join our fellowship group] (link here)
🌐 *Website*: [yourchurchwebsite.com]

*Prayer Request received*: ${prayerRequest || 'None'}

God bless you abundantly!
- ${churchName} Church Administration`;

    try {
        // === EVOLUTION API CONFIGURATION ===
        const evolutionApiUrl = process.env.EVOLUTION_API_URL;
        const apiKey = process.env.EVOLUTION_API_KEY;
        const instanceName = process.env.EVOLUTION_INSTANCE_NAME || "sda_church";

        // Validate Evolution API credentials
        if (!evolutionApiUrl || !apiKey) {
            console.error('Missing Evolution API credentials in environment variables.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // Construct the URL for Evolution API's send text endpoint
        const url = `${evolutionApiUrl}/message/sendText/${instanceName}`;

        const payload = {
            number: whatsapp,
            text: welcomeMessage
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Evolution API error:', result);
            return res.status(500).json({ error: 'Failed to send message via Evolution API.' });
        }

        console.log('Message sent successfully:', result);
        return res.status(200).json({ success: true, messageId: result.key?.id });

    } catch (error) {
        console.error('API call error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}