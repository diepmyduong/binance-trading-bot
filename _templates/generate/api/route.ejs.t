---
to: src/routers/<%= h.path(name) %>/<%= h.inflection.camelize(f, true) %>.route.ts
---
import { Request, Response } from "express";
export default [
  {
    method: "get",
    path: "/api/<%= h.path(name) %>/<%= h.inflection.camelize(f, true) %>",
    midd: [],
    action: async (req: Request, res: Response) => {
        res.json({ message: "OK" });
    },
  },
];
