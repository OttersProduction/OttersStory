import { test, expect } from "@playwright/test";

test("home page renders correctly on mobile", async ({ page }) => {
  await page.goto("/");

  // Ensure main heading is visible on a mobile-sized viewport
  await expect(
    page.getByRole("heading", { name: /MapleStory Washing Calculator/i }),
  ).toBeVisible();

  // Capture a full-page screenshot for visual inspection
  await page.screenshot({
    path: "test-results/mobile-home.png",
    fullPage: true,
  });
});


