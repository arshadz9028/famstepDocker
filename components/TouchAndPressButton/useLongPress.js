import { useCallback, useRef, useState } from "react";

const useLongPress = (
  onLongPress = () => {},
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event) => {
      timeout.current && clearTimeout(timeout.current);
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault]
  );

  return {
    onTouchStart: (e) => start(e),
    onTouchEnd: (e) => clear(e),
  };
};

const preventDefault = (event) => {
  event.preventDefault();
};

export default useLongPress;
