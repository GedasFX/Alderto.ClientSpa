import { useForm } from 'react-hook-form';
import { useApi } from 'src/services';

type BankItemFormProps = {
  bankId: number;
  item?: Dto.Guild.BankItem;
};

export default function BankItemForm({ bankId, item }: BankItemFormProps) {
  const { register, handleSubmit } = useForm();

  const {
    data,
    mutate,
    api: { request },
  } = useApi<Dto.Guild.Bank>('/banks');

  const onSubmit = handleSubmit(async o => {
    if (!data) return;

    const result = await request<Dto.Guild.BankItem>(`/${bankId}/items`, JSON.stringify(o), {
      method: 'POST',
    });

    const bankIdx = data.findIndex(o => o.id === bankId);
    const bank = data[bankIdx];

    const newData = [...data];
    newData.splice(bankIdx, 1, { ...bank, contents: [...bank.contents, result] });

    await mutate(newData);
  });

  return (
    <div className="p-2">
      <form onSubmit={onSubmit}>
        <label className="form-label">
          Name
          <input
            className="form-control"
            defaultValue={item?.name}
            {...register('name', { required: true, maxLength: 70 })}
          />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}
