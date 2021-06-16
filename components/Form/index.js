import s from './style.module.css';
import Button from 'components/Button';
import Link from 'next/link';
import {
  FormProvider,
  useForm,
  useFormContext,
  Controller,
} from 'react-hook-form';
import cn from 'classnames';
import { ToastProvider, useToasts } from 'react-toast-notifications';

export const Field = ({
  name,
  label,
  placeholder,
  validations,
  options,
  render,
  type,
  multiple,
  readOnly,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const value = watch(name);
  const field = register(name, validations);

  let input = (
    <input
      {...field}
      id={name}
      placeholder={placeholder}
      type={type}
      multiple={multiple}
      readOnly={readOnly}
    />
  );

  if (options) {
    input = (
      <>
        {!value && (
          <div className={s.selectPlaceholder}>Please select one...</div>
        )}
        <select id={name} {...field}>
          <option value=""></option>
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      </>
    );
  }

  if (render) {
    input = (
      <Controller
        render={render}
        name={name}
        id={name}
        control={control}
        placeholder={placeholder}
        rules={validations}
      />
    );
  }

  if (type === 'hidden') {
    return input;
  }

  return (
    <div
      className={cn(s.field, {
        [s.fieldError]: errors[name] && errors[name].message,
      })}
    >
      <label htmlFor={name}>
        {label} {validations && <span className={s.required}> *</span>}
      </label>

      {errors[name] && <div className={s.error}>← {errors[name].message}</div>}
      {input}
    </div>
  );
};

export function FormInner({
  children,
  defaultValues,
  action,
  submitLabel,
  onSubmit,
}) {
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, formState } = methods;

  const toastHelpers = useToasts();

  const defaultOnSubmit = async (values, event) => {
    if (onSubmit) {
      await onSubmit(values, event, toastHelpers);
    } else {
      event.target.submit();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={s.form}
        onSubmit={handleSubmit(defaultOnSubmit)}
        method="POST"
        action={action}
        encType="multipart/form-data"
        acceptCharset="utf-8"
      >
        {children}

        <div className={s.submit}>
          <div className={s.agree}>
            By submitting you agree to our{' '}
            <Link href="/legal/terms">
              <a>TOS</a>
            </Link>{' '}
            and acknowledge our{' '}
            <Link href="/legal/privacy-policy">
              <a>Privacy Policy</a>
            </Link>
          </div>

          <Button as="button" type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export function Form(props) {
  return (
    <ToastProvider>
      <FormInner {...props} />
    </ToastProvider>
  );
}
