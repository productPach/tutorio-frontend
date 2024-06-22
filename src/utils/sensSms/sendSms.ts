export const sendSms = async (to: string, msg: string) => {
  try {
    //console.log('Отправка запроса на /api/sms/sendSms с номером:', to);
    const response = await fetch('/api/sms/sendSms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, msg }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send SMS');
    }
    console.log('Ответ от API:', data);
    //setMessage('SMS sent successfully');
  } catch (error) {
    //console.error('Ошибка при отправке SMS:', error);
  }
};