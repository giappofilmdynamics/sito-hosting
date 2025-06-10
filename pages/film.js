import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import styles from '../styles/Film.module.css';

const films = [
  {
    id: 1,
    name: "Film che non finiremo mai",
    year: 2026,
    duration: "1h 45m",
    poster: "/films/poster-nuovo.png",
    link: "https://www.youtube.com/embed/xxxx",
    highlightColor: "#699ebf",
    cast: "Mario Rossi, Lucia Bianchi",
    description: "Un viaggio surreale tra sogni e realtà.",
    isProtected: false
  },
  {
    id: 2,
    name: "Dami nel mondo delle idee",
    year: 2025,
    duration: "1h 12m",
    poster: "/films/poster-dami.png",
    link: "https://www.youtube.com/embed/ZVJ4K9xGTM8",
    highlightColor: "#9fd984",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: false
  },
  {
    id: 3,
    name: "Pelosacco",
    year: 2023,
    duration: "28m",
    poster: "/films/poster-trama.png",
    link: "https://www.youtube.com/embed/EusmBAPBFlE",
    highlightColor: "#f2a500",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: false
  },
  {
    id: 4,
    name: "Gianlu",
    year: 2021,
    duration: "38m",
    poster: "/films/poster-gianlu.png",
    link: "https://www.youtube.com/embed/yHx8Bzs1EJs",
    highlightColor: "#e8c1b3",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: true,
    password: "dami123"
  },
  {
    id: 5,
    name: "I Misteri di Mithra",
    year: 2021,
    duration: "1h 12m",
    poster: "/films/poster-masa.png",
    link: "https://www.youtube.com/embed/OpJPDQEQYEg",
    highlightColor: "#e90f1e",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: true,
    password: "dami123"
  },
  {
    id: 6,
    name: "Niko",
    year: 2021,
    duration: "39m",
    poster: "/films/poster-niko.png",
    link: "https://www.youtube.com/embed/5VoteYKPzJc",
    highlightColor: "#3f5573",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: true,
    password: "dami123"
  },
  {
    id: 7,
    name: "Supergiova",
    year: 2021,
    duration: "18m",
    poster: "/films/poster-giova.png",
    link: "https://www.youtube.com/embed/KrBUUkrWLuk",
    highlightColor: "#fff",
    cast: "Dami, Platone",
    description: "Un documentario concettuale sull’immaginazione.",
    isProtected: true,
    password: "dami123"
  },
];

export default function Catalogo() {
  const router = useRouter();

  const [selectedFilm, setSelectedFilm] = useState(null);
  const [pendingFilm, setPendingFilm] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordInputRef = useRef(null);

  // Aggiorna selectedFilm in base alla query ?video=id
  useEffect(() => {
    const { video } = router.query;
    if (video) {
      const film = films.find(f => String(f.id) === video);
      if (film) {
        if (film.isProtected) {
          setPendingFilm(film);
          setSelectedFilm(null);
        } else {
          setSelectedFilm(film);
          setPendingFilm(null);
        }
      } else {
        // Se id non valido, chiudi player
        setSelectedFilm(null);
        setPendingFilm(null);
      }
    } else {
      // Nessun video in query, chiudi player e modale password
      setSelectedFilm(null);
      setPendingFilm(null);
    }
  }, [router.query]);

  // Fai focus input password quando serve
  useEffect(() => {
    if (pendingFilm && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [pendingFilm]);

  const handleCardClick = (film) => {
    if (film.isProtected) {
      setPendingFilm(film);
      setPasswordInput('');
      setError('');
      // Aggiungi il parametro video all'URL anche per film protetti
      router.push(`/film?video=${film.id}`, undefined, { shallow: true });
    } else {
      // Cambia URL per aprire il player senza ricaricare pagina
      router.push(`/film?video=${film.id}`, undefined, { shallow: true });
      // selectedFilm sarà aggiornato da useEffect
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === pendingFilm.password) {
      setSelectedFilm(pendingFilm);
      setPendingFilm(null);
      setError('');
    } else {
      setError('Password errata');
    }
  };

  const closePlayer = () => {
    // Torna a /film senza query e resetta stato
    router.push('/film', undefined, { shallow: true });
    setSelectedFilm(null);
    setPendingFilm(null);
    setPasswordInput('');
    setError('');
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.title}>Catalogo</h1>

        <div className={styles.grid}>
          {films.map(film => (
            <div
              key={film.id}
              className={styles.card}
              onClick={() => handleCardClick(film)}
              style={{ '--highlight-color': film.highlightColor }}
              aria-label={`Guarda il film ${film.name}`}
            >
              <img src={film.poster} alt={`Locandina di ${film.name}`} className={styles.poster} />
              <div className={styles.details}>
                <div className={styles.name}>{film.name}</div>
                <div className={styles.yearDuration}>
                  {film.year} • {film.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal con player */}
        {selectedFilm && (
          <div className={styles.fullscreenPlayer}>
            <div className={styles.playerHeader}>
              <button onClick={closePlayer} className={styles.backButton}>← Torna al catalogo</button>
            </div>

            <div className={styles.playerContent}>
              <iframe
                src={selectedFilm.link}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={styles.videoPlayerFullscreen}
              ></iframe>
              <div className={styles.filmInfo}>
                <h2>{selectedFilm.name}</h2>
                <p><strong>Anno:</strong> {selectedFilm.year}</p>
                <p><strong>Durata:</strong> {selectedFilm.duration}</p>
                <p><strong>Cast:</strong> {selectedFilm.cast}</p>
                <p><strong>Trama:</strong> {selectedFilm.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal con richiesta password */}
        {pendingFilm && (
          <div className={styles.modalOverlay} onClick={closePlayer}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Questo film è protetto</h2>
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Inserisci la password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className={styles.passwordInput}
              />
              <label className={styles.showPasswordToggle}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Mostra password
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <button onClick={handlePasswordSubmit} className={styles.closeButton}>Accedi</button>
              <button onClick={closePlayer} className={styles.closeButton}>Annulla</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
