import { promises as fs } from 'fs'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
var handler = async (m, { conn, participants }) => {
  try {
    const owners = new Set(
      (global.owner || [])
        .flatMap(v => {
          if (typeof v === 'string') return [v]
          if (Array.isArray(v)) return v.filter(x => typeof x === 'string')
          return []
        })
        .map(v => v.replace(/[^0-9]/g, ''))
    )
    const decodeJid = jid => conn.decodeJid(jid)
    const jidPhone = jid => (decodeJid(jid) || '').split('@')[0].replace(/[^0-9]/g, '')
    const botJid = decodeJid(conn.user?.jid || conn.user?.id)
    const botPhone = jidPhone(botJid)
    const groupUpdate = (conn.originalGroupParticipantsUpdate || conn.groupParticipantsUpdate).bind(conn)
    const chunk = (arr, size) => {
      const out = []
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
      return out
    }
    let metadata = null
    try {
      metadata = await conn.groupMetadata(m.chat)
    } catch {}
    const groupParticipants = metadata?.participants?.length ? metadata.participants : (participants || [])
    const groupOwnerPhones = new Set([
      jidPhone(metadata?.owner),
      ...groupParticipants
        .filter(p => p.admin === 'superadmin')
        .map(p => jidPhone(p.jid || p.id)),
    ].filter(Boolean))
    const protectedPhones = new Set([
      ...owners,
      botPhone,
      jidPhone(m.sender),
      ...groupOwnerPhones,
    ].filter(Boolean))

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    chat.rileva = false
    chat.welcome = false
    chat.goodbye = false

    const toDemote = groupParticipants
      .filter(p => p.admin && !protectedPhones.has(jidPhone(p.jid || p.id)))
      .map(p => decodeJid(p.jid || p.id))
      .filter(Boolean)
    if (toDemote.length > 0) {
      for (const part of chunk(toDemote, 15)) {
        await groupUpdate(m.chat, part, 'demote').catch(e => console.error('[hado90] errore retrocessione:', e))
        await delay(800)
      }
    }
    const canale = 'https://whatsapp.com/channel/0029VbB41Sa1Hsq1JhsC1Z1z'
    const pow = metadata?.subject || ''
    await conn.groupUpdateSubject(m.chat, `${pow} | svt by ${𝑽𝑬𝑿𝑷𝑬𝑹̲̅ꪶ𐌕ꫂ}`)
    await delay(1000)
    await conn.groupUpdateDescription(m.chat, `𝐿𝑎𝑠𝑐𝑖𝑎 𝑐ℎ𝑒 𝑙'𝑜𝑠𝑐𝑢𝑟𝑖𝑡𝑎̀ 𝑡𝑖 𝑐𝑜𝑛𝑠𝑢𝑚𝑖, 𝑐ℎ𝑒 𝑠𝑡𝑟𝑎𝑝𝑝𝑖 𝑣𝑖𝑎 𝑙𝑎 𝑡𝑢𝑎 𝑢𝑚𝑎𝑛𝑖𝑡𝑎̀ 𝑢𝑛 𝑓𝑟𝑎𝑚𝑚𝑒𝑛𝑡𝑜 𝑎𝑙𝑙𝑎 𝑣𝑜𝑙𝑡𝑎, 𝑓𝑖𝑛𝑐ℎ𝑒̀ 𝑎𝑛𝑐ℎ𝑒 𝑖𝑙 𝑡𝑢𝑜 𝑢𝑙𝑡𝑖𝑚𝑜 𝑟𝑒𝑠𝑝𝑖𝑟𝑜 𝑛𝑜𝑛 𝑙𝑒 𝑎𝑝𝑝𝑎𝑟𝑡𝑒𝑟𝑟𝑎̀...)
    await delay(1000)
    const videoBuffer = await fs.readFile('./media/hado90.mp4')
    await conn.sendMessage(m.chat, {
        video: videoBuffer,
        caption: 𝑨𝒗𝒆𝒕𝒆 𝒂𝒗𝒖𝒕𝒐 𝒍'𝒐𝒏𝒐𝒓𝒆 𝒅𝒊 𝒆𝒔𝒔𝒆𝒓𝒆 𝒔𝒕𝒂𝒕𝒊 𝒔𝒗𝒖𝒐𝒕𝒂𝒕𝒊 𝒅𝒂 𝑽𝑬𝑿𝑷𝑬𝑹̲̅ꪶ𐌕ꫂ, 𝑽𝒊 𝒂𝒔𝒑𝒆𝒕𝒕𝒊𝒂𝒎𝒐 𝒕𝒖𝒕𝒕𝒊 𝒒𝒖𝒊:\n\n\https://chat.whatsapp.com/Jm93DpVn1Io42JX1DrBwc2}`,
        gifPlayback: true,
        contextInfo: {
            ...global.fake.contextInfo
        }
    }, { quoted: m })
    await delay(1500)
    const groupNoAdmins = groupParticipants
      .filter(p => !protectedPhones.has(jidPhone(p.jid || p.id)))
      .map(p => decodeJid(p.jid || p.id))
      .filter(Boolean)
    if (groupNoAdmins.length > 0) {
      for (const part of chunk(groupNoAdmins, 10)) {
        await groupUpdate(m.chat, part, 'remove').catch(e => console.error('[hado90] errore rimozione:', e))
        await delay(800)
      }
    }
  } catch (e) {
    console.error(e)
    return m.reply(`*❌ ERRORE*\n━━━━━━━━━━━━━━━━\n\n*⚠️ Si è verificato un errore durante l'esecuzione di *****`)
  }
}

handler.command = /^svuota$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler
