const GEMINI_MODEL = "gemini-flash-lite-latest";

export async function pedirAClaude(prompt, maxTokens = 1000) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta la API Key en el archivo .env");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  );

  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`Error API (${res.status}): ${detalle}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export function extraerJSON(texto) {
  const limpio = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const i = limpio.search(/[[{]/);
  const j = Math.max(limpio.lastIndexOf("}"), limpio.lastIndexOf("]"));
  if (i === -1 || j === -1) throw new Error("Respuesta sin JSON válido");
  return JSON.parse(limpio.slice(i, j + 1));
}
