import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Import your existing Ethos API service
import { ethosApi } from '../api-utils/ethos-api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { query, searchType } = z.object({
      query: z.string().min(1),
      searchType: z.enum(['twitter', 'userkey', 'auto']).optional().default('auto'),
    }).parse(req.body);

    let result;
    
    if (searchType === 'auto') {
      const parsed = ethosApi.parseUserkey(query);
      
      // Try Twitter/X search first
      if (parsed.type === 'twitter') {
        const twitterResult = await ethosApi.getUsersByTwitter([query]);
        if (twitterResult.success && twitterResult.data && twitterResult.data.length > 0) {
          result = { success: true, data: twitterResult.data[0] };
        }
      }
      
      // If Twitter search didn't work, fallback to V1 search
      if (!result || !result.success) {
        const searchResult = await ethosApi.searchUsersV1(query, 10);
        if (searchResult.success && searchResult.data && searchResult.data.ok && searchResult.data.data.values.length > 0) {
          // Filter for Twitter/X profiles only
          const twitterResults = searchResult.data.data.values.filter(user => 
            user.userkey.includes('service:x.com:') || user.userkey.includes('service:twitter.com:')
          );
          
          if (twitterResults.length > 0) {
            const v1Result = twitterResults[0];
            const convertedUser = {
              id: v1Result.profileId,
              profileId: v1Result.profileId,
              displayName: v1Result.name,
              username: v1Result.username,
              avatarUrl: v1Result.avatar,
              description: v1Result.description,
              score: v1Result.score,
              status: null,
              userkeys: [v1Result.userkey],
              xpTotal: 0,
              xpStreakDays: 0,
              links: {
                profile: `https://app.ethos.network/profile/${v1Result.userkey}`,
                scoreBreakdown: `https://app.ethos.network/profile/${v1Result.userkey}/score`
              },
              stats: {
                review: {
                  received: { negative: 0, neutral: 0, positive: 0 }
                },
                vouch: {
                  given: { amountWeiTotal: "0", count: 0 },
                  received: { amountWeiTotal: "0", count: 0 }
                }
              }
            };
            result = { success: true, data: convertedUser };
          } else {
            result = { success: false, error: 'No Twitter/X profiles found' };
          }
        } else {
          result = { success: false, error: 'User not found' };
        }
      }
    } else {
      // Specific search type handling
      switch (searchType) {
        case 'twitter':
          const twitterResult = await ethosApi.getUsersByTwitter([query]);
          result = twitterResult.success && twitterResult.data?.length ? 
            { success: true, data: twitterResult.data[0] } : 
            { success: false, error: 'Twitter user not found' };
          break;
        case 'userkey':
          if (query.includes('service:x.com:') || query.includes('service:twitter.com:')) {
            const searchResult = await ethosApi.searchUsersV1(query, 50);
            
            if (searchResult.success && searchResult.data?.ok && searchResult.data.data.values.length > 0) {
              let v1Result = searchResult.data.data.values.find(user => user.userkey === query);
              
              if (!v1Result) {
                const queryParts = query.split(':');
                if (queryParts.length >= 3) {
                  const service = queryParts[1];
                  const identifier = queryParts[2];
                  
                  v1Result = searchResult.data.data.values.find(user => 
                    user.userkey.includes(service) && user.userkey.includes(identifier)
                  );
                }
              }
              
              if (v1Result) {
                const convertedUser = {
                  id: v1Result.profileId,
                  profileId: v1Result.profileId,
                  displayName: v1Result.name,
                  username: v1Result.username,
                  avatarUrl: v1Result.avatar,
                  description: v1Result.description,
                  score: v1Result.score,
                  status: null,
                  userkeys: [v1Result.userkey],
                  xpTotal: null,
                  xpStreakDays: null,
                  links: {
                    profile: `https://app.ethos.network/profile/${v1Result.userkey}`,
                    scoreBreakdown: `https://app.ethos.network/profile/${v1Result.userkey}/score`
                  },
                  stats: null
                };
                result = { success: true, data: convertedUser };
              } else {
                result = { success: false, error: 'Twitter userkey not found' };
              }
            } else {
              result = { success: false, error: 'Twitter userkey not found' };
            }
          } else {
            result = { success: false, error: 'Only Twitter/X userkeys are supported' };
          }
          break;
        default:
          result = { success: false, error: 'Only Twitter/X search is supported' };
      }
    }

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}