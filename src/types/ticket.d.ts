interface ITicketData {
  id: string;
  token: string;
  status: TicketStatus;
  clientId: string;
  workerId: string;
  serviceId: string;
  rating: number;
  address: string;
  latitude: number;
  longitude: number;
  hour: string;
  date: string;
  notes: string;
}

type TicketStatus = 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'FINISHED';
