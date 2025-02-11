import { botConfig } from "@/config/botConfig";
import type { ModuleI } from "@/types/module";

const RegistrationModule: ModuleI = {
    isEnabled: botConfig.registrationSystem,
    events: {
    }
}

export default RegistrationModule;