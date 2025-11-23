import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sofía Martínez",
    text: "¡La mejor pizza que he probado en años! La masa es increíblemente ligera y los ingredientes se sienten súper frescos. Definitivamente volveré.",
    rating: 5,
    avatar: "SM"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    text: "El ambiente es acogedor y el servicio excelente. Recomiendo la pizza de Trufa y Hongos, es una experiencia religiosa.",
    rating: 5,
    avatar: "CR"
  },
  {
    id: 3,
    name: "Ana López",
    text: "Pedí a domicilio y llegó caliente y crujiente. Me encanta que tengan opciones vegetarianas tan creativas.",
    rating: 4,
    avatar: "AL"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <div className="w-20 h-1 bg-white mx-auto opacity-50 rounded-full"></div>
        </div>

        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2 pl-6">
                <Card className="bg-white/10 border-none text-white h-full backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-4 text-yellow-300">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="text-lg font-medium mb-6 italic leading-relaxed flex-grow">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Avatar className="h-12 w-12 border-2 border-white/30">
                        <AvatarFallback className="bg-primary-foreground text-primary font-bold">
                          {item.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{item.name}</p>
                        <p className="text-sm text-white/70">Cliente Verificado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white/20 border-none text-white hover:bg-white hover:text-primary" />
          <CarouselNext className="bg-white/20 border-none text-white hover:bg-white hover:text-primary" />
        </Carousel>
      </div>
    </section>
  );
}
