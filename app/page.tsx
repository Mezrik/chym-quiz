import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="col-span-12 relative">
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto bg-white/75 dark:bg-black/75 rounded-3xl p-4">
              <p className="">Otestuj své schopnosti</p>
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Test vizualizační gramotnosti
                </h1>
              </div>
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  non placerat lorem, eu aliquet dolor. Maecenas venenatis
                  sapien mi, ac volutpat justo facilisis non. In id tellus dui
                </p>
              </div>
              <div className="mt-8 gap-3 flex justify-center">
                <Button size={"lg"}>Začít</Button>
                <Button size={"lg"} variant={"outline"}>
                  O projektu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/hero.png"
        alt="Hero"
        width={0}
        height={0}
        sizes="100vw"
        className="absolute top-0 dark:invert h-full w-auto object-cover lg:h-auto lg:w-full lg:object-contain"
      />
    </div>
  );
}
