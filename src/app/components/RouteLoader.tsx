"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RouteLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Monkey-patch push/replace/back to start loader
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;

    router.push = ((...args: Parameters<typeof router.push>) => {
      setLoading(true);
      return originalPush(...args);
    }) as typeof router.push;

    router.replace = ((...args: Parameters<typeof router.replace>) => {
      setLoading(true);
      return originalReplace(...args);
    }) as typeof router.replace;

    router.back = (() => {
      setLoading(true);
      return originalBack();
    }) as typeof router.back;

    return () => {
      // Restore original methods when unmounted
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
    };
  }, [router]);

  useEffect(() => {
    // When pathname changes, stop loader
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 200); // smooth end
      return () => clearTimeout(timer);
    }
  }, [pathname]); // stop when URL changes

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-red mt-4 text-lg font-medium">Loading...</p>
        </div>
      )}
    </>
  );
}
