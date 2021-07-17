import React, { PropsWithChildren } from 'react';
import { FieldValues, SubmitHandler, useForm, UseFormProps, UseFormReturn } from 'react-hook-form';

type FormProps<TFormValues> = {
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
};

export default function Form<T extends FieldValues>({
  defaultValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const formMethods = useForm({ defaultValues });

  return <form onSubmit={formMethods.handleSubmit(onSubmit)}>{children(formMethods)}</form>;
}

const FormControl = ({
  label,
  children,
}: PropsWithChildren<{
  label: React.ReactNode;
}>) => (
  <label className="form-label block mb-3">
    {label}
    {children}
  </label>
);

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return (
    <label className="form-label block mb-3">
      {props.label}
      <input className="form-control mt-1" ref={ref} {...props} />
    </label>
  );
});

type TextAreaProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: React.ReactNode;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(props, ref) {
  return (
    <label className="form-label block mb-3">
      {props.label}
      <textarea className="form-control mt-1" ref={ref} rows={3} {...props} />
    </label>
  );
});

type Option = {
  label: React.ReactNode;
  value: string | number | string[];
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { options: Option[] };

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, ...props },
  ref
) {
  return (
    <select ref={ref} {...props}>
      {options.map(({ label, value }, i) => (
        <option key={typeof value === 'string' ? value : i} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});
