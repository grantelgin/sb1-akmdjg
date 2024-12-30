import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthFooter() {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      By continuing, you agree to our{' '}
      <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">
        Privacy Policy
      </Link>
    </div>
  );
} 