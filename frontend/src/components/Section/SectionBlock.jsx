import ButtonLink from "../Button/ButtonLink.jsx";
import arrow from '../../assets/images/arrow.svg'

export default function SectionBlock({
    title,
    children,
    link='/',
    className = '',
    bodyClassName = '',
                                     }) {

    return (
        <div className={`section__block ${className}`}>
            <header className="section__block-header charts__header">
                <ButtonLink to={link} className="section__block-link">
                    {title} <img src={arrow} width={12} height={24} loading='lazy' alt="" className="section__block-link-icon"/>
                </ButtonLink>
            </header>
            <div className={`section__body ${bodyClassName}`}>
                {children}
            </div>
        </div>
    )
}