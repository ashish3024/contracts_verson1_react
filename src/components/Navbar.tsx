import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export function Navbar() {
  const { pathname } = useLocation();
  const isDetail = pathname.startsWith('/contracts/');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          ContractVault
        </Link>
        {isDetail && (
          <Link to="/" className={styles.back}>
            ← All Contracts
          </Link>
        )}
      </div>
    </header>
  );
}
