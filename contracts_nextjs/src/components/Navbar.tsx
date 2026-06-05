'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export function Navbar() {
  const pathname = usePathname();
  const isDetail = pathname.startsWith('/contracts/');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          ContractVault
        </Link>
        {isDetail && (
          <Link href="/" className={styles.back}>
            ← All Contracts
          </Link>
        )}
      </div>
    </header>
  );
}
