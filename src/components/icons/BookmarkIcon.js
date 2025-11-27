import Svg, { Path } from 'react-native-svg';

const BookmarkIcon = ({ width = 16, height = 20, color = '#1A1A1A' }) => (
  <Svg width={width} height={height} viewBox="0 0 16 20" fill="none">
    <Path
      d="M15 19L8 15L1 19V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BookmarkIcon;
