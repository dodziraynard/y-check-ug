import './style.scss';
import { useState } from 'react'
import { Button } from '@chakra-ui/react';

const DropDownContainer = ({ header, children, isOpen = true }) => {

    const [open, setOpen] = useState(isOpen)

    return (
        <div className="dropdown-container">
            <button className='btn btn-sm btn-light p-2' onClick={() => setOpen(!open)}>
                <div className="d-flex">
                    <h6><strong>{header}</strong></h6>
                    {open ? <i className="ps-2 bi bi-chevron-up"></i> :
                        <i className="ps-2 bi bi-chevron-down"></i>}
                </div>
            </button>

            {open ? children : ""}

        </div >
    );
}

export default DropDownContainer;
