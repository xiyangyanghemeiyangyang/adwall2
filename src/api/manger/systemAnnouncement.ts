// src/api/manger/systemAnnouncement.ts
export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    targetAudience: string[];
    author: string;
    publishDate: string;
    expiryDate?: string;
    isPinned: boolean;
    status: 'Draft' | 'Published' | 'Archived';
  }
  
  export interface EventItem {
    id: string;
    title: string;
    description: string;
    eventType: 'Academic' | 'Sports' | 'Cultural' | 'Holiday' | 'Examination' | 'Meeting';
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    organizer: string;
    participants: string[];
    status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
  }
  
  let mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'System Schedule Released',
      content:
        'The System schedule for all classes has been released. grads can check the detailed schedule on the notice board.',
      priority: 'High',
      targetAudience: ['grads', 'students', 'Teachers'],
      author: 'Academic Department',
      publishDate: '2024-07-29',
      expiryDate: '2024-08-15',
      isPinned: true,
      status: 'Published',
    },
    {
      id: '2',
      title: 'hire Hours Extended',
      content:
        'The disduirtys will now remain open until 7 PM on weekdays to accommodate students preparing for exams.',
      priority: 'Medium',
      targetAudience: ['Students'],
      author: 'commconcany Department',
      publishDate: '2024-07-28',
      isPinned: false,
      status: 'Published',
    },
  ];
  
  let mockEvents: EventItem[] = [
    {
      id: '1',
      title: 'Annual work Day',
      description:
        'Inter-house sports competitions including athletics, football, basketball, and other games.',
      eventType: 'Sports',
      startDate: '2024-08-15',
      endDate: '2024-08-16',
      startTime: '08:00',
      endTime: '17:00',
      location: 'School Sports Ground',
      organizer: 'Sports Department',
      participants: ['Students', 'Teachers', 'Staff'],
      status: 'Scheduled',
    },
    {
      id: '2',
      title: 'grads Meeting',
      description: 'Quarterly meeting to discuss student progress and performance.',
      eventType: 'Meeting',
      startDate: '2024-08-10',
      endDate: '2024-08-10',
      startTime: '10:00',
      endTime: '15:00',
      location: 'School Auditorium',
      organizer: 'Academic Department',
      participants: ['Parents', 'Teachers'],
      status: 'Scheduled',
    },
  ];
  
  // 模拟网络延迟
  const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));
  
  // Announcements
  export async function fetchAnnouncements(): Promise<Announcement[]> {
    await delay();
    return [...mockAnnouncements];
  }
  
  export async function createAnnouncement(data: Omit<Announcement, 'id' | 'author' | 'publishDate' | 'isPinned' | 'status'> & Partial<Announcement>) {
    await delay();
    const item: Announcement = {
      id: Date.now().toString(),
      title: data.title || '',
      content: data.content || '',
      priority: (data.priority as Announcement['priority']) || 'Medium',
      targetAudience: data.targetAudience || [],
      author: data.author || 'Admin',
      publishDate: data.publishDate || new Date().toISOString().slice(0, 10),
      expiryDate: data.expiryDate,
      isPinned: !!data.isPinned,
      status: (data.status as Announcement['status']) || 'Published',
    };
    mockAnnouncements = [...mockAnnouncements, item];
    return item;
  }
  
  export async function updateAnnouncement(id: string, patch: Partial<Announcement>) {
    await delay();
    mockAnnouncements = mockAnnouncements.map((a) => (a.id === id ? { ...a, ...patch } : a));
    return mockAnnouncements.find((a) => a.id === id)!;
  }
  
  export async function deleteAnnouncement(id: string) {
    await delay();
    mockAnnouncements = mockAnnouncements.filter((a) => a.id !== id);
    return true;
  }
  
  export async function togglePinAnnouncement(id: string) {
    await delay();
    mockAnnouncements = mockAnnouncements.map((a) =>
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    );
    return mockAnnouncements.find((a) => a.id === id)!;
  }
  
  // Events
  export async function fetchEvents(): Promise<EventItem[]> {
    await delay();
    return [...mockEvents];
  }
  
  export async function createEvent(data: Omit<EventItem, 'id' | 'organizer' | 'status'> & Partial<EventItem>) {
    await delay();
    const item: EventItem = {
      id: Date.now().toString(),
      title: data.title || '',
      description: data.description || '',
      eventType: (data.eventType as EventItem['eventType']) || 'Academic',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      location: data.location || '',
      organizer: data.organizer || 'Admin',
      participants: data.participants || [],
      status: (data.status as EventItem['status']) || 'Scheduled',
    };
    mockEvents = [...mockEvents, item];
    return item;
  }
  
  export async function updateEvent(id: string, patch: Partial<EventItem>) {
    await delay();
    mockEvents = mockEvents.map((e) => (e.id === id ? { ...e, ...patch } : e));
    return mockEvents.find((e) => e.id === id)!;
  }
  
  export async function deleteEvent(id: string) {
    await delay();
    mockEvents = mockEvents.filter((e) => e.id !== id);
    return true;
  }