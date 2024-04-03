import './style.scss';
import React, { Fragment } from 'react'
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import logo from "../../assets/images/logo.png";

function Error404Screen() {

    return (
        <Fragment>
            <div className="error-page">
                <div className="content">
                    <div className="d-flex justify-content-center">
                        <img src={logo} alt="logo" style={{ "height": "3em" }} />
                    </div>
                    <h1 style={{ "fontSize": "10em" }}>404</h1>

                    <div>
                        <h2 className='h2 text-center'>Not Found</h2>
                        <p>Sorry, the requested resource is not found.</p>
                    </div>

                    <div className="d-flex justify-content-center my-4">
                        <Link to="/" className="mx-2 btn btn-primary">Home</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Error404Screen;
