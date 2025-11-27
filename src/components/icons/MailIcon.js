import Svg, { Path } from 'react-native-svg';

const MailIcon = ({ width = 20, height = 16, color = '#29183B' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 16" fill="none">
    <Path
      d="M18 16H2C0.89543 16 0 15.1046 0 14V1.913C0.0466084 0.842548 0.928533 -0.00101238 2 9.11911e-07H18C19.1046 9.11911e-07 20 0.895432 20 2V14C20 15.1046 19.1046 16 18 16ZM2 3.868V14H18V3.868L10 9.2L2 3.868ZM2.8 2L10 6.8L17.2 2H2.8Z"
      fill={color}
    />
  </Svg>
);

export default MailIcon;
