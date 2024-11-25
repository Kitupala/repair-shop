import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-8 p-12 text-slate-100">
      <h2 className="text-3xl">Ooopss... page not found!</h2>

      <Image
        className="m-0 rounded-xl"
        src="/images/not-found.png"
        alt="Ooopss... page not found"
        title="Ooopss... page not found"
        priority={true}
        width={400}
        height={400}
        sizes="400px"
      />

      <Link href="/">Return Home</Link>
    </div>
  );
}
