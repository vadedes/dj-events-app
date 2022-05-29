/* eslint-disable import/no-anonymous-default-export */
import { API_URL } from '@/config/index';
import cookie from 'cookie';

//Purpose of this page is to handle JWT data on the backend without exposing it on the frontend/browser - like a middleware between frontend and backend authenticated requests
//this route is where we fetch data from the server

export default async (req, res) => {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await strapiRes.json();

        if (strapiRes.ok) {
            //Set cookie
            res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', data.jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    sameSite: 'strict',
                    path: '/',
                })
            );

            res.status(200).json({ user: data.user });
            // console.log('user logged in');
        } else {
            res.status(data.error.status).json({ message: data.error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
};
