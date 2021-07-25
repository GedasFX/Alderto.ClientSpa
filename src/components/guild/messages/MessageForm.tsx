import ChannelSelect from 'src/components/common/ChannelSelect';
import Form, { TextArea } from 'src/components/Form';

type MessageFormProps = {
  message: Dto.Guild.Message | null;
  disabled?: boolean;
  onSubmit?: (item: Dto.Guild.Message | null) => void;
};

export default function MessageForm({ message, disabled, onSubmit }: MessageFormProps) {
  return (
    <div className="p-2">
      <Form<Dto.Guild.Message>
        defaultValues={message ?? undefined}
        onSubmit={i => onSubmit && onSubmit(i)}
      >
        {({ register }) => (
          <>
            {!message && <ChannelSelect {...register('channelId', { required: true })} />}
            <TextArea
              label="Content"
              disabled={disabled}
              {...register('content', { maxLength: 2000 })}
            />

            {onSubmit && (
              <div className="flex justify-end gap-2 mt-4">
                {message && (
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
                  value={message ? 'Update' : 'Create'}
                />
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
