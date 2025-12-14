import { NextResponse } from 'next/server';
import { getMenuItems } from '@/lib/firestore';

export async function GET() {
    try {
        const data = await getMenuItems();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
