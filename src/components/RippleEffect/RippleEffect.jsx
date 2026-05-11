import React, { useEffect, useState } from 'react';
import './RippleEffect.css';

const RippleEffect = () => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Eğer tıklanan yer bir buton, link veya tıklanabilir bir elemansa dalga oluşturma
      if (e.target.closest('button, a, .clickable, input, [role="button"]')) {
        return;
      }

      const ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => {
        const next = [...prev, ripple];
        // Sadece son 10 dalgayı tutarak performansı koruyoruz
        return next.length > 10 ? next.slice(-10) : next;
      });

      // Animasyon bitince (10s) temizle
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 10000);
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="ripple-container">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple-circle"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  );
};

export default RippleEffect;
