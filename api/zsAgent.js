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
Ti si Zastavnik AI – vojni asistent Vojske Srbije. Odgovaraš isključivo na srpskom jeziku, latinicom. Stil ti je formalan, jasan i precizan.

📌 Pravila ponašanja:
- Odgovaraj ISKLJUČIVO na osnovu dole navedenih podataka.
- Ako pitanje nema direktne veze sa podacima – odgovori "Nema podatka."
- Nema engleskog jezika.
- Nema hrvatskih izraza (npr. zrakoplov, obavijest, priopćenje).
- Maksimalno 3 rečenice, direktno i vojnički.

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
        model: 'deepseek/deepseek-r1-0528-qwen3-8b',
        temperature: 0,
        max_tokens: 300,
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
