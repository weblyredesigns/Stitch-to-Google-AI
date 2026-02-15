import { Donor, BloodBank, DonationCamp } from './types';

export const MOCK_DONORS: Donor[] = [
  {
    id: '1',
    role: 'donor',
    name: 'Rahul Sharma',
    bloodGroup: 'A+',
    location: 'Andheri West, Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Andheri',
    mobile: '9876543210',
    verified: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jg1EGOn1zfxu_PRxBwrCoMf6GAWDh2ybxnQvnCJ_c3DkUVtJqWJLjNViyGODKmSxzpT6IYPhDEnxQQx0SwDfVDjuFl4fiElKqWiKdS_3ueeH9ElV-HVWjfFGzoepur0vZiT9QKc9xKK8GBn8KhntdhlhUh22LvAcFnuWlga8OUJ5wQl9c6AaP3X4yc4eY3wLy6g4cd9n9q9NZDr6K6jn9xl8uG8bHyY4IQ5Z1L9bo9z03wPt_b3i2mBWJJOXdI6mg_FsnF8vboei',
    distance: '1.2 km'
  },
  {
    id: '2',
    role: 'donor',
    name: 'Priya Patel',
    bloodGroup: 'O-',
    location: 'Seven Bungalows, Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Versova',
    mobile: '9876543211',
    verified: true,
    lastDonated: '5 Months ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBrrLDamKEalTxx-0hiTwqayw7EstMMUjOkYWuI54_oTepQuD8VnGUO6w0ZNVvtVMyjXHekU8gjYwRGpSwBSb3920XpFfRo_hxf29420q6hWms-F2MmXypLhQlHoEgF0p4T7kaMCO-4TyvRy0ciGTGEEC4WGFRr48JvNo2MoOLs9eenOU9c96a7FWQI_0W8-aan_JZRRponqxniJ-Clk0FXEwvNgaB4rJymWG2yo3XQa3FivcONB4ZxtboDx1KBtmTVus-vHVXQ8UT',
    distance: '2.8 km'
  },
  {
    id: '3',
    role: 'donor',
    name: 'Amit Desai',
    bloodGroup: 'B+',
    location: 'Versova, Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Versova',
    mobile: '9876543212',
    verified: true,
    elite: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8aBwT0ZtTwiNp1jGBlYDcm0BuwIj8BhCR5plbK-vqs9pJD7Azq46TXSCJhBnsLNfRF5T0t_8Ztm040cO4dmEOxobav-Tb2jIAvhbGy2mtuDcbQS1JHgJWavLt9_lNwVsLTZy4b2V0bv-8MyG-GD1Puz73C-IX3jksnuwZJQQdHmUZRJKYR9Z24WRc32tG6y6zq8V5EEdVgsrWn4Nt3SdxsHQlZBjO2kuiKLm-XMMyPMz_AFdWpye-Vk_Ii_M_ntV613wR3-IMBFe0',
    distance: '3.5 km'
  },
  {
    id: '4',
    role: 'donor',
    name: 'Suresh Kumar',
    bloodGroup: 'A+',
    location: 'Siddipet, Telangana',
    state: 'Telangana',
    district: 'Siddipet',
    city: 'Siddipet',
    mobile: '9876543213',
    verified: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jg1EGOn1zfxu_PRxBwrCoMf6GAWDh2ybxnQvnCJ_c3DkUVtJqWJLjNViyGODKmSxzpT6IYPhDEnxQQx0SwDfVDjuFl4fiElKqWiKdS_3ueeH9ElV-HVWjfFGzoepur0vZiT9QKc9xKK8GBn8KhntdhlhUh22LvAcFnuWlga8OUJ5wQl9c6AaP3X4yc4eY3wLy6g4cd9n9q9NZDr6K6jn9xl8uG8bHyY4IQ5Z1L9bo9z03wPt_b3i2mBWJJOXdI6mg_FsnF8vboei',
    distance: '0.5 km'
  },
  {
    id: '5',
    role: 'donor',
    name: 'Anjali Reddy',
    bloodGroup: 'A+',
    location: 'Gajwel, Siddipet',
    state: 'Telangana',
    district: 'Siddipet',
    city: 'Gajwel',
    mobile: '9876543214',
    verified: true,
    elite: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBrrLDamKEalTxx-0hiTwqayw7EstMMUjOkYWuI54_oTepQuD8VnGUO6w0ZNVvtVMyjXHekU8gjYwRGpSwBSb3920XpFfRo_hxf29420q6hWms-F2MmXypLhQlHoEgF0p4T7kaMCO-4TyvRy0ciGTGEEC4WGFRr48JvNo2MoOLs9eenOU9c96a7FWQI_0W8-aan_JZRRponqxniJ-Clk0FXEwvNgaB4rJymWG2yo3XQa3FivcONB4ZxtboDx1KBtmTVus-vHVXQ8UT',
    distance: '15 km'
  }
];

export const MOCK_BANKS: BloodBank[] = [
  {
    id: 'b1',
    role: 'bank',
    name: 'City Civil Hospital Blood Bank',
    address: 'MG Road, Near Central Park, Mumbai, Maharashtra - 400001',
    phone: '+91 22 2345 6789',
    mobile: '2223456789',
    hours: '24/7 Available',
    verified: true,
    state: 'Maharashtra',
    district: 'Mumbai City',
    city: 'Mumbai',
    stock: {
      'A+': 'HIGH', 'A-': 'MED', 'B+': 'HIGH', 'B-': 'LOW',
      'O+': 'HIGH', 'O-': 'MED', 'AB+': 'LOW', 'AB-': 'MED'
    }
  },
  {
    id: 'b2',
    role: 'bank',
    name: 'Red Cross Society Center',
    address: 'Indiranagar 80 Feet Road, Bangalore, Karnataka - 560038',
    phone: '+91 80 4567 1234',
    mobile: '8045671234',
    hours: '09:00 AM - 08:00 PM',
    verified: true,
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    stock: {
      'A+': 'LOW', 'A-': 'LOW', 'B+': 'MED', 'B-': 'MED',
      'O+': 'HIGH', 'O-': 'HIGH', 'AB+': 'MED', 'AB-': 'LOW'
    }
  }
];

export const MOCK_CAMPS: DonationCamp[] = [
  {
    id: 'c1',
    name: 'Mega Blood Donation Drive - City General Hospital',
    date: 'Oct 24, 2024',
    time: '09:00 AM - 04:00 PM',
    location: 'Main Atrium, Floor 1, City General Hospital, Central Avenue, Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai City',
    city: 'Mumbai',
    tag: 'NEXT WEEK',
    registeredCount: 42,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1jcFp9tEyJOppP_a6uTj-nJDXhkf2WSKVnnVhCl9_h2yICYdjAhv0Fbbg9juQq3dOdhQlY290trHaTV2xnX1Er89N5X0kf_k_0zMjTPnqGJ7ZrhJlKTGgUkGd0a1GNw4QMpOVbXpWzV7SE2V-UzJnH3Yz-mbtkjyRu82mjhFuLLToP6PpfYKiu0A1s8mkmgVbyUZJPyVdjphxnEoWM7zOldYTR_527jqDQ5Tj0s2LRdimPF4LoSl0WyQzC62i6CyP3ewIRZX1rDFB'
  },
  {
    id: 'c2',
    name: 'Corporate Giving Day: Tech Park Alpha',
    date: 'Oct 19, 2024',
    time: '10:00 AM - 06:00 PM',
    location: 'Building B Lobby, IT Corridor, Whitefield, Bangalore',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    tag: 'HAPPENING TOMORROW',
    registeredCount: 120,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1jcFp9tEyJOppP_a6uTj-nJDXhkf2WSKVnnVhCl9_h2yICYdjAhv0Fbbg9juQq3dOdhQlY290trHaTV2xnX1Er89N5X0kf_k_0zMjTPnqGJ7ZrhJlKTGgUkGd0a1GNw4QMpOVbXpWzV7SE2V-UzJnH3Yz-mbtkjyRu82mjhFuLLToP6PpfYKiu0A1s8mkmgVbyUZJPyVdjphxnEoWM7zOldYTR_527jqDQ5Tj0s2LRdimPF4LoSl0WyQzC62i6CyP3ewIRZX1rDFB'
  }
];