import UserModel from "../models/userModel";
export async function checkUserExists(
    email: string,
    
): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    const userExists = user ? true : false;
    return userExists;
}
