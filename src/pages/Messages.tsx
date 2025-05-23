
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MessageSquare } from 'lucide-react';
import NavBar from '@/components/NavBar';

// Mock data - would come from Supabase in a real implementation
interface ChatPreview {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  apartmentName: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data loading - would be replaced with Supabase query
  useEffect(() => {
    const fetchChats = () => {
      setTimeout(() => {
        setChats([
          {
            id: '1',
            name: 'Jessica Thompson',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            lastMessage: 'What time would you be free to see the apartment?',
            timestamp: '10:30 AM',
            unread: true,
            apartmentName: 'Modern Downtown Loft'
          },
          {
            id: '2',
            name: 'Michael Chen',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            lastMessage: 'I think we would be great roommates!',
            timestamp: 'Yesterday',
            unread: false,
            apartmentName: 'Cozy Studio Near Campus'
          },
          {
            id: '3',
            name: 'Sarah Wilson',
            avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
            lastMessage: 'Are you still interested in the apartment?',
            timestamp: '2 days ago',
            unread: false,
            apartmentName: 'Luxury 2BR with Balcony'
          }
        ]);
        setLoading(false);
      }, 1500);
    };
    
    fetchChats();
  }, []);
  
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.apartmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-10 bg-white border-b dark:bg-gray-900 dark:border-gray-800">
        <div className="p-4 max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      <main className="p-4 max-w-screen-lg mx-auto">
        {loading ? (
          // Loading skeletons
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length > 0 ? (
          <div className="space-y-3">
            {filteredChats.map((chat) => (
              <Link key={chat.id} to={`/messages/${chat.id}`}>
                <Card className={`hover:bg-accent/50 transition-colors ${chat.unread ? 'border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={chat.avatarUrl} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium truncate">{chat.name}</p>
                            <p className="text-xs text-muted-foreground">Re: {chat.apartmentName}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.timestamp}</span>
                        </div>
                        <p className={`text-sm truncate mt-1 ${chat.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                      {chat.unread && (
                        <div className="h-2.5 w-2.5 bg-primary rounded-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            {searchQuery ? (
              <p className="text-muted-foreground">No conversations match your search query.</p>
            ) : (
              <p className="text-muted-foreground">Start matching with roommates to begin chatting!</p>
            )}
          </div>
        )}
      </main>
      
      <NavBar />
    </div>
  );
};

export default Messages;
