import {Link} from "react-router-dom";

export default function ButtonLink({to, children, className='', onClick, type }) {
    if (to) {
        return (
            <Link to={to} className={`button__link ${className}`}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`button ${className}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}

