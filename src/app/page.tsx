const SITE_NAME = "Santa Maria Performance Horses";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        {SITE_NAME}
      </h1>
    </main>
  );
}
