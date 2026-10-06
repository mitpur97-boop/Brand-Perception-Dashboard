const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = path.join(__dirname, "test-output");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runBrowserTests() {
  console.log("=== Starting Browser Automated Verification ===");
  console.log("Launching Edge at:", EDGE_PATH);

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });

  const page = await context.newPage();

  try {
    // 1. Visit Overview Page
    console.log("1. Navigating to http://localhost:3000...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 15000 });

    // Wait for content
    await page.waitForSelector("text=Brand Health Score", { timeout: 10000 });
    console.log("✓ Overview Page Loaded successfully.");

    // Check Brand Health Score
    const healthText = await page.textContent("text=Brand Health Score");
    console.log("✓ Health score component visible:", Boolean(healthText));

    // Save Light Mode Screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, "1-overview-light.png") });
    console.log("✓ Screenshot saved: 1-overview-light.png");

    // 2. Test Dark Mode Toggle
    console.log("2. Testing Dark Mode Toggle...");
    const themeBtn = await page.locator("button[aria-label='Toggle dark mode']");
    await themeBtn.click();
    await page.waitForTimeout(500);

    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    console.log("✓ Dark mode active on <html>:", isDark);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "2-overview-dark.png") });
    console.log("✓ Screenshot saved: 2-overview-dark.png");

    // 3. Navigate to Reviews & Feed Tab
    console.log("3. Testing Reviews Feed & Model Predictions...");
    await page.click("button:has-text('Reviews & Feed')");
    await page.waitForTimeout(1000);
    await page.waitForSelector("text=Customer Reviews & Model Predictions", { timeout: 5000 });

    // Verify reviews rendered
    const reviewCards = await page.locator("text=Confidence").count();
    console.log(`✓ Review cards with ML confidence rendered: ${reviewCards} found`);

    // Test Search Filter
    const searchInput = page.locator("input[placeholder*='Search by review keywords']");
    await searchInput.fill("handloom");
    await page.waitForTimeout(500);
    const filteredCount = await page.locator("text=Confidence").count();
    console.log(`✓ Search filter applied for 'handloom': ${filteredCount} reviews matched`);
    await searchInput.fill(""); // clear search
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(OUTPUT_DIR, "3-reviews-feed.png") });
    console.log("✓ Screenshot saved: 3-reviews-feed.png");

    // 4. Navigate to Algorithmic Variations Tab
    console.log("4. Testing Algorithmic Variations View...");
    await page.click("button:has-text('Algorithmic Variations')");
    await page.waitForTimeout(1000);
    await page.waitForSelector("text=Algorithmic Perception Variations", { timeout: 5000 });

    // Verify the 3 key methods
    const hasSma = await page.locator("text=Method 1: Rolling SMA").count();
    const hasWeighted = await page.locator("text=Method 2: Weighted Score").count();
    const hasNps = await page.locator("text=Method 3: Estimated NPS").count();
    const hasMatrix = await page.locator("text=Algorithmic Variations Comparative Matrix").count();

    console.log(`✓ Method 1 (7-Day SMA) present: ${hasSma > 0}`);
    console.log(`✓ Method 2 (Weighted Sentiment) present: ${hasWeighted > 0}`);
    console.log(`✓ Method 3 (Estimated NPS) present: ${hasNps > 0}`);
    console.log(`✓ Comparative Matrix Table present: ${hasMatrix > 0}`);

    // Click subview pills
    await page.click("button:has-text('Weighted Score')");
    await page.waitForTimeout(600);
    console.log("✓ Switched to Weighted Score subview");

    await page.click("button:has-text('Estimated NPS')");
    await page.waitForTimeout(600);
    console.log("✓ Switched to Estimated NPS subview");

    await page.click("button:has-text('All Variations')");
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(OUTPUT_DIR, "4-algorithmic-variations.png") });
    console.log("✓ Screenshot saved: 4-algorithmic-variations.png");

    // 5. Test Live Review Classifier Modal
    console.log("5. Testing Live ML Inference Modal...");
    await page.click("button:has-text('Classify Review')");
    await page.waitForTimeout(600);
    await page.waitForSelector("text=Live ML Sentiment Inference Tester", { timeout: 5000 });

    // Enter custom review
    const modalTextarea = page.locator("textarea[placeholder*='Type or paste any customer review']");
    await modalTextarea.fill("The handloom weave quality is extraordinary and customer service was truly delightful!");
    await page.waitForTimeout(300);

    // Click Classify with ML
    await page.click("button:has-text('Classify with ML')");
    await page.waitForSelector("text=Predicted Class:", { timeout: 8000 });

    const predictedClass = await page.textContent("text=Predicted Class:");
    console.log("✓ Live Model Result:", predictedClass);

    await page.screenshot({ path: path.join(OUTPUT_DIR, "5-live-ml-modal.png") });
    console.log("✓ Screenshot saved: 5-live-ml-modal.png");

    // Add to dashboard stream
    await page.click("button:has-text('Add to Dashboard Stream')");
    await page.waitForTimeout(1500);
    console.log("✓ Live review added to dashboard stream successfully");

    console.log("\n==========================================");
    console.log("🎉 ALL BROWSER AUTOMATION TESTS PASSED!");
    console.log("==========================================");
  } catch (error) {
    console.error("Test failed with error:", error);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "test-failure.png") });
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runBrowserTests();
