import './style.scss';
import React, { Fragment } from 'react'
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import logo from "../../assets/images/logo.png";
// import TopNav from '../../components/TopNav';

function Error401Screen() {
    return (
        <Fragment>
            {/* <TopNav /> */}

            <div className="error-page">
                <div className="d-flex justify-content-center">
                    <div>
                        <div className="d-flex justify-content-center">
                            <img className='d-block' src={logo} alt="logo" style={{ "height": "10em" }} />
                        </div>

                        <div className="d-flex justify-content-center">
                            <h1 style={{ "fontSize": "10em" }}>401</h1>
                        </div>

                        <h2 className='text-center'>Unauthorized</h2>
                        <p className='text-center'>Sorry, you are not authorized to access this page.</p>


                        <div className="d-flex justify-content-center my-5">
                            <Link to="/" className="mx-2 btn btn-primary">Home</Link>
                            <Link to="/login" className="mx-2 btn btn-primary">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Error401Screen;
