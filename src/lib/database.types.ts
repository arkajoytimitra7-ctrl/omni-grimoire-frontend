/**
 * Types for the EXISTING Omni Grimoire Supabase schema.
 *
 * The live database is the source of truth — this file only mirrors it.
 * Never add, rename, or remove tables/columns here to "fix" a type error:
 * fix the query instead, or regenerate from the database with
 * `supabase gen types typescript --project-id mrbyxdqedlgsmqhtqdiv`.
 *
 * Verified present on the live Data API:
 *   profiles, private_categories, public_tags, files, file_tags, likes
 * `public_tags` columns are confirmed from live rows; the remaining tables are
 * typed from the documented schema and should be locked in by regenerating.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
  Row: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id: string;
    display_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    display_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    updated_at?: string | null;
  };
  Relationships: [];
};
      private_categories: {
  Row: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    name?: string;
    description?: string | null;
    updated_at?: string | null;
  };
  Relationships: [];
};
      public_tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
        };
        Relationships: [];
      };
      files: {
  Row: {
    id: string;
    owner_id: string;
    title: string;
    description: string | null;
    original_filename: string | null;
    storage_path: string | null;
    file_type: string | null;
    mime_type: string | null;
    file_size: number | null;
    visibility: string;
    private_category_id: string | null;
    is_deleted: boolean;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    owner_id: string;
    title: string;
    description?: string | null;
    original_filename?: string | null;
    storage_path?: string | null;
    file_type?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    visibility?: string;
    private_category_id?: string | null;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    owner_id?: string;
    title?: string;
    description?: string | null;
    original_filename?: string | null;
    storage_path?: string | null;
    file_type?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    visibility?: string;
    private_category_id?: string | null;
    is_deleted?: boolean;
    updated_at?: string | null;
  };
  Relationships: [];
};
      file_tags: {
        Row: {
          file_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          file_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "file_tags_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "file_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "public_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
  Row: {
    user_id: string;
    file_id: string;
    created_at: string;
  };
  Insert: {
    user_id: string;
    file_id: string;
    created_at?: string;
  };
  Update: Record<string, never>;
  Relationships: [];
};
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

type PublicTables = Database["public"]["Tables"];

export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]["Insert"];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]["Update"];

export type Profile = Tables<"profiles">;
export type PrivateCategory = Tables<"private_categories">;
export type PublicTag = Tables<"public_tags">;
export type GrimoireFile = Tables<"files">;
export type FileTag = Tables<"file_tags">;
export type Like = Tables<"likes">;
