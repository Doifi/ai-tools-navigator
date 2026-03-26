export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          order: number | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          order?: number | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          order?: number | null;
          slug?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author: string | null;
          category_id: string | null;
          content: string | null;
          cover_image: string | null;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          related_tools: string[] | null;
          slug: string;
          status: Database["public"]["Enums"]["content_status"];
          title: string;
          views: number | null;
        };
        Insert: {
          author?: string | null;
          category_id?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          related_tools?: string[] | null;
          slug: string;
          status?: Database["public"]["Enums"]["content_status"];
          title: string;
          views?: number | null;
        };
        Update: {
          author?: string | null;
          category_id?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          related_tools?: string[] | null;
          slug?: string;
          status?: Database["public"]["Enums"]["content_status"];
          title?: string;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      tool_submissions: {
        Row: {
          admin_notes: string | null;
          api_available: boolean | null;
          category_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: string | null;
          price_model: Database["public"]["Enums"]["price_model"] | null;
          reviewed_at: string | null;
          status: Database["public"]["Enums"]["submission_status"];
          submitter_email: string | null;
          tool_name: string;
          website_url: string;
        };
        Insert: {
          admin_notes?: string | null;
          api_available?: boolean | null;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          price_model?: Database["public"]["Enums"]["price_model"] | null;
          reviewed_at?: string | null;
          status?: Database["public"]["Enums"]["submission_status"];
          submitter_email?: string | null;
          tool_name: string;
          website_url: string;
        };
        Update: {
          admin_notes?: string | null;
          api_available?: boolean | null;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          price_model?: Database["public"]["Enums"]["price_model"] | null;
          reviewed_at?: string | null;
          status?: Database["public"]["Enums"]["submission_status"];
          submitter_email?: string | null;
          tool_name?: string;
          website_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_submissions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      tools: {
        Row: {
          api_available: boolean | null;
          category_id: string | null;
          clicks: number | null;
          created_at: string | null;
          description: string | null;
          detailed_intro: string | null;
          features: string[] | null;
          id: string;
          is_sponsored: boolean | null;
          logo_url: string | null;
          name: string;
          price_model: Database["public"]["Enums"]["price_model"] | null;
          published_at: string | null;
          slug: string;
          sponsor_expiry: string | null;
          sponsor_plan: Database["public"]["Enums"]["sponsor_plan"] | null;
          status: Database["public"]["Enums"]["content_status"];
          tags: string[] | null;
          updated_at: string | null;
          views: number | null;
          website_url: string;
        };
        Insert: {
          api_available?: boolean | null;
          category_id?: string | null;
          clicks?: number | null;
          created_at?: string | null;
          description?: string | null;
          detailed_intro?: string | null;
          features?: string[] | null;
          id?: string;
          is_sponsored?: boolean | null;
          logo_url?: string | null;
          name: string;
          price_model?: Database["public"]["Enums"]["price_model"] | null;
          published_at?: string | null;
          slug: string;
          sponsor_expiry?: string | null;
          sponsor_plan?: Database["public"]["Enums"]["sponsor_plan"] | null;
          status?: Database["public"]["Enums"]["content_status"];
          tags?: string[] | null;
          updated_at?: string | null;
          views?: number | null;
          website_url: string;
        };
        Update: {
          api_available?: boolean | null;
          category_id?: string | null;
          clicks?: number | null;
          created_at?: string | null;
          description?: string | null;
          detailed_intro?: string | null;
          features?: string[] | null;
          id?: string;
          is_sponsored?: boolean | null;
          logo_url?: string | null;
          name?: string;
          price_model?: Database["public"]["Enums"]["price_model"] | null;
          published_at?: string | null;
          slug?: string;
          sponsor_expiry?: string | null;
          sponsor_plan?: Database["public"]["Enums"]["sponsor_plan"] | null;
          status?: Database["public"]["Enums"]["content_status"];
          tags?: string[] | null;
          updated_at?: string | null;
          views?: number | null;
          website_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tools_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_clicks: {
        Args: {
          tool_id: string;
        };
        Returns: undefined;
      };
      increment_tool_views: {
        Args: {
          tool_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      content_status: "draft" | "published" | "archived";
      price_model: "free" | "freemium" | "paid";
      sponsor_plan: "starter" | "featured" | "homepage";
      submission_status: "pending" | "approved" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer Row;
    }
    ? Row
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer Row;
      }
      ? Row
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer Insert;
    }
    ? Insert
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer Insert;
      }
      ? Insert
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer Update;
    }
    ? Update
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer Update;
      }
      ? Update
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
