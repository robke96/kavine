import { mkdir, readdir } from 'node:fs/promises';
import ChannelCard from "@/components/cards/ChannelCard";
import type { ModuleI } from "@/types/module";
import { ActionRowBuilder, ButtonBuilder, type GuildTextBasedChannel } from "discord.js";
import type DiscordClient from '@/core/client';

type channelsT = {
    id: string;
    buttons?: {
        id: string;
        label: string;
        style: number;
        emoji?: string;
    }[];
}[];

const CardPreloaderModule: ModuleI = {
    events: {
        async ready(client) {
            const c = client as DiscordClient;
            const channelsId = c.config?.channelsId;
            if (!channelsId) return;
            
            // todo: fix it - channelsId?, gali failint bet kada.
            const channels: channelsT = [
                {
                    id: channelsId?.['📗︱profilis'],
                    buttons: [
                        { label: "REDAGUOK PROFILI", style: 1, emoji: "1128405939523952681", id: "editProfile" }
                    ]
                }, 
                { id: channelsId?.['🧠︱naujokams']},
                {
                    id: channelsId?.['🫦︱paieškos'],
                    buttons: [
                        { label: "PRADĖTI", style: 1, id: "startSwipe" }
                    ]
                } 
            ]

            channels.forEach(async (ch) => {
                const channel = await client.channels.fetch(ch.id) as GuildTextBasedChannel;
                if (!channel) return console.warn(`[⚠️ | CARD PRELOAD]: didn't find ${ch.id} channel, ignoring card load.`);

                const channelMessages = await channel.messages.fetch();
   
                if (channelMessages.size > 1 || channelMessages.size == 0) {
                    if (channelMessages.size > 1) {
                        await channel.bulkDelete(channelMessages.size).catch((err) => {
                            return console.error(`[🚨 | CARD PRELOAD]: ${channel.name} - ${err.message}`)                       
                        });
                    }

                    // remove emojis and other symbols, raw text
                    const fixedChannelName = channel.name.replace(/[^A-Za-ząčęėįšųūž\s]/g, '');
                    const imgDir = '.cache/'
                    
                    const yearNow = new Date().getFullYear().toString()

                    await mkdir(imgDir, { recursive: true });
                    const allFiles = await readdir(imgDir, { recursive: true })
                    
                    const fileName = allFiles.find(file => file.startsWith(fixedChannelName))
                    const fileYear = fileName?.replace(/[^0-9]/g, '');
                    // buttons
                    const buttons: ButtonBuilder[] = []

                    if (ch.buttons) {
                        ch.buttons.forEach(({ label, emoji, style, id }) => {
                            const button = new ButtonBuilder()
                                .setCustomId(id)
                                .setLabel(label)
                                .setStyle(style)
                                
                            if (emoji) button.setEmoji(emoji);    

                            buttons.push(button);
                        })
                    }

                    const row = buttons.length >= 1 ? [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] : []

                    if (fileYear === yearNow) {
                        // get from folder - cached
                        const file = Bun.file(`${imgDir}${fileName}`);
                        const arrBuf = await file.arrayBuffer()
                        const buffer = Buffer.from(arrBuf);
                        return channel.send({ 
                            files: [{
                                attachment: buffer,
                                name: `${fixedChannelName}${yearNow}.png`
                            }],
                            components: row  
                        });
                    } else {
                        // generate new    
                        let guild = client.guilds.cache.get(c.config!.guildId);
        
                        const serverIcon = guild?.iconURL({ forceStatic: true, extension: 'jpeg' }); 
                        const newImage = await ChannelCard(serverIcon!, `Kavinė ${yearNow}`, fixedChannelName)
                        await Bun.write(`${imgDir}${fixedChannelName}${yearNow}.png`, newImage.pngBuffer);
                        return channel.send({ files: [newImage.imageAttachment], components: row });
                    }  
                }       
            })
        }
    }
}

export default CardPreloaderModule;