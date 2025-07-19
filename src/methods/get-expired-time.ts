/**
 * Generates a future expiration time.
 * You can either pass a human-readable string like "5m", "1h", or pass seconds directly.
 * @param duration - Optional: Duration like "10s", "5m", "2h", "7d"
 * @param seconds - Optional: Number of seconds to expire
 * @param returnType - "date" | "timestamp" (default is "date")
 * @returns A Date object or timestamp
 */
export function getExpireTime(
  duration?: string,
  seconds?: number,
  returnType: 'date' | 'timestamp' = 'date'
): Date | number {
  let totalMilliseconds = 0

  if (duration) {
    const match = duration.match(/^(\d+)([smhd])$/)
    if (!match) {
      throw new Error('Invalid duration format. Use like "10s", "5m", "2h", "7d"')
    }

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's': totalMilliseconds += value * 1000; break
      case 'm': totalMilliseconds += value * 60 * 1000; break
      case 'h': totalMilliseconds += value * 60 * 60 * 1000; break
      case 'd': totalMilliseconds += value * 24 * 60 * 60 * 1000; break
    }
  }

  if (seconds && typeof seconds === 'number') {
    totalMilliseconds += seconds * 1000
  }

  const futureTime = Date.now() + totalMilliseconds
  return returnType === 'timestamp' ? futureTime : new Date(futureTime)
}