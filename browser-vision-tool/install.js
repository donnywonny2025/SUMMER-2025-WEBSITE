const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Installing Browser Vision Tool...\n');

const commands = [
  'npm install',
  'npx playwright install chromium'
];

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`⚡ Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error}`);
        reject(error);
        return;
      }
      if (stderr) console.log(`⚠️  ${stderr}`);
      if (stdout) console.log(stdout);
      resolve();
    });
  });
}

async function install() {
  try {
    for (const command of commands) {
      await runCommand(command);
    }
    
    console.log('\n✅ Installation complete!');
    console.log('\n📋 Usage:');
    console.log('  npm run server     # Start API server');
    console.log('  npm start          # Direct command line usage');
    console.log('  npm run analyze    # Analyze mode');
    
    console.log('\n🔧 IDE Integration:');
    console.log('  POST http://localhost:8080/full-copy');
    console.log('  Body: { "referenceUrl": "https://apple.com", "targetUrl": "localhost:3000", "elementSelector": "h1" }');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

install();
