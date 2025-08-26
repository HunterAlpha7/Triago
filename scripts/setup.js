const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Multi-Level Referral System Setup...\n')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, description) {
  log(`\n${step} ${description}`, 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function runCommand(command, description) {
  try {
    log(`Running: ${command}`, 'blue')
    execSync(command, { stdio: 'inherit' })
    logSuccess(description)
    return true
  } catch (error) {
    logError(`Failed: ${description}`)
    return false
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath)
}

function createEnvFile() {
  const envExamplePath = path.join(process.cwd(), 'env.example')
  const envLocalPath = path.join(process.cwd(), '.env.local')
  
  if (!checkFileExists(envLocalPath)) {
    if (checkFileExists(envExamplePath)) {
      logStep('1️⃣', 'Creating environment file...')
      try {
        fs.copyFileSync(envExamplePath, envLocalPath)
        logSuccess('Created .env.local from env.example')
        logSuccess('No database setup needed - using SQLite!')
      } catch (error) {
        logError('Failed to create .env.local file')
      }
    } else {
      logError('env.example file not found')
    }
  } else {
    logSuccess('.env.local already exists')
  }
  return Promise.resolve()
}

async function main() {
  try {
    // Step 1: Create environment file
    await createEnvFile()
    
    // Step 2: Install dependencies
    logStep('2️⃣', 'Installing dependencies...')
    if (!runCommand('npm install', 'Dependencies installed')) {
      logError('Setup failed at dependency installation')
      process.exit(1)
    }
    
    // Step 3: Generate Prisma client
    logStep('3️⃣', 'Generating Prisma client...')
    if (!runCommand('npx prisma generate', 'Prisma client generated')) {
      logError('Setup failed at Prisma client generation')
      process.exit(1)
    }
    
    // Step 4: Push database schema
    logStep('4️⃣', 'Setting up database schema...')
    if (!runCommand('npx prisma db push', 'Database schema created')) {
      logError('Database setup failed. Please check the error above.')
      process.exit(1)
    }
    
    // Step 5: Seed demo data
    logStep('5️⃣', 'Seeding demo data...')
    if (!runCommand('npm run seed', 'Demo data seeded')) {
      logWarning('Demo data seeding failed, but setup can continue')
    }
    
    // Step 6: Setup complete
    logStep('🎉', 'Setup Complete!')
    logSuccess('Your Multi-Level Referral System is ready!')
    
    console.log('\n' + '='.repeat(60))
    log('🚀 NEXT STEPS:', 'bright')
    console.log('='.repeat(60))
    
    log('\n1. Start the development server:', 'cyan')
    log('   npm run dev', 'blue')
    
    log('\n2. Open your browser to:', 'cyan')
    log('   http://localhost:3000', 'blue')
    
    log('\n3. View the referral network for user "johnsmith"', 'cyan')
    
    log('\n4. Test the system by:', 'cyan')
    log('   - Adding new users in the "Add Users" tab', 'blue')
    log('   - Simulating course purchases in the "Simulate Purchase" tab', 'blue')
    log('   - Viewing commissions in the "Commissions" tab', 'blue')
    
    console.log('\n' + '='.repeat(60))
    
    // Ask if user wants to start the dev server now
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    rl.question('\nWould you like to start the development server now? (y/n): ', (answer) => {
      rl.close()
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        log('\n🚀 Starting development server...', 'green')
        try {
          execSync('npm run dev', { stdio: 'inherit' })
        } catch (error) {
          logError('Failed to start development server')
        }
      } else {
        log('\n✨ Setup complete! Run "npm run dev" when you\'re ready to start.', 'green')
      }
    })
    
  } catch (error) {
    logError('Setup failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run the setup
main()
