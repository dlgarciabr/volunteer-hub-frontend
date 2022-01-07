import { rest } from 'msw';

export const handlers = [
    // Handles a POST /login request
    rest.post('/user/login', (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(400),
        );
    })
]