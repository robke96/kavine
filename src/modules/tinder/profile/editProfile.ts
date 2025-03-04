import ProfileEditModal from "@/components/modals/ProfileEditModal"
import type { ButtonInteraction, CacheType } from "discord.js"

export const showModal = async (interaction: ButtonInteraction<CacheType>) => {
    const value = interaction.customId.split('_')[1];

    const modal = ProfileEditModal(value)
    await interaction.showModal(modal)
}

