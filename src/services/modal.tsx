import { useState } from 'react';
import Modal from 'src/components/Modal';

const openModals = new Map<number, React.ReactNode>();
let update: (val: number) => void;

class ModalRef {
  private _id: number;
  public get id() {
    return this._id;
  }

  public get content() {
    return this._content;
  }

  constructor(private readonly _content: React.ReactNode) {
    this._id = Date.now();
    openModals.set(this._id, _content);
    update(Date.now());
  }

  public close() {
    openModals.delete(this._id);
    update(Date.now());
  }
}

class ModalService {
  public open(content: React.ReactNode) {
    return new ModalRef(content);
  }
}

export const modal = new ModalService();

export function ModalContainer() {
  update = useState<number>()[1];

  return (
    <>
      {Array.from(openModals).map(([id, node]) => (
        <Modal key={id}>{node}</Modal>
      ))}
    </>
  );
}
