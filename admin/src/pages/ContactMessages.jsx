/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare, 
  Eye, 
  EyeOff,
  Loader2,
  X
} from "lucide-react";

const ContactMessages = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "read", "unread"

  const fetchMessages = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        backendUrl + "/api/contact/list",
        { headers: { token } }
      );
      if (response.data.success) {
        setMessages(response.data.contacts || []);
      } else {
        toast.error(response.data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const markAsRead = async (messageId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/contact/mark-read",
        { messageId },
        { headers: { token } }
      );
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        ));
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
        toast.success("Message marked as read");
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      toast.error("Failed to update message status");
    }
  };

  const markAsUnread = async (messageId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/contact/mark-unread",
        { messageId },
        { headers: { token } }
      );
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, read: false } : msg
        ));
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage({ ...selectedMessage, read: false });
        }
        toast.success("Message marked as unread");
      }
    } catch (error) {
      console.error("Mark as unread error:", error);
      toast.error("Failed to update message status");
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.read) {
      markAsRead(message._id);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === "read") return msg.read;
    if (filter === "unread") return !msg.read;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Contact Messages
          </h1>
          <p className="text-gray-600">
            {messages.length} total message{messages.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "read"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filter === "all" 
              ? "No messages yet" 
              : filter === "unread" 
              ? "No unread messages" 
              : "No read messages"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              onClick={() => openMessage(message)}
              className={`
                p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${message.read 
                  ? "bg-gray-50 border-gray-200 hover:border-gray-300" 
                  : "bg-blue-50 border-blue-200 hover:border-blue-300 shadow-sm"}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${message.read ? "bg-gray-200" : "bg-blue-500"}
                    `}>
                      <User className={`w-5 h-5 ${message.read ? "text-gray-600" : "text-white"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-lg ${message.read ? "text-gray-700" : "text-gray-900"}`}>
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{message.subject}</p>
                      <p className="text-gray-600 line-clamp-2">{message.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(message.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {message.read ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsUnread(message._id);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as unread"
                    >
                      <EyeOff className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(message._id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedMessage.name}</h3>
                    <p className="text-gray-600">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{formatDate(selectedMessage.date)}</span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 font-medium">{selectedMessage.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[200px]">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedMessage.read ? (
                  <button
                    onClick={() => {
                      markAsUnread(selectedMessage._id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                    Mark as Unread
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      markAsRead(selectedMessage._id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;

