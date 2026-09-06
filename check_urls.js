const fs = require('fs');

async function testUrls() {
  const content = fs.readFileSync('prisma/seed.ts', 'utf8');
  const urls = Array.from(content.matchAll(/https:\/\/images\.unsplash\.com\/[^\s"',\)]+/g)).map(m => m[0]);
  console.log('Total URLs found in seed.ts:', urls.length);

  const results = await Promise.all(
    urls.map(async (u) => {
      try {
        const res = await fetch(u, { method: 'HEAD' });
        return { url: u, status: res.status };
      } catch (err) {
        return { url: u, status: err.message };
      }
    })
  );

  const broken = results.filter(r => r.status !== 200);
  console.log('Broken count:', broken.length);
  if (broken.length > 0) {
    console.log('Broken URLs:', JSON.stringify(broken, null, 2));
  } else {
    console.log('All image URLs are 200 OK!');
  }
}

testUrls();
