import { insertOrderSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { appendOrderToSheet } from "@/lib/googleSheets";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = insertOrderSchema.parse(body);
    
    // Generate a unique order ID using timestamp + random number
    const orderId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000);
    const now = new Date();
    
    try {
      await appendOrderToSheet({
        id: orderId,
        customerName: validatedData.customerName,
        phone: validatedData.phone,
        orderType: validatedData.orderType,
        address: validatedData.address || null,
        paymentMethod: validatedData.paymentMethod,
        orderDetails: validatedData.orderDetails,
        items: validatedData.items,
        total: validatedData.total,
        status: validatedData.status,
        createdAt: now,
        orderTime: validatedData.orderTime || null
      });

      return NextResponse.json({
        success: true,
        order: {
          id: orderId,
          customerName: validatedData.customerName,
          phone: validatedData.phone,
          orderType: validatedData.orderType,
          address: validatedData.address || null,
          paymentMethod: validatedData.paymentMethod,
          orderDetails: validatedData.orderDetails,
          items: validatedData.items,
          total: validatedData.total,
          status: validatedData.status,
          orderTime: validatedData.orderTime || null,
          createdAt: now
        },
        message: "Pedido recibido correctamente y sincronizado con Google Sheets"
      }, { status: 201 });
    } catch (sheetsError: any) {
      console.error("Failed to sync order to Google Sheets:", sheetsError);
      return NextResponse.json({
        success: false,
        error: "Error al sincronizar el pedido con Google Sheets: " + sheetsError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    if (error.name === "ZodError") {
      const validationError = fromError(error);
      return NextResponse.json({
        success: false,
        error: validationError.message
      }, { status: 400 });
    }
    
    console.error("Error processing order:", error);
    return NextResponse.json({
      success: false,
      error: "Error al procesar el pedido"
    }, { status: 500 });
  }
}
