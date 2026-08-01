import React from 'react';
import Link from 'next/link';

export default function RootPage() {
  return (
    <main
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#1A1A1A' }}>Transport Platform V2</h1>
      <p style={{ color: '#5C5C5C', marginBottom: '24px' }}>
        Foundation status — Productive Monorepo Base (Sprint 0.1 Repair)
      </p>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#0052CC' }}>System Foundation Status</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#006644', fontWeight: 'bold' }}>✓</span> Web configured (Next.js 15 App Router)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#006644', fontWeight: 'bold' }}>✓</span> Driver configured (Expo SDK 57)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#006644', fontWeight: 'bold' }}>✓</span> Worker configured (Node 24 TypeScript
            Process)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#006644', fontWeight: 'bold' }}>✓</span> Supabase local workflow configured
            (PostgreSQL + PostGIS, 0 domain tables)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF9900', fontWeight: 'bold' }}>⏳</span> CI pending verification (GitHub Actions
            quality, e2e & database workflows)
          </li>
        </ul>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
        }}
      >
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Infrastructure Shells (Provisional)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/platform" style={{ color: '#0052CC', textDecoration: 'none' }}>
            → Platform Shell (/platform)
          </Link>
          <Link href="/operator" style={{ color: '#0052CC', textDecoration: 'none' }}>
            → Transporter Shell (/operator)
          </Link>
          <Link href="/client" style={{ color: '#0052CC', textDecoration: 'none' }}>
            → Corporate Client Shell (/client)
          </Link>
          <Link href="/passenger" style={{ color: '#0052CC', textDecoration: 'none' }}>
            → Passenger Shell (/passenger)
          </Link>
          <Link href="/sign-in" style={{ color: '#0052CC', textDecoration: 'none' }}>
            → Sign-In Shell (/sign-in)
          </Link>
        </div>
      </div>
    </main>
  );
}
