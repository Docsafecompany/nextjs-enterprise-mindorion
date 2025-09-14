'use client';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-96px)] grid place-items-center px-4 py-6">
      <SignIn
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: 'w-full',            // let the card size itself
            card: 'mx-auto',              // centers the Clerk card
          },
        }}
      />
    </div>
  );
}
