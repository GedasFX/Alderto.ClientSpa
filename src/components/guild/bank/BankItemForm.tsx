import Form, { Input, TextArea } from 'src/components/Form';

type BankItemFormProps = {
  item: Dto.Guild.BankItem | null;
  onSubmit?: (item: Dto.Guild.BankItem | null) => void;
};

export default function BankItemForm({ item, onSubmit }: BankItemFormProps) {
  return (
    <div className="p-2">
      <Form<Dto.Guild.BankItem>
        defaultValues={item ?? undefined}
        onSubmit={i => onSubmit && onSubmit(i)}
      >
        {({ register }) => (
          <>
            <Input label="Name*" {...register('name', { required: true, maxLength: 70 })} />
            <TextArea label="Description" {...register('description', { maxLength: 280 })} />
            <Input label="Value" type="number" {...register('value', { valueAsNumber: true })} />
            <Input
              label="Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
            />
            <Input label="Image" {...register('imageUrl', { maxLength: 140 })} />

            {onSubmit && (
              <div className="flex justify-end gap-2 mt-2">
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
