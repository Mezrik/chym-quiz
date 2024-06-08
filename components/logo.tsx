import React, { forwardRef } from "react";

interface Props extends React.SVGProps<SVGSVGElement> {}

const Logo = forwardRef((props: Props, svgRef: React.Ref<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      strokeWidth={5}
      stroke="currentColor"
      aria-hidden="true"
      ref={svgRef}
      {...props}
    >
      <circle cx="100" cy="100" r="95" stroke="currentColor" fill="none" />
      <path
        d="M100,140 Q85,120 100,100 Q115,80 100,60"
        stroke="currentColor"
        fill="none"
      />
      <circle cx="100" cy="60" r="10" fill="currentColor" />
      <ellipse
        cx="100"
        cy="100"
        rx="30"
        ry="15"
        stroke="currentColor"
        fill="none"
      />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
});

Logo.displayName = "Logo";
export default Logo;
