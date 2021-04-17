import { ParsedQs } from "qs";
declare module "express-serve-static-core" {
  type Pet = {
    id: number;
    name: string;
    category?: 1 | 2 | 3;
    tag?: string;
    sex?: "male" | "female";
    registeredAt?: Date;
  };
  type Pets = Pet[];
  type Error = {
    code: number;
    message: string;
  };
  export interface IRouterMatcher<
    T,
    Method extends
      | "all"
      | "get"
      | "post"
      | "put"
      | "delete"
      | "patch"
      | "options"
      | "head" = any
  > {
    <
      P extends Params = ParamsDictionary,
      ResBody = {
        all: any;
        get: {
          pets: Pet[];
        };
        post: {
          pet: Pet;
        };
        put: any;
        delete: any;
        options: any;
        head: any;
        patch: any;
      }[Method],
      ReqBody = {
        all: any;
        get: null;
        post: {
          name: string;
          category?: 1 | 2 | 3;
          sex: "male" | "female";
        };
        put: any;
        delete: any;
        options: any;
        head: any;
        patch: any;
      }[Method],
      ReqQuery = {
        all: ParsedQs;
        get: {
          limit?: string;
        };
        post: null;
        put: ParsedQs;
        delete: ParsedQs;
        options: ParsedQs;
        head: ParsedQs;
        patch: ParsedQs;
      }[Method]
    >(
      path: "/pets",
      ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ): T;
    <
      P extends Params = {
        petId: string;
      },
      ResBody = {
        all: any;
        get: {
          pet: Pet;
        };
        post: any;
        put: {
          pet: Pet;
        };
        delete: any;
        options: any;
        head: any;
        patch: any;
      }[Method],
      ReqBody = {
        all: any;
        get: null;
        post: any;
        put: {
          name?: string;
          category?: 1 | 2 | 3;
          sex?: "male" | "female";
        };
        delete: any;
        options: any;
        head: any;
        patch: any;
      }[Method],
      ReqQuery = {
        all: ParsedQs;
        get: null;
        post: ParsedQs;
        put: null;
        delete: ParsedQs;
        options: ParsedQs;
        head: ParsedQs;
        patch: ParsedQs;
      }[Method]
    >(
      path: "/pets/:petId",
      ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ): T;
  }
}
