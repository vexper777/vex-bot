import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../lib/language.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {

    const menuText = `
⚡𝑴𝑬𝑵𝑼 𝑨𝑫𝑴𝑰𝑵⚡
╔═══════════════════╗

➥ P/promuovi 👑
➥ R/retrocevi 🤡
➥ Warn ☢️
➥ Listwarn ⏳
➥ Unwarn ❌
➥ Delwarn ✅
➥ Muta 🔇
➥ Smuta 🔊
➥ Tag 💬
➥ Aperto 🔓
➥ Chiuso 🔒
➥ Inattivi ⏰
➥ Admins 👑
➥ Kick 👋
➥ SetBye ⛓️
➥ SetBenvenuto ⛓️
➥ Link ⚠️
➥ Linkqr ⚠️

*𝑽𝑬𝑹𝑺𝑰𝑶𝑵𝑬:* *2.0*

╚═══════════════════╝
`.trim();

    const imagePath = path.join(__dirname, '../media/admin.jpeg');

    await conn.sendMessage(message.chat, {
        image: { url: imagePath },
        caption: menuText,
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
        ],
        viewOnce: true,
        headerType: 4
    });
};

handler.help = ['menuadmin'];
handler.tags = ['menuadmin'];
handler.command = /^(menuadmin)$/i;

export default handler;