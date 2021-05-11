---
to: next/lib/repo/<%= h.inflection.dasherize(name) %>.repo.ts
---
import { BaseModel, CrudRepository } from "./crud.repo";

export type <%= h.inflection.camelize(name) %> = BaseModel & {
};

export class <%= h.inflection.camelize(name) %>Repository extends CrudRepository<<%= h.inflection.camelize(name) %>> {
  apiName: string = "<%= h.inflection.camelize(name) %>";
  shortFragment: string = `id`;
  fullFragment: string = `id`;
}

export const <%= h.inflection.camelize(name) %>Service = new <%= h.inflection.camelize(name) %>Repository();