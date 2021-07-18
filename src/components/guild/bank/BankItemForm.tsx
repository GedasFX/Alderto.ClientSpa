import Form, { Input, TextArea } from 'src/components/Form';

type BankItemFormProps = {
  disabled?: boolean;
  item: Dto.Guild.BankItem | null;
  onSubmit?: (item: Dto.Guild.BankItem | null) => void;
};

export default function BankItemForm({ item, onSubmit, disabled }: BankItemFormProps) {
  return (
    <div className="p-2">
      <Form<Dto.Guild.BankItem>
        defaultValues={item ?? undefined}
        onSubmit={i => onSubmit && onSubmit(i)}
      >
        {({ register }) => (
          <>
            <Input
              label="Name*"
              disabled={disabled}
              {...register('name', { required: true, maxLength: 70 })}
            />
            <TextArea
              label="Description"
              disabled={disabled}
              {...register('description', { maxLength: 280 })}
            />
            <Input
              label="Value"
              type="number"
              disabled={disabled}
              {...register('value', { valueAsNumber: true })}
            />
            <Input
              label="Quantity"
              type="number"
              disabled={disabled}
              {...register('quantity', { valueAsNumber: true })}
            />
            <Input
              label="Image"
              disabled={disabled}
              {...register('imageUrl', { maxLength: 140 })}
            />

            {!disabled && onSubmit && (
              <div className="flex justify-end gap-2 mt-4">
                {item && (
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
                  value={item ? 'Update' : 'Create'}
                />
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
