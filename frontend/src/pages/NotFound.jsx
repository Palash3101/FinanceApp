import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        {/* Large 404 text */}
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        {/* Subtext */}
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
          Oops! Page not found.
        </p>

        <p className="mt-4 text-gray-500">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;