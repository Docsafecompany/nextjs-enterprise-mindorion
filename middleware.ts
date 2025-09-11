// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware({
  publicRoutes: ["/", "/pricing", "/products/:path*"], // ici tu choisis ce qui reste public
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
