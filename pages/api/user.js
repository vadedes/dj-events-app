/* eslint-disable import/no-anonymous-default-export */
import { API_URL } from '@/config/index';
import cookie from 'cookie';

//Purpose of this page is to handle JWT data on the backend without exposing it on the frontend/browser - like a middleware between frontend and backend authenticated requests
//this route is where we fetch data from the server
//this API route will check if the user is authorized with valid JWT token

export default async (req, res) => {
    if (req.method === 'GET') {
        //check to see if the cookie exists
        if (!req.headers.cookie) {
            res.status(403).json({ message: 'Not Authorized' });
        }

        const { token } = cookie.parse(req.headers.cookie);

        const strapiRes = await fetch(`${API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = await strapiRes.json();

        if (strapiRes.ok) {
            res.status(200).json({ user });
        } else {
            res.status(403).json({ message: 'User forbidden' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
};
