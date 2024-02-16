import './style.scss';


function Footer() {
    return (
        <section className='footer mt-5'>
            <div className="col-md-6 mx-auto">
                <p className="text-center m-0">© {new Date().getFullYear()} Y-Check - All Rights Reserved</p>
            </div>
        </section>
    );
}

export default Footer;
