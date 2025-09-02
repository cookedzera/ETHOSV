import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'EthosRadar',
    environment: process.env.VERCEL_ENV || 'development',
    region: process.env.VERCEL_REGION || 'local'
  });
}