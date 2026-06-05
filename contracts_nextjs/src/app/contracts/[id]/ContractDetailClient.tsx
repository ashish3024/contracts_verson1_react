'use client';

import { format } from 'date-fns';
import { useContract } from '@/hooks/useContract';
import { StatusBadge } from '@/components/StatusBadge';
import { Skeleton } from '@/components/Skeleton';
import styles from './ContractDetail.module.css';

interface Props { id: string; }

export function ContractDetailClient({ id }: Props) {
  const { contract, history, loading, error } = useContract(id);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <Skeleton width="60%" height="32px" />
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <Skeleton width="100px" height="24px" borderRadius="20px" />
              <Skeleton width="140px" />
            </div>
            <div style={{ marginTop: 24 }}>
              <Skeleton width="100%" height="14px" />
              <div style={{ marginTop: 8 }}><Skeleton width="80%" height="14px" /></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <span className={styles.errorIcon}>⚠</span>
            <h2>Could not load contract</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!contract) return null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Contract Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.contractTitle}>{contract.title}</h1>
            <StatusBadge status={contract.status} />
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Owner</span>
              <span className={styles.metaValue}>{contract.owner_name}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Created</span>
              <span className={styles.metaValue}>{format(new Date(contract.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Last Updated</span>
              <span className={styles.metaValue}>{format(new Date(contract.updated_at), 'MMMM d, yyyy')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Contract ID</span>
              <span className={`${styles.metaValue} ${styles.monoId}`}>{contract.id}</span>
            </div>
          </div>

          {contract.description && (
            <div className={styles.descSection}>
              <h3 className={styles.sectionLabel}>Description</h3>
              <p className={styles.description}>{contract.description}</p>
            </div>
          )}
        </section>

        {/* Workflow History */}
        <section className={styles.historySection}>
          <h2 className={styles.historyTitle}>Workflow History</h2>
          {history.length === 0 ? (
            <div className={styles.emptyHistory}>No workflow history available.</div>
          ) : (
            <ol className={styles.timeline}>
              {history.map((entry, idx) => (
                <li key={entry.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  {idx < history.length - 1 && <div className={styles.timelineLine} />}
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineBy}>{entry.changed_by}</span>
                      <span className={styles.timelineDate}>
                        {format(new Date(entry.changed_at), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </div>
                    <div className={styles.timelineChange}>
                      {entry.previous_status ? (
                        <>
                          <StatusBadge status={entry.previous_status} />
                          <span className={styles.arrow}>→</span>
                          <StatusBadge status={entry.new_status} />
                        </>
                      ) : (
                        <>
                          <span className={styles.created}>Created as</span>
                          <StatusBadge status={entry.new_status} />
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
