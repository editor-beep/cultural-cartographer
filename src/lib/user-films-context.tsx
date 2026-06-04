import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MovieRecord } from "@/lib/green";
import { adaptUserMovie, setRuntimeUserFilms, type Artifact } from "@/data/artifacts";
import { findDuplicateIndex } from "@/lib/media-identity";

const STORAGE_KEY = "cc:user-films";

type UserFilmsContextValue = {
  userFilms: Artifact[];
  addUserFilm: (record: MovieRecord) => void;
};

const UserFilmsContext = createContext<UserFilmsContextValue>({
  userFilms: [],
  addUserFilm: () => {},
});

export function UserFilmsProvider({ children }: { children: React.ReactNode }) {
  const [userFilms, setUserFilms] = useState<Artifact[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const records = JSON.parse(raw) as MovieRecord[];
        const adapted = records.map((r) => adaptUserMovie(r as never));
        setUserFilms(adapted);
        setRuntimeUserFilms(adapted);
      }
    } catch {}
  }, []);

  const addUserFilm = useCallback((record: MovieRecord) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const records: MovieRecord[] = raw ? JSON.parse(raw) : [];
      // Replace any existing reading of the same media object (matched on slug
      // or canonical identity) rather than storing a second copy.
      const idx = findDuplicateIndex(records, record);
      if (idx >= 0) {
        records[idx] = { ...record, slug: records[idx].slug };
      } else {
        records.push(record);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      const adapted = records.map((r) => adaptUserMovie(r as never));
      setUserFilms(adapted);
      setRuntimeUserFilms(adapted);
    } catch {}
  }, []);

  return (
    <UserFilmsContext.Provider value={{ userFilms, addUserFilm }}>
      {children}
    </UserFilmsContext.Provider>
  );
}

export function useUserFilms() {
  return useContext(UserFilmsContext);
}
