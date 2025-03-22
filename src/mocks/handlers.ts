import { http, HttpResponse } from 'msw';
import user from "./api/user.json";
 
export const handlers = [
  http.get('/api/user', () => {
    debugger
    return HttpResponse.json(user);
  }),
];