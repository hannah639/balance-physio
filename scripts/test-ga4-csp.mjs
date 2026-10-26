import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const requiredHosts = ['https://analytics.google.com', 'https://*.analytics.google.com'];

test('any future CSP keeps both GA4 collector hosts in connect-src', async () => {
  const [headers, head, consent] = await Promise.all([
    read('public/_headers'),
    read('src/components/SiteHead.astro'),
    read('src/components/CookiesBanner.astro'),
  ]);
  const policies = [
    ['HTTP', headers.match(/^\s*Content-Security-Policy:\s*([^\r\n]+)/m)?.[1]],
    ['HTML meta', head.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([\s\S]*?)"/)?.[1]],
  ];

  for (const [name, policy] of policies) {
    if (!policy) continue; // No CSP currently restricts GA4 on this site.
    const connectSrc = policy.match(/(?:^|;)\s*connect-src\s+([^;]+);/)?.[1];
    assert.ok(connectSrc, `${name} CSP is missing connect-src`);
    const hosts = connectSrc.trim().split(/\s+/);
    for (const host of requiredHosts) {
      assert.ok(hosts.includes(host), `${name} connect-src is missing ${host}`);
    }
  }

  assert.match(consent, /if \(consent === 'accept'\)\s*\{\s*loadAnalytics\(\)/);
  assert.match(consent, /https:\/\/www\.googletagmanager\.com\/gtm\.js/);
  assert.match(consent, /https:\/\/www\.googletagmanager\.com\/gtag\/js/);
});
