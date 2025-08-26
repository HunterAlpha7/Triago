const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...')

    // Clear existing data
    await prisma.commission.deleteMany()
    await prisma.purchase.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Cleared existing data')

    // Create demo users
    const users = [
      {
        email: 'john@example.com',
        username: 'johnsmith',
        referralId: 'johnsmith',
        firstName: 'John',
        lastName: 'Smith',
        referredById: null
      },
      {
        email: 'jane@example.com',
        username: 'janedoe',
        referralId: 'janedoe',
        firstName: 'Jane',
        lastName: 'Doe',
        referredById: 'johnsmith'
      },
      {
        email: 'bob@example.com',
        username: 'bobwilson',
        referralId: 'bobwilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        referredById: 'johnsmith'
      },
      {
        email: 'alice@example.com',
        username: 'alicebrown',
        referralId: 'alicebrown',
        firstName: 'Alice',
        lastName: 'Brown',
        referredById: 'janedoe'
      },
      {
        email: 'charlie@example.com',
        username: 'charliedavis',
        referralId: 'charliedavis',
        firstName: 'Charlie',
        lastName: 'Davis',
        referredById: 'bobwilson'
      },
      {
        email: 'diana@example.com',
        username: 'dianamiller',
        referralId: 'dianamiller',
        firstName: 'Diana',
        lastName: 'Miller',
        referredById: 'alicebrown'
      },
      {
        email: 'edward@example.com',
        username: 'edwardgarcia',
        referralId: 'edwardgarcia',
        firstName: 'Edward',
        lastName: 'Garcia',
        referredById: 'charliedavis'
      }
    ]

    // Create users
    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData
      })
      console.log(`✅ Created user: ${user.username}`)
    }

    // Create referral relationships manually to ensure proper levels
    const referrals = [
      // Level 1 referrals
      { referrerId: 'johnsmith', referredId: 'janedoe', level: 1 },
      { referrerId: 'johnsmith', referredId: 'bobwilson', level: 1 },
      
      // Level 2 referrals
      { referrerId: 'johnsmith', referredId: 'alicebrown', level: 2 },
      { referrerId: 'johnsmith', referredId: 'charliedavis', level: 2 },
      
      // Level 3 referrals
      { referrerId: 'johnsmith', referredId: 'dianamiller', level: 3 },
      { referrerId: 'johnsmith', referredId: 'edwardgarcia', level: 3 }
    ]

    for (const referralData of referrals) {
      await prisma.referral.create({
        data: referralData
      })
      console.log(`✅ Created referral: ${referralData.referrerId} → ${referralData.referredId} (Level ${referralData.level})`)
    }

    // Update referral counts
    await prisma.user.update({
      where: { referralId: 'johnsmith' },
      data: { referralCount: 2 }
    })

    await prisma.user.update({
      where: { referralId: 'janedoe' },
      data: { referralCount: 1 }
    })

    await prisma.user.update({
      where: { referralId: 'bobwilson' },
      data: { referralCount: 1 }
    })

    await prisma.user.update({
      where: { referralId: 'alicebrown' },
      data: { referralCount: 1 }
    })

    await prisma.user.update({
      where: { referralId: 'charliedavis' },
      data: { referralCount: 1 }
    })

    console.log('✅ Updated referral counts')

    // Create demo purchases and commissions
    const purchases = [
      {
        userId: 'alicebrown',
        courseId: 'course-001',
        courseName: 'Advanced JavaScript',
        amount: 99.99
      },
      {
        userId: 'charliedavis',
        courseId: 'course-002',
        courseName: 'React Fundamentals',
        amount: 149.99
      },
      {
        userId: 'dianamiller',
        courseId: 'course-003',
        courseName: 'Node.js Backend',
        amount: 199.99
      }
    ]

    for (const purchaseData of purchases) {
      const purchase = await prisma.purchase.create({
        data: purchaseData
      })
      console.log(`✅ Created purchase: ${purchase.courseName} for ${purchase.userId}`)

      // Calculate and create commissions
      await calculateCommissions(purchase.userId, purchase.id, purchase.amount)
    }

    console.log('✅ Created demo purchases and commissions')

    console.log('\n🎉 Demo data seeding completed!')
    console.log('\nDemo users created:')
    console.log('- johnsmith (root user with 2 direct referrals)')
    console.log('- janedoe (referred by johnsmith)')
    console.log('- bobwilson (referred by johnsmith)')
    console.log('- alicebrown (referred by janedoe, level 2 from johnsmith)')
    console.log('- charliedavis (referred by bobwilson, level 2 from johnsmith)')
    console.log('- dianamiller (referred by alicebrown, level 3 from johnsmith)')
    console.log('- edwardgarcia (referred by charliedavis, level 3 from johnsmith)')
    
    console.log('\nYou can now:')
    console.log('1. View the referral network for "johnsmith"')
    console.log('2. Check commissions for any user')
    console.log('3. Simulate more course purchases')
    console.log('4. Add new users to the system')

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

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
    
    // Commission rates
    const level1Rate = 0.10
    const level2Rate = 0.05
    const level3Rate = 0.02
    
    // Level 1 commission
    await prisma.commission.create({
      data: {
        userId: user.referredById,
        referrerId: user.referredById,
        level: 1,
        amount: purchaseAmount * level1Rate,
        percentage: level1Rate,
        purchaseId,
        status: 'PENDING'
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
          status: 'PENDING'
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
            status: 'PENDING'
          }
        })
      }
    }
    
    console.log(`✅ Commissions calculated for purchase ${purchaseId}`)
  } catch (error) {
    console.error('Error calculating commissions:', error)
  }
}

// Run the seeding function
seedDemoData()
