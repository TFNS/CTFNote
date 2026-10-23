const assert = require('node:assert/strict');
const { test } = require('node:test');
const MarkdownIt = require('markdown-it');
const toc = require('markdown-it-toc-and-anchor').default;

test('updated markdown parser supports QMarkdown plugins and safe rendering', () => {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
    .use(toc)
    .use(require('markdown-it-imsize'))
    .use(require('markdown-it-container'), 'warning');
  const html = md.render('# Heading\n\n[toc]\n\n**bold** https://example.org\n\n![logo](logo.png =100x50)\n\n<script>alert(1)</script>');
  assert.match(html, /id="heading"/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /href="https:\/\/example.org"/);
  assert.match(html, /width="100" height="50"/);
  assert.ok(!html.includes('<script>'));
  assert.ok(!md.render('[bad](javascript:alert(1))').includes('href="javascript:'));
});

test('adversarial quotes and mailto input render within a bounded subprocess', () => {
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['-e', `
    const md = require('markdown-it')({ linkify: true, typographer: true });
    md.render(('a" '.repeat(30000)) + ('mailto:'.repeat(30000)));
  `], { cwd: require('node:path').join(__dirname, '..'), timeout: 5000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr?.toString());
});


test('upload detection supports nested files without routing ordinary operations to multipart', async () => {
  const extractFiles = (await import('extract-files/extractFiles.mjs')).default;
  const isExtractableFile = (await import('apollo-upload-client/isExtractableFile.mjs')).default;
  const file = new File(['image'], 'logo.png', { type: 'image/png' });
  const operation = { variables: { logo: file }, query: 'upload' };
  const result = extractFiles(operation, isExtractableFile);
  assert.deepEqual(result.files.get(file), ['variables.logo']);
  assert.equal(operation.variables.logo, file);
  assert.equal(result.clone.variables.logo, null);
  assert.equal(extractFiles({ variables: { title: 'Task' } }, isExtractableFile).files.size, 0);
});
