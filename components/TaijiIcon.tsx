
import React from 'react';

interface TaijiProps {
  size?: number;
  animate?: boolean;
}

const TaijiIcon: React.FC<TaijiProps> = ({ size = 200, animate = true }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${animate ? 'taiji-pulse' : ''}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="-50 -50 100 100" 
        className={`w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${animate ? 'taiji-rotate' : ''}`}
      >
        {/* 背景大圆 - 宣纸质感边框 */}
        <circle r="49.5" fill="white" stroke="#1a1a1a" strokeWidth="0.5" />
        
        {/* 黑色鱼 (阴) - 标准 S 曲线 */}
        {/* 路径描述：从顶部出发，先向右画一个小半圆(25)，再向左画一个小半圆(25)，最后补齐左侧大半圆(50) */}
        <path 
          d="M 0 -50 
             A 25 25 0 0 1 0 0 
             A 25 25 0 0 0 0 50 
             A 50 50 0 0 1 0 -50" 
          fill="#1a1a1a" 
        />
        
        {/* 阴中之阳 (黑色部分的实心白点) - 标准尺寸 */}
        <circle cy="-25" r="7.5" fill="white" />
        
        {/* 阳中之阴 (白色部分的实心黑点) - 标准尺寸 */}
        <circle cy="25" r="7.5" fill="#1a1a1a" />
        
        {/* 极细外圈装饰 */}
        <circle r="49.5" fill="none" stroke="#1a1a1a" strokeWidth="0.2" opacity="0.1" />
      </svg>
    </div>
  );
};

export default TaijiIcon;
