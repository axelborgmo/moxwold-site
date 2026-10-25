import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', 'about/index.html'];
const read = name => readFile(path.join(root, name), 'utf8');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1].toLowerCase(), m[3]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m => attrs(m[0]));
const plain = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
function target(page, reference) {
  const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
  let resolved = pathname.startsWith('/') ? path.join(root, pathname) : path.resolve(root, path.dirname(page), pathname);
  if (pathname.endsWith('/')) resolved = path.join(resolved, 'index.html');
  return resolved;
}

test('two company pages have metadata, valid inline JavaScript and organization JSON-LD', async () => {
  const titles = new Set();
  for (const page of pages) {
    const html = await read(page);
    assert.match(html, /<html\b[^>]*\blang="en"/i);
    const title = plain(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
    assert.ok(title);
    titles.add(title);
    assert.ok(tags(html, 'meta').find(a => a.name === 'description')?.content);
    const canonical = tags(html, 'link').find(a => a.rel === 'canonical')?.href;
    assert.equal(canonical, `https://moxwold.com/${page === 'index.html' ? '' : 'about/'}`);
    assert.equal([...html.matchAll(/<h1\b/gi)].length, 1);
    assert.match(html, /<main\b/);
    let organizations = 0;
    for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (attrs(script[1]).type === 'application/ld+json') {
        const data = JSON.parse(script[2]);
        assert.equal(data['@type'], 'Organization');
        assert.equal(data.name, 'Moxwold AS');
        assert.equal(data.url, 'https://moxwold.com/');
        organizations++;
      } else {
        new vm.Script(script[2], { filename: page });
        assert.doesNotMatch(script[2], /\bsetInterval\s*\(/);
      }
    }
    assert.equal(organizations, 1);
    assert.doesNotMatch(html, /\b(?:Axel|NYU|Embody|research)\b|Yu(?:&amp;|&)Me/i);
    assert.doesNotMatch(html, /class=["'][^"']*\bnumber\b/);
    assert.doesNotMatch(html, /hands-on technology consulting|technology consulting/i);
  }
  assert.equal(titles.size, 2);
});

test('original front-page hierarchy and quiet About navigation remain', async () => {
  const html = await read('index.html');
  assert.match(html, /<main class="stage">/);
  assert.match(html, /<header class="site-meta">/);
  const subtitle = html.match(/<div class="sub">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(subtitle);
  assert.match(plain(subtitle), /^SOFTWARE MUSIC OSLO hello @ moxwold\.com$/);
  assert.match(subtitle, /href="mailto:hello@moxwold\.com"/);
  assert.match(html, /href="about\/"/);
  for (const page of pages) {
    const source = await read(page);
    assert.ok(!tags(source, 'a').some(a => /(?:^|\/)(?:music|software)(?:\/|$)/.test(a.href ?? '')));
    assert.doesNotMatch(source, /<a\b[^>]*>\s*(?:Music|Software)\s*<\/a>/i);
  }
});

test('About starts with its black company introduction, without a duplicate hero', async () => {
  const html = await read('about/index.html');
  const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
  assert.match(main, /^\s*<section class="intro">/);
  assert.match(main, /<h1 class="statement reveal" id="about-title">An independent Norwegian technology and music company\./);
  assert.doesNotMatch(html, /about-mark|letter-shell|hero-rule|scroll-note/);
  assert.match(html, /\.site-header\{[^}]*color:var\(--paper\)/);
});

test('About remains company-focused with ordered practices and baseline colors', async () => {
  const html = await read('about/index.html');
  assert.match(plain(html.match(/<section class="intro">([\s\S]*?)<\/section>/)?.[1] ?? ''), /technology and music company/);
  const practice = html.match(/<section class="practice"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  assert.deepEqual([...practice.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => plain(m[1])), ['Software development', 'Music production', 'Consulting']);
  const services = [...practice.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(m => plain(m[1]));
  assert.equal(services[0], 'Software development Web, mobile and backend products from early prototypes to maintained production systems.');
  assert.equal(services[1], 'Music production Guitar recording and music production.');
  assert.equal(services[2], 'Consulting Strategy, technical direction and production advice for software and music projects.');
  for (const [variable, color] of [['paper', '#F2EFE6'], ['ink', '#121212'], ['mag', '#EC008C'], ['cyan', '#00AEEF']]) {
    assert.ok(html.includes(`--${variable}:${color};`));
  }
  assert.match(html, /\.intro\{[^}]*background:var\(--ink\);color:var\(--paper\)/);
  assert.match(html, /\.practice\{[^}]*background:var\(--ink\);color:var\(--paper\)/);
  assert.match(html, /<section class="contact"/);
});

test('About gives software and music matching emphasis without repeated company labels', async () => {
  const html = await read('about/index.html');
  const intro = html.match(/<section class="intro">([\s\S]*?)<\/section>/)?.[1] ?? '';
  assert.deepEqual([...intro.matchAll(/<em>(.*?)<\/em>/g)].map(m => m[1]), ['software', 'music']);
  assert.doesNotMatch(intro, /Established 2025|Moxwold AS|section-label/);
  assert.doesNotMatch(html, /<footer\b/);
  const body = html.match(/<body>([\s\S]*?)<script>/)?.[1] ?? '';
  assert.equal((plain(body).match(/935 872 200/g) ?? []).length, 1);
  assert.match(html, /Math\.min\(\.22,/);
});

test('local links and assets resolve, and sitemap exposes only home and About', async () => {
  for (const page of pages) {
    const html = await read(page);
    const otherPage = page === 'index.html' ? pages[1] : pages[0];
    assert.ok(tags(html, 'a').some(a => a.href && !/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(a.href) && target(page, a.href) === path.join(root, otherPage)));
    for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
      for (const [attribute, reference] of Object.entries(attrs(tag[0]))) {
        if (!['href', 'src'].includes(attribute) || !reference || /^(?:[a-z][\w+.-]*:|\/\/|#|\?)/i.test(reference)) continue;
        const resolved = target(page, reference);
        assert.ok(resolved.startsWith(root));
        assert.ok((await stat(resolved)).isFile(), `${page}: ${reference}`);
      }
    }
  }
  const sitemap = await read('sitemap.xml');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), ['https://moxwold.com/', 'https://moxwold.com/about/']);
});

test('actual scramble keeps exactly one designated note until it restores MOXWOLD', async () => {
  const html = await read('index.html');
  const source = html.slice(html.indexOf('  const GLYPHS='), html.indexOf('  if(!REDUCED){ setTimeout(scramble'));
  assert.ok(source.includes('function scramble()'));
  const glyphs = source.match(/const GLYPHS="([^"]*)"/)?.[1];
  assert.equal(glyphs, 'ØÆÅøæåØÆÅøæå{}()[];:<>=+-*/%&|!^~#');
  const allowed = new Set([...glyphs, ...'MOXWOLD', '♪']);
  // Constant edge RNGs cover earliest/latest durations and each designated letter;
  // seeded RNGs also exercise changing glyphs and staggered restoration.
  const randoms = Array.from({ length: 7 }, (_, i) => () => (i + 0.5) / 7);
  randoms.push(() => 0, () => 0.999999);
  for (let seed = 1; seed <= 20; seed++) {
    let state = seed;
    randoms.push(() => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32));
  }
  for (const random of randoms) {
    const letters = [...'MOXWOLD'].map(textContent => ({ node: { textContent } }));
    const pending = [];
    const context = vm.createContext({ letters, WORD: 'MOXWOLD', Math: Object.assign(Object.create(Math), { random }), requestAnimationFrame: callback => pending.push(callback) });
    vm.runInContext(`${source}\nscramble();`, context);
    let frames = 0;
    do {
      const output = letters.map(letter => letter.node.textContent).join('');
      const notes = [...output].filter(c => c === '♪').length;
      assert.ok(notes <= 1, `frame ${frames}: ${output}`);
      assert.equal(notes, pending.length ? 1 : 0, `one note throughout active scramble, frame ${frames}`);
      assert.ok([...output].every(c => allowed.has(c)), `unexpected glyph: ${output}`);
      assert.ok(++frames < 100, 'scramble terminates');
      if (!pending.length) break;
      pending.shift()();
    } while (true);
    assert.ok(frames > 1);
    assert.equal(letters.map(letter => letter.node.textContent).join(''), 'MOXWOLD');
    assert.equal(vm.runInContext('scrambling', context), false);
    assert.equal(pending.length, 0);
  }
});
