import UserModel,{User} from "../models/userModel";
import { generateSlug } from "./generate-slug";
import { hashPassword } from "./hash";
export async function createUser(
    email: string,
    password: string,
    name: string
): Promise<User> {
    const hashedPassword = await hashPassword(password);
    const slug = generateSlug(name);
    const newUser = await new UserModel({
        email,
        name,
        password: hashedPassword,
        slug
    });
    await newUser.save();
    return newUser;
}
