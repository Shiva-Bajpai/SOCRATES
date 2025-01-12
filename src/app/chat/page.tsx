/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideUp } from "@/utils/variant";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/utils/api";
import RenderMarkdown from "@/utils/rednerMarkdown";
import Link from "next/link";
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
interface Message {
  id: number;
  sender: "user" | "bot";
  content: string;
  followUpQuestions?: [string];
  sources?: [[{ title: string; link: string }]];
  videos?: [{ imageUrl: string; link: string }];
  images?: [{ title: string; link: string }];
}
export interface ResponseContent {
  answer: string;
  followUpQuestions: [string];
  sources: [[{ title: string; link: string }]];
  videos?: [{ imageUrl: string; link: string }];
  images?: [{ title: string; link: string }];
}
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: "bot",
      content:
        "This is a minimal viable product (MVP) developed in just one day, so it may be a bit slow. More features and improvements are on the way!",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const handleSendMessage = useCallback(async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: "user" as const,
      content: inputValue.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setLoading(true);

    // Simulate a mock API call

    const payload = {
      history: [
        ...messages.map((r) => ({
          role: r.sender === "bot" ? "model" : "user",
          parts: [
            {
              text: r.content,
            },
          ],
        })),
      ],

      message: inputValue.trim(),
    };
    const res = await api.post(`${process.env.BACKEND_URI}/`, payload);
    if (res.success) {
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot" as const,
        content: (res.data as ResponseContent).answer,
        followUpQuestions: (res.data as ResponseContent).followUpQuestions,
        sources: (res.data as ResponseContent).sources,
        videos: (res.data as ResponseContent).videos,
        images: (res.data as ResponseContent).images,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }
    setLoading(false);
  }, [inputValue, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!loading)
      if (e.key === "Enter") {
        handleSendMessage();
      }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const pressEnter = () => {
    if (inputRef.current) {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
      });
      inputRef.current.dispatchEvent(event);
    }
  };
  const stopRecording = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setSpeaking(false);
    setIsRecording(false);
    const t = setTimeout(() => {
      pressEnter()
    }, 400);
    return () => {clearTimeout(t)};
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = async (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setSpeaking(true);

      setInputValue(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        stopRecording();
      }
    };

    recognitionRef.current.start();
  }, [isRecording, stopRecording]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      className="h-[80dvh] font-serif flex justify-center items-center w-screen bg-primary"
    >
      <div className="flex-col h-full w-3/4 relative max-md:w-full max-md:px-4">
        <div
          ref={chatContainerRef}
          className="h-[95%] w-full flex flex-col pb-10 gap-4 overflow-scroll"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex text-base ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[90%] ${
                  msg.sender === "user"
                    ? "bg-secondary text-primary rounded-lg"
                    : "bg-[#e2daabb6] rounded-lg"
                }`}
              >
                <RenderMarkdown markdown={msg.content} />

                {msg.images && (
                  <div className="  w-full mt-4">
                    {/* <p className=" font-semibold ml-0.5 text-secondary">
                      Related Images
                    </p> */}
                    <ul className="list-inside -mt-2 flex gap-1 overflow-x-scroll">
                      {msg.images.map((image, index) => (
                        <Link
                          href={image.link}
                          target="_blank"
                          key={index}
                          className="my-2.5 p-1.5 pl-0.5 pr-2 text-sm rounded-xl"
                        >
                          <img
                            src={image.link}
                            alt={image.title}
                            height={400}
                            width={400}
                            className=" h-28 w-full object-cover min-w-48  rounded-xl"
                          />
                        </Link>
                      ))}
                    </ul>
                  </div>
                )}
                {msg.videos && (
                  <div className="  w-full mt-1">
                    {/* <p className=" font-semibold ml-0.5  text-secondary">
                      Related Videos
                    </p> */}
                    <ul className="list-inside flex -mt-2 gap-1 overflow-x-scroll">
                      {msg.videos.map((video, index) => (
                        <Link
                          href={video.link}
                          target="_blank"
                          key={index}
                          className="my-2.5 p-1.5 pl-0.5 pr-2 text-sm rounded-xl"
                        >
                          <img
                            src={video.imageUrl.replace(
                              "mqdefault.jpg",
                              "maxresdefault.jpg"
                            )}
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg")
                            }
                            alt={video.imageUrl}
                            height={800}
                            width={800}
                            className=" h-32 w-full object-cover min-w-60  rounded-xl"
                          />
                        </Link>
                      ))}
                    </ul>
                  </div>
                )}
                {msg.followUpQuestions && (
                  <div className="  w-full">
                    <ul className="list-inside">
                      {msg.followUpQuestions.map((question, index) => (
                        <li
                          onClick={() => setInputValue(question)}
                          key={index}
                          className=" hover:bg-[#f2e6a5e0] cursor-pointer transition-all duration-500 bg-[#e2daabe0] my-2.5 p-1.5 px-2 text-sm rounded-xl"
                        >
                          <RenderMarkdown markdown={question} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg rounded-bl-none max-w-[90%]  bg-[#e2daabb6] text-base  animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div className="flex mt-2 items-center justify-center gap-2">
          <input
            ref={inputRef}
            disabled={isRecording}
            onChange={handleInputChange}
            className="border-2 border-secondary bg-[transparent] px-6 outline-none w-full py-3 rounded-full"
            type="text"
            value={inputValue}
            onKeyDown={handleKeyPress}
            placeholder="Let's Chat"
          />
          <button
            className={`${speaking ? "opacity-70" : "opacity-100"}`}
            onClick={startRecording}
          >
            <Image src={"/assets/mic.svg"} height={40} width={40} alt="Mic" />
          </button>
        </div>
        <p className="text-sm py-2 pl-6 uppercase">Press enter to send</p>
      </div>
    </motion.div>
  );
}
