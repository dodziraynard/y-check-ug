import React, { Fragment, useState } from 'react';
import './style.scss';
import { Button } from '@chakra-ui/react';

const Flag = React.forwardRef(({ color, onColorChange, mutable = true, ...props }, ref) => {
    const [newColor, setNewColor] = useState(`${color}`)

    const _onColorChange = (value) => {
        setNewColor(value)
        onColorChange(value)
    }

    return (
        <div className='summary-flag-input d-flex align-items-center' ref={ref}>
            {mutable ?
                <Fragment>
                    <input className='mutable-flag-input' type="color"
                        list="presetColors"
                        value={newColor} onChange={event => { _onColorChange(event.target.value); }} {...props} />
                    {color !== newColor ? <Button size={"sm"} onClick={() => onColorChange(newColor)}>Save</Button> : ""}
                    <datalist id="presetColors">
                        <option>#00ff00</option>
                        <option>#ffa500</option>
                        <option>#ff0000</option>
                    </datalist>
                </Fragment>
                :
                <span className="immutable-flag-input" style={{ background: color }} {...props}></span>
            }
        </div>
    );
})

export default Flag;
