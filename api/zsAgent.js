const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt field' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
           content: 'Ти си војни AI асистент Заставник AI. Одговарај кратко, сажето и војнички директно. Користи српски језик и ћирилицу. Максимално 3 реченице. Ако нешто не знаш, реци: "Нема податка."'

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
