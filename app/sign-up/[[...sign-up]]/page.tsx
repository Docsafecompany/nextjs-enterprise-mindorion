'use client';

import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-96px)] grid place-items-center px-4 py-6">
      <SignUp
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'mx-auto',
          },
        }}
      />
    </div>
  );
}

