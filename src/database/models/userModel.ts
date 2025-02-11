import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userId: { type: Schema.Types.String, required: true },
    userName: { type: Schema.Types.String, required: true },
    userAvatar: { type: Schema.Types.String, required: true },
    verifiedAt: { type: Schema.Types.Number, default: null },
    lastActivityAt: { type: Schema.Types.Number, default: null },

    // Asmens Duomenys - Dating sistemai
    about: {
        name: { type: Schema.Types.String, default: "Nežinomas" },
        age: { type: Schema.Types.String, default: "Nežinomas" },
        gender: { type: Schema.Types.String, default: "Nežinoma" },
        relationshipStatus: { type: Schema.Types.String, default: "Nežinomas" },
        about: { type: Schema.Types.String, default: "Neturi aprašymo" },
        city: { type: Schema.Types.String, default: "Nežinomas" },
        hobbies: { type: Schema.Types.String, default: "Nežinomi" },
    }
})

export const UserModel = model('Users', userSchema);