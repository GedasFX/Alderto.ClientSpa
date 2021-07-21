import Form, { Input, TextArea } from 'src/components/Form';

type CurrencyFormProps = {
  currency: Dto.Guild.Currency | null;
  disabled?: boolean;
  onSubmit?: (item: Dto.Guild.Currency | null) => void;
};

export default function CurrencyForm({ currency, disabled, onSubmit }: CurrencyFormProps) {
  return (
    <div className="p-2">
      <Form<Dto.Guild.Currency>
        defaultValues={currency ?? undefined}
        onSubmit={i => onSubmit && onSubmit(i)}
      >
        {({ register }) => (
          <>
            <Input
              label="Name*"
              disabled={disabled}
              {...register('name', { required: true, maxLength: 50 })}
            />
            <Input
              label="Symbol*"
              disabled={disabled}
              {...register('symbol', { required: true, maxLength: 50 })}
            />
            <TextArea
              label="Description"
              disabled={disabled}
              {...register('description', { maxLength: 2000 })}
            />
            <Input
              label="Timely interval (in seconds)"
              type="number"
              disabled={disabled}
              {...register('timelyInterval', { required: true, valueAsNumber: true })}
            />
            <Input
              label="Timely amount"
              type="number"
              disabled={disabled}
              {...register('timelyAmount', { required: true, valueAsNumber: true })}
            />

            {onSubmit && (
              <div className="flex justify-end gap-2 mt-4">
                {currency && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => confirm('Are you sure?') && onSubmit(null)}
                  >
                    Delete
                  </button>
                )}
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={currency ? 'Update' : 'Create'}
                />
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
