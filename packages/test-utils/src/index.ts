export interface TestBrandFixture {
  displayName: string;
  shortName: string;
  logoUrl: string;
  faviconUrl: string;
  supportName: string;
  supportEmail: string;
  supportPhone: string;
  semanticColorAliases: {
    brandPrimary: string;
  };
  authorizedFontFamily: string;
  locale: string;
  timezone: string;
}

export const brandFixtures: Record<string, TestBrandFixture> = {
  transportesAndina: {
    displayName: 'Transportes Andina',
    shortName: 'ANDINA',
    logoUrl: '/assets/demo/andina-logo.png',
    faviconUrl: '/assets/demo/andina-favicon.ico',
    supportName: 'Soporte Andina',
    supportEmail: 'soporte@andina-demo.cl',
    supportPhone: '+56 2 2000 1111',
    semanticColorAliases: {
      brandPrimary: '#0052CC',
    },
    authorizedFontFamily: 'system-ui, sans-serif',
    locale: 'es-CL',
    timezone: 'America/Santiago',
  },
  movilidadCordillera: {
    displayName: 'Movilidad Cordillera',
    shortName: 'CORDILLERA',
    logoUrl: '/assets/demo/cordillera-logo.png',
    faviconUrl: '/assets/demo/cordillera-favicon.ico',
    supportName: 'Atención Cordillera',
    supportEmail: 'contacto@cordillera-demo.cl',
    supportPhone: '+56 2 2000 2222',
    semanticColorAliases: {
      brandPrimary: '#00875A',
    },
    authorizedFontFamily: 'system-ui, sans-serif',
    locale: 'es-CL',
    timezone: 'America/Santiago',
  },
  transferAustral: {
    displayName: 'Transfer Austral',
    shortName: 'AUSTRAL',
    logoUrl: '/assets/demo/austral-logo.png',
    faviconUrl: '/assets/demo/austral-favicon.ico',
    supportName: 'Mesade Ayuda Austral',
    supportEmail: 'ayuda@austral-demo.cl',
    supportPhone: '+56 61 200 3333',
    semanticColorAliases: {
      brandPrimary: '#6554C0',
    },
    authorizedFontFamily: 'system-ui, sans-serif',
    locale: 'es-CL',
    timezone: 'America/Santiago',
  },
};
