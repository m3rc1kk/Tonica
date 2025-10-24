export default function Input({className, id, placeholder, label, type = 'text', value, onChange}) {
    return (
        <div className={`field ${className}`}>
            <label
                htmlFor={id}
                className='field__label'
            >{label}</label>

            <input type={type}
                   id={id}
                   placeholder={placeholder}
                   className="field__input"
                   autoComplete="off"
                   value={value}
                   onChange={onChange}
            />
        </div>
    )
}