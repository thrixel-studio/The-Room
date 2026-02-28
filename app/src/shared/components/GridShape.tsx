import React from "react";
import Image from "next/image";

export default function GridShape() {
  return (
    <>
      {/* Top Right Grid */}
      <div className="fixed top-0 right-0 w-[300px] h-[169px] pointer-events-none" style={{ zIndex: 0 }}>
        <Image
          src="/images/shape/grid-01.svg"
          alt="Grid background"
          width={300}
          height={169}
          className="opacity-30"
          priority
        />
      </div>
      
      {/* Bottom Left Grid */}
      <div className="fixed bottom-0 left-0 w-[300px] h-[169px] rotate-180 pointer-events-none" style={{ zIndex: 0 }}>
        <Image
          src="/images/shape/grid-01.svg"
          alt="Grid background"
          width={300}
          height={169}
          className="opacity-30"
          priority
        />
      </div>
    </>
  );
}
