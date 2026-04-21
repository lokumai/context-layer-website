'use client';
import { useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playground-store';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const setActiveWorkspace = usePlaygroundStore((state) => state.setActiveWorkspace);

  useEffect(() => {
    setActiveWorkspace(params.workspaceId);
    return () => setActiveWorkspace('');
  }, [params.workspaceId, setActiveWorkspace]);

  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
