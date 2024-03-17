import './style.scss';

const SummaryFlagLegend = ({ label, colour, className }) => {

    return (
        <div className={`summary-flag-legend d-flex align-items-center ${className}`}>
            <span style={{ background: colour, height: "0.8em", width: "0.8em", margin: "0.2em" }}></span>
            <small>{label}</small>
        </div >
    );
}

export default SummaryFlagLegend;
