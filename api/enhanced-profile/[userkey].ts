import { NextRequest, NextResponse } from 'next/server';
import { ethosApi } from '../../api-utils/ethos-api';

// Specify runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { userkey: string } }
) {
  try {
    const userkey = decodeURIComponent(params.userkey);
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh');
    
    // Simple in-memory cache (in production, use Redis or similar)
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    
    // Fast status detection using optimized V2 API calls
    let userResult;
    
    if (userkey.startsWith('profileId:')) {
      const profileId = parseInt(userkey.split(':')[1]);
      const profileResult = await ethosApi.getUsersByProfileId([profileId]);
      if (profileResult.success && profileResult.data && profileResult.data.length > 0) {
        userResult = profileResult.data[0];
      }
    } else if (userkey.includes('service:x.com:')) {
      // For Twitter users, get status directly from Twitter API
      const parts = userkey.split(':');
      const twitterId = parts[2];
      const twitterResult = await ethosApi.getUsersByTwitter([twitterId]);
      if (twitterResult.success && twitterResult.data && twitterResult.data.length > 0) {
        userResult = twitterResult.data[0];
      }
    } else if (userkey.startsWith('address:')) {
      // For address userkeys
      const address = userkey.split(':')[1];
      const addressResult = await ethosApi.getUsersByAddresses([address]);
      if (addressResult.success && addressResult.data && addressResult.data.length > 0) {
        userResult = addressResult.data[0];
      }
    } else {
      // For other userkey types, try direct lookup first
      const directResult = await ethosApi.getUserByUserkey(userkey);
      if (directResult.success) {
        userResult = directResult.data;
      }
    }
    
    // Enhanced fallback: If no V2 API result, try V1 API and convert
    if (!userResult) {
      try {
        const v1SearchResult = await ethosApi.searchUsersV1(userkey, 5);
        
        if (v1SearchResult.success && v1SearchResult.data?.ok && v1SearchResult.data.data.values.length > 0) {
          // Find exact userkey match or best match
          let v1User = v1SearchResult.data.data.values.find(user => user.userkey === userkey);
          if (!v1User) {
            v1User = v1SearchResult.data.data.values[0];
          }
          
          // Convert to V2 format with enhanced data fetching
          let enhancedXpTotal = null;
          let enhancedXpStreak = null;
          let enhancedStatus = null;
          
          // Try to get enhanced data if profileId exists
          if (v1User.profileId) {
            try {
              const profileResult = await ethosApi.getUsersByProfileId([v1User.profileId]);
              if (profileResult.success && profileResult.data && profileResult.data.length > 0) {
                const enhancedData = profileResult.data[0];
                enhancedXpTotal = enhancedData.xpTotal;
                enhancedXpStreak = enhancedData.xpStreakDays;
                enhancedStatus = enhancedData.status;
              }
            } catch (enhanceError) {
              // Could not enhance V1 user data
            }
          }
          
          userResult = {
            id: v1User.profileId || 0,
            profileId: v1User.profileId || 0, 
            displayName: v1User.name,
            username: v1User.username,
            avatarUrl: v1User.avatar,
            description: v1User.description,
            score: v1User.score,
            status: enhancedStatus || (v1User.profileId ? 'ACTIVE' : 'UNINITIALIZED'),
            userkeys: [v1User.userkey],
            xpTotal: enhancedXpTotal || 0,
            xpStreakDays: enhancedXpStreak || 0,
            links: {
              profile: `https://app.ethos.network/profile/${v1User.userkey}`,
              scoreBreakdown: `https://app.ethos.network/profile/${v1User.userkey}/score`
            },
            stats: null
          };
        }
      } catch (v1Error) {
        // V1 fallback error
      }
    }

    // If we got user data, add weekly XP data and leaderboard position
    if (userResult) {
      // Get weekly XP for users with actual activity
      let weeklyXpGain = 0;
      if (userResult.status === 'ACTIVE' && userResult.xpTotal > 0) {
        weeklyXpGain = await ethosApi.getWeeklyXpGain(userkey);
      }
      
      // Get leaderboard position
      let leaderboardPosition = userResult.leaderboardPosition;
      if (!leaderboardPosition) {
        try {
          leaderboardPosition = await ethosApi.getUserLeaderboardPosition(userkey);
        } catch (error) {
          // Could not fetch leaderboard position
        }
      }
      
      const profileData = {
        id: userResult.id,
        profileId: userResult.profileId,
        displayName: userResult.displayName,
        username: userResult.username,
        avatarUrl: userResult.avatarUrl,
        description: userResult.description,
        score: userResult.score,
        status: userResult.status,
        userkeys: userResult.userkeys,
        xpTotal: userResult.xpTotal,
        xpStreakDays: userResult.xpStreakDays,
        leaderboardPosition,
        weeklyXpGain,
        links: userResult.links,
        stats: userResult.stats
      };
      
      return NextResponse.json({ success: true, data: profileData });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Enhanced profile not found' 
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}