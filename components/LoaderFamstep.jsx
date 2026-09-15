import React from "react";

function LoaderFamstep() {
  return (
    <>
      <div className="wholeAction">
        <div className="loader" />
      </div>
      <style jsx global>
        {`
          .wholeAction {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            display: grid;
            place-items: center;
            z-index: 99999;
            overflow: hidden;
            background: rgb(62, 60, 60, 0.7);
          }

          .loader {
            width: 100px;
            aspect-ratio: 1;
            display: grid;
          }
          .loader::before,
          .loader::after {
            content: "";
            grid-area: 1/1;
            --c: no-repeat radial-gradient(farthest-side, #08529B 92%, #0000);
            background: var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 50%,
              var(--c) 0 50%;
            background-size: 12px 12px;
            animation: l12 1s infinite;
          }
          .loader::before {
            margin: 4px;
            filter: hue-rotate(45deg);
            background-size: 8px 8px;
            animation-timing-function: linear;
          }

          @keyframes l12 {
            100% {
              transform: rotate(0.5turn);
            }
          }
        `}
      </style>
    </>
  );
}

export default LoaderFamstep;
