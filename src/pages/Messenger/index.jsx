import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import "./index.css";

import {
  fetchMessages,
  appendMessage,
} from "../../redux/Messenger/sliceAction";

const MessageList = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.data);
  const hasMore = useSelector((state) => state.messages.hasMore);
  const page = useSelector((state) => state.messages.page);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    setShowScrollToBottom(false);
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;
      setShowScrollToBottom(!isAtBottom);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    dispatch(
      appendMessage({ id: Date.now(), name: newMessage, isOutgoing: true })
    );
    setNewMessage("");
    scrollToBottom();
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      await dispatch(fetchMessages(1));
      dispatch(fetchMessages(2));
    };
    loadInitialMessages();
  }, []);

  return (
    messages?.length >= 1 && (
      <div className="container">
        <div
          className="message-container"
          id="scrollableDiv"
          onScroll={handleScroll}
          ref={messageContainerRef}
        >
          <InfiniteScroll
            key={messages.length}
            dataLength={messages.length}
            next={() => dispatch(fetchMessages(page))}
            hasMore={hasMore}
            inverse={true}
            scrollableTarget="scrollableDiv"
          >
            {messages?.map((message, index) => (
              <div
                key={message.id}
                className={`message ${
                  message.isOutgoing
                    ? "outgoing"
                    : index % 2 === 0
                    ? "incoming"
                    : "outgoing"
                }`}
              >
                {message.name}
              </div>
            ))}
            <div ref={messageEndRef} />
          </InfiniteScroll>
        </div>
        <div className="input-container">
          {showScrollToBottom && (
            <button className="scroll-to-bottom" onClick={scrollToBottom}>
              ⬇
            </button>
          )}
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    )
  );
};

export default MessageList;
