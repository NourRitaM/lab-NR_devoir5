// One small block of the card (icon + value + label), used for humidity and wind.
function WeatherDetail({ iconClass, value, label }) {
    return (
        <div className="col">
            <i className={iconClass}></i>
            <div>
                <p className="detail-value">{value}</p>
                <p>{label}</p>
            </div>
        </div>
    );
}

export default WeatherDetail;
