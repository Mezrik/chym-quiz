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
          seconds_per_question: number | null
          self_test: boolean
          show_results: boolean | null
        }
        Insert: {
          author_email: string
          created_at?: string
          id?: string
          seconds_per_question?: number | null
          self_test?: boolean
          show_results?: boolean | null
        }
        Update: {
          author_email?: string
          created_at?: string
          id?: string
          seconds_per_question?: number | null
          self_test?: boolean
          show_results?: boolean | null
        }
        Relationships: []
      }
      quiz_instance_pass: {
        Row: {
          created_at: string
          id: number
          passer_name: string
          quiz_instance_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          passer_name: string
          quiz_instance_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          passer_name?: string
          quiz_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_pass_quiz_instance_id_fkey"
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
          quiz_instance_id: string | null
          quiz_question_id: number
          seconds_taken: number
        }
        Insert: {
          created_at?: string
          id?: number
          quiz_instance_id?: string | null
          quiz_question_id: number
          seconds_taken: number
        }
        Update: {
          created_at?: string
          id?: number
          quiz_instance_id?: string | null
          quiz_question_id?: number
          seconds_taken?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_pass_answer_quiz_instance_id_fkey"
            columns: ["quiz_instance_id"]
            isOneToOne: false
            referencedRelation: "quiz_instance"
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
      quiz_instance_question: {
        Row: {
          created_at: string
          id: number
          quiz_instance_id: string | null
          quiz_question_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          quiz_instance_id?: string | null
          quiz_question_id: number
        }
        Update: {
          created_at?: string
          id?: number
          quiz_instance_id?: string | null
          quiz_question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_instance_question_quiz_instance_id_fkey"
            columns: ["quiz_instance_id"]
            isOneToOne: false
            referencedRelation: "quiz_instance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_instance_question_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_question"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question: {
        Row: {
          created_at: string
          id: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: number
          text?: string
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
      [_ in never]: never
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
