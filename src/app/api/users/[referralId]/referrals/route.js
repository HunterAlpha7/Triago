import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/[referralId]/referrals - Get user's referral network
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { referralId } = resolvedParams
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { referralId },
      select: {
        id: true,
        username: true,
        referralId: true,
        firstName: true,
        lastName: true,
        referralCount: true,
        referredById: true,
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get all referrals for this user across all levels
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: referralId
      },
      include: {
        referred: {
          select: {
            id: true,
            username: true,
            referralId: true,
            firstName: true,
            lastName: true,
            referralCount: true,
            createdAt: true,
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    // Organize referrals by level
    const referralNetwork = {
      user,
      levels: {
        level1: referrals.filter(r => r.level === 1).map(r => r.referred),
        level2: referrals.filter(r => r.level === 2).map(r => r.referred),
        level3: referrals.filter(r => r.level === 3).map(r => r.referred),
      },
      stats: {
        totalReferrals: referrals.length,
        level1Count: referrals.filter(r => r.level === 1).length,
        level2Count: referrals.filter(r => r.level === 2).length,
        level3Count: referrals.filter(r => r.level === 3).length,
      }
    }
    
    return NextResponse.json(referralNetwork)
  } catch (error) {
    console.error('Error fetching referral network:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral network' },
      { status: 500 }
    )
  }
}
