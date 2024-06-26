export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      quiz_instance: {
        Row: {
          author_email: string
          created_at: string
          id: string
          seconds_per_question: number
          self_test: boolean
          show_results: boolean | null
          without_time_limit: boolean | null
        }
        Insert: {
          author_email: string
          created_at?: string
          id?: string
          seconds_per_question: number
          self_test?: boolean
          show_results?: boolean | null
          without_time_limit?: boolean | null
        }
        Update: {
          author_email?: string
          created_at?: string
          id?: string
          seconds_per_question?: number
          self_test?: boolean
          show_results?: boolean | null
          without_time_limit?: boolean | null
        }
        Relationships: []
      }
      quiz_instance_pass: {
        Row: {
          created_at: string
          end: string | null
          id: string
          passer_name: string
          quiz_instance_id: string | null
          sets_correct_percentage: Json | null
          start: string | null
          taken_time: number | null
          total_correct_percentage: number | null
          types_correct_percentage: Json | null
        }
        Insert: {
          created_at?: string
          end?: string | null
          id?: string
          passer_name: string
          quiz_instance_id?: string | null
          sets_correct_percentage?: Json | null
          start?: string | null
          taken_time?: number | null
          total_correct_percentage?: number | null
          types_correct_percentage?: Json | null
        }
        Update: {
          created_at?: string
          end?: string | null
          id?: string
          passer_name?: string
          quiz_instance_id?: string | null
          sets_correct_percentage?: Json | null
          start?: string | null
          taken_time?: number | null
          total_correct_percentage?: number | null
          types_correct_percentage?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_pass_duplicate_quiz_instance_id_fkey"
            columns: ["quiz_instance_id"]
            isOneToOne: false
            referencedRelation: "quiz_instance"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_instance_pass_answer: {
        Row: {
          created_at: string
          id: number
          quiz_instance_pass_id: string | null
          quiz_question_answer_id: number | null
          quiz_question_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          quiz_instance_pass_id?: string | null
          quiz_question_answer_id?: number | null
          quiz_question_id: number
        }
        Update: {
          created_at?: string
          id?: number
          quiz_instance_pass_id?: string | null
          quiz_question_answer_id?: number | null
          quiz_question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_pass_answer_quiz_instance_pass_id_fkey"
            columns: ["quiz_instance_pass_id"]
            isOneToOne: false
            referencedRelation: "quiz_instance_pass"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_instance_pass_answer_quiz_question_answer_id_fkey"
            columns: ["quiz_question_answer_id"]
            isOneToOne: false
            referencedRelation: "quiz_question_answer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_instance_pass_answer_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_question"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_instance_set: {
        Row: {
          quiz_instance_id: string
          quiz_set_id: number
        }
        Insert: {
          quiz_instance_id: string
          quiz_set_id: number
        }
        Update: {
          quiz_instance_id?: string
          quiz_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_set_quiz_instance_id_fkey"
            columns: ["quiz_instance_id"]
            isOneToOne: false
            referencedRelation: "quiz_instance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_instance_set_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_set"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question: {
        Row: {
          created_at: string
          id: number
          image_url: string | null
          text: string
          type: Database["public"]["Enums"]["chart_type"]
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string | null
          text: string
          type?: Database["public"]["Enums"]["chart_type"]
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string | null
          text?: string
          type?: Database["public"]["Enums"]["chart_type"]
        }
        Relationships: []
      }
      quiz_question_answer: {
        Row: {
          created_at: string
          id: number
          is_correct: boolean
          quiz_question_id: number | null
          text: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_correct?: boolean
          quiz_question_id?: number | null
          text: string
        }
        Update: {
          created_at?: string
          id?: number
          is_correct?: boolean
          quiz_question_id?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_answer_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_question"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_set: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      quiz_set_question: {
        Row: {
          quiz_question_id: number
          quiz_set_id: number
        }
        Insert: {
          quiz_question_id: number
          quiz_set_id: number
        }
        Update: {
          quiz_question_id?: number
          quiz_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_set_question_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_set_question_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_set"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      chart_type:
        | "histogram"
        | "pie-chart"
        | "bar-chart"
        | "line-chart"
        | "cartogram"
        | "correlation-chart"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
