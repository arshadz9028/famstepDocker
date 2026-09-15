import React, { useState, useEffect, useRef } from 'react';
import styles from './DraggableButton.module.scss';

const DraggableButton = ({
    onClick,
    children,
    className,
    buttonStyles = {},
    initialPosition = { x: 20, y: window.innerHeight - 150 },
    size = 60
}) => {
    const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const hasDragged = useRef(false);
    const startPosition = useRef({ x: 0, y: 0 });

    // Initialize button position after component mounts (to avoid window reference errors)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setButtonPosition(initialPosition);
        }
    }, []);

    const handleDragStart = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (!clientX || !clientY) return;

        // Reset drag tracking on start
        hasDragged.current = false;
        startPosition.current = { x: clientX, y: clientY };
        
        setIsDragging(true);
        setDragStart({
            x: clientX - buttonPosition.x,
            y: clientY - buttonPosition.y
        });
    };

    const handleDrag = (e) => {
        if (!isDragging) return;

        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (!clientX || !clientY) return;

        // Check if drag has occurred (more than 3px movement)
        const deltaX = Math.abs(clientX - startPosition.current.x);
        const deltaY = Math.abs(clientY - startPosition.current.y);
        if (deltaX > 3 || deltaY > 3) {
            hasDragged.current = true;
        }

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Keep the button within window bounds
        const maxX = typeof window !== 'undefined' ? window.innerWidth - size : 1000;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - size : 1000;

        setButtonPosition({
            x: Math.min(Math.max(0, newX), maxX),
            y: Math.min(Math.max(0, newY), maxY)
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging && typeof document !== 'undefined') {
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchmove', handleDrag, { passive: false });
            document.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', handleDragEnd);
                document.removeEventListener('touchmove', handleDrag);
                document.removeEventListener('touchend', handleDragEnd);
            }
        };
    }, [isDragging, dragStart]);

    // Handle button click
    const handleClick = (e) => {
        // Only consider it a click if no significant dragging occurred
        if (!hasDragged.current && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={`${styles.draggableButton} ${className || ''}`}
            style={{
                position: 'fixed',
                left: `${buttonPosition.x}px`,
                top: `${buttonPosition.y}px`,
                width: `${size}px`,
                height: `${size}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                zIndex: 9999,
                
                ...buttonStyles
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
        >
            {children}
        </button>
    );
};

export default DraggableButton; 