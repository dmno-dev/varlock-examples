'use client';

import { useState } from 'react';

export default function ActionForm({
  getEnvAction,
}: {
  getEnvAction: (leak: boolean) => Promise<Record<string, string | undefined>>;
}) {
  const [result, setResult] = useState<Record<string, string | undefined> | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={async () => setResult(await getEnvAction(false))}>
          Call action (safe)
        </button>
        <button onClick={async () => setResult(await getEnvAction(true))}>
          Call action (leak)
        </button>
      </div>
      {result && (
        <pre style={{ marginTop: '16px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
