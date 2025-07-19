import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password
 * @param password - The password to hash
 * @returns Promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password with a hashed one
 * @param password - Plain-text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise that resolves to true if matched, false otherwise
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}
