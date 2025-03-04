import { Model, Schema, model } from "mongoose";

export interface IUser {
    userId: string;
    userName: string;
    userAvatar: string;
    verifiedAt: number;
    lastActivityAt: number;

    about: {
        name: string;
        age: string;
        gender: string;
        relationshipStatus: string;
        description: string;
        city: string;
        hobbies: string;
        profileCard: string;
        visible: boolean;
    };

    tinder: {
        eloScore: number;
        likedUsers: {
            userId: string;
            isMatch: boolean;
            createdAt: number;
        }[],
    }
}

const userSchema = new Schema<IUser>({
    userId: { type: Schema.Types.String, required: true },
    userName: { type: Schema.Types.String, required: true },
    userAvatar: { type: Schema.Types.String, required: true },
    verifiedAt: { type: Schema.Types.Number, default: null },
    lastActivityAt: { type: Schema.Types.Number, default: null },

    // Asmens Duomenys - Dating sistemai
    about: {
        name: { type: Schema.Types.String, },
        age: { type: Schema.Types.String, },
        gender: { type: Schema.Types.String },
        relationshipStatus: { type: Schema.Types.String},
        description: { type: Schema.Types.String, default: undefined },
        city: { type: Schema.Types.String },
        hobbies: { type: Schema.Types.String },
        profileCard: { type: Schema.Types.String, default: undefined },
        // if user is new, make card visible after setup (name, age, etc.)
        visible: { type: Schema.Types.Boolean, default: false },
    },

    tinder: {
        eloScore: { type: Schema.Types.Number },
        likedUsers: [{
            userId: { type: Schema.Types.String },
            isMatch: { type: Schema.Types.Boolean },
            createdAt: { type: Schema.Types.Number },
        }],
    }
})

export const UserModel: Model<IUser> = model<IUser>('Users', userSchema);