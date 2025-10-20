import Logo from "../Logo/Logo.jsx";
import Input from "../Input/Input.jsx";
import ButtonLink from "../Button/ButtonLink.jsx";

export default function Form({title, inputs=[], buttonText, buttonIcon, isLogin=false, text=''}) {

    return (
        <>
                <header className="form__header">
                    <h2 className="form__title">{title}</h2>
                    <Logo
                        className="form__logo"
                    />
                </header>

                <div className="form__inputs">
                    {inputs.length > 0 ? (
                        inputs.map(({ id, label, type, placeholder }) => (
                            <Input
                                key={id}
                                id={id}
                                label={label}
                                type={type}
                                placeholder={placeholder}
                                className="form__field auth__form-field"
                            />
                        ))
                    ) : (
                        <p className='form__text'>{text}</p>
                    )}
                </div>

                {isLogin && (
                    <ButtonLink to={'/reset-password'} className="form__forgot login__form-forgot">
                        Forgot Password?
                    </ButtonLink>
                )}

                <ButtonLink
                    type='submit'
                    className={`form__button login__form-button${!isLogin ? ' form__button--margin' : ''}`}
                    onClick=""
                >{buttonText} <img src={buttonIcon} width={16} height={16} loading="lazy" alt="Icon" className="form__button-icon login__form-button-icon"/></ButtonLink>
        </>
    )
}