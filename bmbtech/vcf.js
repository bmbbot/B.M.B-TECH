const {
  zokou
} = require("../framework/zokou");
const fs = require('fs-extra');

zokou({
  nomCom: 'vcf1',
  categorie: "Group",
  reaction: '💗'
}, async (zk, message, context) => {
  const { repondre, verifGroupe, verifAdmin } = context;

  if (!verifAdmin) {
    repondre("You are not an admin here!");
    return;
  }

  if (!verifGroupe) {
    repondre("This command works in groups only");
    return;
  }

  try {
    // Fetch group metadata
    let groupMetadata = await zk.groupMetadata(message.key.remoteJid);

    // Log group details
    console.log(`Group Name: ${groupMetadata.subject}`);
    console.log(`Total Participants: ${groupMetadata.participants.length}`);

    // Build VCF content
    let vCardData = "";
    let contactIndex = 0;

    for (let participant of groupMetadata.participants) {
      let phoneNumber = participant.id.split('@')[0];
      vCardData += `BEGIN:VCARD\nVERSION:3.0\nFN:[${contactIndex++}] +${phoneNumber}\nTEL;type=CELL;type=VOICE;waid=${phoneNumber}:+${phoneNumber}\nEND:VCARD\n`;
    }

    // Notify user
    repondre(`A moment, *BMB-TECH* is compiling ${groupMetadata.participants.length} contacts into a VCF file...`);

    // Ensure the file is properly created
    const filePath = './contacts.vcf';
    fs.writeFileSync(filePath, vCardData.trim(), 'utf-8');

    // Check if the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      throw new Error("VCF file creation failed.");
    }

    // Send the file
    await zk.sendMessage(message.key.remoteJid, {
      document: fs.readFileSync(filePath),
      mimetype: 'text/vcard',
      fileName: `${groupMetadata.subject}.vcf`,
      caption: `VCF for ${groupMetadata.subject}\nTotal Contacts: ${groupMetadata.participants.length}\n*KEEP USING BMB-XMD*`
    });

    // Clean up
    fs.unlinkSync(filePath);
    console.log("VCF file sent and deleted successfully.");
  } catch (error) {
    console.error("Error during VCF generation or sending:", error);
    repondre("❌ An error occurred while compiling contacts. Please check the logs for details.");
  }
});
