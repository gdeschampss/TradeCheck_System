import { supabase } from './supabaseClient';

export const saveAnalysis = async (id: string, result: any, userId?: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        id: id,
        user_id: userId || null,
        extracted_data: result.extractedData,
        report: result.report,
        confidence_score: result.confidenceScore,
        created_at: result.createdAt || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving analysis to Supabase:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in saveAnalysis:', error);
    return null;
  }
};

export const getAnalysisById = async (id: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting analysis by ID from Supabase:', error);
      return null;
    }

    if (!data) return null;

    // Map back to the original application format
    return {
      id: data.id,
      userId: data.user_id,
      createdAt: data.created_at,
      extractedData: data.extracted_data,
      report: data.report,
      confidenceScore: data.confidence_score
    };
  } catch (error) {
    console.error('Error in getAnalysisById:', error);
    return null;
  }
};

export const getAllAnalyses = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all analyses from Supabase:', error);
      return [];
    }

    return (data || []).map(a => ({
      id: a.id,
      userId: a.user_id,
      createdAt: a.created_at,
      extractedData: a.extracted_data,
      report: a.report,
      confidenceScore: a.confidence_score
    }));
  } catch (error) {
    console.error('Error in getAllAnalyses:', error);
    return [];
  }
};

export const deleteAnalysisById = async (id: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting analysis from Supabase:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in deleteAnalysisById:', error);
    return false;
  }
};
