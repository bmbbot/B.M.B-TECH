const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUU5WdkozVnRMM29rN2R4OHNKRFlYODJHRUp4c2VaMUNKTkFWRmYwZCsxdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaGdiYlErUjF0TDhPbHZFWWhMc3JJR2ppMVdMdm02NXY2dlk4MU4vUkNIZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDTklPSytKdEU0K1dRR3haeTR3YnM0TS9LckpFRFJBa2trK250T2RLREVZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWUkMvdlFvaTVoRkhjbUxLdExGemc2aVphN2xHUVdUNGJRRWxNVEVpV0VRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlJam0xMzV6aEx5cGJTTWM1a05adlpES3k4ZnRwSU1xZ1pwRVh5ZFBFbGM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBud3ljSGNUZHBpeDJFc05FUkZ2K1NpbkhnTlVybmNhNDNWUVkzdTB1UjA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUdFUWV3WW91c0pWeXZZWnJmNnZDS1BiVzgxNVRZVytzSnJOeGZ3UVlGMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidjNvU04rM08veENuRnJtMzF4blRpajZINFY0R2krTmtib05DeXpSZXdHVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iml0UzN3L01wU2VBUmtQSTgyZ25hOFVYNVBEN245VjdNSXpqYmRlQk94bzlJRjlIM2I2eCt1NSsrVFBjZWZ1MVU1NEdhcm0zazZTaDcrS3FES1NjZWh3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjUwLCJhZHZTZWNyZXRLZXkiOiJvWWJNOUl4V3BCMFhWdzFaL0xOZ0hVSldJOFo4NlZtZkI3Q3dsVm9aZHlBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1Njc2MjU5NjgzOUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI4NUY5NDM0QkQ1MTY1QjU4MzEzNUZFRUNBQkU5NjBCOSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQ3ODI5ODI4fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTY3NjI1OTY4MzlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQjY1Mjg2OTU5RTlGNkI5NzU1MEE3MDA4NTExQTZFOEMifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0NzgyOTg1Nn1dLCJuZXh0UHJlS2V5SWQiOjYxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6NjEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiVjRBMUJHNVYiLCJtZSI6eyJpZCI6IjI1Njc2MjU5NjgzOTozOUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJVcmJhbiBLYWx6IiwibGlkIjoiMTUwMTg2ODM1ODUzNDI3OjM5QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFh6MHJFRUVLcUl0OEVHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiRWg3Zmd1YzVrM045dWsweU5HaXNCdDl4RnM3RXg1S1ZqS2NrZy94Q3VYaz0iLCJhY2NvdW50U2lnbmF0dXJlIjoick1XaksyWDBYdGluT1Vkemt6SGxtM0FoaG8xbExjZUE2Z3gyWDRqbFc3cFRVcENiRzNLMkd4aUxLNm40M0ROYzVCR0huWUVDby9rcnMzU1JnenQzQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6IkRxUmIwakZDbDVlMm5GUkQyd1NpV2I5QXFpdTlEeHJTYnE2ZHBjUis2ZGtZTW55YUkvNngydXZsbTdJYlprbWoreXRZallONmVSQWdtWld6cVh1bWdRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU2NzYyNTk2ODM5OjM5QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlJJZTM0TG5PWk56ZmJwTk1qUm9yQWJmY1JiT3hNZVNsWXluSklQOFFybDUifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlBZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0NzgyOTgxNiwibGFzdFByb3BIYXNoIjoiM2dQVUprIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMTmkifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Urban Kalz",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " 𝙱.𝙼.𝙱-𝚇𝙼𝙳 ke",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

