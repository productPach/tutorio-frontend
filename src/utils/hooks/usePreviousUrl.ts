import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function usePreviousUrl() {
    const router = useRouter();
    const previousUrlRef = useRef<string | null>(null);
    const isMounted = useRef<boolean>(false);

    useEffect(() => {
        if (isMounted.current) {
            const handleRouteChange = (url: string) => {
                previousUrlRef.current = window.location.pathname;
            };

            router.events.on('routeChangeStart', handleRouteChange);

            return () => {
                router.events.off('routeChangeStart', handleRouteChange);
            };
        } else {
            isMounted.current = true;
        }
    }, [router]);

    return previousUrlRef.current;
}