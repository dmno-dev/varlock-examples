'use client'

import { ENV } from "varlock/env";

console.log('client component - log in root');
console.log(process.env.SECRET_FOO);

export default function ClientEnvTest() {
  console.log('client component - log in component fn');
  console.log(process.env.SECRET_FOO);

  return (
    <div>
      <h2>Client env test</h2>

      <h3>process.env</h3>
      <ul>
        <li>NEXT_PUBLIC_FOO = { process.env.NEXT_PUBLIC_FOO }</li>
        
        {/* THIS TRIGGERS HYDRATION ERROR (unprefixed process.env does not get replaced) */}
        {/* <li>PUBLIC_FOO = { process.env.PUBLIC_FOO }</li> */}

        {/* THIS TRIGGERS LEAK ERROR */}
        {/* <li>SECRET_FOO = { process.env.SECRET_FOO }</li> */}
      </ul>

      <h4>ENV (varlock)</h4>
      <ul>
        <li>NEXT_PUBLIC_FOO = { ENV.NEXT_PUBLIC_FOO }</li>
        <li>PUBLIC_FOO = { ENV.PUBLIC_FOO }</li>
        
        {/* THIS TRIGGERS LEAK ERROR */}
        {/* <li>SECRET_FOO = { ENV.SECRET_FOO }</li> */}
      </ul>
    </div>
  );
}
