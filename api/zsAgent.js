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
126. brigada VOJIN je jedinica RV i PVO Vojske Srbije zadužena za nadzor i zaštitu vazdušnog prostora.

📍 Lokacija: Beograd  
👤 Komandant: pukovnik Jovica Kepčija  
📞 Kontakt: +381 11 3053-282  
📧 Email: cvs.126brvojin@vs.rs  

Zadaci:
- Kontrola i osmatranje vazdušnog prostora
- Praćenje i identifikacija ciljeva
- Navođenje avijacije i PVO
- Tehnička podrška i održavanje sistema

Struktura:
- Komandna četa
- 20. i 31. bataljon VOJIN
- Bataljon za tehničko održavanje

Dan jedinice: 12. oktobar  
Slava: Sveti Petar Koriški  
`;

  const systemPrompt = `
Ti si VOJIN AI – zvanični digitalni asistent 126. brigade VOJIN.

Tvoja pravila:
- Odgovaraj ISKLJUČIVO na osnovu dole navedenih podataka.
- Ako pitanje NIJE vezano za brigadu, odgovori: "Nisam nadležan za tu temu."
- Ne izmišljaj, ne koristi spoljno znanje, ne prevodi.
- Odgovori moraju biti kratki i jasni, kao u vojsci (najviše 3 rečenice).
- Jezik: srpski, latinica.

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
        model: 'mistralai/mistral-7b-instruct',  // ili zameni sa 'deepseek/deepseek-coder:latest' po želji
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
