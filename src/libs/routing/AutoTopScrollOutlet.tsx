import { Outlet, useLocation } from 'libs/routing';
import { useEffect, useRef } from 'react';

export const AutoTopScrollOutlet = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollIntoView();
    }
  }, [location.current.pathname]);

  return (
    <div className="h-full w-full" ref={parentRef}>
      <Outlet />
    </div>
  );
};