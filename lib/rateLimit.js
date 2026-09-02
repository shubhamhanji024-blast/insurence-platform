/**
 * In-memory sliding window rate limiter with auto-garbage collection.
 * Designed to work safely in both serverless (Vercel) and node.js server environments.
 */

const ipRequestMap = new Map();

// Clean up expired entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now > data.resetTime) {
        ipRequestMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

export function checkRateLimit(ip = '127.0.0.1', limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const clientData = ipRequestMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count += 1;
  }

  ipRequestMap.set(ip, clientData);

  if (clientData.count > limit) {
    const retryAfterSec = Math.ceil((clientData.resetTime - now) / 1000);
    return {
      allowed: false,
      retryAfterSec,
      message: `Too many contact requests from this IP. Please try again in ${Math.ceil(retryAfterSec / 60)} minutes.`,
    };
  }

  return { allowed: true };
}
