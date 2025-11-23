import { initializeSheetHeaders } from "@/lib/googleSheets";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await initializeSheetHeaders();
    return NextResponse.json({ 
      success: true, 
      message: "Encabezados de Google Sheets configurados correctamente" 
    });
  } catch (error: any) {
    console.error("Error initializing sheet headers:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al configurar Google Sheets"
    }, { status: 500 });
  }
}
