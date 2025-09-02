import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'EthosRadar',
    environment: process.env.VERCEL_ENV || 'development',
    region: process.env.VERCEL_REGION || 'local'
  });
}