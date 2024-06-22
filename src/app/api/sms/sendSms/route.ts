import { NextResponse } from 'next/server';
import axios from 'axios';
import { securePinGenerator } from '@/utils/securePinGenerator/securePinGenerator';

export async function POST(request: Request) {
  // Генерируем проверочный код
  const msg = securePinGenerator();
  try {
    const { to: phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Не указан номер телефона' }, { status: 400 });
    }

    const apiId = process.env.SMSRU_API_ID;
    if (!apiId) {
      return NextResponse.json({ error: 'Не указан API ID' }, { status: 500 });
    }

    const response = await axios.post('https://sms.ru/sms/send', null, {
      params: {
        api_id: apiId,
        to: phoneNumber,
        msg: msg,
        json: 1,
      },
    });

    if (response.data.status === 'OK') {
      return NextResponse.json({ message: 'SMS sent successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: response.data.status_text || 'Failed to send SMS' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при получении данных запроса' }, { status: 400 });
  }
}