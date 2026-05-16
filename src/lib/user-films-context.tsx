import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MovieRecord } from "@/lib/green";
import { adaptUserMovie, setRuntimeUserFilms, type Artifact } from "@/data/artifacts";

const STORAGE_KEY = "cc:user-films";

type UserFilmsContextValue = {
  userFilms: Artifact[];
  addUserFilm: (record: MovieRecord) => void;
  getUserFilm: (slug: string) => MovieRecord | undefined;
};

const UserFilmsContext = createContext<UserFilmsContextValue>({
  userFilms: [],
  addUserFilm: () => {},
  getUserFilm: () => undefined,
});

export function UserFilmsProvider({ children }: { children: React.ReactNode }) {
  const [userFilms, setUserFilms] = useState<Artifact[]>([]);
  const [rawFilms, setRawFilms] = useState<MovieRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const records = JSON.parse(raw) as MovieRecord[];
        const adapted = records.map((r) => adaptUserMovie(r as never));
        setRawFilms(records);
        setUserFilms(adapted);
        setRuntimeUserFilms(adapted);
      }
    } catch {}
  }, []);

  const addUserFilm = useCallback((record: MovieRecord) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const records: MovieRecord[] = raw ? JSON.parse(raw) : [];
      const idx = records.findIndex((r) => r.slug === record.slug);
      if (idx >= 0) {
        records[idx] = record;
      } else {
        records.push(record);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      const adapted = records.map((r) => adaptUserMovie(r as never));
      setRawFilms(records);
      setUserFilms(adapted);
      setRuntimeUserFilms(adapted);
    } catch {}
  }, []);

  const getUserFilm = useCallback(
    (slug: string) => rawFilms.find((r) => r.slug === slug),
    [rawFilms],
  );

  return (
    <UserFilmsContext.Provider value={{ userFilms, addUserFilm, getUserFilm }}>
      {children}
    </UserFilmsContext.Provider>
  );
}

export function useUserFilms() {
  return useContext(UserFilmsContext);
}
