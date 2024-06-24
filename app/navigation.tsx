"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Mám kód od lektora",
    href: "/quiz/entry",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non placerat lorem, eu aliquet dolor. Maecenas venenatis sapien mi, ac volutpat justo facilisis non. In id tellus dui.",
  },
  {
    title: "Potřebuji otestovat skupinu",
    href: "/setup-quiz",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non placerat lorem, eu aliquet dolor. Maecenas venenatis sapien mi, ac volutpat justo facilisis non. In id tellus dui.",
  },
  {
    title: "Chci otestovat sebe",
    href: "/setup-quiz?selfTest=true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non placerat lorem, eu aliquet dolor. Maecenas venenatis sapien mi, ac volutpat justo facilisis non. In id tellus dui.",
  },
];

export function NavigationMenuDemo() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Otevřít menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <Logo className="h-6 w-6" />
          </Link>
          <div className="grid gap-2 py-6">
            {components.map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                {component.title}
              </Link>
            ))}
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              O projektu
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <NavigationMenu className="space-x-2 hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Začít pracovat s testem
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>O projektu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[450px] lg:w-[550px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Test vizualizační gramotnosti
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec non placerat lorem, eu aliquet dolor. Maecenas
                        venenatis sapien mi, ac volutpat justo facilisis non. In
                        id tellus dui.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="O co jde">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </ListItem>
                <ListItem href="/docs/installation" title="Proč vznikl">
                  Donec non placerat lorem, eu aliquet dolor.
                </ListItem>
                <ListItem
                  href="/docs/primitives/typography"
                  title="Kdo na něm pracoval"
                >
                  Maecenas venenatis sapien mi, ac volutpat justo facilisis non.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

ListItem.displayName = "ListItem";
