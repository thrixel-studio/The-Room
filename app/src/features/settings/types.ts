export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  bio: string | null;
  theme: string;
  selected_framework: string;
  has_completed_tutorial: boolean;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  bio?: string;
  theme?: string;
  selected_framework?: string;
  has_completed_tutorial?: boolean;
}
