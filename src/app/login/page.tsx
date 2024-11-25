import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex h-dvh max-w-5xl flex-col text-center">
      <div className="mx-auto mt-8 flex w-4/5 flex-col gap-6 rounded-lg border border-slate-50/20 bg-black/80 p-12 text-slate-50 sm:max-w-96 sm:text-2xl">
        <h1 className="text-3xl">Repair Shop</h1>
        <Button asChild>
          <LoginLink>Sign In</LoginLink>
        </Button>
      </div>
    </main>
  );
}
