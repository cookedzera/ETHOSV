import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Import your existing Ethos API service
import { ethosApi } from '../api-utils/ethos-api';

// Specify runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, searchType } = z.object({
      query: z.string().min(1),
      searchType: z.enum(['twitter', 'userkey', 'auto']).optional().default('auto'),
    }).parse(body);

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
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}