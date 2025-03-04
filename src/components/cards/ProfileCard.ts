import type { IUser } from "@/database/models/userModel";
import { Resvg, type ResvgRenderOptions } from "@resvg/resvg-js";
import { AttachmentBuilder } from "discord.js";
import sharp from "sharp";

const ProfileCard = async (user: IUser) => {
  // card specs
    const cardW = 440
    const cardH = 700

    // user info
    const name = user.about.name ? user.about.name : user.userName;
    const age = user.about.age ? user.about.age : '';
    const rawDescription = user.about.description;
    const imgSrc = `https://cdn.discordapp.com/avatars/${user.userId}/${user.userAvatar}.png?size=512`

    const description = (rawDescription: string) => {
      function wrapTextByChars(text: string, maxWidth: number, fontSize: number, maxLines = 4) {
        const avgCharWidth = fontSize * 0.6; // Approximate width per character
        const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth); // Max characters per line
      
        let words = text.split(" ");
        let lines = [];
        let currentLine = "";
      
        for (let word of words) {
            let testLine = currentLine ? currentLine + " " + word : word;
      
            if (testLine.length > maxCharsPerLine) {
                if (lines.length + 1 >= maxLines) {
                    lines.push(currentLine + "...");
                    break;
                }
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
      
        if (currentLine && lines.length < maxLines) {
            lines.push(currentLine);
        }
      
        return lines;
      }

      if (rawDescription) {
        const wrappedLines = wrapTextByChars(rawDescription, cardW*1.25, 19, 3);
        
        const result = wrappedLines
        .map((line, index) => `<tspan x="20" dy="${index === 0 ? '0' : '1.2em'}">${line}</tspan>`)
        .join("");

        return result;
      } else {
        return '';
      }
    }

    const activityStatus = () => {
      let height = 81
      let text = '';
      rawDescription == undefined ? height = height + 9 : '' 

      const userActivity = new Date(user.lastActivityAt).getTime();
      const timeNow = Date.now()
      const timeElapsed = timeNow - userActivity;

      if (timeElapsed < 2 * 60 * 60 * 1000) { // 2 hours
        text = 'Online now'
      } else if (timeElapsed < 24 * 60 * 60 * 1000) { // 24 hours
        text = 'Recently active'
      } else {
        return;
      }

      return `
      <g>
        <circle cx="30" cy="${height}%" r="5" fill="#7BFDA2"/>
        <text x="43" y="${height}.8%" fill="#fff" font-family="Proxima Nova" font-size="19">${text}</text>
      </g>
      `
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="440" height="700" fill="none" viewBox="0 0 440 700">
        <mask id="b" width="440" height="700" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
          <rect width="440" height="700" fill="#fff" />
        </mask>

        <!-- User image -->
        <image href="${imgSrc}" width="${cardW}" height="${cardH}" preserveAspectRatio="xMidYMid slice" />

        <g filter="url(#a)" mask="url(#b)"><path fill="#000" d="M-166.737 494h808.211v362h-808.211z"/></g>
        <defs>
          <filter id="a" width="1088.21" height="642" x="-306.737" y="354" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur result="effect1_foregroundBlur_502_535" stdDeviation="70"/>
          </filter>
        </defs>

        <!-- Status -->

        <!-- Name -->
        <text font-family="Montserrat" font-size="32" fill="#fff" x="20" y="87%">
          ${name} 
          <tspan font-family="Proxima Nova" font-size="50">${age}</tspan>
        </text>

        <!-- Description About -->
        <text x="20" y="91%" fill="#fff" font-family="Proxima Nova" font-size="19" >
          ${description(rawDescription)}
        </text>
</svg>
`
    
    const opts: ResvgRenderOptions = {
        font: {
            loadSystemFonts: false,
            fontFiles: ['./src/assets/fonts/Montserrat-Bold.ttf','./src/assets/fonts/ProximaNovaLight.ttf'],
        },
        // './src/assets/fonts/MontserratMedium.ttf'
        shapeRendering: 0,
        textRendering: 1,
        imageRendering: 0,
    }

    const resvg = new Resvg(svg, opts);

    const resolved = await Promise.all(
        resvg.imagesToResolve().map(async (url) => {
          const img = await fetch(url)
          const buffer = await img.arrayBuffer()
          return {
            url,
            buffer: Buffer.from(buffer),
          }
        }),
      )
      if (resolved.length > 0) {
        for (const result of resolved) {
          const { url, buffer } = result
          resvg.resolveImage(url, buffer)
        }
    }

    const pngData = resvg.render()
    const pngBuffer = pngData.asPng();

    const buffer = await sharp(pngBuffer).webp({  quality: 80, effort: 6 }).toBuffer();

    const fileName = Date.now().toString(12)
    const imageAttachment = new AttachmentBuilder(buffer, { name: `${fileName}.webp` });
    return { imageAttachment, buffer };
}

export default ProfileCard;