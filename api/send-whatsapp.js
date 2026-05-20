import { createClient } from '@supabase/supabase-js';

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
    const churchName = "Middelburg City SDA Church";
    const headElder = "Elder Isaac Fambarega";
    const headElderPhone = "+27787866285";
    const deacon = "Deacon W Fambarega";
    const deaconPhone = "+27837842180";
    const churchAddress = "1 Pearl street, Middelburg, Mpumalanga, South Africa";
    const serviceTimes = "Sabbath School: 9:30 AM | Divine Service: 11:00 AM";
    // -------------------------------------------------

    const welcomeMessage = 
`🙏 *WELCOME TO ${churchName}* 🙏

Dear ${fullName},

We are thrilled that you visited us today! Here is everything you need to stay connected:

🎥 *Live Stream*: https://www.facebook.com/MIDcitysdachurch
🏛️ *Church Address*: ${churchAddress}
🕘  *Service Times*: ${serviceTimes}

📞 *Church Leaders*:
• Head Elder: ${headElder} – ${headElderPhone}
• Deacon: ${deacon} – ${deaconPhone}

📱 *WhatsApp Group*: [Join our fellowship group] (link here)
🌐 *Website*: [churchwebsite.com]

*Prayer Request received*: ${prayerRequest || 'None'}

God bless you abundantly!
- ${churchName} Administration`;

    try {
        // === EVOLUTION API CONFIGURATION ===
        const evolutionApiUrl = process.env.EVOLUTION_API_URL;
        const apiKey = process.env.EVOLUTION_API_KEY;
        const instanceName = process.env.EVOLUTION_INSTANCE_NAME || "sda_church";

        if (!evolutionApiUrl || !apiKey) {
            console.error('Missing Evolution API credentials.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const url = `${evolutionApiUrl}/message/sendText/${instanceName}`;
        const payload = { number: whatsapp, text: welcomeMessage };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'apikey': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Evolution API error:', result);
            return res.status(500).json({ error: 'Failed to send message via Evolution API.' });
        }

        console.log('WhatsApp message sent successfully:', result);

        // === SAVE TO SUPABASE ===
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials missing – skipping database insert');
        } else {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { error: dbError } = await supabase
                .from('visitors')
                .insert([
                    {
                        full_name: fullName,
                        whatsapp: whatsapp,
                        email: email || null,
                        heard_from: heardFrom || null,
                        prayer_request: prayerRequest || null
                    }
                ]);

            if (dbError) {
                console.error('Supabase insert error:', dbError);
                // We don't return error to user because WhatsApp already succeeded
            } else {
                console.log('Visitor record saved to Supabase');
            }
        }

        return res.status(200).json({ success: true, messageId: result.key?.id });

    } catch (error) {
        console.error('API call error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}