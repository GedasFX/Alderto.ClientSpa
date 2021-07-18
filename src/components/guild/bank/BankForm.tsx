import Form, { Input } from 'src/components/Form';

type BankFormProps = {
  bank: Dto.Guild.Bank | null;
  onSubmit?: (item: Dto.Guild.Bank | null) => void;
};

export default function BankForm({ bank, onSubmit }: BankFormProps) {
  return (
    <div className="p-2">
      <Form<Dto.Guild.Bank>
        defaultValues={bank ?? undefined}
        onSubmit={i => onSubmit && onSubmit(i)}
      >
        {({ register }) => (
          <>
            <Input label="Name*" {...register('name', { required: true, maxLength: 70 })} />

            {onSubmit && (
              <div className="flex justify-end gap-2 mt-4">
                {bank && (
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
                  value={bank ? 'Update' : 'Create'}
                />
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
