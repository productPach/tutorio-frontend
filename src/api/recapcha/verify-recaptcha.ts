import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    // ДЛЯ LOCALHOST
    //const secretKey = '6LeS-_spAAAAAPOPnH_1UMvKyjhRZWMAUu4ht4VM';
    // ДЛЯ DEV TUTORIO
    const secretKey = '6LdL82IrAAAAAPg6Ivwoym8BAoEvwJyrXaCb6e2a';

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: secretKey,
            response: token
          }
        }
      );

      const data = response.data;

      if (data.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: data['error-codes'] });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}