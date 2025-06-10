import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import AgeCheck from '../components/AgeCheck';


const phrases = [
  'Benvenuto.',
  'Ciao.',
  'Giova vattene',
  'oviv é okiN',
  'Bentornato.',
];

export default function Home() {
  const [selectedPhrase, setSelectedPhrase] = useState(phrases[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setSelectedPhrase(phrases[randomIndex]);
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        {selectedPhrase}
      </main>
      <AgeCheck />
    </>
  );
}
