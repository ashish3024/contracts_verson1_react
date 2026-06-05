import styles from './Skeleton.module.css';

interface Props {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function Skeleton({ width = '100%', height = '16px', borderRadius = '6px' }: Props) {
  return (
    <span className={styles.skeleton} style={{ width, height, borderRadius }} aria-hidden="true" />
  );
}

export function ContractRowSkeleton() {
  return (
    <tr className={styles.row}>
      <td><Skeleton width="55%" /></td>
      <td><Skeleton width="40%" /></td>
      <td><Skeleton width="80px" height="22px" borderRadius="20px" /></td>
      <td><Skeleton width="60%" /></td>
    </tr>
  );
}
