import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

import firebaseAdminApp from "@/app/lib/firebaseAdmin";
import { users } from "@/app/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Código inválido." },
        { status: 400 }
      );
    }

    const user = users.find(
      (u) => u.code.toUpperCase() === code
    );

    if (!user) {
      return NextResponse.json(
        { error: "Código inválido." },
        { status: 401 }
      );
    }

    const auth = getAuth(firebaseAdminApp);

    const token = await auth.createCustomToken(user.code, {
      admin: user.admin,
      name: user.name,
      code: user.code,
    });

    return NextResponse.json({
      token,
      user: {
        code: user.code,
        name: user.name,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);

    return NextResponse.json(
      { error: "Erro interno no login." },
      { status: 500 }
    );
  }
}