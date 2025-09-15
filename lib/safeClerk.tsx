'use client';

import React from 'react';

type Children = { children?: React.ReactNode };

export function SignedIn({ children }: Children) {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <>{children}</> : null;
}
export function SignedOut({ children }: Children) {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? null : <>{children}</>;
}

export function UserButton() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  const { UserButton: RealUserButton } = require('@clerk/nextjs');
  return <RealUserButton />;
}
export function SignInButton({ children }: Children) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children ?? "Sign in"}</>;
  const { SignInButton: RealSignInButton } = require('@clerk/nextjs');
  return <RealSignInButton mode="modal">{children}</RealSignInButton>;
}