// Converts the original brand PNGs in /assets-source into web-ready assets.
// next/image then serves responsive AVIF/WebP variants from these sources.
import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const SRC = 'assets-source'
const OUT = 'src/assets/images'
await mkdir(OUT, { recursive: true })

const photos = ['zynara-hero', 'vaqto-story', 'zynara-about']
for (const name of photos) {
  const info = await sharp(`${SRC}/${name}.png`)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(`${OUT}/${name}.jpg`)
  console.log(`${name}.jpg`, info.width, 'x', info.height, Math.round(info.size / 1024) + 'KB')
}

// Brand mark as an SVG (path traced from the original PNG, brand gradient applied)
const path = (await readFile(`${SRC}/zynara-mark-path.txt`, 'utf8')).trim()
const markSvg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bg ? '-188 -363 1350 1350' : '0 0 974 624'}">
<defs><linearGradient id="z" x1="0" y1="624" x2="974" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#4E28FC"/><stop offset="1" stop-color="#22D0FC"/></linearGradient></defs>
${bg ? '<rect x="-188" y="-363" width="1350" height="1350" fill="#080D1B"/>' : ''}<path fill="url(#z)" d="${path}"/></svg>`

// Favicon / app icons
await writeFile('src/app/icon.svg', markSvg(true))
await sharp(Buffer.from(markSvg(true))).resize(180, 180).png().toFile('src/app/apple-icon.png')

// Open Graph image (1200x630) from the hero artwork
await sharp(`${SRC}/zynara-hero.png`)
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('src/app/opengraph-image.jpg')

console.log('icons + og image written')
