export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return false;
    }
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async send(title, options = {}) {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      if (registration) {
        registration.showNotification(title, {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          ...options
        });
      } else {
        new Notification(title, options);
      }
    }
  }
};
