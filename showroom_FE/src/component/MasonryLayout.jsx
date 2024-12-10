import Masonry from 'react-masonry-css';
import Pin from './Pin.jsx';

const breakpointColumnsObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1100: 3,
    700: 2,
    500: 1
};

const MasonryLayout = ({ pins }) => {
  
  <>
  <h1>Layout</h1>
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
      {pins.map( pin => (
        <div key={pin._id} className='w-max'>
          <Pin pin={pin}/>
        </div>
        ))}
    </Masonry>
  </>
}

export default MasonryLayout;