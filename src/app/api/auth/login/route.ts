import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setAdminSession } from "@/lib/auth";
import { ensureInitialized } from "@/lib/db-init";

export async function POST(req: Request) {
  await ensureInitialized();
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre zorunludur" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }

    await setAdminSession(admin.username);

    return NextResponse.json({
      success: true,
      user: { id: admin.id, username: admin.username, name: admin.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Giriş işlemi sırasında hata oluştu" }, { status: 500 });
  }
}
