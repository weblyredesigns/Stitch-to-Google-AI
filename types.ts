export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type UserRole = 'donor' | 'bank';
export type StockLevel = 'HIGH' | 'MED' | 'LOW';

export interface Donor {
  id: string;
  role: 'donor';
  name: string;
  bloodGroup: BloodGroup;
  location: string;
  state: string;
  district: string;
  city: string;
  mobile: string;
  verified: boolean;
  elite?: boolean;
  lastDonated?: string;
  imageUrl: string;
  distance?: string;
  gender?: string;
  weight?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  state: string;
  district: string;
  city: string;
  location: string;
  timestamp: string;
  contactName: string;
  contactMobile: string;
  notes?: string;
}

export interface BloodBank {
  id: string;
  role: 'bank';
  name: string;
  address: string;
  phone: string;
  mobile: string; 
  hours: string;
  verified: boolean;
  state: string;
  district: string;
  city: string;
  stock: Record<BloodGroup, StockLevel>;
  licenseNumber?: string;
  category?: string; // Govt, Private, NGO
}

export interface DonationCamp {
  id: string;
  organizerId?: string; // ID of the bank/hospital that created it
  name: string;
  date: string;
  time: string;
  location: string;
  state: string;
  district: string;
  city: string;
  tag: 'NEXT WEEK' | 'HAPPENING TOMORROW' | 'REGISTRATION OPEN';
  registeredCount: number;
  imageUrl: string;
}