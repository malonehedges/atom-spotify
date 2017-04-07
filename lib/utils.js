'use babel'

export function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  // Zero-pad the seconds
  const padding = seconds < 10 ? '0' : ''

  return `${minutes}:${padding}${seconds}`
}
