export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
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
      client_companies: {
        Row: {
          archived_at: string | null;
          created_at: string;
          display_name: string;
          id: string;
          legal_name: string;
          status: Database['public']['Enums']['client_company_status'];
          tax_id: string | null;
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          display_name: string;
          id?: string;
          legal_name: string;
          status?: Database['public']['Enums']['client_company_status'];
          tax_id?: string | null;
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          legal_name?: string;
          status?: Database['public']['Enums']['client_company_status'];
          tax_id?: string | null;
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'client_companies_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      company_employee_records: {
        Row: {
          client_company_id: string;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          identifier: string;
          status: Database['public']['Enums']['employee_record_status'];
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          client_company_id: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          identifier: string;
          status?: Database['public']['Enums']['employee_record_status'];
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          client_company_id?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          identifier?: string;
          status?: Database['public']['Enums']['employee_record_status'];
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_employee_records_client_company_id_fkey';
            columns: ['client_company_id'];
            isOneToOne: false;
            referencedRelation: 'client_companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'company_employee_records_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      daily_demand: {
        Row: {
          client_company_id: string;
          created_at: string;
          demand_date: string;
          id: string;
          notes: string | null;
          source_schedule_upload_id: string | null;
          status: Database['public']['Enums']['daily_demand_status'];
          tenant_id: string;
          total_passengers_expected: number;
          total_shifts_count: number;
          updated_at: string;
        };
        Insert: {
          client_company_id: string;
          created_at?: string;
          demand_date: string;
          id?: string;
          notes?: string | null;
          source_schedule_upload_id?: string | null;
          status?: Database['public']['Enums']['daily_demand_status'];
          tenant_id: string;
          total_passengers_expected?: number;
          total_shifts_count?: number;
          updated_at?: string;
        };
        Update: {
          client_company_id?: string;
          created_at?: string;
          demand_date?: string;
          id?: string;
          notes?: string | null;
          source_schedule_upload_id?: string | null;
          status?: Database['public']['Enums']['daily_demand_status'];
          tenant_id?: string;
          total_passengers_expected?: number;
          total_shifts_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_demand_client_company_id_fkey';
            columns: ['client_company_id'];
            isOneToOne: false;
            referencedRelation: 'client_companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'daily_demand_source_schedule_upload_id_fkey';
            columns: ['source_schedule_upload_id'];
            isOneToOne: false;
            referencedRelation: 'schedule_uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'daily_demand_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      employee_addresses: {
        Row: {
          address_label: string;
          city: string | null;
          country: string;
          created_at: string;
          employee_record_id: string;
          geocodable_address_text: string;
          id: string;
          latitude: number | null;
          longitude: number | null;
          postal_code: string | null;
          state_province: string | null;
          street_address: string;
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          address_label?: string;
          city?: string | null;
          country?: string;
          created_at?: string;
          employee_record_id: string;
          geocodable_address_text: string;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          postal_code?: string | null;
          state_province?: string | null;
          street_address: string;
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          address_label?: string;
          city?: string | null;
          country?: string;
          created_at?: string;
          employee_record_id?: string;
          geocodable_address_text?: string;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          postal_code?: string | null;
          state_province?: string | null;
          street_address?: string;
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'employee_addresses_employee_record_id_fkey';
            columns: ['employee_record_id'];
            isOneToOne: false;
            referencedRelation: 'company_employee_records';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'employee_addresses_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      import_jobs: {
        Row: {
          created_at: string;
          finished_at: string | null;
          id: string;
          initiated_by: string;
          job_type: Database['public']['Enums']['import_job_type'];
          metadata: Json;
          started_at: string | null;
          status: Database['public']['Enums']['import_job_status'];
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          finished_at?: string | null;
          id?: string;
          initiated_by: string;
          job_type: Database['public']['Enums']['import_job_type'];
          metadata?: Json;
          started_at?: string | null;
          status?: Database['public']['Enums']['import_job_status'];
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          finished_at?: string | null;
          id?: string;
          initiated_by?: string;
          job_type?: Database['public']['Enums']['import_job_type'];
          metadata?: Json;
          started_at?: string | null;
          status?: Database['public']['Enums']['import_job_status'];
          tenant_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'import_jobs_initiated_by_fkey';
            columns: ['initiated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'import_jobs_tenant_id_fkey';
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
      schedule_upload_rows: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          row_number: number;
          schedule_upload_id: string;
          tenant_id: string;
          updated_at: string;
          validation_errors: Json;
          validation_status: Database['public']['Enums']['upload_row_validation_status'];
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          row_number: number;
          schedule_upload_id: string;
          tenant_id: string;
          updated_at?: string;
          validation_errors?: Json;
          validation_status?: Database['public']['Enums']['upload_row_validation_status'];
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          row_number?: number;
          schedule_upload_id?: string;
          tenant_id?: string;
          updated_at?: string;
          validation_errors?: Json;
          validation_status?: Database['public']['Enums']['upload_row_validation_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'schedule_upload_rows_schedule_upload_id_fkey';
            columns: ['schedule_upload_id'];
            isOneToOne: false;
            referencedRelation: 'schedule_uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'schedule_upload_rows_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      schedule_uploads: {
        Row: {
          client_company_id: string | null;
          created_at: string;
          error_rows_count: number;
          id: string;
          original_filename: string;
          source_type: Database['public']['Enums']['schedule_upload_source'];
          status: Database['public']['Enums']['schedule_upload_status'];
          tenant_id: string;
          total_rows_count: number;
          updated_at: string;
          uploaded_by: string;
          valid_rows_count: number;
        };
        Insert: {
          client_company_id?: string | null;
          created_at?: string;
          error_rows_count?: number;
          id?: string;
          original_filename: string;
          source_type?: Database['public']['Enums']['schedule_upload_source'];
          status?: Database['public']['Enums']['schedule_upload_status'];
          tenant_id: string;
          total_rows_count?: number;
          updated_at?: string;
          uploaded_by: string;
          valid_rows_count?: number;
        };
        Update: {
          client_company_id?: string | null;
          created_at?: string;
          error_rows_count?: number;
          id?: string;
          original_filename?: string;
          source_type?: Database['public']['Enums']['schedule_upload_source'];
          status?: Database['public']['Enums']['schedule_upload_status'];
          tenant_id?: string;
          total_rows_count?: number;
          updated_at?: string;
          uploaded_by?: string;
          valid_rows_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'schedule_uploads_client_company_id_fkey';
            columns: ['client_company_id'];
            isOneToOne: false;
            referencedRelation: 'client_companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'schedule_uploads_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'schedule_uploads_uploaded_by_fkey';
            columns: ['uploaded_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          accent_color_h: number;
          accent_color_l: number;
          accent_color_s: number;
          created_at: string;
          favicon_asset_path: string | null;
          logo_asset_path: string | null;
          primary_color_h: number;
          primary_color_l: number;
          primary_color_s: number;
          secondary_color_h: number;
          secondary_color_l: number;
          secondary_color_s: number;
          tenant_id: string;
          updated_at: string;
        };
        Insert: {
          accent_color_h?: number;
          accent_color_l?: number;
          accent_color_s?: number;
          created_at?: string;
          favicon_asset_path?: string | null;
          logo_asset_path?: string | null;
          primary_color_h?: number;
          primary_color_l?: number;
          primary_color_s?: number;
          secondary_color_h?: number;
          secondary_color_l?: number;
          secondary_color_s?: number;
          tenant_id: string;
          updated_at?: string;
        };
        Update: {
          accent_color_h?: number;
          accent_color_l?: number;
          accent_color_s?: number;
          created_at?: string;
          favicon_asset_path?: string | null;
          logo_asset_path?: string | null;
          primary_color_h?: number;
          primary_color_l?: number;
          primary_color_s?: number;
          secondary_color_h?: number;
          secondary_color_l?: number;
          secondary_color_s?: number;
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
      activate_tenant: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
      add_schedule_upload_row: {
        Args: {
          p_payload: Json;
          p_row_number: number;
          p_schedule_upload_id: string;
          p_tenant_id?: string;
          p_validation_errors?: Json;
          p_validation_status?: Database['public']['Enums']['upload_row_validation_status'];
        };
        Returns: string;
      };
      archive_tenant: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
      create_client_company: {
        Args: {
          p_display_name: string;
          p_legal_name: string;
          p_tax_id?: string;
          p_tenant_id?: string;
        };
        Returns: string;
      };
      create_daily_demand: {
        Args: {
          p_client_company_id: string;
          p_demand_date: string;
          p_notes?: string;
          p_source_schedule_upload_id?: string;
          p_tenant_id?: string;
          p_total_passengers_expected?: number;
          p_total_shifts_count?: number;
        };
        Returns: string;
      };
      create_employee_address: {
        Args: {
          p_address_label?: string;
          p_city?: string;
          p_country?: string;
          p_employee_record_id: string;
          p_geocodable_address_text: string;
          p_latitude?: number;
          p_longitude?: number;
          p_postal_code?: string;
          p_state_province?: string;
          p_street_address: string;
          p_tenant_id?: string;
        };
        Returns: string;
      };
      create_employee_record: {
        Args: {
          p_client_company_id: string;
          p_email?: string;
          p_full_name: string;
          p_identifier: string;
          p_status?: Database['public']['Enums']['employee_record_status'];
          p_tenant_id?: string;
        };
        Returns: string;
      };
      create_import_job: {
        Args: {
          p_job_type: Database['public']['Enums']['import_job_type'];
          p_metadata?: Json;
          p_tenant_id?: string;
        };
        Returns: string;
      };
      create_schedule_upload: {
        Args: {
          p_client_company_id?: string;
          p_original_filename: string;
          p_source_type?: Database['public']['Enums']['schedule_upload_source'];
          p_tenant_id?: string;
        };
        Returns: string;
      };
      create_tenant_invitation: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_email: string;
          p_expires_in_hours?: number;
          p_role?: Database['public']['Enums']['tenant_role'];
          p_tenant_id: string;
        };
        Returns: string;
      };
      create_tenant_with_defaults: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_display_name: string;
          p_legal_name: string;
          p_locale?: string;
          p_slug: string;
          p_timezone?: string;
        };
        Returns: string;
      };
      revoke_tenant_invitation: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_invitation_id: string;
        };
        Returns: boolean;
      };
      revoke_tenant_membership: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_tenant_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      set_active_tenant: { Args: { p_tenant_id: string }; Returns: Json };
      set_tenant_module: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_is_enabled: boolean;
          p_module_key: string;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
      suspend_tenant: {
        Args: {
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
          p_tenant_id: string;
        };
        Returns: boolean;
      };
      update_tenant_branding: {
        Args: {
          p_accent_color_h?: number;
          p_accent_color_l?: number;
          p_accent_color_s?: number;
          p_actor_email_snapshot: string;
          p_actor_user_id: string;
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
        | 'profile_email_updated'
        | 'client_company_created'
        | 'employee_record_created'
        | 'employee_address_created'
        | 'schedule_upload_created'
        | 'schedule_upload_row_created'
        | 'daily_demand_created'
        | 'import_job_started'
        | 'import_job_finished';
      audit_entity_type:
        | 'profile'
        | 'tenant'
        | 'tenant_membership'
        | 'user_tenant_context'
        | 'tenant_invitation'
        | 'tenant_branding'
        | 'tenant_module_setting'
        | 'client_company'
        | 'company_employee_record'
        | 'employee_address'
        | 'schedule_upload'
        | 'schedule_upload_row'
        | 'daily_demand'
        | 'import_job';
      client_company_status: 'active' | 'inactive' | 'archived';
      daily_demand_status: 'open' | 'locked' | 'processing' | 'completed' | 'cancelled';
      employee_record_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
      import_job_status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
      import_job_type: 'employee_directory_import' | 'schedule_demand_import' | 'client_company_import';
      invitation_status: 'pending' | 'accepted' | 'revoked';
      membership_status: 'active' | 'revoked';
      profile_status: 'active' | 'suspended' | 'inactive';
      schedule_upload_source: 'csv' | 'xlsx' | 'api' | 'manual';
      schedule_upload_status: 'pending' | 'processing' | 'validated' | 'partially_valid' | 'error' | 'completed';
      tenant_role: 'tenant_admin';
      tenant_status: 'draft' | 'active' | 'suspended' | 'archived';
      upload_row_validation_status: 'pending' | 'valid' | 'error';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      buckets_analytics: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          format: string;
          id: string;
          name: string;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          format?: string;
          id?: string;
          name: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          format?: string;
          id?: string;
          name?: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Relationships: [];
      };
      buckets_vectors: {
        Row: {
          created_at: string;
          id: string;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          metadata: Json | null;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          metadata?: Json | null;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          metadata?: Json | null;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      vector_indexes: {
        Row: {
          bucket_id: string;
          created_at: string;
          data_type: string;
          dimension: number;
          distance_metric: string;
          id: string;
          metadata_configuration: Json | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          data_type: string;
          dimension: number;
          distance_metric: string;
          id?: string;
          metadata_configuration?: Json | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          data_type?: string;
          dimension?: number;
          distance_metric?: string;
          id?: string;
          metadata_configuration?: Json | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vector_indexes_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets_vectors';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] };
        Returns: boolean;
      };
      allow_only_operation: {
        Args: { expected_operation: string };
        Returns: boolean;
      };
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string };
        Returns: undefined;
      };
      extension: { Args: { name: string }; Returns: string };
      filename: { Args: { name: string }; Returns: string };
      foldername: { Args: { name: string }; Returns: string[] };
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string };
        Returns: string;
      };
      get_size_by_bucket: {
        Args: never;
        Returns: {
          bucket_id: string;
          size: number;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
          prefix_param: string;
        };
        Returns: {
          created_at: string;
          id: string;
          key: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string;
          delimiter_param: string;
          max_keys?: number;
          next_token?: string;
          prefix_param: string;
          sort_order?: string;
          start_after?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      operation: { Args: never; Returns: string };
      search: {
        Args: {
          bucketname: string;
          levels?: number;
          limits?: number;
          offsets?: number;
          prefix: string;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      search_by_timestamp: {
        Args: {
          p_bucket_id: string;
          p_level: number;
          p_limit: number;
          p_prefix: string;
          p_sort_column: string;
          p_sort_column_after: string;
          p_sort_order: string;
          p_start_after: string;
        };
        Returns: {
          created_at: string;
          id: string;
          key: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      search_v2: {
        Args: {
          bucket_name: string;
          levels?: number;
          limits?: number;
          prefix: string;
          sort_column?: string;
          sort_column_after?: string;
          sort_order?: string;
          start_after?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          key: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
    };
    Enums: {
      buckettype: 'STANDARD' | 'ANALYTICS' | 'VECTOR';
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
  graphql_public: {
    Enums: {},
  },
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
        'client_company_created',
        'employee_record_created',
        'employee_address_created',
        'schedule_upload_created',
        'schedule_upload_row_created',
        'daily_demand_created',
        'import_job_started',
        'import_job_finished',
      ],
      audit_entity_type: [
        'profile',
        'tenant',
        'tenant_membership',
        'user_tenant_context',
        'tenant_invitation',
        'tenant_branding',
        'tenant_module_setting',
        'client_company',
        'company_employee_record',
        'employee_address',
        'schedule_upload',
        'schedule_upload_row',
        'daily_demand',
        'import_job',
      ],
      client_company_status: ['active', 'inactive', 'archived'],
      daily_demand_status: ['open', 'locked', 'processing', 'completed', 'cancelled'],
      employee_record_status: ['active', 'inactive', 'on_leave', 'terminated'],
      import_job_status: ['queued', 'running', 'completed', 'failed', 'cancelled'],
      import_job_type: ['employee_directory_import', 'schedule_demand_import', 'client_company_import'],
      invitation_status: ['pending', 'accepted', 'revoked'],
      membership_status: ['active', 'revoked'],
      profile_status: ['active', 'suspended', 'inactive'],
      schedule_upload_source: ['csv', 'xlsx', 'api', 'manual'],
      schedule_upload_status: ['pending', 'processing', 'validated', 'partially_valid', 'error', 'completed'],
      tenant_role: ['tenant_admin'],
      tenant_status: ['draft', 'active', 'suspended', 'archived'],
      upload_row_validation_status: ['pending', 'valid', 'error'],
    },
  },
  storage: {
    Enums: {
      buckettype: ['STANDARD', 'ANALYTICS', 'VECTOR'],
    },
  },
} as const;
