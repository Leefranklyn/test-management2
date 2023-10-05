import { model, Schema } from "mongoose";

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["MALE", "FEMALE"]
    },
    institution: {
        type: Schema.Types.ObjectId,
        ref: "Institution",
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "admin"
    }
},{
    timestamps: true
});

export default model("Admin", adminSchema)