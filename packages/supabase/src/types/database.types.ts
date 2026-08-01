export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      audit_events: {
        Row: {
          action_type: Database['public']['Enums']['audit_action_type'];
          actor_email_snapshot: string | null;
          actor_user_id: string | null;
          correlation_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: Database['public']['Enums']['audit_entity_type'];
          id: string;
          metadata: Json;
          tenant_id: string | null;
        };
        Insert: {
          action_type: Database['public']['Enums']['audit_action_type'];
          actor_email_snapshot?: string | null;
          actor_user_id?: string | null;
          correlation_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: Database['public']['Enums']['audit_entity_type'];
          id?: string;
          metadata?: Json;
          tenant_id?: string | null;
        };
        Update: {
          action_type?: Database['public']['Enums']['audit_action_type'];
          actor_email_snapshot?: string | null;
          actor_user_id?: string | null;
          correlation_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: Database['public']['Enums']['audit_entity_type'];
          id?: string;
          metadata?: Json;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_events_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          status: Database['public']['Enums']['profile_status'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          status?: Database['public']['Enums']['profile_status'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          status?: Database['public']['Enums']['profile_status'];
          updated_at?: string;
        };
        Relationships: [];
      };
      system_modules: {
        Row: {
          created_at: string;
          description: string | null;
          is_active: boolean;
          key: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          key: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          key?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tenant_branding: {
        Row: {
          accent_color_h: number | null;
          accent_color_l: number | null;
          accent_color_s: number | null;
          created_at: string;
          favicon_asset_path: string | null;
          logo_asset_path: string | null;
          primary_color_h: number | null;
          primary_color_l: number | null;
          primary_color_s: number | null;
          secondary_color_h: number | null;
          secondary_color_l: number | null;
          secondary_color_s: number | null;
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          accent_color_h?: number | null;
          accent_color_l?: number | null;
          accent_color_s?: number | null;
          created_at?: string;
          favicon_asset_path?: string | null;
          logo_asset_path?: string | null;
          primary_color_h?: number | null;
          primary_color_l?: number | null;
          primary_color_s?: number | null;
          secondary_color_h?: number | null;
          secondary_color_l?: number | null;
          secondary_color_s?: number | null;
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          accent_color_h?: number | null;
          accent_color_l?: number | null;
          accent_color_s?: number | null;
          created_at?: string;
          favicon_asset_path?: string | null;
          logo_asset_path?: string | null;
          primary_color_h?: number | null;
          primary_color_l?: number | null;
          primary_color_s?: number | null;
          secondary_color_h?: number | null;
          secondary_color_l?: number | null;
          secondary_color_s?: number | null;
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tenant_branding_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: true;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      tenant_invitations: {
        Row: {
          accepted_at: string | null;
          accepted_by: string | null;
          created_at: string;
          expires_at: string;
          id: string;
          invited_by: string | null;
          normalized_email: string;
          revoked_at: string | null;
          role: Database['public']['Enums']['tenant_role'];
          status: Database['public']['Enums']['invitation_status'];
          tenant_id: string;
          token_hash: string;
          updated_at: string;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          expires_at: string;
          id?: string;
          invited_by?: string | null;
          normalized_email: string;
          revoked_at?: string | null;
          role?: Database['public']['Enums']['tenant_role'];
          status?: Database['public']['Enums']['invitation_status'];
          tenant_id: string;
          token_hash: string;
          updated_at?: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          expires_at?: string;
          id?: string;
          invited_by?: string | null;
          normalized_email?: string;
          revoked_at?: string | null;
          role?: Database['public']['Enums']['tenant_role'];
          status?: Database['public']['Enums']['invitation_status'];
          tenant_id?: string;
          token_hash?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tenant_invitations_accepted_by_fkey';
            columns: ['accepted_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenant_invitations_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenant_invitations_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      tenant_memberships: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['tenant_role'];
          status: Database['public']['Enums']['membership_status'];
          tenant_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['tenant_role'];
          status?: Database['public']['Enums']['membership_status'];
          tenant_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['tenant_role'];
          status?: Database['public']['Enums']['membership_status'];
          tenant_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tenant_memberships_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenant_memberships_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tenant_module_settings: {
        Row: {
          created_at: string;
          id: string;
          is_enabled: boolean;
          module_key: string;
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          module_key: string;
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          module_key?: string;
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tenant_module_settings_module_key_fkey';
            columns: ['module_key'];
            isOneToOne: false;
            referencedRelation: 'system_modules';
            referencedColumns: ['key'];
          },
          {
            foreignKeyName: 'tenant_module_settings_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      tenants: {
        Row: {
          activated_at: string | null;
          archived_at: string | null;
          created_at: string;
          display_name: string;
          id: string;
          legal_name: string;
          locale: string;
          slug: string;
          status: Database['public']['Enums']['tenant_status'];
          suspended_at: string | null;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          activated_at?: string | null;
          archived_at?: string | null;
          created_at?: string;
          display_name: string;
          id?: string;
          legal_name: string;
          locale?: string;
          slug: string;
          status?: Database['public']['Enums']['tenant_status'];
          suspended_at?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          activated_at?: string | null;
          archived_at?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          legal_name?: string;
          locale?: string;
          slug?: string;
          status?: Database['public']['Enums']['tenant_status'];
          suspended_at?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_tenant_context: {
        Row: {
          active_tenant_id: string | null;
          updated_at: string;
          user_id: string;
          version: number;
        };
        Insert: {
          active_tenant_id?: string | null;
          updated_at?: string;
          user_id: string;
          version?: number;
        };
        Update: {
          active_tenant_id?: string | null;
          updated_at?: string;
          user_id?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'user_tenant_context_active_tenant_id_fkey';
            columns: ['active_tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_tenant_context_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_tenant_invitation: { Args: { p_token: string }; Returns: Json };
      activate_tenant: { Args: { p_tenant_id: string }; Returns: boolean };
      archive_tenant: { Args: { p_tenant_id: string }; Returns: boolean };
      create_tenant_invitation: {
        Args: {
          p_email: string;
          p_expires_in_hours?: number;
          p_invited_by?: string;
          p_role?: Database['public']['Enums']['tenant_role'];
          p_tenant_id: string;
        };
        Returns: string;
      };
      create_tenant_with_defaults: {
        Args: {
          p_display_name: string;
          p_legal_name: string;
          p_locale?: string;
          p_slug: string;
          p_status?: Database['public']['Enums']['tenant_status'];
          p_timezone?: string;
        };
        Returns: string;
      };
      revoke_tenant_invitation: {
        Args: { p_invitation_id: string };
        Returns: boolean;
      };
      revoke_tenant_membership: {
        Args: { p_tenant_id: string; p_user_id: string };
        Returns: boolean;
      };
      set_active_tenant: { Args: { p_tenant_id: string }; Returns: Json };
      set_tenant_module: {
        Args: {
          p_is_enabled: boolean;
          p_module_key: string;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
      suspend_tenant: { Args: { p_tenant_id: string }; Returns: boolean };
      update_tenant_branding: {
        Args: {
          p_accent_color_h?: number;
          p_accent_color_l?: number;
          p_accent_color_s?: number;
          p_favicon_asset_path?: string;
          p_logo_asset_path?: string;
          p_primary_color_h?: number;
          p_primary_color_l?: number;
          p_primary_color_s?: number;
          p_secondary_color_h?: number;
          p_secondary_color_l?: number;
          p_secondary_color_s?: number;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      audit_action_type:
        | 'tenant_created'
        | 'tenant_activated'
        | 'tenant_suspended'
        | 'tenant_archived'
        | 'membership_created'
        | 'membership_reactivated'
        | 'membership_revoked'
        | 'invitation_created'
        | 'invitation_accepted'
        | 'invitation_revoked'
        | 'active_tenant_changed'
        | 'branding_updated'
        | 'module_updated'
        | 'profile_created'
        | 'profile_email_updated';
      audit_entity_type:
        | 'profile'
        | 'tenant'
        | 'tenant_membership'
        | 'user_tenant_context'
        | 'tenant_invitation'
        | 'tenant_branding'
        | 'tenant_module_setting';
      invitation_status: 'pending' | 'accepted' | 'revoked';
      membership_status: 'active' | 'revoked';
      profile_status: 'active' | 'suspended' | 'inactive';
      tenant_role: 'tenant_admin';
      tenant_status: 'draft' | 'active' | 'suspended' | 'archived';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      audit_action_type: [
        'tenant_created',
        'tenant_activated',
        'tenant_suspended',
        'tenant_archived',
        'membership_created',
        'membership_reactivated',
        'membership_revoked',
        'invitation_created',
        'invitation_accepted',
        'invitation_revoked',
        'active_tenant_changed',
        'branding_updated',
        'module_updated',
        'profile_created',
        'profile_email_updated',
      ],
      audit_entity_type: [
        'profile',
        'tenant',
        'tenant_membership',
        'user_tenant_context',
        'tenant_invitation',
        'tenant_branding',
        'tenant_module_setting',
      ],
      invitation_status: ['pending', 'accepted', 'revoked'],
      membership_status: ['active', 'revoked'],
      profile_status: ['active', 'suspended', 'inactive'],
      tenant_role: ['tenant_admin'],
      tenant_status: ['draft', 'active', 'suspended', 'archived'],
    },
  },
} as const;
