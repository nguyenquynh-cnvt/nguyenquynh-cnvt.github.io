import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  User,
  Subject,
  Incident,
  Treatment,
  PostTreatment,
  DataAlert,
} from '../types';
import {
  MOCK_USERS,
  MOCK_SUBJECTS,
  MOCK_INCIDENTS,
  MOCK_TREATMENTS,
  MOCK_POST_TREATMENTS,
  MOCK_ALERTS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, s: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  incidents: Incident[];
  addIncident: (inc: Omit<Incident, 'id' | 'createdAt'>) => void;
  updateIncident: (id: string, inc: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  treatments: Treatment[];
  addTreatment: (t: Omit<Treatment, 'id'>) => void;
  updateTreatment: (id: string, t: Partial<Treatment>) => void;
  deleteTreatment: (id: string) => void;

  postTreatments: PostTreatment[];
  addPostTreatment: (pt: Omit<PostTreatment, 'id'>) => void;
  updatePostTreatment: (id: string, pt: Partial<PostTreatment>) => void;
  deletePostTreatment: (id: string) => void;

  alerts: DataAlert[];
  resolveAlert: (id: string) => void;
  regenerateAlerts: () => void;

  activePage: string;
  setActivePage: (page: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function buildAlertsFromData(
  subjects: Subject[],
  treatments: Treatment[],
  postTreatments: PostTreatment[],
  existingAlerts: DataAlert[]
): DataAlert[] {
  const autoAlerts: DataAlert[] = [];
  const now = new Date().toISOString().split('T')[0];

  const postTreatmentSubjectIds = new Set(postTreatments.map((pt) => pt.subjectId));

  treatments
    .filter((t) => t.status === 'hoan_thanh')
    .forEach((t) => {
      if (!postTreatmentSubjectIds.has(t.subjectId)) {
        if (!existingAlerts.find((a) => a.subjectId === t.subjectId && a.type === 'missing_post_treatment' && !a.resolved)) {
          autoAlerts.push({
            id: generateId(),
            subjectId: t.subjectId,
            subjectName: t.subjectName,
            unit: subjects.find((s) => s.id === t.subjectId)?.unit ?? '',
            level: 'red',
            message: 'Đã hoàn thành cai nghiện nhưng chưa có hồ sơ quản lý sau cai',
            type: 'missing_post_treatment',
            createdAt: now,
            resolved: false,
          });
        }
      }
    });

  subjects.forEach((s) => {
    if (!s.cccd || !s.address) {
      if (!existingAlerts.find((a) => a.subjectId === s.id && a.type === 'missing_data' && !a.resolved)) {
        autoAlerts.push({
          id: generateId(),
          subjectId: s.id,
          subjectName: s.fullName,
          unit: s.unit,
          level: 'yellow',
          message: 'Thiếu thông tin bắt buộc trong hồ sơ',
          type: 'missing_data',
          createdAt: now,
          resolved: false,
        });
      }
    }
  });

  return autoAlerts;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [treatments, setTreatments] = useState<Treatment[]>(MOCK_TREATMENTS);
  const [postTreatments, setPostTreatments] = useState<PostTreatment[]>(MOCK_POST_TREATMENTS);
  const [alerts, setAlerts] = useState<DataAlert[]>(MOCK_ALERTS);
  const [activePage, setActivePage] = useState('dashboard');

  const login = useCallback((username: string, password: string): boolean => {
    const user = MOCK_USERS.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setActivePage('dashboard');
  }, []);

  const addSubject = useCallback((s: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = { ...s, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
    setSubjects((prev) => [newSubject, ...prev]);
  }, []);

  const updateSubject = useCallback((id: string, s: Partial<Subject>) => {
    setSubjects((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addIncident = useCallback((inc: Omit<Incident, 'id' | 'createdAt'>) => {
    const newInc: Incident = { ...inc, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
    setIncidents((prev) => [newInc, ...prev]);
  }, []);

  const updateIncident = useCallback((id: string, inc: Partial<Incident>) => {
    setIncidents((prev) => prev.map((item) => (item.id === id ? { ...item, ...inc } : item)));
  }, []);

  const deleteIncident = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addTreatment = useCallback((t: Omit<Treatment, 'id'>) => {
    const newT: Treatment = { ...t, id: generateId() };
    setTreatments((prev) => [newT, ...prev]);
  }, []);

  const updateTreatment = useCallback((id: string, t: Partial<Treatment>) => {
    setTreatments((prev) => prev.map((item) => (item.id === id ? { ...item, ...t } : item)));
  }, []);

  const deleteTreatment = useCallback((id: string) => {
    setTreatments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addPostTreatment = useCallback((pt: Omit<PostTreatment, 'id'>) => {
    const newPt: PostTreatment = { ...pt, id: generateId() };
    setPostTreatments((prev) => [newPt, ...prev]);
  }, []);

  const updatePostTreatment = useCallback((id: string, pt: Partial<PostTreatment>) => {
    setPostTreatments((prev) => prev.map((item) => (item.id === id ? { ...item, ...pt } : item)));
  }, []);

  const deletePostTreatment = useCallback((id: string) => {
    setPostTreatments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  }, []);

  const regenerateAlerts = useCallback(() => {
    setAlerts((prev) => {
      const auto = buildAlertsFromData(subjects, treatments, postTreatments, prev);
      return [...prev, ...auto];
    });
  }, [subjects, treatments, postTreatments]);

  return (
    <AppContext.Provider
      value={{
        currentUser, login, logout,
        subjects, addSubject, updateSubject, deleteSubject,
        incidents, addIncident, updateIncident, deleteIncident,
        treatments, addTreatment, updateTreatment, deleteTreatment,
        postTreatments, addPostTreatment, updatePostTreatment, deletePostTreatment,
        alerts, resolveAlert, regenerateAlerts,
        activePage, setActivePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
