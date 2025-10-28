// API for user profile details

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import { createUser, getUsers, IUser } from "@/app/models/user";

export async function GET() {
    try {
        await connectToDatabase();
        const users: IUser[] = await getUsers();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data: IUser = await request.json();
        await connectToDatabase();
        const newUser: IUser = await createUser(data);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}