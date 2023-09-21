import './style.scss';
import { useRef } from 'react';

function PasswordInput({ value, setValue, ...rest }) {
    const passwordInputRef = useRef(null);
    const handleEyeClick = () => {
        const passwordInput = passwordInputRef.current;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    };

    return (
        <div className="password-input">
            <div className="input-group">
                <input ref={passwordInputRef}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={value}
                    {...rest}
                />
                <div className="input-group-append d-flex">
                    <button className="btn btn-outline-primary" type="button" onClick={handleEyeClick}>
                        <i className="bi bi-eye-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PasswordInput;
