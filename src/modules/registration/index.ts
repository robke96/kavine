import { systems, categoryId, rolesId } from "@/config/botConfig.json";
import type { ModuleI } from "@/types/module";
import { CategoryChannel, ChannelType, PermissionFlagsBits, TextInputComponent } from "discord.js";
import ChannelCard from "@/components/cards/ChannelCard";
import VerificationButtons from "@/components/buttons/Verification";
import { UserModel } from "@/database/models/userModel";
import RegisterModal from "@/components/modals/RegisterModal";

function MathQuestion() {
    const randomOperator = Math.random() > 0.5 ? '+' : '-';
    
    const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min); 
    const num1 = randomNumber(1, 35);
    const num2 = randomNumber(1, num1);

    const task = num1 + randomOperator + num2;

    return {
        task: task,
        answer: eval(task) as number
    }    
} 

const RegistrationModule: ModuleI = {
    isEnabled: systems.registration,
    events: {
        guildMemberAdd: async (client, member) => {
            // create new channel for user 
            const memberChannel = await member.guild.channels.create({
                name: `⏳︱${member.user.displayName}`,
                type: ChannelType.GuildText,
                parent: categoryId['📕・REGISTRACIJA'],
                permissionOverwrites: [
                    {
                        id: member.guild.roles.everyone, // @everyone
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                        deny: [PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            // create card
            let memberAvatar = member.user.displayAvatarURL({ forceStatic: true, extension: 'jpg' }) as string;

            const card = await ChannelCard(memberAvatar, `Labas ${member.user.displayName}`, "Registracija"); 
            const buttons = VerificationButtons();

            // send messsage
            memberChannel.send({ files: [card.imageAttachment], components: [buttons] });

            // add to db
            await UserModel.findOneAndUpdate({
                userId: member.user.id,
            }, {
                userId: member.user.id,
                userName: member.user.username,
                userAvatar: member.user.avatar,
                lastActivityAt: Date.now(),
            }, { upsert: true, new: true })
        },
        guildMemberRemove: async (client, member) => {
            const user = await UserModel.findOneAndDelete({
                userId: member.user.id
            });

            if (user) {
                const registerCategory = member.guild.channels.cache.get(categoryId['📕・REGISTRACIJA']) as CategoryChannel;
                if (registerCategory) {
                    const channel = registerCategory.children.cache.find(ch => ch.name === `⏳︱${member.user.displayName}`);
                    
                    if (channel) {
                        await channel.delete();
                    }
                }
            }

        },
        interactionCreate: async (client, interaction) => {
            if (interaction.isButton()) {
                if (interaction.customId === "registracijaButton") {
                    const { task, answer } = MathQuestion();

                    const modal = RegisterModal(task, answer);
                    await interaction.showModal(modal);
                }
            }

            if (interaction.isModalSubmit()) {
                if (interaction.customId.startsWith('mathModal')) {
                    const { value, customId } = interaction.fields.fields.first() as TextInputComponent;
                    const [_, answer] = customId.split('/');  
    
                    if (value === answer && interaction.guild) {
                        const narysRole = interaction.guild.roles.cache.get(rolesId['・Narys']);
                        if (!narysRole) interaction.guild.roles.fetch(rolesId['・Narys']);
    
                        const user = interaction.guild.members.cache.get(interaction.user.id);
                        if (!user) interaction.guild.members.fetch(interaction.user.id);
    
                        if (narysRole && user) {
                            await user.roles.add(narysRole);
    
                            await UserModel.updateOne({ userId: user.id }, {
                                verifiedAt: Date.now(),
                                lastActivityAt: Date.now(),
                            })
                        }
    
                        interaction.deferUpdate().then(() => {
                            if (interaction.channel) {
                                interaction.channel.delete();
                            };
                        });
                    } else {
                        interaction.reply({ content: `Atsakymas neteisingas, bandykite dar kartą.`, flags: "Ephemeral" })
                    }
                }
            }
        },
    }
}

export default RegistrationModule;