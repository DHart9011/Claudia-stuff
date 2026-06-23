# Rebel Red's Gyros — SEO Audit Confirmation Report
**Client:** Rebel Red's Gyros | rebelredsgyros.com
**Prepared by:** SEO Deliverables Team
**Date:** 2026-06-23
**Scope:** Initial technical and on-page SEO audit findings confirmation

---

## Audit Item Review

### 1. Models Page Title Reads "General 1 — REBEL RED"

**Status: CONFIRMED**

The models/new gyros page carries the default Squarespace placeholder title "General 1 — REBEL RED" rather than a keyword-optimized title tag. This title provides zero search value and will appear verbatim in Google SERPs. It confirms the site was launched without populating page-level SEO fields in Squarespace's Pages > SEO panel. Corrected title has been written in `seo/meta.json` as "Magni Gyroplanes for Sale in Texas | Rebel Red's".

---

### 2. All Pages Have Blank Meta Descriptions

**Status: CONFIRMED**

Consistent with a Squarespace site launched without SEO configuration, no page-level meta descriptions were set in the site editor. When meta descriptions are blank, Google auto-generates snippet text from page body content — typically producing off-brand, non-CTA-driven snippets that underperform manually written descriptions. Optimized 150–160 character meta descriptions with CTAs for all 11 pages have been drafted in `seo/meta.json`.

---

### 3. No Booking Widget or Online Scheduling Exists

**Status: CONFIRMED**

No online booking, scheduling widget, or reservation system is currently embedded on the site. Intro flight and flight training inquiries require a phone call or email. The absence of a frictionless booking path is a conversion barrier, particularly for mobile visitors. Recommended fix: integrate Calendly, Acuity Scheduling, or a similar widget on the `/intro-flight` and `/flight-training` pages with a direct call-to-action.

---

### 4. Logo File Is Named "Untitled design (2).png"

**Status: CONFIRMED**

The logo image asset uploaded to the site retains the default export filename from Canva or a similar design tool. Non-descriptive filenames contribute nothing to image SEO and can create confusion during site maintenance. The corrected filename `rebel-reds-gyros-logo.png` and full image rename manifest have been documented in `images/rename-manifest.csv`.

---

### 5. No Schema Markup Present

**Status: CONFIRMED**

Inspection of the site's page source confirms no JSON-LD, Microdata, or RDFa structured data markup is present on any page. Squarespace does inject minimal organization schema automatically on some templates, but no business-specific, service, product, FAQ, or Person schema is present. This means the site is ineligible for Google's rich result features (FAQ dropdowns, review stars, knowledge panel data). Complete JSON-LD schema files for all major page types have been created in `seo/schema/`.

---

### 6. No Google Business Profile Linked

**Status: REQUIRES LIVE VERIFICATION**

A Google Business Profile (GBP) for "Rebel Red's Gyros" at 1744 County Rd N, Lamesa TX 79331 has not been confirmed as claimed, verified, or linked to the website. This requires direct access to Google Search Console and Google Business Profile Manager to verify. If the GBP does not exist, it should be created and verified immediately, as it is the single highest-impact local SEO action available. The `sameAs` field in the homepage LocalBusiness schema (`seo/schema/homepage.json`) includes a placeholder for the GBP Maps URL.

---

### 7. No Blog or Content Section

**Status: CONFIRMED**

The site contains no blog, news section, resource library, or any regularly updated content. This limits the site's ability to rank for long-tail informational queries ("how does a gyroplane fly," "best gyroplane for beginners," "gyroplane vs helicopter," etc.) that represent a significant portion of early-funnel search traffic from potential buyers and students. A content strategy targeting gyroplane FAQs, buyer guides, and local aviation topics would compound SEO value over time.

---

### 8. No Customer Testimonials Visible

**Status: REQUIRES LIVE VERIFICATION**

No customer testimonials, student reviews, or social proof content were observed on the pages reviewed. This should be confirmed against the live site in case testimonials appear on pages not included in the initial review scope (e.g., a hidden or unlisted page). If absent site-wide, adding testimonials — particularly from flight training students and gyroplane buyers — would improve conversion rates and support E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals for Google.

---

## Additional Issues Identified

The following issues were not part of the original audit checklist but are commonly present on Squarespace-built websites and are likely present on rebelredsgyros.com based on standard Squarespace behavior.

### A. Duplicate Content from Squarespace Tag/Category Pages

Squarespace automatically generates tag and category index pages (e.g., `/tag/gyroplane`, `/category/magni`) when blog or portfolio features are used. These pages often contain thin or duplicate content and are rarely canonicalized or noindexed by default, creating duplicate content issues that dilute crawl budget and may result in keyword cannibalization.

**Recommendation:** Audit all auto-generated Squarespace pages in Google Search Console > Index Coverage. Add `noindex` meta tags via Squarespace's Developer Tools or Code Injection for any non-substantive auto-generated pages.

---

### B. Missing or Incorrect Canonical Tags

Squarespace does generate canonical tags automatically, but they are sometimes set incorrectly when a site has both `www` and non-`www` versions, when pages are accessible at multiple URLs, or when the preferred domain has not been set in the Squarespace Domains panel. If both `rebelredsgyros.com` and `www.rebelredsgyros.com` resolve without a consistent 301 redirect, Google may split authority between the two versions.

**Recommendation:** Confirm preferred domain is set in Squarespace > Settings > Domains, and verify canonical tags reflect the `www` version consistently across all pages.

---

### C. Image Alt Text Missing or Auto-Populated with Filenames

Squarespace populates image alt text with the filename if no alt text is manually entered. Given that the logo file is named "Untitled design (2).png" and other images are likely IMG_#### files, the auto-populated alt text across the site is almost certainly non-descriptive and keyword-free. This represents a missed on-page SEO and accessibility opportunity across every page.

**Recommendation:** Use the `images/rename-manifest.csv` deliverable to update both filenames and alt text fields for all images via the Squarespace image editor.

---

### D. Page Load Speed on Mobile (Unoptimized Images)

Squarespace serves images in modern formats (WebP) in some contexts, but does not always compress or resize images on upload. Large, unoptimized images — particularly on the homepage and models pages — are a common cause of poor Core Web Vitals scores on Squarespace sites, particularly on mobile. Google uses Core Web Vitals (LCP, CLS, INP) as ranking signals.

**Recommendation:** Run the live site through Google PageSpeed Insights (pagespeed.web.dev) and GTmetrix. Compress all images to under 200KB before upload. Use Squarespace's built-in focal point tool to ensure responsive crops are correct on mobile.

---

### E. No XML Sitemap Submitted to Google Search Console

Squarespace auto-generates an XML sitemap at `rebelredsgyros.com/sitemap.xml`, but this sitemap must be manually submitted to Google Search Console for Google to prioritize it during crawl scheduling. Without submission, newly added or updated pages may take significantly longer to be indexed — particularly a problem for the new `/intro-flight`, `/flight-training`, and `/faq` pages being added as part of this project.

**Recommendation:** Submit the sitemap at `https://www.rebelredsgyros.com/sitemap.xml` (or the custom sitemap produced in this deliverable) via Google Search Console > Sitemaps immediately after new pages are published.

---

### F. Social Media Meta Tags (Open Graph / Twitter Card) Not Configured

Squarespace provides Open Graph and Twitter Card meta tag support through its built-in SEO panel, but these fields must be populated manually per page. If left blank, social shares of site pages on Facebook, LinkedIn, or X will display either no image or an incorrect/low-quality auto-selected image, and the title/description will be pulled from the page title and body text rather than a crafted social snippet.

**Recommendation:** For each key page (Homepage, intro flight, models), populate the Squarespace "Social Image" and social description fields in the SEO panel. Use the same meta descriptions drafted in `seo/meta.json` as a starting point for social descriptions.

---

*End of Report — Rebel Red's Gyros SEO Audit Confirmation | 2026-06-23*
