import fs from "fs"
import { performance } from "perf_hooks"
import Jimp from "jimp"

let handler = async (m, { conn }) => {
  const start = performance.now()

  await conn.sendMessage(m.chat, { text: "𝐒𝐭𝐨 𝐟𝐚𝐜𝐞𝐧𝐝𝐨 𝐢𝐥 𝐭𝐞𝐬𝐭 𝐝𝐞𝐥 𝐏𝐢𝐧𝐠...⏳" })

  const ping = performance.now() - start
  const uptime = process.uptime() * 1000
  const status = "🟢 𝐎𝐧𝐥𝐢𝐧𝐞"

  const formatTime = (ms) => {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  const thumbnailPath = "media/ping.jpeg"
  let thumbBuffer = null

  try {
    if (fs.existsSync(thumbnailPath)) {
      let image = await Jimp.read(thumbnailPath)
      image.resize(150, Jimp.AUTO).quality(70) // 🟡 THUMBNAIL PICCOLA
      thumbBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)
    }
  } catch (e) {
    console.error("Errore nel caricare la thumbnail:", e)
  }

  const textMsg = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 𝐔𝐩𝐭𝐢𝐦𝐞: ${formatTime(uptime)}
│ ⚡ 𝐏𝐢𝐧𝐠: ${ping.toFixed(0)} ms
│ 📶 𝐒𝐭𝐚𝐭𝐨: ${status}
╰────────────────────⬣`

  await conn.sendMessage(
    m.chat,
    {
      text: textMsg,
      contextInfo: {
        externalAdReply: {
          title: "📡 Stato del Bot",
          body: "√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝",
          mediaType: 1,
          thumbnail: thumbBuffer ?? undefined, // 🟡 MINIATURA
          // rimosso renderLargerThumbnail → ora è piccola
        },
      },
    },
    { quoted: m }
  )
}

handler.help = ["status", "uptime"]
handler.tags = ["info"]
handler.command = /^status|uptime|ping$/i

export default handler