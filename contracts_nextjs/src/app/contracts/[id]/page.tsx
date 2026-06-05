import { ContractDetailClient } from './ContractDetailClient';

interface Props {
  params: { id: string };
}

export default function ContractDetailPage({ params }: Props) {
  return <ContractDetailClient id={params.id} />;
}
