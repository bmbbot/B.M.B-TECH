const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction");
const { default: axios } = require('axios');
const fs = require('fs');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

zokou({ nomCom: "gpte", reaction: "🤦", categorie: "bmbai" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('Hello 🖐️.\n\nWhat help can I offer you today?');
    }

    const prompt = arg.join(' ');
    const apiKey = 'gifted_api_s9hs4dyf5';
    const apiUrl = `https://api.giftedtech.web.id/api/ai/gpt?apikey=${apiKey}&q=${encodeURIComponent(prompt)}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.result) {
      const answer = data.result;

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "> *B.M.B-TECH🇹🇿*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: []
              })
            })
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });
    } else {
      throw new Error('Invalid response from the API.');
    }
  } catch (error) {
    console.error('Error getting response:', error.message);
    repondre('Error getting response.');
  }
});
