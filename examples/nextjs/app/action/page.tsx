import { ENV } from 'varlock/env';
import ActionForm from './action-form';

async function getEnvAction(leak: boolean) {
  'use server';
  return {
    PUBLIC_FOO: ENV.PUBLIC_FOO,
    NEXT_PUBLIC_FOO: ENV.NEXT_PUBLIC_FOO,
    ...leak && {
      SECRET_FOO: ENV.SECRET_FOO,
    },
  };
}

export default function ActionPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h2>Server Action</h2>
        <ActionForm getEnvAction={getEnvAction} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        testing env vars in nextjs
      </footer>
    </div>
  );
}
