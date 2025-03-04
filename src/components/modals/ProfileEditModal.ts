import { ComponentType, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, type ModalActionRowComponentBuilder } from "discord.js"

const ProfileEditModal = (option: string) => {
    let userInput = new TextInputBuilder({
        label: "",
        type: ComponentType.TextInput,
        style: TextInputStyle.Short,
        custom_id: `input_${option}`,
        required: true,
    })

    switch (option) {
        case "name":
            userInput.setLabel("Įrašykite savo vardą")
            userInput.setPlaceholder("Įrašykite savo vardą")
            userInput.setMaxLength(14)
            userInput.setMinLength(3)
            break
        case "age":
            userInput.setLabel("Iraškykite savo amžių")
            userInput.setPlaceholder("Iraškykite savo amžių")
            userInput.setMaxLength(2)
            userInput.setMinLength(2)
            break;
        case "description":
            userInput.setLabel("Aprašymas apie jus")
            userInput.setPlaceholder("Aprašymas apie jus")
            userInput.setMinLength(20)
            userInput.setMaxLength(200)
            userInput.setStyle(TextInputStyle.Paragraph)
            break;
    }

    const modal = new ModalBuilder()
    .setCustomId('profileUpdateData')
    .setTitle('Kavinė')

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(userInput);
    modal.addComponents(row);

    return modal;
}

export default ProfileEditModal;