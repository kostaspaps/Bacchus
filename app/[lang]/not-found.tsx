import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100svh] grid place-items-center px-page text-center">
      <div>
        <p className="label text-olive m-0 mb-6">404</p>
        <h1 className="font-serif font-light text-[clamp(40px,6vw,88px)] leading-none m-0 mb-6">
          Lost at sea. <em className="italic text-wine">Χαθήκατε.</em>
        </h1>
        <Link href="/" className="btn bg-wine text-ivory px-8 py-[18px]">
          Back to Bacchus
        </Link>
      </div>
    </main>
  );
}
