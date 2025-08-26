import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/[referralId]/commissions - Get user's commission history
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
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get all commissions for this user
    const commissions = await prisma.commission.findMany({
      where: {
        userId: referralId
      },
      include: {
        purchase: {
          select: {
            courseName: true,
            amount: true,
            createdAt: true,
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
    
    // Calculate summary statistics
    const totalEarnings = commissions.reduce((sum, commission) => {
      return sum + parseFloat(commission.amount)
    }, 0)
    
    const pendingEarnings = commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, commission) => {
        return sum + parseFloat(commission.amount)
      }, 0)
    
    const paidEarnings = commissions
      .filter(c => c.status === 'PAID')
      .reduce((sum, commission) => {
        return sum + parseFloat(commission.amount)
      }, 0)
    
    // Group commissions by level
    const commissionsByLevel = {
      level1: commissions.filter(c => c.level === 1),
      level2: commissions.filter(c => c.level === 2),
      level3: commissions.filter(c => c.level === 3),
    }
    
    // Calculate earnings by level
    const earningsByLevel = {
      level1: commissionsByLevel.level1.reduce((sum, c) => sum + parseFloat(c.amount), 0),
      level2: commissionsByLevel.level2.reduce((sum, c) => sum + parseFloat(c.amount), 0),
      level3: commissionsByLevel.level3.reduce((sum, c) => sum + parseFloat(c.amount), 0),
    }
    
    const commissionData = {
      user,
      commissions,
      summary: {
        totalEarnings,
        pendingEarnings,
        paidEarnings,
        totalCommissions: commissions.length,
        pendingCommissions: commissions.filter(c => c.status === 'PENDING').length,
        paidCommissions: commissions.filter(c => c.status === 'PAID').length,
      },
      byLevel: {
        level1: {
          count: commissionsByLevel.level1.length,
          earnings: earningsByLevel.level1,
          percentage: 10, // 10%
        },
        level2: {
          count: commissionsByLevel.level2.length,
          earnings: earningsByLevel.level2,
          percentage: 5, // 5%
        },
        level3: {
          count: commissionsByLevel.level3.length,
          earnings: earningsByLevel.level3,
          percentage: 2, // 2%
        },
      }
    }
    
    return NextResponse.json(commissionData)
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}
