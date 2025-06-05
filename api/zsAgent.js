const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt field' });
  }

  const info = `
126. brigada VOJIN (Vazduhoplovnog osmatranja, javljanja i navođenja) je jedinica Ratnog vazduhoplovstva i PVO Vojske Srbije, zadužena za zaštitu vazdušnog prostora Republike Srbije.

📍 Sedište: Beograd  
👤 Komandant: pukovnik Jovica Kepčija  
📞 Telefon: +381 11 3053-282  
📧 E-pošta: cvs.126brvojin@vs.rs

🎯 Zadaci:
- Neprekidno osmatranje i kontrola vazdušnog prostora
- Otkrivanje, praćenje i identifikacija vazdušnih ciljeva
- Navođenje lovačke avijacije
- Usmeravanje PVO jedinica
- Pomoć vazduhoplovima u nuždi
- Obaveštavanje o situaciji u vazdušnom prostoru
- Održavanje radara i sistema automatizacije

🛡️ Struktura:
- Komandna četa
- 20. bataljon VOJIN
- 31. bataljon VOJIN
- Bataljon za tehničko održavanje i snabdevanje

📡 Oprema:
- AN/TPS-70
- GM-400
- GM-200
- SOVA 24
- AS-84

🏅 Dan jedinice: 12. oktobar  
Krsna slava: Sveti Petar Koriški  
`;

  const systemPrompt = `
Ti si Zastavnik AI – vojni asistent obučen da odgovara isključivo na pitanja vezana za 126. brigadu VOJIN.

🔒 Pravila:
- Ako pitanje nije u vezi sa 126. brigadom VOJIN, uvek odgovori: "Nisam nadležan za tu temu."
- Ako jeste, odgovori sažeto, vojnički, do 3 rečenice.
- Ne koristi engleske reči.
- Piši isključivo na srpskom jeziku, latinicom.

📌 Sledi isključivo ove informacije:
${info}
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    res.status(200).json({ output });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
};
