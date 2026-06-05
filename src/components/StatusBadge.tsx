import type { ContractStatus } from '../types';
import styles from './StatusBadge.module.css';

interface Props {
  status: ContractStatus;
}

const labels: Record<ContractStatus, string> = {
  DRAFT: 'Draft',
  REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {labels[status] ?? status}
    </span>
  );
}
