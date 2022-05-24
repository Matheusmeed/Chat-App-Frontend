import { useEffect, useRef } from 'react';
import EVENTS from '../config/events';
import { useSockets } from '../context/socket.context';
import styles from '../styles/Messages.module.css';
import { AiOutlineSend } from 'react-icons/ai';

function MessagesContainer() {
  const { socket, messages, roomId, username, setMessages } = useSockets();
  const newMessageRef = useRef(null);
  const messageEndRef = useRef(null);

  function handleSendMessage() {
    const message = newMessageRef.current.value;

    if (!String(message).trim()) {
      return;
    }

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

    const date = new Date();

    setMessages([
      ...messages,
      {
        username: 'Você',
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);

    newMessageRef.current.value = '';
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!roomId) {
    return <div />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messageList}>
        {messages.map(({ message, username, time }, index) => {
          return (
            <div
              key={index}
              className={
                username === 'Você'
                  ? styles.messageContainer
                  : styles.messageContainerFromOther
              }
            >
              <div
                className={
                  username === 'Você' ? styles.message : styles.messageFromOther
                }
              >
                <div className={styles.messageInner}>
                  <span
                    className={
                      username === 'Você'
                        ? styles.messageSender
                        : styles.messageSenderFromOther
                    }
                  >
                    {username} - {time}
                  </span>
                  <span className={styles.messageBody}>{message}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <div className={styles.messageBox}>
        <textarea
          rows={1}
          placeholder='Digite a sua mensagem...'
          ref={newMessageRef}
        />
        <button onClick={handleSendMessage} style={{ width: '80px' }}>
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
}

export default MessagesContainer;
