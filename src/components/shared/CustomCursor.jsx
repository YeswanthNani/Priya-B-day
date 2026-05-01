import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    };

    const animate = () => {
      const dx = posRef.current.x - dotPosRef.current.x;
      const dy = posRef.current.y - dotPosRef.current.y;
      dotPosRef.current.x += dx * 0.12;
      dotPosRef.current.y += dy * 0.12;
      cursor.style.left = dotPosRef.current.x + 'px';
      cursor.style.top = dotPosRef.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      cursor.style.width = '50px';
      cursor.style.height = '50px';
      cursor.style.borderColor = 'rgba(168,85,247,0.8)';
    };

    const onLeave = () => {
      cursor.style.width = '28px';
      cursor.style.height = '28px';
      cursor.style.borderColor = 'rgba(232,121,160,0.8)';
    };

    const onDown = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(0.8)';
    };
    const onUp = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    };

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('button,a,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" ref={cursorRef} />
      <div id="cursor-dot" ref={dotRef} />
    </>
  );
};

export default CustomCursor;
