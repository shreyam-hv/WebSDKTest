import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p className="description">{description}</p>
    </div>
  );
};
