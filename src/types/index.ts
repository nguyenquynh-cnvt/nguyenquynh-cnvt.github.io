export type Role = 'admin_tinh' | 'cong_an_xa' | 'co_so_cai_nghien';

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: Role;
  unit: string;
}

export type SubjectType =
  | 'nguoi_nghien'
  | 'su_dung_trai_phep'
  | 'sau_cai'
  | 'methadone';

export interface Subject {
  id: string;
  fullName: string;
  cccd: string;
  dob: string;
  address: string;
  unit: string;
  type: SubjectType;
  createdAt: string;
  notes?: string;
}

export type IncidentStatus = 'cho_xu_ly' | 'dang_xu_ly' | 'da_xu_ly';

export interface Incident {
  id: string;
  date: string;
  location: string;
  description: string;
  subjectCount: number;
  status: IncidentStatus;
  unit: string;
  createdAt: string;
}

export type TreatmentStatus = 'dang_cai' | 'hoan_thanh';

export interface Treatment {
  id: string;
  subjectId: string;
  subjectName: string;
  admissionDate: string;
  facility: string;
  duration: number;
  status: TreatmentStatus;
  completionDate?: string;
  notes?: string;
}

export interface PostTreatment {
  id: string;
  subjectId: string;
  subjectName: string;
  handoverDate: string;
  receivingUnit: string;
  officerInCharge: string;
  managementStatus: 'dang_quan_ly' | 'mat_lien_lac' | 'tai_pham';
  notes?: string;
}

export type AlertLevel = 'red' | 'yellow' | 'green';

export interface DataAlert {
  id: string;
  subjectId?: string;
  subjectName: string;
  unit: string;
  level: AlertLevel;
  message: string;
  type: 'missing_post_treatment' | 'missing_data' | 'synced' | 'late_report' | 'unmanaged';
  createdAt: string;
  resolved: boolean;
}
