import { Fragment, useState } from 'react';
import './style.scss';

const Flag = ({ color }) => {
    const [newColor, setNewColor] = useState(`${color}`)
    return (
        <Fragment>
            <input className='summary-flag-input' type="color" list="presetColors" value={newColor} onChange={event => setNewColor(event.target.value)} />
            <datalist id="presetColors">
                <option>#00ff55</option>
                <option>#FFA500</option>
                <option>#ff0000</option>
            </datalist>
        </Fragment>
    );
}

export default Flag;
