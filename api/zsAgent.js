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
126. бригада ВОЈИН (Ваздухопловног осматрања, јављања и навођења) је јединица Ратног ваздухопловства и ПВО Војске Србије, задужена за заштиту ваздушног простора Републике Србије.

📍 Седиште: Београд  
👤 Командант: пуковник Јовица Кепчија  
📞 Телефон: +381 11 3053-282  
📧 Е-пошта: cvs.126brvojin@vs.rs

🎯 Задаци:
- Непрекидно осматрање и контрола ваздушног простора
- Откривање, праћење и идентификација ваздушних циљева
- Навођење ловачке авијације
- Усмеравање ПВО јединица
- Помоћ ваздухопловима у нужди
- Обавештавање о ситуацији у ваздушном простору
- Одржавање радара и система аутоматизације

🛡️ Структура:
- Командна чета
- 20. батаљон ВОЈИН
- 31. батаљон ВОЈИН
- Батаљон за техничко одржавање и снабдевање

📡 Опрема:
- AN/TPS-70
- GM-400
- GM-200
- СОВА 24
- AS-84

🏅 Дан јединице: 12. октобар  
Крсна слава: Свети Петар Коришки  
`;

  const systemPrompt = `
Ти си Заставник AI – војни асистент који одговара искључиво на српском језику, ћирилицом.

Твоја улога:
- Одговарај само на основу следећих података о 126. бригади ВОЈИН
- Нема измишљања, ако нема информације – одговори: "Нема податка."
- Буди кратак, војнички, највише 3 реченице
- Не користи енглеске речи
- Без додатног тумачења

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
