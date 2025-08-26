# Triago: Multi-Level Referral System

A comprehensive multi-level referral system for course platforms built with Next.js, Prisma, and PostgreSQL. This system allows users to earn commissions from up to three levels of referrals with automatic commission calculations.

## Features

- **Multi-Level Referrals**: Support for up to 3 levels of referrals
- **Automatic Commission Calculation**: Real-time commission distribution on course purchases
- **Human-Readable Referral IDs**: Simple referral IDs like "johnsmith" or "jsmith-102"
- **Referral Limits**: Maximum of 5 direct referrals per user
- **Commission Tiers**:
  - Level 1 (Direct): 10% commission
  - Level 2 (Indirect): 5% commission  
  - Level 3 (Third level): 2% commission
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Tracking**: Live updates of referral networks and commissions

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- **No database setup needed! Uses SQLite (just a file)**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dascher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   The setup script will do this automatically! No manual editing needed.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations (creates SQLite file automatically)
   npx prisma db push
   
   # (Optional) Open Prisma Studio to view/edit data
   npx prisma studio
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The system uses the following main models:

### User
- Basic user information (email, username, name)
- `referralId`: Human-readable referral identifier
- `referredById`: Points to the user who referred them
- `referralCount`: Current number of direct referrals (max 5)

### Referral
- Tracks referral relationships across all levels
- `level`: 1, 2, or 3 (referral depth)
- Links referrer and referred users

### Commission
- Records commission earnings for each referral level
- Automatic calculation based on course purchase amounts
- Status tracking (PENDING, PAID, CANCELLED)

### Purchase
- Course purchase records
- Triggers automatic commission calculations
- Links to commission records

## Usage

### 1. User Registration
- Navigate to the "Add Users" tab
- Fill in user details including referral ID
- Optionally specify who referred them
- System automatically creates referral relationships

### 2. View Referral Network
- Use the "Referral Network" tab to visualize the referral tree
- See all users across three levels
- View referral statistics and counts

### 3. Track Commissions
- Check the "Commissions" tab for earnings overview
- View commission breakdown by level
- Track pending vs. paid commissions

### 4. Simulate Purchases
- Use the "Simulate Purchase" tab to test the system
- Enter user referral ID and course details
- System automatically calculates and distributes commissions

## API Endpoints

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[referralId]/referrals` - Get user's referral network
- `GET /api/users/[referralId]/commissions` - Get user's commission history

### Purchases
- `GET /api/purchases` - List all purchases
- `POST /api/purchases` - Create purchase and calculate commissions

## Commission Calculation Logic

1. **Level 1 Commission**: Direct referrer gets 10% of course price
2. **Level 2 Commission**: Indirect referrer gets 5% of course price  
3. **Level 3 Commission**: Third-level referrer gets 2% of course price

Commissions are automatically calculated when:
- A user makes a course purchase
- The user has a valid referral chain
- All referral levels are properly linked

## Referral Chain Example

```
User A (referrer)
├── User B (Level 1 referral - gets 10% commission)
    ├── User C (Level 2 referral - gets 5% commission)
        └── User D (Level 3 referral - gets 2% commission)
```

When User D purchases a $100 course:
- User B earns $10 (10% of $100)
- User A earns $5 (5% of $100)
- User A's referrer (if any) earns $2 (2% of $100)

## Customization

### Commission Rates
Edit the environment variables to change commission percentages:
```env
LEVEL_1_COMMISSION_RATE=0.15  # 15% instead of 10%
LEVEL_2_COMMISSION_RATE=0.08  # 8% instead of 5%
LEVEL_3_COMMISSION_RATE=0.03  # 3% instead of 2%
```

### Referral Limits
Modify the maximum direct referrals in the user creation API:
```javascript
// In src/app/api/users/route.js
if (referrer.referralCount >= 10) { // Change from 5 to 10
  // ... error handling
}
```

## Development

### Project Structure
```
src/
├── app/
│   ├── api/           # API routes
│   ├── layout.js      # Root layout
│   └── page.js        # Main dashboard
├── components/        # React components
└── lib/              # Utility functions
```

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Build React components in `src/components/`
3. Update the main dashboard in `src/app/page.js`
4. Add database models to `prisma/schema.prisma`

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection string
- Authentication secrets
- Commission rates
- API URLs

### Database
- Use a production PostgreSQL instance
- Run `npx prisma db push` to apply schema changes
- Consider using Prisma migrations for production

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in .env.local
   - Ensure PostgreSQL is running
   - Check database permissions

2. **Prisma Client Error**
   - Run `npx prisma generate` after schema changes
   - Restart development server

3. **Commission Calculation Issues**
   - Verify referral relationships exist
   - Check commission rate environment variables
   - Review API error logs

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=prisma:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review API documentation
3. Open a GitHub issue with detailed information
