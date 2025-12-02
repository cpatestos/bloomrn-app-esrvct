
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          role: string
          priorities: Json
          has_completed_onboarding: boolean
          program_type: string | null
          semester: string | null
          year: string | null
          years_experience: string | null
          setting: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          role: string
          priorities: Json
          has_completed_onboarding?: boolean
          program_type?: string | null
          semester?: string | null
          year?: string | null
          years_experience?: string | null
          setting?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          role?: string
          priorities?: Json
          has_completed_onboarding?: boolean
          program_type?: string | null
          semester?: string | null
          year?: string | null
          years_experience?: string | null
          setting?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_checkins: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: number
          stress: number
          energy: number
          note: string | null
          gratitude: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood: number
          stress: number
          energy: number
          note?: string | null
          gratitude: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: number
          stress?: number
          energy?: number
          note?: string | null
          gratitude?: string[]
          created_at?: string
        }
      }
      self_care_activities: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          duration_minutes: number
          category: string
          role_tag: string | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          duration_minutes: number
          category: string
          role_tag?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          duration_minutes?: number
          category?: string
          role_tag?: string | null
          is_favorite?: boolean
          created_at?: string
        }
      }
      time_blocks: {
        Row: {
          id: string
          user_id: string
          day: string
          start_time: string
          end_time: string
          type: string
          title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day: string
          start_time: string
          end_time: string
          type: string
          title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day?: string
          start_time?: string
          end_time?: string
          type?: string
          title?: string | null
          created_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          type: string
          proud_of: string | null
          releasing: string | null
          meaningful_moment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          type: string
          proud_of?: string | null
          releasing?: string | null
          meaningful_moment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          type?: string
          proud_of?: string | null
          releasing?: string | null
          meaningful_moment?: string | null
          created_at?: string
        }
      }
      barriers: {
        Row: {
          id: string
          user_id: string
          date: string
          category: string
          description: string
          action_step: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          category: string
          description: string
          action_step: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          category?: string
          description?: string
          action_step?: string
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          date: string
          category: string
          description: string
          action_step: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          category: string
          description: string
          action_step: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          category?: string
          description?: string
          action_step?: string
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          title: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          title?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          title?: string | null
          content?: string
          created_at?: string
        }
      }
      media_recordings: {
        Row: {
          id: string
          user_id: string
          media_type: string
          file_path: string
          title: string | null
          description: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_type: string
          file_path: string
          title?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          media_type?: string
          file_path?: string
          title?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          created_at?: string
          updated_at?: string
        }
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
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
