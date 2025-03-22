import type { ModuleI } from "@/types/module";
import type DiscordClient from "@/core/client";
import { showModal } from "./profile/editProfile";
import showProfile from "./profile/showProfile";
import updateProfile from "./profile/updateProfile";
import startSwiping from "./matching/startSwiping";
import nextCard from "./matching/nextCard";
import swipeYes from "./matching/swipeYes";
import deleteMatch from "./matching/deleteMatch";
import autoClose from "./security/autoClose";

const TinderModule: ModuleI = {
    events: {
        interactionCreate: async (client, interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    // profile edit
                    case "editProfile":
                        showProfile(interaction);
                        break;
                    case "change_name":
                    case "change_age":
                    case "change_description":
                        showModal(interaction);
                        break;

                    // matching
                    case "startSwipe":
                        startSwiping(interaction, client);
                        break;
                    case interaction.customId.startsWith("swipe_yes") ? interaction.customId : undefined:
                        swipeYes(interaction, client)
                        break;
                    case "swipe_no":
                        nextCard(interaction, client);
                        break
                    case "match_delete":
                        deleteMatch(interaction, client);
                }

            // auto close card system
                await autoClose(client, interaction);
            }

            if (interaction.isModalSubmit()) {
                switch (interaction.customId) {
                    case "profileUpdateData":
                        await updateProfile(interaction);
                        break;
                }
            }
        },
    }
}

export default TinderModule;