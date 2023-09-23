import { Fragment, useState } from 'react';
import './style.scss';

const Flag = ({ color, mutable = true }) => {
    const [newColor, setNewColor] = useState(`${color}`)
    return (
        <div className='summary-flag-input d-flex align-items-center'>
            {mutable ?
                <Fragment>
                    <input className='mutable-flag-input' type="color"
                        list="presetColors"
                        value={newColor} onChange={event => setNewColor(event.target.value)} />
                    <datalist id="presetColors">
                        <option>#00ff00</option>
                        <option>#FFA500</option>
                        <option>#ff0000</option>
                    </datalist>
                </Fragment>
                :
                <span className="immutable-flag-input" style={{ background: color }}></span>
            }
        </div>
    );
}

export default Flag;
