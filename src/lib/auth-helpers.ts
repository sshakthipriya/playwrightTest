import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "./mongodb";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "greenway-equipment-exchange-secret-key-2026";
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRATION_HOURS = parseInt(process.env.JWT_EXPIRATION_HOURS || "24");

export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10);
}

export function verifyPassword(password: string, hashed: string): boolean {
  return bcryptjs.compareSync(password, hashed);
}

export function createToken(userId: string, role: string): string {
  return jwt.sign(
    { user_id: userId, role },
    JWT_SECRET,
    { expiresIn: `${JWT_EXPIRATION_HOURS}h` }
  );
}

export async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  let token = authHeader;
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { user_id: string; role: string };
    const db = await getDb();
    const user = await db.collection("users").findOne(
      { id: payload.user_id },
      { projection: { _id: 0 } }
    );
    return user;
  } catch {
    return null;
  }
}
