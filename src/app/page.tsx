import Link from "next/link";

export default function Home() {
  return (
    <div className="bg bg-black bg-home-img bg-cover bg-center">
      <main className="mx-auto flex h-dvh max-w-5xl flex-col justify-center text-center">
        <div className="mx-auto flex w-4/5 flex-col gap-6 rounded-lg border border-slate-50/20 bg-black/80 p-12 text-slate-50 sm:max-w-96 sm:text-2xl">
          <h1 className="text-4xl font-bold">
            Dan&apos;s Computer <br /> Repair Shop
          </h1>
          <address>
            555 Gateway Lane
            <br />
            Kansas City, KS 55555
          </address>
          <p>Open daily: 9am to 5pm</p>
          <Link href="tel: 55555555555" className="hover:underline">
            555-5555-5555
          </Link>
        </div>
      </main>
    </div>
  );
}
