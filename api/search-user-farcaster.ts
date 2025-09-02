import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ethosApi } from '../api-utils/ethos-api';

// Specify runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterUsername } = z.object({
      farcasterUsername: z.string().min(1),
    }).parse(body);

    // Step 1: Try to get FID from Farcaster username API
    const usernameResult = await ethosApi.getUserByFarcasterUsername(farcasterUsername);
    
    if (!usernameResult.success) {
      // Fallback to global search if no Farcaster user found
      try {
        const globalSearchResult = await ethosApi.searchUsersV1(farcasterUsername, 10);
        
        if (globalSearchResult.success && globalSearchResult.data?.ok && globalSearchResult.data.data.values.length > 0) {
          // Find best match from global search
          const bestMatch = globalSearchResult.data.data.values[0];
          
          // Convert to expected user format
          const globalUser = {
            id: bestMatch.profileId,
            profileId: bestMatch.profileId,
            displayName: bestMatch.name,
            username: bestMatch.username,
            avatarUrl: bestMatch.avatar,
            description: bestMatch.description,
            score: bestMatch.score,
            status: null,
            userkeys: [bestMatch.userkey],
            xpTotal: null,
            xpStreakDays: null,
            links: {
              profile: `https://app.ethos.network/profile/${bestMatch.userkey}`,
              scoreBreakdown: `https://app.ethos.network/profile/${bestMatch.userkey}/score`
            },
            stats: null,
            _crossReferenced: true,
            _originalQuery: farcasterUsername
          };
          
          return NextResponse.json({ success: true, data: globalUser });
        }
      } catch (globalError) {
        // Global search fallback error
      }
      
      return NextResponse.json({
        success: false,
        error: `User not found in Farcaster or global search: ${farcasterUsername}`
      }, { status: 404 });
    }

    const userData = usernameResult.data;
    if (!userData || !userData.user) {
      return NextResponse.json({
        success: false,
        error: `Invalid Farcaster user data for: ${farcasterUsername}`
      }, { status: 404 });
    }

    // Step 2: Extract FID from response
    const farcasterKey = userData.user.userkeys?.find((key: string) => key.startsWith('service:farcaster:'));
    if (!farcasterKey) {
      return NextResponse.json({
        success: false,
        error: `No FID found for Farcaster user: ${farcasterUsername}`
      }, { status: 404 });
    }

    const fid = farcasterKey.split(':')[2];

    // Step 3: Get complete profile data using FID API endpoint
    const fidResult = await ethosApi.getUserByFarcasterFid(fid);
    
    if (!fidResult.success) {
      return NextResponse.json({
        success: false,
        error: `Could not get profile data for FID: ${fid}`
      }, { status: 404 });
    }

    // Return pure Farcaster profile data
    const enhancedUser = {
      ...fidResult.data,
      _isFarcasterEnhanced: true,
      _fid: fid,
      _pureFarcaster: true
    };

    return NextResponse.json({ success: true, data: enhancedUser });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}