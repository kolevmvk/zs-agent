const fetch = require('node-fetch');

const BASE_INFO = {
  "komandant": "Komandant 126. brigade VOJIN je pukovnik Jovica Kepčija.",
  "sediste": "Sedište brigade je u Beogradu.",
  "dan jedinice": "Dan jedinice je 12. oktobar.",
  "krsna slava": "Krsna slava je Sveti Petar Koriški.",
  "oprema": "Brigada koristi radare: AN/TPS-70, GM-400, GM-200, SOVA 24 i AS-84.",
  "struktura": "Struktura: Komandna četa, 20. bataljon, 31. bataljon, i bataljon za tehničko održavanje.",
  "zadaci": "Zadaci: osmatranje neba, praćenje ciljeva, navođenje aviona i PVO jedinica.",
  "kontakt": "Telefon: +381 11 3053-282, Email: cvs.126brvojin@vs.rs."
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt field' });
  }

  const normalized = prompt.toLowerCase();
  let responseText = "Nema podatka.";

  if (normalized.includes("komandant") || normalized.includes("ko vodi")) {
    responseText = BASE_INFO["komandant"];
  } else if (normalized.includes("sedište") || normalized.includes("sediste") || normalized.includes("gde se nalazi")) {
    responseText = BASE_INFO["sediste"];
  } else if (normalized.includes("dan jedinice") || normalized.includes("kad je dan")) {
    responseText = BASE_INFO["dan jedinice"];
  } else if (normalized.includes("krsna slava")) {
    responseText = BASE_INFO["krsna slava"];
  } else if (normalized.includes("radar") || normalized.includes("oprema")) {
    responseText = BASE_INFO["oprema"];
  } else if (normalized.includes("struktura") || normalized.includes("četa") || normalized.includes("ceta") || normalized.includes("bataljon")) {
    responseText = BASE_INFO["struktura"];
  } else if (normalized.includes("zadatak") || normalized.includes("šta radi") || normalized.includes("funkcija") || normalized.includes("zaduženje")) {
    responseText = BASE_INFO["zadaci"];
  } else if (normalized.includes("kontakt") || normalized.includes("telefon") || normalized.includes("email") || normalized.includes("mejl")) {
    responseText = BASE_INFO["kontakt"];
  }

  res.status(200).json({ output: responseText });
};
