import React from 'react';
import { useApi } from 'src/services';
import { Select } from '../Form';

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

const ChannelSelect = React.forwardRef<HTMLSelectElement, SelectProps>(function ChannelSelect(
  props,
  ref
) {
  const { data } = useApi<Discord.Channel>('/channels');

  return (
    <Select
      label="Channel"
      disabled={!data}
      {...props}
      options={(data ?? []).map(d => ({ label: d.name, value: d.id }))}
      ref={ref}
    />
  );
});
export default ChannelSelect;
