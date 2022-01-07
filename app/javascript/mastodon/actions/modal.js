export const MODAL_OPEN  = 'MODAL_OPEN';
export const MODAL_CLOSE = 'MODAL_CLOSE';

export function openModal(type, props, modalRootProps) {
  return {
    type: MODAL_OPEN,
    modalType: type,
    modalProps: props,
    modalRootProps,
  };
};

export function closeModal(type) {
  return {
    type: MODAL_CLOSE,
    modalType: type,
  };
};
