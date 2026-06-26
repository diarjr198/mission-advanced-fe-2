import { useState, cloneElement } from "react";

export default function InputField({
    id,
    label,
    type = "text",
    name,
    required = false,
    value,
    onChange,
    children,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    const enhancedChildren =
        children && type === "password"
            ? cloneElement(children, {
                  showPassword,
                  onClick: togglePasswordVisibility,
              })
            : children;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 inline-block text-sm text-slate-600 sm:text-base"
            >
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <div className={children ? "relative" : ""}>
                <input
                    id={id}
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="h-12 w-full rounded-md border border-gray-200 px-3 pr-11 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-base"
                />
                {enhancedChildren}
            </div>
        </div>
    );
}
