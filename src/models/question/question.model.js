import { Schema , model} from "mongoose";
import  Options from "../options/options.model";

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [
        {
            text: {
                type: String,
                required: true
            },
            isCorrect: Boolean,
            required: true
        }
    ]
})

export default model("Question", questionSchema)