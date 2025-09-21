import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Complaint {
  id?: string;
  token_number: string;
  issue_type: string;
  personal_info: {
    name: string;
    phone: string;
    address: string;
  };
  case_info: Record<string, any>;
  documents: string[];
  status: 'pending' | 'under_action' | 'completed';
  officer_remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id?: string;
  rating: 'good' | 'medium' | 'poor';
  comment?: string;
  language: string;
  created_at?: string;
}

export interface FeedbackStats {
  total: number;
  good: number;
  medium: number;
  poor: number;
  recent_comments: Array<{
    comment: string;
    rating: string;
    language: string;
    created_at: string;
  }>;
}

export const generateTokenNumber = async (): Promise<string> => {
  try {
    // Get the latest token number from the database
    const { data, error } = await supabase
      .from('complaints')
      .select('token_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest token:', error);
      return '0001'; // Fallback to first token
    }

    if (!data || data.length === 0) {
      return '0001'; // First complaint
    }

    const lastToken = data[0].token_number;
    const nextNumber = parseInt(lastToken) + 1;
    return nextNumber.toString().padStart(4, '0');
  } catch (error) {
    console.error('Error generating token number:', error);
    return Math.floor(Math.random() * 9999).toString().padStart(4, '0'); // Random fallback
  }
};

export const saveComplaint = async (complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to save complaint' };
  }
};

export const saveFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to save feedback' };
  }
};

export const getFeedbackStats = async (): Promise<{ success: boolean; data?: FeedbackStats; error?: string }> => {
  try {
    // Get total counts by rating
    const { data: ratingCounts, error: ratingError } = await supabase
      .from('feedback')
      .select('rating')
      .order('created_at', { ascending: false });

    if (ratingError) {
      return { success: false, error: ratingError.message };
    }

    // Get recent comments
    const { data: recentComments, error: commentsError } = await supabase
      .from('feedback')
      .select('comment, rating, language, created_at')
      .not('comment', 'is', null)
      .neq('comment', '')
      .order('created_at', { ascending: false })
      .limit(10);

    if (commentsError) {
      return { success: false, error: commentsError.message };
    }

    // Calculate statistics
    const total = ratingCounts?.length || 0;
    const good = ratingCounts?.filter(f => f.rating === 'good').length || 0;
    const medium = ratingCounts?.filter(f => f.rating === 'medium').length || 0;
    const poor = ratingCounts?.filter(f => f.rating === 'poor').length || 0;

    const stats: FeedbackStats = {
      total,
      good,
      medium,
      poor,
      recent_comments: recentComments || []
    };

    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: 'Failed to fetch feedback statistics' };
  }
};