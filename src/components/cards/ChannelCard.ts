import { Resvg, type ResvgRenderOptions } from "@resvg/resvg-js";
import { AttachmentBuilder } from "discord.js";

const ChannelCard = async (Icon: string, whiteText: string, blueText: string) => {
    // Server Image 
    const serverIconImageSize = 96;

    // edit this to move image
    const serverIconCX = 80;
    const serverIconCY = 65;

    // formule for mask
    const serverIconX = serverIconCX - serverIconImageSize / 2;
    const serverIconY = serverIconCY - serverIconImageSize / 2;

    // White text - name 
    let whiteTextFontSize = 72;
    let whiteTextY = 25;
    
    const width = whiteText.length * whiteTextFontSize * 0.63;
    
    const svg = `<svg width="${150 * blueText.length}" height="380" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/svg">
     <!-- Grey rounded bg -->
        <path d="M0 64c0-22 0-34 4-42S14 8 22 4s20-4 42-4h${width}a50 50 0 0 1 0 130H0V64Z" 
        fill="#1A1B1E"/>
    <!-- Serverio/User Icon -->
         <defs>
            <mask id="circleMask">
            <circle cx="${serverIconCX}" cy="${serverIconCY}" r="${serverIconImageSize / 2}" fill="white"/>
            </mask>
        </defs>
        <image
            href="${Icon}"
            x="${serverIconX}" y="${serverIconY}" 
            width="${serverIconImageSize}" height="${serverIconImageSize}"
            mask="url(#circleMask)"
        />
    <!-- Baltas Tekstas -->    
        <text font-family="UniSansHeavy" x="${serverIconCX + 70}" y="${serverIconCY + whiteTextY}" font-size="${whiteTextFontSize}" fill="#ffff">${whiteText}</text>
    <!-- Mėlynas Tekstas -->    
        <defs>
            <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" /> <!-- Adjust blur here -->
            <feOffset dx="5" dy="5" result="offsetblur" /> <!-- Adjust offset here -->
            <feFlood flood-color="rgba(0, 0, 0, 0.5)" /> <!-- Shadow color -->
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" /> <!-- This ensures the text is drawn above the shadow -->
            </feMerge>
            </filter>
        </defs>
        <text fill="#5865F2" font-family="UniSansHeavy" x="-20" y="320" font-size="232" filter="url(#drop-shadow)">${blueText}</text>
    </svg>
    `;

    const opts: ResvgRenderOptions = {
        // logLevel: 'debug',
        font: {
            loadSystemFonts: false,
            fontFiles: ['./src/assets/fonts/UniSansHeavy.ttf']
        },
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

    const name = Date.now().toString(36)
    const imageAttachment = new AttachmentBuilder(pngBuffer, { name: `${name}.png` });

    return { imageAttachment, pngBuffer };
}

export default ChannelCard;