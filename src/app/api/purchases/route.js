import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/purchases - Create a purchase and calculate commissions
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, courseId, courseName, amount } = body
    
    // Validate required fields
    if (!userId || !courseId || !courseName || !amount) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { referralId: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Create the purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        courseId,
        courseName,
        amount: parseFloat(amount),
      }
    })
    
    // Calculate and create commissions for all referral levels
    await calculateCommissions(userId, purchase.id, parseFloat(amount))
    
    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    )
  }
}

// GET /api/purchases - Get all purchases (for admin purposes)
export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            username: true,
            referralId: true,
            firstName: true,
            lastName: true,
          }
        },
        commissions: {
          include: {
            user: {
              select: {
                username: true,
                referralId: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    )
  }
}

// Helper function to calculate commissions for all referral levels
async function calculateCommissions(userId, purchaseId, purchaseAmount) {
  try {
    // Get the user's referral chain
    const user = await prisma.user.findUnique({
      where: { referralId: userId },
      select: { referredById: true }
    })
    
    if (!user?.referredById) {
      return // No referrer, no commissions
    }
    
    // Commission rates (from environment variables or defaults)
    const level1Rate = parseFloat(process.env.LEVEL_1_COMMISSION_RATE) || 0.10
    const level2Rate = parseFloat(process.env.LEVEL_2_COMMISSION_RATE) || 0.05
    const level3Rate = parseFloat(process.env.LEVEL_3_COMMISSION_RATE) || 0.02
    
    // Level 1 commission
    const level1Commission = await prisma.commission.create({
      data: {
        userId: user.referredById,
        referrerId: user.referredById,
        level: 1,
        amount: purchaseAmount * level1Rate,
        percentage: level1Rate,
        purchaseId,
      }
    })
    
    // Get Level 2 referrer
    const level1User = await prisma.user.findUnique({
      where: { referralId: user.referredById },
      select: { referredById: true }
    })
    
    if (level1User?.referredById) {
      // Level 2 commission
      await prisma.commission.create({
        data: {
          userId: level1User.referredById,
          referrerId: level1User.referredById,
          level: 2,
          amount: purchaseAmount * level2Rate,
          percentage: level2Rate,
          purchaseId,
        }
      })
      
      // Get Level 3 referrer
      const level2User = await prisma.user.findUnique({
        where: { referralId: level1User.referredById },
        select: { referredById: true }
      })
      
      if (level2User?.referredById) {
        // Level 3 commission
        await prisma.commission.create({
          data: {
            userId: level2User.referredById,
            referrerId: level2User.referredById,
            level: 3,
            amount: purchaseAmount * level3Rate,
            percentage: level3Rate,
            purchaseId,
          }
        })
      }
    }
    
    console.log(`Commissions calculated for purchase ${purchaseId}`)
  } catch (error) {
    console.error('Error calculating commissions:', error)
  }
}
