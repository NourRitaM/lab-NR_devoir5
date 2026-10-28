// Shows the error text it receives from App (invalid city, network issue, etc.).
function ErrorMessage({ message }) {
    return <p className="error">{message}</p>;
}

export default ErrorMessage;
