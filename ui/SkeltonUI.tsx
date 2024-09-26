import React from "react";

export default function SkeltonUI() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-16 w-64 bg-gray-200 rounded"></div>
        <div className="h-6 w-48 mt-2 bg-gray-200 rounded"></div>
      </div>

      <nav className="flex space-x-6 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
        ))}
      </nav>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex space-x-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-8 w-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="h-96 relative">
        <div className="absolute inset-0 border-gray-500 border-0 rounded"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="w-full h-full flex items-end">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-300"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-gray-300 w-16 h-6 rounded"></div>
        <div className="absolute bottom-28 right-2 bg-gray-300 w-16 h-6 rounded"></div>
      </div>
    </div>
  );
}
