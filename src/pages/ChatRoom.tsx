
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send, Info, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';

// Mock interfaces - would be replaced with proper types from Supabase
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  avatarUrl?: string;
  apartmentId: string;
  apartmentName: string;
}

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data loading - would be replaced with Supabase query
  useEffect(() => {
    // Simulate API call to get chat data
    setTimeout(() => {
      setPartner({
        id: '123',
        name: 'Jessica Thompson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        apartmentId: 'apt1',
        apartmentName: 'Modern Downtown Loft'
      });
      
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi there! I saw that we both matched with the Downtown Loft apartment.',
          senderId: '123', // partner's ID
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: true
        },
        {
          id: '2',
          content: 'Hey Jessica! Yes, I really liked the location and amenities. Are you still interested in it?',
          senderId: user?.id || '', // current user's ID
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '3',
          content: 'Definitely! I\'m looking for a roommate to split the rent. Would you be interested in seeing it together?',
          senderId: '123',
          timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '4',
          content: 'That sounds great! When are you free?',
          senderId: user?.id || '',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '5',
          content: 'What time would you be free to see the apartment?',
          senderId: '123',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false
        }
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    }, 1500);
  }, [id, user?.id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to Supabase
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user?.id || '',
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  // Format the date for message timestamps
  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return format(date, 'h:mm a');
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/messages')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {loading ? (
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage src={partner?.avatarUrl} />
                  <AvatarFallback>{partner?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{partner?.name}</h2>
                  <p className="text-xs text-muted-foreground">Re: {partner?.apartmentName}</p>
                </div>
              </div>
            )}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About this Match</DialogTitle>
              </DialogHeader>
              {partner && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={partner.avatarUrl} />
                      <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">Matched 3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Matching Apartment</h4>
                    <p className="text-primary">{partner.apartmentName}</p>
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate(`/feed/${partner.apartmentId}`)}>
                      View Apartment Details
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                <Skeleton className={`h-16 w-3/4 rounded-lg ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id;
              const showDateSeparator = index === 0 || 
                new Date(messages[index-1].timestamp).getDate() !== new Date(message.timestamp).getDate();
              
              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs bg-accent/50 text-muted-foreground px-2 py-1 rounded-full">
                        {format(new Date(message.timestamp), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex flex-col max-w-[75%]">
                      <div className={`inline-block px-4 py-2 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-accent dark:bg-accent/50 rounded-tl-none'
                      }`}>
                        {message.content}
                      </div>
                      <span className={`text-xs mt-1 text-muted-foreground ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                        {formatMessageDate(new Date(message.timestamp))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>
      
      <footer className="bg-card p-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Image className="h-5 w-5" />
          </Button>
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className={`${!newMessage.trim() ? 'text-muted-foreground' : 'text-primary'}`}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;
