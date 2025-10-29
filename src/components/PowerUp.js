import React from 'react';

const PowerUp = ({ position, type }) => {
  const powerUpStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  const getTypeClass = () => {
    switch (type) {
      case 'MULTIBALL':
        return 'power-up-multiball';
      case 'PADDLE_ENLARGE':
        return 'power-up-enlarge';
      case 'SLOW_MOTION':
        return 'power-up-slow';
      case 'EXPLOSIVE_BALL':
        return 'power-up-explosive';
      case 'EXTRA_LIFE':
        return 'power-up-extralife';
      default:
        return '';
    }
  };

  return <div className={`power-up ${getTypeClass()}`} style={powerUpStyle}></div>;
};

export default PowerUp;
