import UserModel from "../models/userModel";
import { generateSlug } from "./generate-slug";
import { hashPassword } from "./hash";
export async function createUser(
    email: string,
    password: string,
    name: string
): Promise<UserModel> {
    const hashedPassword = await hashPassword(password);
    const slug = generateSlug(name);
    const newUser = await new UserModel({
        email,
        name,
        password: hashedPassword
    });
    await newUser.save();
    return newUser;
}
