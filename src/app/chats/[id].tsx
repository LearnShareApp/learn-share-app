// app/chat/page.tsx
import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import Ably from "ably";
import { IMessage } from "react-native-gifted-chat"; // Импортируем тип IMessage

const ably = new Ably.Realtime({
  key: "PlyVbg.q_AK8w:rIN6wX0SzBvKvZ3-trKOeKYDqHBVofXFZzs4IlivlXY",
}); // Замените на ваш API-ключ Ably
const channelName = "chat-channel"; // Название канала

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]); // Типизируем состояние
  const userId = 1; // Уникальный ID пользователя (замените на актуальный)
  const userName = "User1"; // Имя пользователя (замените на актуальное)

  useEffect(() => {
    const channel = ably.channels.get(channelName);

    // Подписываемся на новые сообщения в канале
    channel.subscribe((message) => {
      addMessage({
        _id: message.id,
        text: message.data.text,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.data.userId,
          name: message.data.userName,
        },
      });
    });

    // Загружаем историю сообщений при загрузке экрана
    channel
      .history()
      .then(({ items }) => {
        const historyMessages = items.map(
          (item): IMessage => ({
            _id: item.id,
            text: item.data.text,
            createdAt: new Date(item.timestamp),
            user: {
              _id: item.data.userId,
              name: item.data.userName,
            },
          })
        );
        setMessages(historyMessages);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке истории:", error);
      });

    // Очищаем подписку при размонтировании компонента
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addMessage = (message: IMessage) => {
    setMessages(
      (previousMessages) => GiftedChat.append(previousMessages, [message]) // Оберните сообщение в массив
    );
  };

  const onSend = (newMessages: IMessage[]) => {
    const message = newMessages[0];
    const channel = ably.channels.get(channelName);

    // Публикуем новое сообщение в канале
    channel.publish("message", {
      text: message.text,
      userId: userId, // ID текущего пользователя
      userName: userName, // Имя текущего пользователя
    });

    // Добавляем сообщение в локальный стейт
    addMessage(message);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userId, // Уникальный ID текущего пользователя
      }}
    />
  );
}
