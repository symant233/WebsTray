/* eslint-disable @typescript-eslint/no-explicit-any */
type EventListener = (data?: any) => void;

class EventManager {
  private events: { [key: string]: EventListener[] } = {};

  on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listenerToRemove: EventListener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove,
    );
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(data));
  }
}

export default new EventManager();
