export interface User {
  user_id: string;
  profile_id: string;
  auth_token: string;
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  date_of_birth: string;
  type: string;
  matric_number?: string;
  gender: string;
  marital_status: string;
  othername?: string;
  country?: string;
  residence_address?: string;
  employment_status?: string;
  company_name?: string;
  position_in_company?: string;
  company_address?: string;
  company_phone_number?: string;
  company_email?: string;
  religion?: string;
  name_of_ministry?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}
