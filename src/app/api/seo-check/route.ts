import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

interface Check {
  id: number;
  name: string;
  passed: boolean;
  message: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

interface SeoResults {
  score: number;
  checks: Check[];
  suggestions: string[];
  detailedSuggestions: {
    checkId: number;
    title: string;
    description: string;
    steps: string[];
  }[];
}

interface ApiError {
  error: string;
}

export async function GET(request: Request): Promise<NextResponse<SeoResults | ApiError>> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 📥 Fetch the page HTML
    const { data: html } = await axios.get(url, { timeout: 10000 });

    // 🧰 Parse with Cheerio
    const $ = cheerio.load(html);

    const checks: Check[] = [];
    const detailedSuggestions: SeoResults['detailedSuggestions'] = [];
    let score = 0;

    // ✅ Check 1: Title tag (10 points)
    const title = $('title').text().trim();
    if (title && title.length > 10 && title.length < 60) {
      checks.push({ 
        id: 1, 
        name: 'Title Tag', 
        passed: true, 
        message: `Good: "${title}"`,
        description: 'The title tag appears in search engine results and browser tabs. It should be descriptive and between 10-60 characters.',
        importance: 'high'
      });
      score += 10;
    } else {
      checks.push({ 
        id: 1, 
        name: 'Title Tag', 
        passed: false, 
        message: 'Missing or invalid title',
        description: 'The title tag is one of the most important SEO factors. It should be descriptive and between 10-60 characters.',
        importance: 'high'
      });
      
      detailedSuggestions.push({
        checkId: 1,
        title: 'Optimize Your Title Tag',
        description: 'A well-optimized title tag helps search engines understand the content of your page and appears as the main headline in search results.',
        steps: [
          'Create a unique, descriptive title for each page',
          'Keep it between 10-60 characters to avoid truncation in search results',
          'Include your primary keyword near the beginning',
          'Make it compelling to encourage clicks',
          'Avoid keyword stuffing'
        ]
      });
    }

    // ✅ Check 2: Meta description (10 points)
    const description = $('meta[name="description"]').attr('content') || '';
    if (description.length > 50 && description.length < 160) {
      checks.push({ 
        id: 2, 
        name: 'Meta Description', 
        passed: true, 
        message: 'Present and optimal length',
        description: 'The meta description appears under your title in search results. It should be between 50-160 characters and compelling.',
        importance: 'high'
      });
      score += 10;
    } else {
      checks.push({ 
        id: 2, 
        name: 'Meta Description', 
        passed: false, 
        message: 'Missing or too short/long',
        description: 'The meta description appears under your title in search results. It should be between 50-160 characters and compelling.',
        importance: 'high'
      });
      
      detailedSuggestions.push({
        checkId: 2,
        title: 'Improve Your Meta Description',
        description: 'A well-written meta description can improve click-through rates from search results, even though it\'s not a direct ranking factor.',
        steps: [
          'Write a unique description for each page',
          'Keep it between 50-160 characters to avoid truncation',
          'Include your primary keyword naturally',
          'Make it compelling to encourage clicks',
          'Think of it as an ad for your page in search results'
        ]
      });
    }

    // ✅ Check 3: H1 tag (10 points)
    const h1Count = $('h1').length;
    if (h1Count === 1) {
      checks.push({ 
        id: 3, 
        name: 'H1 Tag', 
        passed: true, 
        message: 'Exactly one H1 found',
        description: 'The H1 tag is the main heading of your page. There should be exactly one H1 per page, and it should contain your primary keyword.',
        importance: 'high'
      });
      score += 10;
    } else {
      checks.push({ 
        id: 3, 
        name: 'H1 Tag', 
        passed: false, 
        message: `${h1Count} H1(s) found (should be 1)`,
        description: 'The H1 tag is the main heading of your page. There should be exactly one H1 per page, and it should contain your primary keyword.',
        importance: 'high'
      });
      
      detailedSuggestions.push({
        checkId: 3,
        title: 'Fix Your H1 Tag Structure',
        description: 'Proper heading structure helps both users and search engines understand the content hierarchy of your page.',
        steps: [
          'Ensure there is exactly one H1 tag on the page',
          'Make the H1 descriptive and include your primary keyword',
          'Use H2-H6 tags for subheadings in a logical hierarchy',
          'Avoid skipping heading levels (e.g., going from H1 to H3)'
        ]
      });
    }

    // ✅ Check 4: Image alt attributes (10 points)
    const images = $('img');
    const altMissing = images.filter((i, el) => !($(el).attr('alt') || '').trim()).length;
    if (altMissing === 0 && images.length > 0) {
      checks.push({ 
        id: 4, 
        name: 'Image Alt Tags', 
        passed: true, 
        message: 'All images have alt text',
        description: 'Alt text describes images for search engines and visually impaired users. All images should have descriptive alt text.',
        importance: 'medium'
      });
      score += 10;
    } else if (images.length === 0) {
      checks.push({ 
        id: 4, 
        name: 'Image Alt Tags', 
        passed: true, 
        message: 'No images found (N/A)',
        description: 'Alt text describes images for search engines and visually impaired users. All images should have descriptive alt text.',
        importance: 'low'
      });
      score += 10;
    } else {
      checks.push({ 
        id: 4, 
        name: 'Image Alt Tags', 
        passed: false, 
        message: `${altMissing} images missing alt text`,
        description: 'Alt text describes images for search engines and visually impaired users. All images should have descriptive alt text.',
        importance: 'medium'
      });
      
      detailedSuggestions.push({
        checkId: 4,
        title: 'Add Alt Text to Images',
        description: 'Alt text improves accessibility and helps search engines understand the content of your images.',
        steps: [
          'Add descriptive alt text to all images',
          'Be concise but descriptive (under 125 characters)',
          'Include relevant keywords where appropriate',
          'For decorative images, use empty alt text (alt="")',
          'Avoid keyword stuffing in alt text'
        ]
      });
    }

    // ✅ Check 5: Performance via Lighthouse (60 points)
    try {
      // Increase maxBuffer to handle larger Lighthouse outputs
      const { stdout } = await execPromise(
        `npx lighthouse "${url}" --only-categories=performance --output=json --quiet --chrome-flags="--headless"`,
        { maxBuffer: 1024 * 1024 * 10 } // 10MB buffer
      );
      const report = JSON.parse(stdout);
      const performanceScore = Math.round((report?.categories?.performance?.score ?? 0) * 60);
      checks.push({
        id: 5,
        name: 'Performance (Lighthouse)',
        passed: performanceScore > 30,
        message: `Score: ${performanceScore}/60`,
        description: 'Page speed is a crucial ranking factor. Faster pages provide better user experience and tend to rank higher.',
        importance: 'high'
      });
      score += performanceScore;
      
      if (performanceScore <= 30) {
        detailedSuggestions.push({
          checkId: 5,
          title: 'Improve Page Performance',
          description: 'Page speed significantly impacts user experience and search rankings. Faster pages lead to higher engagement and conversions.',
          steps: [
            'Optimize images by compressing them and using modern formats like WebP',
            'Minimize CSS, JavaScript, and HTML',
            'Leverage browser caching',
            'Reduce server response time',
            'Use a Content Delivery Network (CDN)',
            'Eliminate render-blocking resources',
            'Implement lazy loading for images and videos'
          ]
        });
      }
    } catch (lhError) {
      console.error('Lighthouse failed:', lhError);
      checks.push({
        id: 5,
        name: 'Performance (Lighthouse)',
        passed: false,
        message: 'Lighthouse failed to run',
        description: 'Page speed is a crucial ranking factor. We couldn\'t analyze your page performance due to an error.',
        importance: 'high'
      });
      
      detailedSuggestions.push({
        checkId: 5,
        title: 'Improve Page Performance',
        description: 'Page speed significantly impacts user experience and search rankings. We couldn\'t analyze your page, but here are general optimization tips.',
        steps: [
          'Optimize images by compressing them and using modern formats like WebP',
          'Minimize CSS, JavaScript, and HTML',
          'Leverage browser caching',
          'Reduce server response time',
          'Use a Content Delivery Network (CDN)',
          'Eliminate render-blocking resources',
          'Implement lazy loading for images and videos'
        ]
      });
    }

    // 💡 Suggestions for failed checks
    const suggestions = checks
      .filter(check => !check.passed)
      .map(check => `Improve ${check.name.toLowerCase()}: ${check.message}`);

    return NextResponse.json({
      score: Math.min(score, 100),
      checks,
      suggestions,
      detailedSuggestions,
    });
  } catch (error) {
    console.error('SEO Check Error:', error);
    return NextResponse.json({ error: 'Failed to fetch or analyze URL' }, { status: 500 });
  }
}