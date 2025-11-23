import type { Metadata } from "next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMASARTE - Pizzas que Enamoran",
  description: "Sabor, arte y pasión en cada porción. Pizzería artesanal especializada en ingredientes frescos.",
  openGraph: {
    title: "AMASARTE - Pizzas que Enamoran",
    description: "Sabor, arte y pasión en cada porción. Pizzería artesanal especializada en ingredientes frescos.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMASARTE - Pizzas que Enamoran",
    description: "Sabor, arte y pasión en cada porción. Pizzería artesanal especializada en ingredientes frescos.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </CartProvider>
      </body>
    </html>
  );
}
