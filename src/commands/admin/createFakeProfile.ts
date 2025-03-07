import type { SlashCommandT } from "@/core/client";
import { UserModel, type IUser } from "@/database/models/userModel";
import { MessageFlags, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

// TODO: add permissions, now accessible for everyone

const command: SlashCommandT = {
    data: new SlashCommandSubcommandBuilder()
        .setName("createfakeprofile")
        .setDescription('Create a fake profile document in database (TESTING FOR TINDER system)')
        .addNumberOption((option) =>
            option
              .setName('document_number')
              .setDescription('How many documents create?')
              .setMaxValue(10)
              .setRequired(true)
              .setMinValue(1),
        ),
    async execute(interaction) {
        const input = interaction.options.getNumber('document_number');
        if (!input) return;

        const usersData = [];

        for (let i = 1; i <= input; i++) {
            const res = await fetch('https://picsum.photos/440/700')

            const data = {
                userId: Date.now().toString(18),
                userName: Date.now().toString(4),
                userAvatar: Date.now().toString(8),
                about: {
                    profileCard: res.url,
                }
            }

            usersData.push(data);
        }
        interaction.deferReply();

        await UserModel.create(usersData);

        interaction.reply({ content: "Done", flags: MessageFlags.Ephemeral });
    }
}

export default command;