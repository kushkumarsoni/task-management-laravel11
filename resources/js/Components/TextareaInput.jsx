import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextareaInput({
  className = '',
  children,
  name ,isFocused = false, ...props }, ref) {

    const input = ref ? ref : useRef();
    useEffect(() => {
      if (isFocused) {
          input.current.focus();
      }
  }, []);

    return (
        <textarea
            {...props}
            name={name}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        >
          {children}
        </textarea>
    );
});
