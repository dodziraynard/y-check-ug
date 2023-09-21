import './style.scss';

const Flag = ({ color }) => {
    return (
        <span className='summary-flag' style={{ background: color }}></span>
    );
}

export default Flag;
