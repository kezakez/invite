export default function remoteIpAddress(req): string {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  return ip;
}
