const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Starting Backend Verification...');

// 1. Check Environment Variables
console.log('\n1. Checking Environment Variables:');
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
let envMissing = false;
requiredEnv.forEach(env => {
    if (process.env[env]) {
        console.log(`   ✅ ${env} is set`);
    } else {
        console.log(`   ❌ ${env} is MISSING`);
        envMissing = true;
    }
});

if (envMissing) {
    console.error('   ❌ Setup Failed: Missing environment variables');
    process.exit(1);
}

// 2. Check Directory Structure
console.log('\n2. Checking Directory Structure:');
const requiredDirs = [
    'config',
    'controllers',
    'middleware',
    'models',
    'routes',
    'utils',
    'uploads' // Created dynamically but good to check
];

requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        console.log(`   ✅ ${dir}/ exists`);
    } else {
        console.log(`   ❌ ${dir}/ is MISSING`);
        // Create if missing (especially uploads)
        if (dir === 'uploads') {
            fs.mkdirSync(dirPath);
            console.log(`      Created ${dir}/ directory`);
        }
    }
});

// 3. Test Database Connection
console.log('\n3. Testing MongoDB Connection:');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('   ✅ MongoDB Connected Successfully!');
        console.log('   ✅ Backend Setup Verified!');
        console.log('\n🚀 To start the server, run: npm run dev');
        process.exit(0);
    })
    .catch(err => {
        console.log('   ❌ MongoDB Connection Failed:');
        console.error(err.message);
        console.log('\n   ⚠️  Make sure MongoDB is running locally on default port 27017');
        console.log('      Or update MONGODB_URI in .env file');
        process.exit(1);
    });
