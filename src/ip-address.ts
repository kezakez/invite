export default function remoteIpAddress(req): string {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip;
}
