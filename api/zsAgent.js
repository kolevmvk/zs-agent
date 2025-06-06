import fetch from 'node-fetch';

export default async function handler(req, res) {
  // ✅ CORS headeri – obavezno za sve zahteve
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Preflight (OPTIONS) – odgovori odmah
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ⛔ Ako nije POST – greška
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  // ✅ Parsiranje prompta
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
Ti si Zastavnik AI – vojni asistent.

Tvoj zadatak:
- Odgovaraj ISKLJUČIVO na osnovu informacija o 126. brigadi VOJIN.
- Ako pitanje NEMA VEZE sa 126. brigadom VOJIN, odgovori TAČNO i KRATKO: "Nisam nadležan za tu temu."
- Odgovaraj isključivo na SRPSKOM jeziku, LATINIČNIM pismom.
- Odgovori moraju biti kratki, precizni, bez dodatnog tumačenja, max 3 rečenice.
- Nikad ne koristi engleske reči.

Baza znanja:
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content?.trim();

    if (!output) {
      return res.status(500).json({ error: 'Ne mogu da odgovorim na to pitanje.' });
    }

    res.status(200).json({ output });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    res.status(500).json({ error: 'Greška u komunikaciji sa AI servisom.' });
  }
}
