export default function Input({className, id, placeholder, label, type = 'text', value, onChange}) {
    const isFile = type === 'file';

    return (
        <div className={`field ${isFile ? "field--file" : ""} ${className}`}>
            <label
                htmlFor={id}
                className={`field__label ${isFile ? "field__label--file" : ""}`}
            >{label}</label>

            <input type={type}
                   id={id}
                   placeholder={placeholder}
                   className={`field__input ${isFile ? "field__input--file" : ""}`}
                   autoComplete="off"
                   value={type === "file" ? undefined : value}
                   onChange={onChange}
                   hidden={isFile}
            />
        </div>
    )
}