import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { ENV } from 'varlock/env';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <h1>Varlock + Gatsby Example</h1>
      <h2>process.env vs ENV</h2>
      <ul>
        <li>GATSBY_PUBLIC_FOO (prefixed): process.env={process.env.GATSBY_PUBLIC_FOO} / ENV={ENV.GATSBY_PUBLIC_FOO}</li>
        <li>PUBLIC_FOO (no prefix): process.env={process.env.PUBLIC_FOO} / ENV={ENV.PUBLIC_FOO}</li>
        <li>DEFAULT_FROM_SCHEMA (no prefix): process.env={process.env.DEFAULT_FROM_SCHEMA} / ENV={ENV.DEFAULT_FROM_SCHEMA}</li>
        <li>OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env={process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE} / ENV={ENV.OVERRIDE_FROM_ENV_SPECIFIC_FILE}</li>
      </ul>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Varlock Gatsby Example</title>;
