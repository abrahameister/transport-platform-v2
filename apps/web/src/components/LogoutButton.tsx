'use client';

import React, { useTransition } from 'react';
import { Button } from '@transport-platform/ui-web';
import { signOutAction } from '@/lib/actions/authActions';

export const LogoutButton: React.FC<{ variant?: 'primary' | 'secondary' | 'outline' }> = ({ variant = 'outline' }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <Button
      type="button"
      variant={variant as any}
      disabled={isPending}
      onClick={handleLogout}
      style={{
        padding: '6px 12px',
        fontSize: '13px',
        borderRadius: '6px',
        borderColor: '#94A3B8',
        color: '#334155',
      }}
    >
      {isPending ? 'Saliendo...' : 'Cerrar Sesión'}
    </Button>
  );
};
