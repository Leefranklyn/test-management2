import { Schema, model } from "mongoose";

const schoolInfoSchema = new Schema({
    schoolUrl: {
        type: String,
        required: true
    },
    schoolId: {
        type: String,
        required: true
    }
})

export default model("schoolInfo", schoolInfoSchema)