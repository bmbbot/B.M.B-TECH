const axios = require("axios");
const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "gpt1",
  alias: ["gpt1", "gpt2", "gpt3"],
  categorie: "ai",
  reaction: "🙋"
}, async (jid, sock, { arg, ms, repondre, react }) => {
  try {
    const question = arg.join(" ");
    if (!question) return repondre("❌ Please provide a message for Gpt.\n\nExample: `.gpt Hello`");

    const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(question)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result) {
      await react("❌");
      return repondre("⚠️ Gpt failed to respond. Try again later.");
    }

    await repondre(`🤖 *Gpt Response:*\n\n${data.result}`);
    await react("✅");

  } catch (e) {
    console.error("GPT Command Error:", e);
    await react("❌");
    repondre("❌ An error occurred while communicating with Gpt.");
  }
});
