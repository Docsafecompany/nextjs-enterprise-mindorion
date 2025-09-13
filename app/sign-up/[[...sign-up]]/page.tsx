// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <SignUp />
    </main>
  );
}
