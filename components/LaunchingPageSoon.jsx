import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/launchingModel.module.scss"; // Adjust based on your file structure
import { gsap } from "gsap";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import launchingSoon from "../assets/newIcons/launchingSoon.png";
export default function Countdown({days,hours,min,sec}) {
  const [time, setTime] = useState({
    days: days,
    hours: hours,
    minutes: min,
    seconds: sec,
  });

  const intervalRef = useRef(null);
  const prevTimeRef = useRef({ days: 0, hours: 72, minutes: 0, seconds: 0 });

  useEffect(() => {
    let totalSeconds =
      time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds;

    intervalRef.current = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--; // Decrement totalSeconds each tick

        const newDays = Math.floor(totalSeconds / 86400);
        const newHours = Math.floor((totalSeconds % 86400) / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = Math.floor(totalSeconds % 60);

        setTime({
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        });

        animateFigureIfChanged(newDays, newHours, newMinutes, newSeconds);
      } else {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const animateFigureIfChanged = (days, hours, minutes, seconds) => {
    const prevDays = prevTimeRef.current.days;
    const prevHours = prevTimeRef.current.hours;
    const prevMinutes = prevTimeRef.current.minutes;
    const prevSeconds = prevTimeRef.current.seconds;

    // Check if each digit has changed, then animate
    if (Math.floor(prevDays / 10) !== Math.floor(days / 10)) {
      animateDigit(".days-1", Math.floor(days / 10));
    }
    if (prevDays % 10 !== days % 10) {
      animateDigit(".days-2", days % 10);
    }
    if (Math.floor(prevHours / 10) !== Math.floor(hours / 10)) {
      animateDigit(".hours-1", Math.floor(hours / 10));
    }
    if (prevHours % 10 !== hours % 10) {
      animateDigit(".hours-2", hours % 10);
    }
    if (Math.floor(prevMinutes / 10) !== Math.floor(minutes / 10)) {
      animateDigit(".min-1", Math.floor(minutes / 10));
    }
    if (prevMinutes % 10 !== minutes % 10) {
      animateDigit(".min-2", minutes % 10);
    }
    if (Math.floor(prevSeconds / 10) !== Math.floor(seconds / 10)) {
      animateDigit(".sec-1", Math.floor(seconds / 10));
    }
    if (prevSeconds % 10 !== seconds % 10) {
      animateDigit(".sec-2", seconds % 10);
    }

    // Update the previous time reference
    prevTimeRef.current = { days, hours, minutes, seconds };
  };

  const animateDigit = (className, value) => {
    const $el = document.querySelector(className);
    if (!$el) return;

    const $top = $el.querySelector(`.${styles.top}`);
    const $backTop = $el.querySelector(`.${styles.top_back}`);
    const $bottom = $el.querySelector(`.${styles.bottom}`);
    const $backBottom = $el.querySelector(`.${styles.bottom_back}`);

    if (!$top || !$backTop || !$bottom || !$backBottom) return;

    $backTop.querySelector("span").textContent = value;
    $backBottom.querySelector("span").textContent = value;

    gsap.to($top, {
      duration: 0.8,
      rotationX: "-180deg",
      transformPerspective: 300,
      ease: "quart.out",
      onComplete: () => {
        $top.textContent = value;
        $bottom.textContent = value;
        gsap.set($top, { rotationX: 0 });
      },
    });

    gsap.to($backTop, {
      duration: 0.8,
      rotationX: 0,
      transformPerspective: 300,
      ease: "quart.out",
      clearProps: "all",
    });
  };

  return (
    <div className={styles.wrap}>
      {/* logo */}

      <div className={styles.wrap1}>
        <div className={styles.Image_logo}>
          <svg
            viewBox="0 0 718 211"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logo_svg}
          >
            <rect
              x="508.692"
              y="75.3672"
              width="61.5316"
              height="21.5466"
              rx="5"
              fill="#08529B"
            />
            <path
              d="M524.707 69.334H554.209L566.852 74.5052H512.064L524.707 69.334Z"
              fill="#08529B"
              fillOpacity="0.5"
            />
            <rect
              x="476.662"
              y="148.626"
              width="124.749"
              height="21.5466"
              rx="5"
              fill="#08529B"
            />
            <path
              d="M492.677 141.731H585.396L598.04 147.764H480.034L492.677 141.731Z"
              fill="#08529B"
              fillOpacity="0.5"
            />
            <rect
              x="492.678"
              y="111.564"
              width="92.7189"
              height="21.5466"
              rx="5"
              fill="#08529B"
            />
            <path
              d="M508.726 104.67H570.224L582.868 110.703H496.049L508.726 104.67Z"
              fill="#08529B"
              fillOpacity="0.5"
            />
            <path
              d="M64.6714 51.9498C60.7047 51.9498 57.8464 52.8831 56.0964 54.7498C54.3464 56.6165 53.4714 59.7665 53.4714 64.1998V71.3748H75.3464L72.3714 90.6248H53.4714V164.3H25.8214V90.6248H11.8214V71.3748H25.8214V63.1498C25.8214 53.8165 28.8547 46.2331 34.9214 40.3998C41.1047 34.4498 49.9131 31.4748 61.3464 31.4748C70.5631 31.4748 79.0214 33.4581 86.7214 37.4248L79.1964 55.4498C74.5297 53.1165 69.6881 51.9498 64.6714 51.9498ZM154.102 137.35C154.102 140.85 154.569 143.416 155.502 145.05C156.552 146.683 158.185 147.908 160.402 148.725L154.627 166.75C148.91 166.283 144.244 165.058 140.627 163.075C137.01 160.975 134.21 157.708 132.227 153.275C126.16 162.608 116.827 167.275 104.227 167.275C95.0102 167.275 87.6602 164.591 82.1769 159.225C76.6935 153.858 73.9519 146.858 73.9519 138.225C73.9519 128.075 77.6852 120.316 85.1519 114.95C92.6185 109.583 103.41 106.9 117.527 106.9H126.977V102.875C126.977 97.3915 125.81 93.6581 123.477 91.6748C121.144 89.5748 117.06 88.5248 111.227 88.5248C108.194 88.5248 104.519 88.9915 100.202 89.9248C95.8852 90.7415 91.4519 91.9081 86.9019 93.4248L80.6019 75.2248C86.4352 73.0081 92.3852 71.3165 98.4519 70.1498C104.635 68.9831 110.352 68.3998 115.602 68.3998C128.902 68.3998 138.644 71.1415 144.827 76.6248C151.01 82.1081 154.102 90.3331 154.102 101.3V137.35ZM112.277 147.5C118.577 147.5 123.477 144.525 126.977 138.575V122.125H120.152C113.852 122.125 109.127 123.233 105.977 125.45C102.944 127.666 101.427 131.108 101.427 135.775C101.427 139.508 102.36 142.425 104.227 144.525C106.21 146.508 108.894 147.5 112.277 147.5ZM278.851 68.3998C286.201 68.3998 292.093 70.9081 296.526 75.9248C300.959 80.8248 303.176 87.6498 303.176 96.3998V164.3H275.526V101.125C275.526 92.8415 272.901 88.6998 267.651 88.6998C264.734 88.6998 262.168 89.6915 259.951 91.6748C257.734 93.6581 255.576 96.6915 253.476 100.775V164.3H225.826V101.125C225.826 92.8415 223.201 88.6998 217.951 88.6998C215.151 88.6998 212.584 89.7498 210.251 91.8498C208.034 93.8331 205.876 96.8081 203.776 100.775V164.3H176.126V71.3748H200.276L202.201 82.2248C205.818 77.5581 209.784 74.1165 214.101 71.8998C218.534 69.5665 223.551 68.3998 229.151 68.3998C234.401 68.3998 238.893 69.6831 242.626 72.2498C246.476 74.8165 249.276 78.4331 251.026 83.0998C254.759 78.0831 258.843 74.4081 263.276 72.0748C267.826 69.6248 273.018 68.3998 278.851 68.3998ZM356.678 68.3998C363.328 68.3998 369.57 69.3915 375.403 71.3748C381.236 73.3581 386.37 76.1581 390.803 79.7748L380.653 95.3498C373.07 90.5665 365.428 88.1748 357.728 88.1748C354.111 88.1748 351.311 88.8165 349.328 90.0998C347.461 91.2665 346.528 92.9581 346.528 95.1748C346.528 96.9248 346.936 98.3831 347.753 99.5498C348.686 100.6 350.495 101.708 353.178 102.875C355.861 104.041 360.003 105.441 365.603 107.075C375.286 109.875 382.461 113.55 387.128 118.1C391.911 122.533 394.303 128.716 394.303 136.65C394.303 142.95 392.495 148.433 388.878 153.1C385.261 157.65 380.303 161.15 374.003 163.6C367.703 166.05 360.703 167.275 353.003 167.275C345.186 167.275 337.895 166.05 331.128 163.6C324.478 161.15 318.82 157.766 314.153 153.45L327.628 138.4C335.445 144.466 343.67 147.5 352.303 147.5C356.503 147.5 359.77 146.741 362.103 145.225C364.553 143.708 365.778 141.55 365.778 138.75C365.778 136.533 365.311 134.783 364.378 133.5C363.445 132.216 361.636 131.05 358.953 130C356.27 128.833 352.011 127.433 346.178 125.8C336.961 123.116 330.078 119.383 325.528 114.6C320.978 109.816 318.703 103.866 318.703 96.7498C318.703 91.3831 320.22 86.5998 323.253 82.3998C326.403 78.0831 330.836 74.6998 336.553 72.2498C342.386 69.6831 349.095 68.3998 356.678 68.3998ZM466.823 159.925C463.439 162.258 459.473 164.066 454.923 165.35C450.489 166.633 446.056 167.275 441.623 167.275C421.323 167.158 411.173 155.958 411.173 133.675V90.6248H398.048V71.3748H411.173V51.2498L438.823 48.0998V71.3748H460.173L457.198 90.6248H438.823V133.325C438.823 137.641 439.523 140.733 440.923 142.6C442.323 144.466 444.539 145.4 447.573 145.4C450.723 145.4 454.048 144.408 457.548 142.425L466.823 159.925Z"
              fill="#08529B"
            />
            <path
              d="M665.011 72.1547C676.678 72.1547 685.369 76.4713 691.086 85.1047C696.803 93.738 699.661 105.813 699.661 121.33C699.661 130.896 698.144 139.471 695.111 147.055C692.194 154.521 687.936 160.413 682.336 164.73C676.736 168.93 670.203 171.03 662.736 171.03C653.403 171.03 645.878 167.821 640.161 161.405V203.93L612.511 206.905V75.1297H636.836L638.236 85.4547C641.853 80.9047 645.994 77.5797 650.661 75.4797C655.328 73.263 660.111 72.1547 665.011 72.1547ZM654.336 150.73C665.419 150.73 670.961 141.046 670.961 121.68C670.961 110.713 669.736 103.13 667.286 98.9297C664.836 94.613 661.161 92.4547 656.261 92.4547C653.111 92.4547 650.136 93.388 647.336 95.2547C644.653 97.1213 642.261 99.8047 640.161 103.305V142.505C643.894 147.988 648.619 150.73 654.336 150.73Z"
              fill="#08529B"
            />
          </svg>
        </div>

        <div>
          <h1 className={styles.wrapH1}>Launching Soon</h1>
          <div className={styles.countdown}>
            <TimeBlock unit="days" time={time.days} />
            <TimeBlock unit="hours" time={time.hours} />
            <TimeBlock unit="min" time={time.minutes} />
            <TimeBlock unit="sec" time={time.seconds} />
          </div>
        </div>

        <div className={styles.footerSocialIcons}>
          <Link
            href={`https://www.linkedin.com/company/famstep/?viewAsMember=true`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.socialIcon}>
              <FaLinkedinIn />
            </span>
          </Link>
          <Link
            href={`https://www.instagram.com/famstep_in/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.socialIcon}>
              <FaInstagram />
            </span>
          </Link>

          <Link
            href={`https://x.com/famstepOfficial`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.socialIcon}>
              <FaXTwitter />
            </span>
          </Link>
        </div>
      </div>
      <div className={styles.imageLaunch}>
        <Image
          src={launchingSoon}
          alt="launchingImage"
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

function TimeBlock({ unit, time }) {
  const firstDigit = Math.floor(time / 10);
  const secondDigit = time % 10;

  return (
    <div className={`${styles.bloc_time} ${unit}`} data-init-value={time}>
      <div className={`${styles.figure} ${unit} ${unit}-1`}>
        <span className={styles.top}>{firstDigit}</span>
        <span className={styles.top_back}>
          <span>{firstDigit}</span>
        </span>
        <span className={styles.bottom}>{firstDigit}</span>
        <span className={styles.bottom_back}>
          <span>{firstDigit}</span>
        </span>
      </div>
      <div className={`${styles.figure} ${unit} ${unit}-2`}>
        <span className={styles.top}>{secondDigit}</span>
        <span className={styles.top_back}>
          <span>{secondDigit}</span>
        </span>
        <span className={styles.bottom}>{secondDigit}</span>
        <span className={styles.bottom_back}>
          <span>{secondDigit}</span>
        </span>
      </div>
      <span className={styles.count_title}>
        {unit.charAt(0).toUpperCase() + unit.slice(1)}
      </span>
    </div>
  );
}
