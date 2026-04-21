'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playground-store';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const setActiveWorkspace = usePlaygroundStore((state) => state.setActiveWorkspace);

  useEffect(() => {
    if (workspaceId) {
      setActiveWorkspace(workspaceId);
    }
    return () => setActiveWorkspace('');
  }, [workspaceId, setActiveWorkspace]);

  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
