import { PropsWithChildren } from 'react';
import ReactModal, { Props } from 'react-modal';

ReactModal.setAppElement('#__next');

export default function Modal({
  children,
  ...modalProps
}: PropsWithChildren<Omit<Props, 'isOpen'>>) {
  return (
    <ReactModal
      {...modalProps}
      isOpen={true}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
        },
      }}
    >
      <div className="box p-5">{children}</div>
    </ReactModal>
  );
}
