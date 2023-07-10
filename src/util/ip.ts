import { Request } from 'express';
import * as ipAddr from 'ipaddr.js';

export const getClientIp = (request: Request) => {
  const ipString =
    (request.headers['x-forwarded-for'] as string) ||
    (request.socket.remoteAddress as string);

  const ip = ipAddr.IPv4.parse(ipString);

  return ip.toString();
};
