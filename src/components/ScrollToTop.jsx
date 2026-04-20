import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Function to save current scroll position to session storage
        const handleScroll = () => {
            // We use the full pathname to store unique positions per page
            sessionStorage.setItem(`scroll-pos-${window.location.pathname}`, window.scrollY.toString());
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (navType === 'POP') {
            // When user goes BACK or FORWARD, try to restore from history
            const savedPosition = sessionStorage.getItem(`scroll-pos-${pathname}`);
            if (savedPosition) {
                // Use a small timeout to ensure the DOM has rendered and has a height
                // This is crucial for async content like medicine grids
                setTimeout(() => {
                    window.scrollTo({
                        top: parseInt(savedPosition, 10),
                        left: 0,
                        behavior: 'instant'
                    });
                }, 15);
            }
        } else {
            // When user clicks a NEW link (PUSH), always go to top
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        }
    }, [pathname, navType]);

    return null;
};

export default ScrollToTop;
