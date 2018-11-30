export default function (lrc) {
  const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
  const lines = lrc.split('\n')
  let res = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let result = timeExp.exec(line)
    if (result) {
      const txt = line.replace(timeExp, '').trim()
      if (txt) {
        res.push({
          time: result[1] * 60 * 1000 + result[2] * 1000 + ((result[3] || 0) >= 100 ? (result[3] || 0) * 1 : ((result[3] || 0) * 10)),
          txt
        })
      }
    }
  }
  res.sort((a, b) => {
    return a.time - b.time
  })
  return res
}
