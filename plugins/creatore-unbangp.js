let handler = async (m) => {
global.db.data.chats[m.chat].isBanned = false
m.reply('𝕀𝐋 𝐁𝕆𝐓 𝕊𝕀 𝚵 𝕊𝐕𝚵𝐆𝐋𝕀𝚲𝐓Ꮻ 🔔')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^unbanchat$/i
handler.rowner = true
export default handler