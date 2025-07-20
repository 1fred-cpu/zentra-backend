import mongoose,{Document} from "mongoose";

export interface User extends Document {
    name:string;
    email:string;
    password:string;
    emailVerified:boolean;
    role:'user'|'creator';
    slug:string;
    avatar:string;
    bio:string;
     socials?: {
        website: string,
        twitter: string,
        dribbble: string,
        github: string
    } |  null | undefined,
    createdAt:Date;
    updatedAt:Date
}
export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        default:'none'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "creator"],
        default: "user"
    },
    slug: { type: String, required: true, lowercase: true },
    avatar: {
        type: String, // URL to profile image
        default: ""
    },
    bio: {
        type: String,
        maxlength: 300,
        default:''
    },

    // Fields for "Creators"
    socials: {
        website: {type : String, default:''},
        twitter: {type : String, default:''},
        dribbble: {type : String, default:''},
        github: {type : String, default:''}
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", UserSchema);
