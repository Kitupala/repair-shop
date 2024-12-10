import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { File, HomeIcon, LogOut, UsersRound } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/ModeToggle";
import NavButton from "@/components/NavButton";
import { Button } from "@/components/ui/button";
import NavButtonMenu from "@/components/NavButtonMenu";

function Header() {
  return (
    <header className="sticky top-0 z-20 h-12 animate-slide border-b bg-background p-2">
      <div className="flex h-8 w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <NavButton href="/home" label="Home" icon={HomeIcon} />
          <Link
            href="/home"
            title="Home"
            className="ml-0 flex items-center justify-center gap-2"
          >
            <h1 className="m-0 hidden text-xl sm:block">
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className="flex items-center">
          <NavButton href="/tickets" label="Tickets" icon={File} />
          <NavButtonMenu
            icon={UsersRound}
            label="Customers Menu"
            choices={[
              { title: "Search Customers", href: "/customers" },
              { title: "New Customer", href: "/customers/form" },
            ]}
          />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="LogOut"
            title="LogOut"
            className="rounded-full"
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
