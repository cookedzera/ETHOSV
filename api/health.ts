import { NextRequest, NextResponse } from 'next/server';

// Specify runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'EthosRadar',
    environment: process.env.VERCEL_ENV || 'development',
    region: process.env.VERCEL_REGION || 'local'
  });
}