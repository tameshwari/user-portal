import { http, HttpResponse } from 'msw';
import user from "./api/user.json";
 
export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json(user);
  }),
];