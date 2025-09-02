import { NextRequest, NextResponse } from 'next/server';

// Specify runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjE5MDUyMiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDk5RjZGZTYwZTJCYTM0MzI1MTI5ZEJEMmNEZGM0NTdEMjk3MzY4RjgifQ",
      payload: "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSJ9",
      signature: "Ap2jpG3Hb7ifpde/kd56Hr6Z8e4mOnSi7tQZU25LYsVtsveU1T2LyfqQmB1oy0w1Mwm31IDlQlWKuAoOIquj0Bs="
    },
    miniapp: {
      version: "1",
      name: "EthosRadar",
      homeUrl: "https://ethosradar.vercel.app",
      iconUrl: "https://ethosradar.vercel.app/logo1.png",
      subtitle: "Trust Score Scanner for Web3",
      description: "Generate your personalized trust reputation card on Ethos Protocol",
      buttonTitle: "Scan Your Trust Score",
      primaryCategory: "utility",
      tags: ["trust", "reputation", "ethos", "crypto", "web3"]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}