#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class ProgressTracker {
  constructor() {
    this.progressFile = path.join(process.cwd(), 'screenshots', 'progress-tracking.json');
    this.progressData = this.loadProgressData();
  }

  loadProgressData() {
    try {
      if (fs.existsSync(this.progressFile)) {
        const data = fs.readFileSync(this.progressFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('Creating new progress tracking file...');
    }

    return {
      sessions: [],
      overallProgress: {
        startTime: Date.now(),
        totalSessions: 0,
        successfulSessions: 0,
        averageScore: 0,
        bestScore: 0,
        improvementTrend: []
      },
      milestones: [],
      currentGoal: 'Match Sam Kolder design pixel-perfectly'
    };
  }

  saveProgressData() {
    try {
      const dir = path.dirname(this.progressFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.progressFile, JSON.stringify(this.progressData, null, 2));
    } catch (error) {
      console.error('Error saving progress data:', error.message);
    }
  }

  recordSession(sessionData) {
    console.log('📊 RECORDING SESSION PROGRESS...');
    console.log('=================================\n');

    const session = {
      id: sessionData.timestamp || Date.now(),
      timestamp: Date.now(),
      changeDescription: sessionData.changeDescription,
      targetGoal: sessionData.targetGoal,
      effectivenessScore: sessionData.effectivenessScore,
      measurements: sessionData.measurements,
      suggestions: sessionData.suggestions,
      duration: sessionData.duration || 0,
      success: sessionData.effectivenessScore?.overallScore >= 0.6
    };

    this.progressData.sessions.push(session);
    this.updateOverallProgress(session);
    this.checkMilestones(session);
    this.saveProgressData();

    this.logSessionProgress(session);
    return session;
  }

  updateOverallProgress(session) {
    const overall = this.progressData.overallProgress;
    
    overall.totalSessions++;
    if (session.success) {
      overall.successfulSessions++;
    }

    // Update average score
    const totalScore = overall.averageScore * (overall.totalSessions - 1) + (session.effectivenessScore?.overallScore || 0);
    overall.averageScore = totalScore / overall.totalSessions;

    // Update best score
    if (session.effectivenessScore?.overallScore > overall.bestScore) {
      overall.bestScore = session.effectivenessScore.overallScore;
    }

    // Track improvement trend
    overall.improvementTrend.push({
      session: overall.totalSessions,
      score: session.effectivenessScore?.overallScore || 0,
      timestamp: session.timestamp
    });

    // Keep only last 20 sessions for trend analysis
    if (overall.improvementTrend.length > 20) {
      overall.improvementTrend = overall.improvementTrend.slice(-20);
    }
  }

  checkMilestones(session) {
    const milestones = this.progressData.milestones;
    const score = session.effectivenessScore?.overallScore || 0;

    // Check for score milestones
    if (score >= 0.8 && !milestones.find(m => m.type === 'excellent_score')) {
      milestones.push({
        type: 'excellent_score',
        description: 'Achieved excellent design score (80%+)',
        timestamp: Date.now(),
        sessionId: session.id
      });
    } else if (score >= 0.6 && !milestones.find(m => m.type === 'good_score')) {
      milestones.push({
        type: 'good_score',
        description: 'Achieved good design score (60%+)',
        timestamp: Date.now(),
        sessionId: session.id
      });
    }

    // Check for session milestones
    const totalSessions = this.progressData.overallProgress.totalSessions;
    if (totalSessions === 5 && !milestones.find(m => m.type === 'first_5_sessions')) {
      milestones.push({
        type: 'first_5_sessions',
        description: 'Completed first 5 design sessions',
        timestamp: Date.now(),
        sessionId: session.id
      });
    } else if (totalSessions === 10 && !milestones.find(m => m.type === 'first_10_sessions')) {
      milestones.push({
        type: 'first_10_sessions',
        description: 'Completed first 10 design sessions',
        timestamp: Date.now(),
        sessionId: session.id
      });
    }

    // Check for improvement milestones
    const recentScores = this.progressData.overallProgress.improvementTrend.slice(-5);
    if (recentScores.length >= 5) {
      const isImproving = recentScores.every((score, index) => 
        index === 0 || score.score >= recentScores[index - 1].score
      );
      
      if (isImproving && !milestones.find(m => m.type === 'improvement_streak')) {
        milestones.push({
          type: 'improvement_streak',
          description: '5 consecutive sessions showing improvement',
          timestamp: Date.now(),
          sessionId: session.id
        });
      }
    }
  }

  getProgressSummary() {
    const overall = this.progressData.overallProgress;
    const recentSessions = this.progressData.sessions.slice(-5);
    const recentAverage = recentSessions.reduce((sum, session) => 
      sum + (session.effectivenessScore?.overallScore || 0), 0) / recentSessions.length;

    return {
      totalSessions: overall.totalSessions,
      successRate: overall.totalSessions > 0 ? (overall.successfulSessions / overall.totalSessions * 100).toFixed(1) : 0,
      averageScore: (overall.averageScore * 100).toFixed(1),
      bestScore: (overall.bestScore * 100).toFixed(1),
      recentAverage: (recentAverage * 100).toFixed(1),
      improvementTrend: this.calculateImprovementTrend(),
      milestones: this.progressData.milestones.slice(-5)
    };
  }

  calculateImprovementTrend() {
    const trend = this.progressData.overallProgress.improvementTrend;
    if (trend.length < 2) return 'Insufficient data';

    const recent = trend.slice(-5);
    const older = trend.slice(-10, -5);
    
    if (recent.length < 2) return 'Insufficient data';

    const recentAvg = recent.reduce((sum, item) => sum + item.score, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, item) => sum + item.score, 0) / older.length : recentAvg;

    if (recentAvg > olderAvg * 1.1) return 'Improving';
    if (recentAvg < olderAvg * 0.9) return 'Declining';
    return 'Stable';
  }

  logSessionProgress(session) {
    console.log('📊 SESSION PROGRESS RECORDED:');
    console.log('==============================\n');

    console.log(`🎯 Session: ${session.changeDescription}`);
    console.log(`📈 Score: ${(session.effectivenessScore?.overallScore * 100 || 0).toFixed(1)}%`);
    console.log(`✅ Success: ${session.success ? 'Yes' : 'No'}`);
    console.log(`⏱️  Duration: ${session.duration || 0} seconds\n`);

    const summary = this.getProgressSummary();
    console.log('📊 OVERALL PROGRESS:');
    console.log('====================');
    console.log(`   Total Sessions: ${summary.totalSessions}`);
    console.log(`   Success Rate: ${summary.successRate}%`);
    console.log(`   Average Score: ${summary.averageScore}%`);
    console.log(`   Best Score: ${summary.bestScore}%`);
    console.log(`   Recent Average: ${summary.recentAverage}%`);
    console.log(`   Trend: ${summary.improvementTrend}\n`);

    if (summary.milestones.length > 0) {
      console.log('🏆 RECENT MILESTONES:');
      summary.milestones.forEach(milestone => {
        console.log(`   ${milestone.description}`);
      });
      console.log('');
    }
  }

  generateProgressReport() {
    const summary = this.getProgressSummary();
    const report = `DESIGN PROGRESS REPORT
=====================

Generated: ${new Date().toLocaleString()}
Project: Sam Kolder Design Matching

OVERALL STATISTICS:
- Total Sessions: ${summary.totalSessions}
- Success Rate: ${summary.successRate}%
- Average Score: ${summary.averageScore}%
- Best Score: ${summary.bestScore}%
- Recent Average: ${summary.recentAverage}%
- Improvement Trend: ${summary.improvementTrend}

RECENT SESSIONS:
${this.progressData.sessions.slice(-5).map(session => 
  `- ${session.changeDescription}: ${(session.effectivenessScore?.overallScore * 100 || 0).toFixed(1)}%`
).join('\n')}

MILESTONES ACHIEVED:
${this.progressData.milestones.map(milestone => 
  `- ${milestone.description} (${new Date(milestone.timestamp).toLocaleDateString()})`
).join('\n')}

RECOMMENDATIONS:
${this.generateRecommendations(summary)}
`;

    const reportPath = path.join(process.cwd(), 'screenshots', 'progress-report.txt');
    fs.writeFileSync(reportPath, report);
    
    console.log('📋 PROGRESS REPORT GENERATED:');
    console.log('=============================');
    console.log(`📄 Report saved: ${reportPath}\n`);
    
    return reportPath;
  }

  generateRecommendations(summary) {
    const recommendations = [];

    if (summary.successRate < 50) {
      recommendations.push('- Focus on making smaller, more targeted changes');
      recommendations.push('- Review failed sessions to identify patterns');
    }

    if (summary.recentAverage < 60) {
      recommendations.push('- Consider reverting to a previous successful state');
      recommendations.push('- Break down complex changes into smaller steps');
    }

    if (summary.improvementTrend === 'Declining') {
      recommendations.push('- Take a step back and analyze what\'s working');
      recommendations.push('- Consider a different approach to the design');
    }

    if (summary.totalSessions > 10 && summary.averageScore < 70) {
      recommendations.push('- Consider getting external feedback on the design');
      recommendations.push('- Review the target design more carefully');
    }

    if (recommendations.length === 0) {
      recommendations.push('- Continue with current approach - making good progress!');
    }

    return recommendations.join('\n');
  }

  getProgressData() {
    return this.progressData;
  }
}

export default ProgressTracker;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const tracker = new ProgressTracker();
  
  console.log('📊 PROGRESS TRACKER');
  console.log('===================\n');
  console.log('Usage:');
  console.log('  const tracker = new ProgressTracker();');
  console.log('  tracker.recordSession(sessionData);');
  console.log('  const summary = tracker.getProgressSummary();');
  console.log('  tracker.generateProgressReport();\n');
}


