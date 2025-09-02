import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  return res.status(200).json(manifest);
}