export function getRoleFromToken(token: string): string {
  try {
    const payloadBase64 = token.split('.')[1];

    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const payload = JSON.parse(decodedJson);
    
    return payload.role?.toLowerCase() || 'user';
  } catch (error) {
    console.error('🛡️ [Proxy] Falha ao decodificar token:', error);
    return 'user';
  }
}