import { supabase } from '@/lib/supabase';

export const requestsService = {
  /**
   * Create a new song request
   */
  async createRequest(requestData) {
    const { motive, story, vibes, privacy, userId, musicStyle } = requestData;
    
    // Base payload
    const payload = {
      user_id: userId,
      motive,
      description: story, // Mapping story to description column
      title: `Solicitud: ${motive}`, // Auto-generate title
      status: 'received',
      privacy: privacy || 'public',
      vibes: vibes, // Try to send vibes array
      music_style: musicStyle // Add music style
    };

    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback: If vibes or music_style column doesn't exist or array insert fails
      console.warn('Standard insert failed, attempting fallback...', error);
      
      let description = story;
      if (vibes && vibes.length > 0) {
        description = `[VIBE: ${vibes.join(', ')}]\n\n${description}`;
      }
      if (musicStyle) {
        description = `[ESTILO: ${musicStyle}]\n\n${description}`;
      }

      const fallbackPayload = {
        user_id: userId,
        motive,
        description,
        title: `Solicitud: ${motive}`,
        status: 'received',
        privacy: privacy || 'public'
      };

      const { data, error: fallbackError } = await supabase
        .from('requests')
        .insert([fallbackPayload])
        .select()
        .single();

      if (fallbackError) throw fallbackError;
      return data;
    }
  },

  /**
   * Get requests for the current user
   */
  async getMyRequests(userId) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get all requests (Admin only)
   */
  async getAllRequests() {
    // Join with profiles to get username
    const { data, error } = await supabase
      .from('requests')
      .select('*, profiles:user_id(username, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update request status and notes (Admin only)
   */
  async updateRequestStatus(id, status, adminNotes) {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a request
   */
  async deleteRequest(id) {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};