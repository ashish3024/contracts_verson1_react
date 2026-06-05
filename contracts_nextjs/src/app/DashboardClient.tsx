'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useContracts } from '@/hooks/useContracts';
import { useDebounce } from '@/hooks/useDebounce';
import { StatusBadge } from '@/components/StatusBadge';
import { Pagination } from '@/components/Pagination';
import { ContractRowSkeleton } from '@/components/Skeleton';
import type { ContractStatus } from '@/types';
import styles from './Dashboard.module.css';

const STATUS_OPTIONS: { value: ContractStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'In Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
];

const PAGE_SIZE = 10;

export function DashboardClient() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<ContractStatus | ''>('');
  const [page, setPage] = useState(0);

  const search = useDebounce(searchInput, 400);
  const { data, loading, error } = useContracts({ search, status, page, size: PAGE_SIZE });

  const contracts = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Contracts</h1>
            {!loading && !error && (
              <p className={styles.subtitle}>
                {totalElements} contract{totalElements !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⊘</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by title or owner…"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(0); }}
              aria-label="Search contracts"
            />
            {searchInput && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSearchInput(''); setPage(0); }}
                aria-label="Clear search"
              >✕</button>
            )}
          </div>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => { setStatus(e.target.value as ContractStatus | ''); setPage(0); }}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <ContractRowSkeleton key={i} />)
              ) : error ? (
                <tr>
                  <td colSpan={4} className={styles.stateCell}>
                    <div className={styles.errorState}>
                      <span className={styles.stateIcon}>⚠</span>
                      <p className={styles.stateTitle}>Something went wrong</p>
                      <p className={styles.stateMsg}>{error}</p>
                    </div>
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.stateCell}>
                    <div className={styles.emptyState}>
                      <span className={styles.stateIcon}>◎</span>
                      <p className={styles.stateTitle}>No contracts found</p>
                      <p className={styles.stateMsg}>Try adjusting your search or filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr
                    key={c.id}
                    className={styles.row}
                    onClick={() => router.push(`/contracts/${c.id}`)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && router.push(`/contracts/${c.id}`)}
                    role="button"
                    aria-label={`View contract: ${c.title}`}
                  >
                    <td className={styles.titleCell}>
                      <span className={styles.contractTitle}>{c.title}</span>
                    </td>
                    <td className={styles.ownerCell}>{c.owner_name}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className={styles.dateCell}>
                      {format(new Date(c.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationWrap}>
            <span className={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </main>
  );
}
