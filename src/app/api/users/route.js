import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users - Get all users (for admin purposes)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        referralId: true,
        firstName: true,
        lastName: true,
        referralCount: true,
        referredById: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, username, firstName, lastName, referredById } = body
    
    // Validate required fields
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { referralId: username }
        ]
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }
    
    // If referredById is provided, validate it exists
    if (referredById) {
      const referrer = await prisma.user.findUnique({
        where: { referralId: referredById }
      })
      
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral ID' },
          { status: 400 }
        )
      }
      
      // Check if referrer has reached the limit of 5 direct referrals
      if (referrer.referralCount >= 5) {
        return NextResponse.json(
          { error: 'Referrer has reached the maximum number of direct referrals (5)' },
          { status: 400 }
        )
      }
    }
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        referralId: username, // Use username as referralId for simplicity
        firstName,
        lastName,
        referredById,
      }
    })
    
    // If user was referred, update the referrer's referral count
    if (referredById) {
      await prisma.user.update({
        where: { referralId: referredById },
        data: {
          referralCount: {
            increment: 1
          }
        }
      })
      
      // Create referral records for all levels
      await createReferralChain(referredById, username)
    }
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// Helper function to create referral chain for all 3 levels
async function createReferralChain(referrerId, newUserId) {
  try {
    // Get the referrer's referrer (Level 2)
    const level1User = await prisma.user.findUnique({
      where: { referralId: referrerId },
      select: { referredById: true }
    })
    
    if (level1User?.referredById) {
      // Get the Level 2 referrer's referrer (Level 3)
      const level2User = await prisma.user.findUnique({
        where: { referralId: level1User.referredById },
        select: { referredById: true }
      })
      
      // Create Level 1 referral
      await prisma.referral.create({
        data: {
          referrerId: referrerId,
          referredId: newUserId,
          level: 1
        }
      })
      
      // Create Level 2 referral
      await prisma.referral.create({
        data: {
          referrerId: level1User.referredById,
          referredId: newUserId,
          level: 2
        }
      })
      
      // Create Level 3 referral if exists
      if (level2User?.referredById) {
        await prisma.referral.create({
          data: {
            referrerId: level2User.referredById,
            referredId: newUserId,
            level: 3
          }
        })
      }
    } else {
      // Only Level 1 referral
      await prisma.referral.create({
        data: {
          referrerId: referrerId,
          referredId: newUserId,
          level: 1
        }
      })
    }
  } catch (error) {
    console.error('Error creating referral chain:', error)
  }
}
