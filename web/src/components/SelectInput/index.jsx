import './style.scss';
import { Fragment } from 'react';


function SelectInput({ options = [], value = "", ...props }) {
    return (
        <Fragment>
            <select className="form-select" id="locale"
                value={value || ""}
                aria-describedby="locale"
                {...props}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </Fragment>
    );
}

export default SelectInput;
