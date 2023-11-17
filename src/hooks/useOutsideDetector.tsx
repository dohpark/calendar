import React, { useRef, useEffect } from 'react';

interface OutsideDetecterProps {
  children: React.ReactNode;
  callback: () => void;
  classExtend?: string[];
  style?: object;
}

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !('nodeType' in e)) {
    throw new Error(`Node expected`);
  }
}

function OutsideDetecter({ children, callback, classExtend, style }: OutsideDetecterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const classExtension = classExtend ? classExtend.join(' ') : '';

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      assertIsNode(target);
      if (wrapperRef.current && wrapperRef.current.parentNode && !wrapperRef.current.parentNode.contains(target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, callback]);

  return (
    <div ref={wrapperRef} className={`${classExtension}`} style={style}>
      {children}
    </div>
  );
}

export default OutsideDetecter;
