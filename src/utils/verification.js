import { supabase } from '@/lib/supabase';

/**
 * Checks if a user is "verified" (has at least one delivered or published request).
 * This function is used to gate features like leaving reviews.
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
export async function getVerificationStatus(userId) {
  if (!userId) return false;
  
  try {
    const { count, error } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['delivered', 'published']);
      
    if (error) throw error;
    
    return count > 0;
  } catch (err) {
    console.error('Error checking verification:', err);
    return false;
  }
}

// Alias for backward compatibility if needed, or prefer getVerificationStatus
export const checkUserVerification = getVerificationStatus;