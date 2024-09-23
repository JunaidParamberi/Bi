import React from 'react';

// Define the types for the props
interface ButtonProps {
  text?: string; // Optional string type for the text
  onClick: () => void; // Function type for the onClick event
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <div>
      <button
        className="gradient-border  px-7 py-2 xl:text-[34px] xl:py-5 xl:px-5 text-[16px] w-full text-center active:opacity-70 text-ellipsis"
        onClick={onClick}
      >
        {text || 'More Stories'}
      </button>
    </div>
  );
};

export default Button;
