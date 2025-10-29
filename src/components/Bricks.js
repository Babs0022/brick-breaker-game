import React from 'react';
import Brick from './Brick';

const Bricks = ({ bricks, scale }) => {
  return (
    <div className="bricks-container">
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          position={brick.position}
          width={brick.width}
          height={brick.height}
          color={brick.color}
          health={brick.health}
          isSecret={brick.isSecret}
          scale={scale}
        />
      ))}
    </div>
  );
};

export default Bricks;