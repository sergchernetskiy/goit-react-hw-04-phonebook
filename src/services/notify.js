import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function NotifyFail(message) {
  const notifyParams = {
    position: 'right-bottom',
    useIcon: false,
    fontSize: '18px',
    cssAnimationStyle: 'from-bottom',
    closeButton: false,
    background: '#e100ff',
  };

  Notify.failure(message, { notifyParams });
}
