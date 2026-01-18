const handler = async (m, { conn, usedPrefix, command, text }) => {

  // 🔹 SETUSER
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      return conn.sendMessage(m.chat, { text: `❌ Usa: ${usedPrefix}setuser <username>` })
    }
    setUser(m.sender, username)
    return conn.sendMessage(m.chat, { text: `✅ Username Last.fm *${username}* salvato!` })
  }

  // 🔹 CUR
  if (command === 'cur') {
    // Se viene menzionato qualcuno, usa il primo menzionato; altrimenti mittente
    let targetId = m.mentionedJid?.[0] || m.sender
    const user = getUser(targetId)

    if (!user) {
      return conn.sendMessage(m.chat, {
        text: `❌ L'utente non ha registrato un username Last.fm.\nUsa: ${usedPrefix}setuser <username>`,
        mentions: [targetId]
      })
    }

    const track = await getRecentTrack(user)
    if (!track) return m.reply('❌ Nessuna traccia trovata')

    const artist = track.artist['#text']
    const title = track.name
    const album = track.album?.['#text'] || '—'
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text']

    const info = await getTrackInfo(user, artist, title)

    const playcount = Number(info?.userplaycount || 0)
    const durationMs = Number(info?.duration || 0)
    const minutes = durationMs
      ? Math.round((playcount * durationMs) / 60000)
      : 0

    const tags = info?.toptags?.tag
      ?.slice(0, 4)
      .map(t => `#${t.name}`)
      .join(' ') || '—'

    const listeners = Number(info?.listeners || 0)

    const displayName = '@' + targetId.split('@')[0]

    const caption = `
🎧 *In riproduzione di ${displayName}*

🎵 *${title}*
🎤 ${artist}
💿 ${album}

⏱️ Minuti ascoltati da te: *${minutes}*
🎨 Mood: ${tags}

🔥 Popolarità: ${popularityBar(listeners)}
📊 Listener: *${listeners}*
🏷️ Stato: *${popularityLabel(listeners)}*
`.trim()

    return conn.sendMessage(m.chat, {
      image: image ? { url: image } : undefined,
      caption,
      mentions: [targetId]
    }, { quoted: m })
  }
}

handler.command = ['cur', 'setuser']

// Tutti i membri del gruppo possono usarlo
handler.group = true

export default handler