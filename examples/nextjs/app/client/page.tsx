import ClientEnvTest from '../components/client-env-test';

export default async function ClientPage() {

  const now = new Date().toISOString();

  // const data = await fetch('https://api.vercel.app/blog');
  // const posts = await data.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ClientEnvTest />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        testing env vars in nextjs
      </footer>
    </div>
  );
}
