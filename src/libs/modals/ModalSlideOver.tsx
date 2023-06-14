import { FC, ReactNode } from 'react';
import { m } from 'libs/motion';
import { Overlay } from 'libs/modals/Overlay';
import { useModal } from 'hooks/useModal';
import { getInAndOutVariant } from './utils';
import { ReactComponent as IconX } from 'assets/icons/X.svg';

type Props = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const getSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return 'max-w-[580px]';
    case 'md':
      return 'max-w-[480px]';
    default:
      return 'max-w-[380px]';
  }
};

export const ModalSlideOver: FC<Props> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
}) => {
  const { closeModal } = useModal();
  const dropInAndOut = getInAndOutVariant();
  const sizeClass = getSize(size);

  return (
    <Overlay onClick={() => closeModal(id)} className={`justify-end`}>
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${sizeClass}`}
        variants={dropInAndOut}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative flex h-screen w-full flex-col border-0 bg-silver p-25 outline-none focus:outline-none">
          <div
            className={`flex items-center ${
              title ? 'justify-between' : 'justify-end'
            }`}
          >
            <>
              {typeof title === 'string' ? (
                <h2 className={'m-0'}>{title}</h2>
              ) : (
                title
              )}
            </>
            <div>
              {showCloseButton ? (
                <button className={'p-4'} onClick={() => closeModal(id)}>
                  <IconX className={'w-12'} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="overflow-y-auto">{children}</div>
        </div>
      </m.div>
    </Overlay>
  );
};
