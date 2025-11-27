#!/usr/bin/env node

/**
 * Automated Health Check Script
 * Monitors the health of the Australian Property Investment Calculator
 * Run this script to check if everything is working correctly
 */

const https = require("https");
const { execSync } = require("child_process");

const PRODUCTION_URL = "https://aupropertyinvestmentmc.vercel.app";
const LOCAL_URL = "http://localhost:3000";

class HealthChecker {
  constructor() {
    this.results = {
      production: {},
      local: {},
      build: {},
      lint: {},
    };
  }

  async checkProduction() {
    console.log("🌐 Checking production site...");

    try {
      const response = await this.makeRequest(PRODUCTION_URL);
      this.results.production = {
        status: response.statusCode,
        responseTime: response.responseTime,
        working: response.statusCode === 200,
      };
      console.log(`✅ Production: ${response.statusCode} (${response.responseTime}ms)`);
    } catch (error) {
      this.results.production = {
        status: "ERROR",
        error: error.message,
        working: false,
      };
      console.log(`❌ Production: ${error.message}`);
    }
  }

  async checkLocal() {
    console.log("🏠 Checking local development server...");

    try {
      const response = await this.makeRequest(LOCAL_URL);
      this.results.local = {
        status: response.statusCode,
        responseTime: response.responseTime,
        working: response.statusCode === 200,
      };
      console.log(`✅ Local: ${response.statusCode} (${response.responseTime}ms)`);
    } catch (error) {
      this.results.local = {
        status: "NOT RUNNING",
        error: error.message,
        working: false,
      };
      console.log(`❌ Local: ${error.message}`);
    }
  }

  checkBuild() {
    console.log("🔨 Checking build process...");

    try {
      execSync("npm run build", {
        stdio: "pipe",
        cwd: process.cwd(),
      });
      this.results.build = {
        status: "SUCCESS",
        working: true,
      };
      console.log("✅ Build: Successful");
    } catch (error) {
      this.results.build = {
        status: "ERROR",
        error: error.message,
        working: false,
      };
      console.log(`❌ Build: ${error.message}`);
    }
  }

  checkLint() {
    console.log("🔍 Checking code quality...");

    try {
      execSync("npm run lint", {
        stdio: "pipe",
        cwd: process.cwd(),
      });
      this.results.lint = {
        status: "SUCCESS",
        working: true,
      };
      console.log("✅ Lint: No errors");
    } catch (error) {
      this.results.lint = {
        status: "WARNINGS",
        error: error.message,
        working: false,
      };
      console.log(`⚠️ Lint: ${error.message}`);
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const request = https.get(url, (response) => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: response.statusCode,
          responseTime,
        });
      });

      request.on("error", (error) => {
        reject(error);
      });

      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error("Request timeout"));
      });
    });
  }

  generateReport() {
    console.log("\n📊 HEALTH CHECK REPORT");
    console.log("=".repeat(50));

    const allWorking = Object.values(this.results).every((result) => result.working);

    if (allWorking) {
      console.log("🎉 ALL SYSTEMS OPERATIONAL!");
    } else {
      console.log("⚠️  ISSUES DETECTED:");

      if (!this.results.production.working) {
        console.log("  - Production site issues");
      }
      if (!this.results.local.working) {
        console.log("  - Local development server not running");
      }
      if (!this.results.build.working) {
        console.log("  - Build process failing");
      }
      if (!this.results.lint.working) {
        console.log("  - Code quality issues");
      }
    }

    console.log("\n📋 DETAILED RESULTS:");
    console.log(`Production: ${this.results.production.status}`);
    console.log(`Local: ${this.results.local.status}`);
    console.log(`Build: ${this.results.build.status}`);
    console.log(`Lint: ${this.results.lint.status}`);

    console.log("\n🔧 RECOMMENDED ACTIONS:");

    if (!this.results.local.working) {
      console.log("1. Start development server: npm run dev");
    }

    if (!this.results.build.working) {
      console.log("2. Fix build errors before deployment");
    }

    if (!this.results.lint.working) {
      console.log("3. Fix linting issues: npm run lint --fix");
    }

    console.log("\n📱 MANUAL TESTING STEPS:");
    console.log("1. Visit: https://aupropertyinvestmentmc.vercel.app/en/firb-calculator");
    console.log("2. Complete a calculation with sample data");
    console.log('3. Click "Show Investment Analysis"');
    console.log("4. Test PDF download");
    console.log("5. Test mobile responsiveness");
  }

  async run() {
    console.log("🏥 AUSTRALIAN PROPERTY INVESTMENT CALCULATOR HEALTH CHECK");
    console.log("=".repeat(60));
    console.log("");

    await this.checkProduction();
    await this.checkLocal();
    this.checkBuild();
    this.checkLint();

    this.generateReport();
  }
}

// Run health check if this script is executed directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.run().catch(console.error);
}

module.exports = HealthChecker;
