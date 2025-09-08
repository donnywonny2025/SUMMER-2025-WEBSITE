import MandatoryVisualVerification from './mandatory-visual-verification.js';
import fs from 'fs';
import path from 'path';

console.log('🚨 FORCE VISUAL VERIFICATION SYSTEM');
console.log('===================================\n');

class ForceVisualVerification {
  constructor() {
    this.verification = new MandatoryVisualVerification();
    this.verificationHistory = [];
  }

  async forceVerificationAfterChange(changeDescription) {
    console.log(`🚨 FORCING VISUAL VERIFICATION AFTER: ${changeDescription}`);
    console.log('=====================================================');
    
    try {
      // Run mandatory verification
      const report = await this.verification.runMandatoryVerification();
      
      // Add to history
      this.verificationHistory.push({
        timestamp: new Date().toISOString(),
        change: changeDescription,
        report: report
      });
      
      // Save history
      this.saveVerificationHistory();
      
      // Check if verification passed
      if (report.summary.totalIssues === 0) {
        console.log('\n✅ VERIFICATION PASSED - Change successful!');
        return { success: true, report: report };
      } else {
        console.log('\n❌ VERIFICATION FAILED - Issues found!');
        console.log('🚨 YOU MUST FIX THESE ISSUES BEFORE CONTINUING!');
        return { success: false, report: report, issues: report.actionPlan };
      }
      
    } catch (error) {
      console.error('❌ FORCED VERIFICATION FAILED:', error.message);
      throw error;
    }
  }

  saveVerificationHistory() {
    const historyPath = path.join(process.cwd(), 'screenshots', 'verification', 'verification-history.json');
    fs.writeFileSync(historyPath, JSON.stringify(this.verificationHistory, null, 2));
  }

  async blockUntilVerificationPasses(changeDescription) {
    console.log(`🚨 BLOCKING UNTIL VERIFICATION PASSES FOR: ${changeDescription}`);
    console.log('=======================================================');
    
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`\n🔄 Verification attempt ${attempts}/${maxAttempts}`);
      
      const result = await this.forceVerificationAfterChange(changeDescription);
      
      if (result.success) {
        console.log(`\n✅ VERIFICATION PASSED ON ATTEMPT ${attempts}!`);
        return result;
      } else {
        console.log(`\n❌ VERIFICATION FAILED ON ATTEMPT ${attempts}`);
        console.log('🚨 YOU MUST FIX THE ISSUES BEFORE CONTINUING!');
        
        if (attempts < maxAttempts) {
          console.log('⏳ Waiting for you to fix the issues...');
          console.log('💡 Fix the issues and run the verification again.');
          throw new Error('VERIFICATION_FAILED - Fix issues and try again');
        } else {
          console.log('🚨 MAXIMUM ATTEMPTS REACHED - VERIFICATION FAILED');
          throw new Error('VERIFICATION_FAILED_MAX_ATTEMPTS');
        }
      }
    }
  }

  printVerificationSummary() {
    console.log('\n📊 VERIFICATION HISTORY SUMMARY');
    console.log('===============================');
    
    this.verificationHistory.forEach((entry, index) => {
      const status = entry.report.summary.totalIssues === 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`${index + 1}. ${entry.change} - ${status} (${entry.report.summary.totalIssues} issues)`);
    });
  }
}

// Main execution
async function main() {
  const forceVerification = new ForceVisualVerification();
  
  try {
    const changeDescription = process.argv[2] || 'Unknown change';
    const result = await forceVerification.forceVerificationAfterChange(changeDescription);
    
    if (result.success) {
      console.log('\n🎉 VERIFICATION SUCCESSFUL!');
    } else {
      console.log('\n🚨 VERIFICATION FAILED - FIX ISSUES!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ FORCE VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export default ForceVisualVerification;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
