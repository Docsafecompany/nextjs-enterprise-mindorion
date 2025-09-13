// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SignUp />
    </div>
  );
}
