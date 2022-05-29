/* eslint-disable import/no-anonymous-default-export */
import { API_URL } from '@/config/index';
import cookie from 'cookie';

//Purpose of this page is to handle JWT data on the backend without exposing it on the frontend/browser - like a middleware between frontend and backend authenticated requests
//this route is where we fetch data from the server
//this route will destroy the current cookie
export default async (req, res) => {
    if (req.method === 'POST') {
        //Destroy cookie
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                expires: new Date(0),
                sameSite: 'strict',
                path: '/',
            })
        );

        res.status(200).json({ message: 'Success' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
};
