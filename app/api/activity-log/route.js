import { NextResponse } from "next/server";
import {
  createActivityLog,
  getActivityLogs,
} from "../../controller/activityLogController";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userType = searchParams.get("userType") || "all";
    const search = searchParams.get("search") || "";

    const logs = await getActivityLogs({ userType, search });

    return NextResponse.json(
      {
        success: true,
        data: logs,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch activity logs.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const log = await createActivityLog(body);

    return NextResponse.json(
      {
        success: true,
        data: log,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create activity log.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}