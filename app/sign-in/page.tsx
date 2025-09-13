// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SignIn />
    </div>
  );
}
