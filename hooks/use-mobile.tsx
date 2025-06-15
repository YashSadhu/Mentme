import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
    
    // Set initial value
    setIsMobile(checkIfMobile());
    
    // Set up event listener for window resize
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
