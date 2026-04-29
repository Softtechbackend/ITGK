export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE' | 'PARTNER';

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';

export type DocumentStatus = 'DRAFT' | 'APPROVED' | 'SIGNED' | 'FINAL';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  user_id: string;
  company_name?: string;
  gst_number?: string;
  business_type?: string;
  referred_by?: string;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  service_type: string;
  status: ApplicationStatus;
  personal_info: PersonalInfo;
  property_details: PropertyDetails;
  business_info?: BusinessInfo;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PropertyDetails {
  roof_type: string;
  roof_area: number;
  property_type: string;
  existing_electricity_connection: boolean;
  monthly_electricity_bill?: number;
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessInfo {
  company_name: string;
  gst_number: string;
  business_type: string;
  experience_years: number;
  employees_count: number;
}

export interface Quotation {
  id: string;
  application_id: string;
  system_capacity: number;
  estimated_cost: number;
  installation_timeline: string;
  warranty_period: number;
  maintenance_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface VendorAgreement {
  id: string;
  application_id: string;
  partner_id: string;
  status: DocumentStatus;
  signed_date?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface WorkCompletionCertificate {
  id: string;
  application_id: string;
  completion_date: string;
  inspector_name: string;
  notes?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  application_id: string;
  invoice_number: string;
  amount: number;
  tax: number;
  total: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  file_url: string;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referral_type: 'PARTNER' | 'CUSTOMER';
  referred_user_id?: string;
  referred_email?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  commission?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  total_applications: number;
  pending_applications: number;
  completed_applications: number;
  total_partners: number;
  total_revenue: number;
  average_project_value: number;
  completion_rate: number;
}
