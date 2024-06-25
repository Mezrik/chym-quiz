import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
                  Tento test vám pomůže pochopit silné a slabé stránky vás anebo
                  vašich studentů v oblasti vizualizační gramotnosti.
                </p>
              </div>
              <div className="mt-8 gap-3 flex justify-center">
                <Link href="/setup-quiz">
                  <Button size={"lg"}>Vytvořit test</Button>
                </Link>
                <Link href="/about">
                  <Button size={"lg"} variant={"outline"}>
                    O aplikaci
                  </Button>
                </Link>
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
