import { TailSpin } from 'react-loader-spinner';
import { MessagePropType } from './propTypes';

const Spinner = ({ message }) => {
  return (
    <div className='flex flex-col jsutify-center items-center w-full h-full'>
        <TailSpin
            type="Circles"
            color="#00BFFF"
            height={50}
            width={200}
            ariaLabel='loading...'
            className="m-5"
        />
        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  );
};

Spinner.prototype = {
  message: MessagePropType,
};
export default Spinner;