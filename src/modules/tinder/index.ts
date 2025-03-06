import { systems } from "@/config/botConfig.json";
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
    isEnabled: systems.tinder,
    events: {
        interactionCreate: async (client, interaction) => {
            if (interaction.isButton()) {
                const c = client as DiscordClient;

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
                        startSwiping(interaction, c);
                        break;
                    case interaction.customId.startsWith("swipe_yes") ? interaction.customId : undefined:
                        swipeYes(interaction, c)
                        break;
                    case "swipe_no":
                        nextCard(interaction, c);
                        break
                    case "match_delete":
                        deleteMatch(interaction, c);
                }

            // auto close card system
                await autoClose(c, interaction);
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