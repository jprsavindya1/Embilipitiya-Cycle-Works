"use client";

import React, { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button";

type Message = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "PATCH" });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchDate) return true;
    const msgDate = new Date(msg.createdAt).toISOString().split('T')[0];
    return msgDate === searchDate;
  });

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading messages...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Customer Messages</h1>
        <p className="text-zinc-500">View and manage messages sent from the Contact Us page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm h-[70vh] flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="font-bold mb-3">
              Inbox ({filteredMessages.filter(m => m.status === 'unread').length} Unread)
            </div>
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full p-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-zinc-700 dark:text-zinc-300"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No messages found for this date.</div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') markAsRead(msg.id);
                  }}
                  className={`p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedMessage?.id === msg.id ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {msg.status === 'unread' ? (
                        <Mail className="h-5 w-5 text-blue-500" />
                      ) : (
                        <MailOpen className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${msg.status === 'unread' ? 'font-bold' : 'font-medium'}`}>
                        {msg.first_name} {msg.last_name}
                      </p>
                      <p className={`text-xs truncate ${msg.status === 'unread' ? 'text-zinc-700 dark:text-zinc-300 font-semibold' : 'text-zinc-500'}`}>
                        {msg.message}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm h-[70vh] flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedMessage.first_name} {selectedMessage.last_name}</h2>
                  <p className="text-sm text-zinc-500 mb-2">{selectedMessage.email}</p>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-500">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedMessage.status === 'unread' && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(selectedMessage.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark Read
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteMessage(selectedMessage.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {selectedMessage.message}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
              <Mail className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
