import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, type ModalActionRowComponentBuilder } from "discord.js";

const RegisterModal = (mathTask: string, mathAnswer: number) => {
    const modal = new ModalBuilder()
        .setCustomId(`mathInput/${mathAnswer}`)
        .setTitle(`REGISTRACIJA: ${mathTask}=?`);

    const questionInput = new TextInputBuilder()
        .setCustomId(`mathInput/${mathAnswer}`)
        .setLabel(`Išpreskite uždavinį: ${mathTask}`)
        .setPlaceholder('Įrašykite atsakymą')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(2)
        .setMinLength(1)
        .setRequired(true);

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(questionInput);
    modal.addComponents(row);

    return modal;
};

export default RegisterModal;