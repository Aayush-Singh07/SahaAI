export interface SMSAcknowledgementData {
  phoneNumber: string;
  tokenNumber: string;
  issueType: string;
  policeStation: string;
  dateTime: string;
}

export interface SMSResult {
  success: boolean;
  error?: string;
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91, return as is with +
  if (cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // If it's 10 digits, add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // Return as is with + if it looks like an international number
  return `+${cleaned}`;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  // Should be 10 digits or 12 digits starting with 91
  if (cleaned.length === 10) {
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^91[6-9]\d{9}$/.test(cleaned);
  }
  
  return false;
};

export const sendAcknowledgementSMS = async (data: SMSAcknowledgementData): Promise<SMSResult> => {
  try {
    // Placeholder implementation - in a real app this would call a backend service
    console.log('SMS would be sent with data:', data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, always return success
    return { success: true };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};