import React from 'react';

interface IconProps {
  className?: string;
}

export const LearnIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M21.38 9.32l-8.82-3.95a1.37 1.37 0 00-1.12 0l-8.82 4a.75.75 0 000 1.36l3.63 1.63v4.62a.74.74 0 00.09.36c.06.1 1.41 2.46 5.66 2.46a7.72 7.72 0 004.38-1.16 4.27 4.27 0 001.28-1.3.74.74 0 00.09-.36v-4.67l1.5-.67v3.72A1 1 0 0019 16a1 1 0 002 0 1 1 0 00-.25-.64V11h-.07l.7-.32a.75.75 0 000-1.36zm-5.13 7.38a3.84 3.84 0 01-.72.65 6.19 6.19 0 01-3.53.9c-2.79 0-3.94-1.15-4.25-1.55V13l3.69 1.65c.356.16.764.16 1.12 0L16.25 13v3.7zM12 13.24L4.76 10 12 6.76 19.24 10 12 13.24z" />
  </svg>
);

export const CheckmarkIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10.03 17.09l-4.56-4.56 1.06-1.06 3.44 3.44 7.47-8.41 1.12 1-8.53 9.59z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 11.75a3.75 3.75 0 003.75-3.69V8a3.75 3.75 0 00-7.5-.06V8A3.75 3.75 0 0012 11.75zM9.75 8a2.25 2.25 0 014.5 0 2.25 2.25 0 01-4.5 0zm10 8v3h-1.5v-3c0-1.21-.24-2.14-3.18-2.21l-2.52 2.71a.77.77 0 01-1.1 0l-2.52-2.75c-2.94.07-3.18 1-3.18 2.21v3h-1.5V16c0-3.22 2.54-3.67 4.76-3.71a1.33 1.33 0 011 .41l2 2.22 2-2.22a1.28 1.28 0 011-.41c2.2 0 4.74.45 4.74 3.71z" />
  </svg>
);

export const TransferIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M17.19 8.75H6v-1.5h11.19L15 5l1-1 4 4-4 4-1-1zM9 13l-1-1-4 4 4 4 1-1-2.19-2.25H17v-1.5H6.81z" />
  </svg>
);

export const AlertWarningIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.75 9v5h-1.5V9h1.5zM12 17a1 1 0 100-2 1 1 0 000 2z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.995 3.242a1.75 1.75 0 00-1.513.87v.002L2.874 17.108l-.001.002a1.75 1.75 0 001.52 2.64h15.213a1.75 1.75 0 001.52-2.64l-.002-.002L13.51 4.114l-.001-.002a1.75 1.75 0 00-1.513-.87zm-.125 1.533a.25.25 0 01.341.091l7.622 13.003.002.003a.25.25 0 01-.218.378H4.383a.25.25 0 01-.218-.378L11.777 4.87l.002-.003a.25.25 0 01.091-.09z"
    />
  </svg>
);

export const AlertErrorIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.06 12l2.47 2.47-1.06 1.06L12 13.06l-2.47 2.47-1.06-1.06L10.94 12 8.47 9.53l1.06-1.06L12 10.94l2.47-2.47 1.06 1.06L13.06 12z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.25 12a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0zM12 4.75a7.25 7.25 0 100 14.5 7.25 7.25 0 000-14.5z"
    />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.5 10.25h-.75V8a4.75 4.75 0 00-9.5 0v2.25H6.5a1.25 1.25 0 00-1.25 1.25v7a1.25 1.25 0 001.25 1.25h11a1.25 1.25 0 001.25-1.25v-7a1.25 1.25 0 00-1.25-1.25zM8.75 8a3.25 3.25 0 016.5 0v2.25h-6.5zm8.5 10.25H6.75v-6.5h10.5zm-6-4.25h1.5v2h-1.5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export const InformationIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12.75 16h-1.5v-5h1.5zM12 8a1 1 0 101 1 1 1 0 00-1-1zm8.75 4A8.75 8.75 0 1012 20.75 8.77 8.77 0 0020.75 12zm-1.5 0A7.25 7.25 0 1112 4.75 7.26 7.26 0 0119.25 12z" />
  </svg>
);
