class PubSub: 
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, topic, callback):
        if topic not in self.subscribers:
            self.subscribers[topic] = []
        self.subscribers[topic].append(callback)

    def publish(self, topic, *args, **kwargs):
        if topic in self.subscribers:
            for callback in self.subscribers[topic]:
                callback(*args, **kwargs)

    def unsubscribe(self, topic, callback):
        if topic in self.subscribers:
            self.subscribers[topic].remove(callback)

    def publish(self, topic, *args, **kwargs):
        if topic in self.subscribers:
            for callback in self.subscribers[topic]:
                callback(*args, **kwargs)