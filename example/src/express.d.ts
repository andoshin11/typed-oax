import { RequestHandler } from "express";
declare module "express-serve-static-core" {
  type Pet = {
    id: number;
    name: string;
    category?: 1 | 2 | 3;
    tag?: string;
    sex?: "male" | "female";
  };
  type Pets = Pet[];
  type Error = {
    code: number;
    message: string;
  };
  export interface IRouterMatcher<T> {
    <
      P extends Params = ParamsDictionary,
      ResBody =
        | {
            pets: Pet[];
          }
        | {
            pet: Pet;
          },
      ReqBody = null | {
        name: string;
        category?: 1 | 2 | 3;
        sex: "male" | "female";
      }
    >(
      path: "/pets",
      ...handlers: Array<RequestHandler<P, ResBody, ReqBody>>
    ): T;
    <
      P extends Params = {
        petId: string;
      },
      ResBody =
        | {
            pet: Pet;
          }
        | {
            pet: Pet;
          },
      ReqBody = null | {
        name?: string;
        category?: 1 | 2 | 3;
        sex?: "male" | "female";
      }
    >(
      path: "/pets/:petId",
      ...handlers: Array<RequestHandler<P, ResBody, ReqBody>>
    ): T;
  }
}
