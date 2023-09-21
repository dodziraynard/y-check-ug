import { Link } from 'react-router-dom';
import './style.scss';
import { Fragment } from 'react';

const BreadCrumb = ({ items }) => {

    return (
        <div className="breadcrumb">
            <Link to="/">Home /</Link>
            {items?.map((item, index) => {
                return <Fragment key={index}>
                    <Link key={index} to={item.url}>{item.name} / </Link>
                </Fragment >

            })}
        </div >
    );
}

export default BreadCrumb;
