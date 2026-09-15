import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.scss';
import { useRouter } from 'next/router';

const NoSessionNavbar = () => {
  const router = useRouter();
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.navLogo}>
          Famstep
        </Link>
        
        <div className={styles.navButtons}>
          <button 
            className={styles.loginBtn}
            onClick={() => router.push('/login')}
          >
            Log in
          </button>
          <button 
            className={styles.signupBtn}
            onClick={() => router.push('/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NoSessionNavbar; 