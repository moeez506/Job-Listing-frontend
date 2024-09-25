import React from "react";

interface PendingJobImageProps {
  width?: number;
  height?: number;
}

export default function PendingJobImage({
  width = 800,
  height = 400,
}: PendingJobImageProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <svg
        width={width}
        height={height}
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="800" height="400" fill="#F3F4F6" />
        <rect x="100" y="100" width="600" height="200" rx="20" fill="#E5E7EB" />
        <circle cx="400" cy="200" r="60" fill="#D1D5DB">
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M400 160V240M360 200H440"
          stroke="#9CA3AF"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <text
          x="400"
          y="350"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fill="#4B5563"
          textAnchor="middle"
        >
          Job Pending
        </text>
        <g>
          <circle cx="300" cy="200" r="20" fill="#9CA3AF">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>
          <circle cx="400" cy="200" r="20" fill="#9CA3AF">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          <circle cx="500" cy="200" r="20" fill="#9CA3AF">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}
